import { useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Chip,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";

const getUserFullName = (userObject) =>
	userObject.firstName + " " + userObject.lastName;

const UserChip = ({ user, onDelete, variant = "outlined " }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Chip
				avatar={
					<Avatar>
						{user.firstName[0]}
						{user.lastName[0]}
					</Avatar>
				}
				label={getUserFullName(user)}
				variant={variant}
				onDelete={onDelete}
				key={user.id}
				onClick={handleMenuOpen}
			/>
			<Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
				{user && (
					<>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								p: 2,
								mr: 4,
							}}
						>
							<Avatar>
								{user.firstName[0]}
								{user.lastName[0]}
							</Avatar>
							<Box>
								<Typography sx={{ ml: 2 }}>{getUserFullName(user)}</Typography>
								<Typography variant="body2" sx={{ ml: 2 }}>
									{user.email}
								</Typography>
							</Box>
						</Box>

						<Divider />

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								p: 2,
								gap: 2,
							}}
						>
							<Button sx={{ gap: 1, color: "text.secondary" }}>
								<EmailIcon sx={{ color: "text.primary" }} />
								Email
							</Button>
							<Button sx={{ gap: 1, color: "text.secondary" }}>
								<ChatIcon sx={{ color: "text.primary" }} />
								Chat
							</Button>
						</Box>
					</>
				)}
			</Menu>
		</>
	);
};

export default UserChip;
