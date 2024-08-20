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
import ChevronRight from "@mui/icons-material/ChevronRight";
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
	// values from recognizedPathWordsToNavbarWords
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
				height: "64px", // fixed height for AppBar
				overflow: "hidden", // hide overflow
			}}
		>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					height: "100%", // ensure full height is used
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
					<MenuIcon sx={{ marginRight: "16px", color: "#fff" }} />
					<Typography variant="h6" noWrap>
						CASA
					</Typography>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flexGrow: 1, // allows the middle box to grow and take available space
						justifyContent: "flex-start", // align contents to the left
						overflow: "hidden", // prevent overflow
						flexShrink: 1, // allows the box to shrink if necessary
						minWidth: 0, // ensures the box can shrink properly
					}}
				>
					{navbarLinks.map((link, index) => (
						<React.Fragment key={index}>
							<ChevronRight sx={{ m: 1 }} />
							<Typography
								variant="subtitle1"
								noWrap
								onClick={() => handleClickPath(link)}
							>
								{link.name}
							</Typography>
						</React.Fragment>
					))}
				</Box>

				<Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
					<IconButton onClick={handleLogout}>
						<LogoutIcon sx={{ color: "#fff" }} />
					</IconButton>
					<IconButton onClick={handleAccountButton}>
						<AccountCircleIcon sx={{ color: "#fff" }} />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
