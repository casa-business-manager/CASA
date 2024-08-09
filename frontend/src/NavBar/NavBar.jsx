import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import PathContext from "./PathContext";

const NavBar = ({}) => {
	const navigate = useNavigate();
	const [navbarLinks, setNavbarLinks] = useContext(PathContext);

	const location = useLocation();

	useEffect(() => {
		console.log("Location changed", location);
		console.log("Location changed", location.pathname);
	}, [location]);

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		navigate("/login");
	};

	const handleAccountButton = () => {
		console.log("TODO: Account button clicked");
	};

	return (
		<AppBar
			position="relative"
			sx={{
				backgroundColor: "#3b89f3",
				mb: 2,
			}}
		>
			<Toolbar>
				<MenuIcon sx={{ marginRight: "50px", color: "#fff" }}></MenuIcon>
				<Typography onClick={handleLogout}>CASA</Typography>
				{navbarLinks.map((link) => (
					<>
						<Typography sx={{ mx: 2 }}> {" > "} </Typography>
						<Typography
							onClick={() => {
								navigate(link.path);
							}}
						>
							{link.name}
						</Typography>
					</>
				))}
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
