import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppBar, Menu, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = ({title}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const handleAccountCircleIcon = () => {
    <div className="accountCircleIcon"></div>;
  };

  return (
    <AppBar sx={{backgroundColor: '#3b89f3', position:'fixed', height:'70x', alignItems:'', display:'block'}}>
      <Toolbar>
        <MenuIcon sx={{marginRight:'50px'}}></MenuIcon>
        <div className="title">{title}</div>
        <LogoutIcon onClick={handleLogout} sx={{marginLeft:'1650px'}}></LogoutIcon>
        <AccountCircleIcon onClick={handleAccountCircleIcon}></AccountCircleIcon>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
