import React, { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '../Constants/constants';
import { getCurrentUser } from '../APIUtils/APIUtils';

const Organization = () => {
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCurrentUser()
            .then(data => {
                setOrganization(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Organization Details</h1>
            {organization ? (
                <div>
                    <h2>{organization.name}</h2>
                    <p>{organization.description}</p>
                    {/* Add more fields as needed */}
                </div>
            ) : (
                <p>No organization data available.</p>
            )}
        </div>
    );
};

export default Organization;