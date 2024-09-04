import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
	getUsersInOrganization,
	inviteUserToOrganization,
	removeUserFromOrganization,
} from "../../../API/OrganizationAPI";
import { Box, IconButton } from "@mui/material";
import { AccountIcon, AddIcon } from "../../../constants/icons";

const MembersTabSettings = ({ organization, setOrganization }) => {
	const orgId = organization.orgId;

	// must do this because MembersTabSettings isnt a child component
	// it wont be re-rendered when organization changes
	const [users, setUsers] = useState(organization.users);

	const [error, setError] = useState(null);
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInvite = async () => {
		try {
			await inviteUserToOrganization(orgId, email);
			setOpen(false);
			const updatedUsers = await getUsersInOrganization(orgId);

			setOrganization((oldOrganization) => ({
				...oldOrganization,
				users: updatedUsers,
			}));
			setUsers(updatedUsers);
		} catch (error) {
			console.error("Error inviting user:", error);
			setError(error);
		}
	};

	const handleRemoveUser = async (userId) => {
		try {
			await removeUserFromOrganization(orgId, userId);
			setOrganization((oldOrganization) => {
				const updatedUsers = oldOrganization.users.filter(
					(user) => user.id !== userId,
				);
				setUsers(updatedUsers);
				return {
					...oldOrganization,
					users: updatedUsers,
				};
			});
		} catch (error) {
			console.error("Error removing user:", error);
			setError(error);
		}
	};

	if (error) {
		return <>Error: {error.message}</>;
	}

	const columns = [
		// { field: "id", headerName: "ID", width: 150 },
		{ field: "email", headerName: "Email", flex: 1 },
		{ field: "firstName", headerName: "First Name", flex: 1 },
		{ field: "lastName", headerName: "Last Name", flex: 1 },
		{
			field: "actions",
			headerName: "Actions",
			flex: 1,
			renderCell: (params) => (
				<Button
					variant="contained"
					color="secondary"
					onClick={() => handleRemoveUser(params.row.id)}
				>
					Delete
				</Button>
			),
		},
	];

	return (
		<>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<Typography variant="h5">Members</Typography>
				<IconButton onClick={handleClickOpen}>
					<AddIcon />
				</IconButton>
			</Box>
			<Box sx={{ height: "100%", display: "flex" }}>
				<DataGrid
					rows={users}
					columns={columns}
					autoPageSize
					checkboxSelection
				/>
			</Box>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Invite User</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To invite a user to this organization, please enter their email
						address here.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="email"
						label="Email Address"
						type="email"
						fullWidth
						variant="standard"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleInvite} variant="contained">
						Invite
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

const MembersTab = ({
	organization,
	setOrganization,
	onClick,
	selected,
	indentLevel = 0,
}) => {
	return (
		<BaseTab
			Icon={AccountIcon}
			Label={"Members"}
			selected={selected}
			indentLevel={indentLevel}
			onClick={onClick}
			SettingsPage={
				<MembersTabSettings
					organization={organization}
					setOrganization={setOrganization}
				/>
			}
		/>
	);
};

export default MembersTab;
