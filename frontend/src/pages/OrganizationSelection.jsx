import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganizations, createOrganization } from "../API/OrganizationAPI";
import OrganizationsContext from "../contexts/OrganizationsContext";
import CurrentUserContext from "../contexts/CurrentUserContext";
import {
	Alert,
	Box,
	Button,
	Card,
	CardActionArea,
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
import { AddIcon, OrganizationIcon } from "../constants/icons";
import { BE_ACCESS_TOKEN } from "../constants/login";

const CardColor = "OliveDrab";

const Organization = () => {
	const [_, setCurrentUser] = useContext(CurrentUserContext);
	const [organizations, setOrganizations] = useContext(OrganizationsContext);

	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [apiError, setApiError] = useState("");
	const navigate = useNavigate();

	// Fetch data on component mount
	useEffect(() => {
		const fetchData = async () => {
			const token = sessionStorage.getItem(BE_ACCESS_TOKEN);
			if (!token) {
				console.warn("No backend access token found. Redirecting to login.");
				navigate("/login"); // Redirect to login if token is missing
				return;
			}

			try {
				const orgData = await getOrganizations();
				console.log("Fetched Organizations Data:", orgData); // Debugging log
				setOrganizations(orgData);
			} catch (error) {
				console.error("Error fetching data:", error);
				setApiError("Failed to load organizations. Please try again.");
			} finally {
				setLoading(false); // Ensure loading is set to false once fetching completes
			}
		};

		fetchData();
	}, [navigate, setOrganizations]);

	const handleCardClick = (orgId) => {
		navigate(`/organization/${orgId}`);
	};

	if (loading) return <div>Loading...</div>;

	const OrganizationCard = ({ id, name, description, location }) => (
		<Card key={id} sx={{ boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)" }}>
			<CardActionArea onClick={() => handleCardClick(id)}>
				<CardMedia sx={{ height: 140, backgroundColor: CardColor }} />
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
							variant="body2"
							color="text.primary"
							sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
						>
							{location}
						</Typography>
					</Box>
				</CardContent>
			</CardActionArea>
		</Card>
	);

	const CreateDialog = ({ isOpen, setIsOpen }) => {
		const [orgName, setOrgName] = useState("");
		const [orgDescription, setOrgDescription] = useState("");
		const [orgLocation, setOrgLocation] = useState("");

		const [orgNameError, setOrgNameError] = useState(false);
		const [orgDescriptionError, setOrgDescriptionError] = useState(false);
		const [orgLocationError, setOrgLocationError] = useState(false);

		const handleCreateOrganization = async (event) => {
			event.preventDefault();

			// Form validation
			let hasError = false;
			if (!orgName) {
				setOrgNameError(true);
				hasError = true;
			}
			if (!orgDescription) {
				setOrgDescriptionError(true);
				hasError = true;
			}
			if (!orgLocation) {
				setOrgLocationError(true);
				hasError = true;
			}
			if (hasError) return;

			// API call to create the organization
			const organizationDto = { orgName, orgDescription, orgLocation };
			try {
				const data = await createOrganization(organizationDto);
				setOrganizations([...organizations, data]); // Update organization list
				setIsOpen(false); // Close dialog on success
			} catch (error) {
				console.error("Error creating organization:", error);
				setApiError("Error creating organization. Please try again.");
			}
		};

		return (
			<Dialog open={isOpen} onClose={() => setIsDialogOpen(false)}>
				<DialogTitle>Create Organization</DialogTitle>
				<DialogContent>
					{apiError && <Alert severity="error">{apiError}</Alert>}
					<TextField
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
					<Button onClick={() => setIsOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleCreateOrganization}>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	return (
		<>
			<Box
				sx={{
					display: "flex",
					gap: 2,
					alignItems: "center",
					mt: 1,
					mb: 2,
					fontSize: 36,
				}}
			>
				<OrganizationIcon sx={{ fontSize: "inherit" }} />
				<Typography sx={{ fontSize: "inherit" }}>Organizations</Typography>
				<IconButton onClick={() => setIsDialogOpen(true)}>
					<AddIcon />
				</IconButton>
			</Box>
			<Divider sx={{ my: 2 }} />
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
					gap: 2,
				}}
			>
				{organizations.length > 0 ? (
					organizations
						.sort((a, b) => a.orgName.localeCompare(b.orgName))
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
					<Typography>No organization data available.</Typography>
				)}
			</Box>
			<CreateDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
		</>
	);
};

export default Organization;
