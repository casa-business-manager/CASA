import { Avatar, Box, Button, Divider, Menu, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import { getUserFullName } from "../util/user";

const UserMenu = ({ anchorEl, onClose, user }) => {
	const open = Boolean(anchorEl);

	return (
		<Menu anchorEl={anchorEl} open={open} onClose={onClose}>
			{user ? (
				<div>
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
				</div>
			) : (
				<>Loading...</>
			)}
		</Menu>
	);
};

export default UserMenu;
