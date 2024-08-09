import React, { useContext, useEffect, useState } from "react";
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
import OrganizationsContext from "../Contexts/OrganizationsContext";
import { path } from "slate";
import { getCurrentUser, getOrganizations } from "../APIUtils/APIUtils";

const parseLocation = (location) => {
	const path = location.pathname;
	return path.split("/").filter((word) => word !== "");
};

const recognizedPathWordsToNavbarWords = {
	login: { name: "Login", path: "login" },
	organization: { name: "My Organizations", path: "organization" },
	user: { name: "Me", path: "user" },
	calendar: { name: "Calendar", path: "calendar" },
	email: { name: "Email", path: "email" },
};

const addOrganizationNameIfOrganizationId = (
	pathWordsArray,
	id,
	organizations,
) => {
	if (pathWordsArray.length <= 0 || organizations.length === 0) {
		return;
	}

	if (pathWordsArray[pathWordsArray.length - 1].path === "organization") {
		const organizationOfId = organizations.find((org) => org.orgId === id);
		pathWordsArray.push({ name: organizationOfId.orgName, path: `${id}` });
	}
};

const NavBar = ({}) => {
	const navigate = useNavigate();
	const [organizations, setOrganizations] = useContext(OrganizationsContext);
	const [navbarLinks, setNavbarLinks] = useState([]);

	const location = useLocation();

	useEffect(() => {
		if (organizations.length !== 0) {
			return;
		}

		const fetchData = async () => {
			try {
				const orgData = await getOrganizations();
				setOrganizations(orgData);
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchData();
	}, [organizations]);

	useEffect(() => {
		const pathWords = parseLocation(location);
		const navbarWords = [];
		for (const word of pathWords) {
			if (Object.hasOwn(recognizedPathWordsToNavbarWords, word)) {
				navbarWords.push(recognizedPathWordsToNavbarWords[word]);
			} else {
				addOrganizationNameIfOrganizationId(navbarWords, word, organizations);
			}
		}
		setNavbarLinks(navbarWords);
	}, [location, organizations]);

	const handleClickPath = (clickedLink) => {
		const pathLinkWords = [];
		for (const link of navbarLinks) {
			pathLinkWords.push(link.path);
			if (link.path === clickedLink.path) {
				break;
			}
		}
		const path = "/" + pathLinkWords.join("/");
		navigate(path);
	};

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
				mb: 1,
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
								handleClickPath(link);
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
