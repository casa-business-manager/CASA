import { Avatar, Chip } from "@mui/material";

const getUserFullName = (userObject) =>
	userObject.firstName + " " + userObject.lastName;

const UserChip = ({ user, onDelete, variant = "outlined " }) => {
	return (
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
		/>
	);
};

export default UserChip;
