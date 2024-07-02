import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUsersInOrganization, inviteUserToOrganization, removeUserFromOrganization } from '../APIUtils/APIUtils';
import { DataGrid } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const UserManagement = () => {
    const { orgId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsersInOrganization(orgId);
                if (typeof response === 'string') {
                    throw new Error(response); 
                }
                setUsers(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [orgId]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInvite = async () => {
        try {
            await inviteUserToOrganization(orgId, email);
            setOpen(false);
            const updatedUsers = await getUsersInOrganization(orgId); 
            setUsers(updatedUsers); 
        } catch (error) {
            console.error('Error inviting user:', error);
            setError(error);
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            await removeUserFromOrganization(orgId, userId);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error removing user:', error);
            setError(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'firstName', headerName: 'First Name', width: 200 },
        { field: 'lastName', headerName: 'Last Name', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveUser(params.row.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>User Management</h2>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                />
            </div>
            <Fab color="primary" aria-label="add" onClick={handleClickOpen} style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <AddIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Invite User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To invite a user to this organization, please enter their email address here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleInvite}>Invite</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserManagement;
