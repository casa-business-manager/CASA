import { useNavigate, useParams } from "react-router-dom";
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
import { useContext, useEffect, useState } from "react";
import EmailContext from "../Contexts/EmailContext";

const UserMenu = ({ anchorEl, onClose, user, orgIdFromArg }) => {
	const navigate = useNavigate();
	const orgIdFromParam = useParams().orgId;

	const [organizations, _] = useContext(OrganizationsContext);
	const [__, setEmailRecipients] = useContext(EmailContext);
	const [userRoles, setUserRoles] = useState([]);
	const orgId = orgIdFromArg || orgIdFromParam;

	const open = Boolean(anchorEl);

	useEffect(() => {
		if (!orgId) {
			return;
		}
		const organization = organizations.find((org) => org.orgId === orgId);
		const orgRoles = organization.roles;
		setUserRoles(
			orgRoles.filter((role) =>
				role.users.some((roleUser) => roleUser.id === user.id),
			),
		);
	}, [orgId]);

	const handleEmailClick = () => {
		setEmailRecipients([user]);
		navigate(`/organization/${orgId}/email`);
	};

	return (
		<Menu anchorEl={anchorEl} open={open} onClose={onClose}>
			{user ? (
				<Box
					sx={{
						maxWidth: "30vw",
						px: 2,
						py: 1,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							mr: 4,
							mb: 2,
						}}
					>
						<Avatar sx={{ mr: 2 }}>
							{user.firstName[0]}
							{user.lastName[0]}
						</Avatar>
						<Box>
							<Typography>{getUserFullName(user)}</Typography>
							<Typography variant="body2">{user.email}</Typography>
						</Box>
					</Box>

					{userRoles.length > 0 && (
						<>
							<Divider sx={{ my: 2 }} />

							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									gap: 1,
								}}
							>
								{userRoles.map((role) => (
									<Chip
										key={role.roleId}
										label={role.name}
										color="primary"
										variant="outlined"
										sx={{ mb: 1 }}
									/>
								))}
							</Box>
						</>
					)}

					<Divider sx={{ my: 2 }} />

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							pb: 1,
							gap: 1,
						}}
					>
						<Button
							onClick={handleEmailClick}
							sx={{ gap: 1, color: "text.secondary" }}
						>
							<EmailIcon sx={{ color: "text.primary" }} />
							Email
						</Button>
						<Button sx={{ gap: 1, color: "text.secondary" }}>
							<ChatIcon sx={{ color: "text.primary" }} />
							Chat
						</Button>
					</Box>
				</Box>
			) : (
				<>Loading...</>
			)}
		</Menu>
	);
};

export default UserMenu;
