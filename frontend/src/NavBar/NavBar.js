import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav>
            <LogoutIcon onClick={handleLogout}>Log Out</LogoutIcon>
        </nav>
    );
};

export default NavBar;