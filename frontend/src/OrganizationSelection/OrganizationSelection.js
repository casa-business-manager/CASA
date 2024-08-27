import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/UserAPI";
import {
	getOrganizations,
	createOrganization,
	updateOrganization,
} from "../API/OrganizationAPI";
import "./OrganizationSelection.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import OrganizationsContext from "../Contexts/OrganizationsContext";
import CurrentUserContext from "../Contexts/CurrentUserContext";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Divider,
	IconButton,
	Typography,
} from "@mui/material";

const Organization = () => {
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
	const [organizations, setOrganizations] = useContext(OrganizationsContext);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [orgName, setOrgName] = useState("");
	const [orgDescription, setOrgDescription] = useState("");
	const [orgLocation, setOrgLocation] = useState("");
	const [editingOrg, setEditingOrg] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userData = await getCurrentUser();
				setCurrentUser(userData);

				const orgData = await getOrganizations();
				setOrganizations(orgData);
			} catch (error) {
				console.error("Error:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleCreateOrganization = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		const organizationDto = { orgName, orgDescription, orgLocation };

		try {
			const data = await createOrganization(organizationDto);
			setOrganizations([...organizations, data]);
			setOrgName("");
			setOrgDescription("");
			setOrgLocation("");
			setIsDialogOpen(false);
		} catch (error) {
			setError(error.message);
		}
	};

	// const handleEditOrganization = (org) => {
	// 	setEditingOrg(org);
	// 	setOrgName(org.orgName);
	// 	setOrgDescription(org.orgDescription);
	// 	setOrgLocation(org.orgLocation);
	// 	setIsDialogOpen(true);
	// };

	// const handleUpdateOrganization = async (event) => {
	// 	event.preventDefault();
	// 	const updatedOrg = {
	// 		...editingOrg,
	// 		orgName,
	// 		orgDescription,
	// 		orgLocation,
	// 	};

	// 	try {
	// 		const data = await updateOrganization(updatedOrg);
	// 		setOrganizations(
	// 			organizations.map((org) => (org.orgId === data.orgId ? data : org)),
	// 		);
	// 		setEditingOrg(null);
	// 		setOrgName("");
	// 		setOrgDescription("");
	// 		setOrgLocation("");
	// 		setIsDialogOpen(false);
	// 	} catch (error) {
	// 		console.error("Error updating organization:", error);
	// 		setError(error.message);
	// 	}
	// };

	// const openDialog = () => {
	// 	setEditingOrg(null);
	// 	setOrgName("");
	// 	setOrgDescription("");
	// 	setOrgLocation("");
	// 	setIsDialogOpen(true);
	// };

	// const closeDialog = () => {
	// 	setIsDialogOpen(false);
	// };

	const handleCardClick = (orgId) => {
		navigate(`/organization/${orgId}`);
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	const OrganizationCard = ({ id, name, description, location }) => (
		<Card>
			<CardActionArea onClick={() => handleCardClick(id)}>
				<CardMedia
					// TODO: Add image
					sx={{ height: 140, backgroundColor: "green" }}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{description}
					</Typography>
					<Typography variant="body3" color="text.secondary">
						{location}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button size="small" color="primary">
					Share
				</Button>
			</CardActions>
		</Card>
	);

	return (
		<>
			<Box
				fullWidth
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Typography variant="h4">Organizations</Typography>
				<IconButton onClick={handleCreateOrganization}>
					<AddIcon />
				</IconButton>
			</Box>
			<Divider sx={{ my: 1 }} />
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
					gap: 2,
				}}
			>
				{organizations.length > 0 ? (
					organizations
						.toSorted((a, b) => a.orgName > b.orgName)
						.map((org) => (
							<OrganizationCard
								key={org.orgId}
								id={org.orgId}
								name={org.orgName}
								description={org.orgDescription}
								location={org.orgLocation}
							/>
						))
				) : (
					<>No organization data available.</>
				)}
			</Box>
		</>
	);
};

export default Organization;
