import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getOrganizations, createOrganization, updateOrganization } from '../APIUtils/APIUtils';
import './Organization.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NavBar from '../NavBar/NavBar';

const Organization = () => {
    const [user, setUser] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orgName, setOrgName] = useState('');
    const [orgDescription, setOrgDescription] = useState('');
    const [orgLocation, setOrgLocation] = useState('');
    const [editingOrg, setEditingOrg] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUser();
                console.log('User data:', userData);
                setUser(userData);
    
                const orgData = await getOrganizations();
                console.log('Organization data:', orgData);
                setOrganizations(orgData);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []); // Empty dependency array ensures this runs only once

    const handleCreateOrganization = async (event) => {
        event.preventDefault();
        const organizationDto = { orgName, orgDescription, orgLocation };

        try {
            const data = await createOrganization(organizationDto);
            console.log('Organization created:', data);
            setOrganizations([...organizations, data]);
            setOrgName('');
            setOrgDescription('');
            setOrgLocation('');
            setIsDialogOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditOrganization = (org) => {
        setEditingOrg(org);
        setOrgName(org.orgName);
        setOrgDescription(org.orgDescription);
        setOrgLocation(org.orgLocation);
        setIsDialogOpen(true);
    };

    const handleUpdateOrganization = async (event) => {
        event.preventDefault();
        const updatedOrg = { ...editingOrg, orgName, orgDescription, orgLocation };
    
        try {
            const data = await updateOrganization(updatedOrg);
            console.log('Organization updated:', data);
            setOrganizations(organizations.map(org => org.orgId === data.orgId ? data : org));
            setEditingOrg(null);
            setOrgName('');
            setOrgDescription('');
            setOrgLocation('');
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error updating organization:', error);
            setError(error.message);
        }
    };

    const openDialog = () => {
        setEditingOrg(null);
        setOrgName('');
        setOrgDescription('');
        setOrgLocation('');
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    const handleCardClick = (orgId) => {
        navigate(`/organization/${orgId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <NavBar />
            <h1>Organization</h1>
            {organizations.length > 0 ? (
                organizations.map(org => (
                    <div key={org.orgId} className="card" onClick={() => handleCardClick(org.orgId)}>
                        <MoreVertIcon className="more-icon" onClick={(e) => { e.stopPropagation(); handleEditOrganization(org); }} />
                        <h2>{org.orgName}</h2>
                        <p>ID: {org.orgId}</p>
                        <p>Description: {org.orgDescription}</p>
                        <p>Location: {org.orgLocation}</p>
                    </div>
                ))
            ) : (
                <p>No organization data available.</p>
            )}

            {isDialogOpen && (
                <div className="dialog-overlay" onClick={closeDialog}>
                    <div className="dialog" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingOrg ? 'Edit Organization' : 'Create Organization'}</h2>
                        <form onSubmit={editingOrg ? handleUpdateOrganization : handleCreateOrganization}>
                            <div>
                                <label>Organization Name:</label>
                                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
                            </div>
                            <div>
                                <label>Organization Description:</label>
                                <input type="text" value={orgDescription} onChange={(e) => setOrgDescription(e.target.value)} required />
                            </div>
                            <div>
                                <label>Organization Location:</label>
                                <input type="text" value={orgLocation} onChange={(e) => setOrgLocation(e.target.value)} required />
                            </div>
                            <button type="submit">{editingOrg ? 'Update' : 'Create'}</button>
                        </form>
                    </div>
                </div>
            )}

            <button className="floating-button" onClick={openDialog}>+</button>
        </div>
    );
};

export default Organization;