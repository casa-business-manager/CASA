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

const MembersTabSettings = ({ settings, orgId }) => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");

	useEffect(() => {
		if (!orgId) {
			return;
		}

		const fetchUsers = async () => {
			try {
				const response = await getUsersInOrganization(orgId);
				if (typeof response === "string") {
					throw new Error(response);
				}
				setUsers(response);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching users:", error);
				setError(error);
				setLoading(false);
			}
		};

		fetchUsers();
	}, [orgId]);

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
			setUsers(updatedUsers);
		} catch (error) {
			console.error("Error inviting user:", error);
			setError(error);
		}
	};

	const handleRemoveUser = async (userId) => {
		try {
			await removeUserFromOrganization(orgId, userId);
			setUsers(users.filter((user) => user.id !== userId));
		} catch (error) {
			console.error("Error removing user:", error);
			setError(error);
		}
	};

	if (loading || !settings || !settings.orgName) {
		return <>Loading</>;
	}

	if (error) {
		return <>Error: {error.message}</>;
	}

	const columns = [
		{ field: "id", headerName: "ID", width: 150 },
		{ field: "name", headerName: "Name", width: 200 },
		{ field: "email", headerName: "Email", width: 250 },
		{ field: "firstName", headerName: "First Name", width: 200 },
		{ field: "lastName", headerName: "Last Name", width: 200 },
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
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
					justifyContent: "space-between",
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
	settings,
	orgId,
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
			SettingsPage={<MembersTabSettings orgId={orgId} settings={settings} />}
		/>
	);
};

export default MembersTab;
