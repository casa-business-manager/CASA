import { useParams } from "react-router-dom";
import OrganizationsContext from "../Contexts/OrganizationsContext";
import {
	Avatar,
	Box,
	Button,
	Chip,
	Divider,
	Menu,
	Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import { getUserFullName } from "../util/user";
import { useContext } from "react";

const UserMenu = ({ anchorEl, onClose, user }) => {
	const { orgId } = useParams();
	const [organizations, setOrganizations] = useContext(OrganizationsContext);

	const open = Boolean(anchorEl);

	console.log("orgs", organizations);

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

					<Chip />

					<Divider />

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							p: 2,
							pb: 1,
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
