import { useState } from "react";
import { Avatar, Chip } from "@mui/material";
import UserMenu from "./UserMenu";
import { getUserFullName } from "../util/user";

const UserChip = ({ user, onDelete, variant = "outlined", orgId = null }) => {
	const [anchorEl, setAnchorEl] = useState(null);

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
				sx={{ my: 0.5, mr: 0.5 }}
			/>
			<UserMenu
				anchorEl={anchorEl}
				onClose={handleMenuClose}
				user={user}
				orgIdFromArg={orgId}
			/>
		</>
	);
};

export default UserChip;
