import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
	AppBar,
	Box,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRight from "@mui/icons-material/ChevronRight";
import OrganizationsContext from "../contexts/OrganizationsContext";
import { getOrganizations } from "../API/OrganizationAPI";
import CurrentUserContext from "../contexts/CurrentUserContext";
import zIndex from "@mui/material/styles/zIndex";
import { parseLocation } from "../util/path";

const recognizedPathWordsToNavbarWords = {
	login: { name: "Login", path: "login" },
	organization: { name: "My Organizations", path: "organization" },
	user: { name: "User", path: "user" },
	calendar: { name: "Calendar", path: "calendar" },
	email: { name: "Email", path: "email" },
};

/// the function takes in IDs from the route url in order to replace them with
/// words in the navbar. Since we maintain that IDs in the URL will be preceeded
/// by their type (i.e. /organization/abcde-fg123-... or /user/abcde-fg123-...),
/// we can use the preceeding type to determine how to fill in the word for the
/// navbar.
/// Will mutate the array pathWordsArray and add the new object with name and path
const addNameIfId = (pathWordsArray, id, organizations) => {
	if (pathWordsArray.length <= 0 || organizations.length === 0) {
		return;
	}

	const idType = pathWordsArray[pathWordsArray.length - 1].path;
	const newPathWordObj = { path: id };

	if (idType === "organization") {
		const organizationOfId = organizations.find((org) => org.orgId === id);
		newPathWordObj.name = organizationOfId.orgName;
	} else if (idType === "user") {
		newPathWordObj.name = "Me";
	}

	pathWordsArray.push(newPathWordObj);
};

const NavBar = ({}) => {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
	const [organizations, setOrganizations] = useContext(OrganizationsContext);
	// values from recognizedPathWordsToNavbarWords
	const [navbarLinks, setNavbarLinks] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);

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
	}, []);

	useEffect(() => {
		const pathWords = parseLocation(location);
		const navbarWords = [];
		for (const word of pathWords) {
			if (Object.hasOwn(recognizedPathWordsToNavbarWords, word)) {
				navbarWords.push(recognizedPathWordsToNavbarWords[word]);
			} else {
				addNameIfId(navbarWords, word, organizations);
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

	const handleCalendarClick = () => {
		navigate(`/user/${currentUser.id}/calendar`);
	};

	const handleAccountButton = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClickWrapper = (clickFunction) => {
		return (...params) => {
			setAnchorEl(null);
			clickFunction(...params);
		};
	};

	return (
		<AppBar
			position="fixed"
			sx={{
				backgroundColor: "#3b89f3",
				mb: 2,
				zIndex: zIndex.drawer + 1,
			}}
		>
			<Toolbar>
				<MenuIcon sx={{ marginRight: "50px", color: "#fff" }}></MenuIcon>
				<Typography
					onClick={() => {
						navigate("/oauth2/redirect");
					}}
					sx={{
						"&:hover": {
							textDecoration: "underline",
							textDecorationThickness: "2px",
						},
					}}
				>
					CASA
				</Typography>
				{navbarLinks.map((link, index) => (
					<React.Fragment key={index}>
						<ChevronRight sx={{ m: 1 }} />
						<Typography
							onClick={() => {
								handleClickPath(link);
							}}
							sx={{
								"&:hover": {
									textDecoration: "underline",
									textDecorationThickness: "2px",
									cursor: "pointer",
								},
							}}
						>
							{link.name}
						</Typography>
					</React.Fragment>
				))}
				<Box sx={{ flexGrow: 1 }} />
				{/* Log out and Account buttons. Must make them white manualluy */}
				{navbarLinks.find((link) => link.name === "Login") ? null : (
					<>
						<IconButton onClick={handleAccountButton}>
							<AccountCircleIcon sx={{ color: "#fff" }} />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={() => setAnchorEl(null)}
							transformOrigin={{
								horizontal: "center",
								vertical: "top",
							}}
						>
							{/* TODO: My Account page */}
							<MenuItem
								onClick={handleMenuClickWrapper(() =>
									console.log("TODO: Handle My Account"),
								)}
							>
								My Account
							</MenuItem>
							<MenuItem onClick={handleMenuClickWrapper(handleCalendarClick)}>
								My Calendar
							</MenuItem>
							<Divider />
							<MenuItem
								onClick={handleMenuClickWrapper(handleLogout)}
								sx={{ color: "red" }}
							>
								Logout
							</MenuItem>
						</Menu>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
