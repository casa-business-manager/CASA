import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/UserAPI";
import {
	getOrganizations,
	createOrganization,
	updateOrganization,
} from "../API/OrganizationAPI";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import OrganizationsContext from "../Contexts/OrganizationsContext";
import CurrentUserContext from "../Contexts/CurrentUserContext";
import {
	Alert,
	Box,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";

const Organization = () => {
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
	const [organizations, setOrganizations] = useContext(OrganizationsContext);

	const [loading, setLoading] = useState(true);
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
				setLoading(true);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

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

	const OrganizationCard = ({ id, name, description, location }) => (
		<Card>
			<CardActionArea onClick={() => handleCardClick(id)}>
				<CardMedia
					// TODO: Add image
					sx={{ height: 140, backgroundColor: "OliveDrab" }}
				/>
				<CardContent>
					<Box sx={{ maxHeight: 80, overflowY: "auto" }}>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
							sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
						>
							{name}
						</Typography>
					</Box>
					<Box sx={{ maxHeight: 80, overflowY: "auto" }}>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
						>
							{description}
						</Typography>
					</Box>
					<Box sx={{ maxHeight: 80, overflowY: "auto" }}>
						<Typography
							variant="body3"
							color="text.primary"
							sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
						>
							{location}
						</Typography>
					</Box>
				</CardContent>
			</CardActionArea>
			<CardActions sx={{ justifyContent: "right" }}>
				{/* TODO: what goes in here? */}
				<IconButton>
					<MoreVertIcon />
				</IconButton>
			</CardActions>
		</Card>
	);

	const CreateDialog = ({ isOpen, setIsOpen }) => {
		const [orgName, setOrgName] = useState("");
		const [orgDescription, setOrgDescription] = useState("");
		const [orgLocation, setOrgLocation] = useState("");

		const [orgNameError, setOrgNameError] = useState(false);
		const [orgDescriptionError, setOrgDescriptionError] = useState(false);
		const [orgLocationError, setOrgLocationError] = useState(false);
		const [apiError, setApiError] = useState("");

		const handleCreateOrganization = async (event) => {
			event.preventDefault();
			event.stopPropagation();

			var flag = false;
			if (!orgName) {
				setOrgNameError(true);
				flag = true;
			}
			if (!orgDescription) {
				setOrgDescriptionError(true);
				flag = true;
			}
			if (!orgLocation) {
				setOrgLocationError(true);
				flag = true;
			}
			if (flag) {
				return;
			}

			const organizationDto = { orgName, orgDescription, orgLocation };

			try {
				const data = await createOrganization(organizationDto);
				setOrganizations([...organizations, data]);
				setIsOpen(false);
			} catch (error) {
				console.error("Error creating organization:", error);
				setApiError(`${error}`);
			}
		};

		return (
			<>
				<Dialog open={isOpen} onClose={() => setIsDialogOpen(false)}>
					<DialogTitle variant="h4">Create Organization</DialogTitle>
					<DialogContent>
						{apiError !== "" && <Alert severity="error">{apiError}</Alert>}
						<TextField
							id="organization-name"
							label="Organization Name"
							value={orgName}
							onChange={(e) => {
								setOrgName(e.target.value);
								setOrgNameError(false);
							}}
							fullWidth
							margin="normal"
							required
							error={orgNameError}
						/>
						<TextField
							label="Organization Description"
							value={orgDescription}
							onChange={(e) => {
								setOrgDescription(e.target.value);
								setOrgDescriptionError(false);
							}}
							fullWidth
							margin="normal"
							required
							error={orgDescriptionError}
						/>
						<TextField
							label="Organization Location"
							value={orgLocation}
							onChange={(e) => {
								setOrgLocation(e.target.value);
								setOrgLocationError(false);
							}}
							fullWidth
							margin="normal"
							required
							error={orgLocationError}
						/>
					</DialogContent>
					<DialogActions>
						<Button color="primary" onClick={() => setIsOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleCreateOrganization}
						>
							Create
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	};

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
				<IconButton onClick={() => setIsDialogOpen(true)}>
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
			<CreateDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
		</>
	);
};

export default Organization;
