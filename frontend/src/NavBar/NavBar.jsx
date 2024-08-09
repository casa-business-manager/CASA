import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
	AppBar,
	Box,
	IconButton,
	Menu,
	Toolbar,
	Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const NavBar = ({ title }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		navigate("/login");
	};

	const handleAccountButton = () => {
		console.log("TODO: Account button clicked");
	};

	return (
		<AppBar
			sx={{
				backgroundColor: "#3b89f3",
				position: "fixed",
				width: { sm: "100%", md: "100%" },
			}}
		>
			<Toolbar>
				<MenuIcon sx={{ marginRight: "50px", color: "#fff" }}></MenuIcon>
				<Typography>{title}</Typography>
				<Box sx={{ flexGrow: 1 }} />
				{/* Log out and Account buttons. Must make them white manualluy */}
				<IconButton onClick={handleLogout}>
					<LogoutIcon sx={{ color: "#fff" }} />
				</IconButton>
				<IconButton onClick={handleAccountButton}>
					<AccountCircleIcon sx={{ color: "#fff" }} />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
