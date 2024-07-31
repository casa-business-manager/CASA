import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {
	Box,
	Button,
	Chip,
	ClickAwayListener,
	Grow,
	IconButton,
	List,
	MenuItem,
	MenuList,
	Paper,
	Popper,
	Switch,
	TextField,
} from "@mui/material";
import BaseCollapse from "../SettingsCollapses/BaseCollapse";
import PeopleIcon from "@mui/icons-material/People";
import ShieldIcon from "@mui/icons-material/Shield";
import CloseIcon from "@mui/icons-material/Close";
import { GraphCanvas, lightTheme } from "reagraph";
import { editRole } from "../../APIUtils/APIUtils";

const graphTheme = {
	...lightTheme,
	node: {
		...lightTheme.node,
		activeFill: "#ff7f0e",
	},
};

const GraphPopup = ({
	node,
	onClose,
	setSelectedRole,
	setRoles,
	setEditorIsCreatingNewRole,
	setName,
	setPermissions,
	setUsers,
}) => {
	const menuClickWrapper = (handlerFunction) => {
		return () => {
			handlerFunction();
			onClose();
		};
	};

	const handleOpenDetails = () => {
		setEditorIsCreatingNewRole(false);
		setSelectedRole(node.data);
	};

	const handleAddRole = () => {
		setEditorIsCreatingNewRole(true);
		setName("");
		setPermissions((oldPermissions) => {
			const newPermissions = {};
			for (const key in oldPermissions) {
				newPermissions[key] = false;
			}
			return newPermissions;
		});
		setUsers([]);
	};

	return (
		<Popper
			open={true}
			anchorEl={null}
			role={undefined}
			placement="bottom-start"
			transition
			disablePortal
		>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{
						transformOrigin:
							placement === "bottom-start" ? "left top" : "left bottom",
					}}
				>
					<Paper>
						<ClickAwayListener onClickAway={onClose}>
							<MenuList
								autoFocusItem={true}
								id="composition-menu"
								aria-labelledby="composition-button"
							>
								<MenuItem onClick={menuClickWrapper(handleOpenDetails)}>
									Open details
								</MenuItem>
								<MenuItem onClick={menuClickWrapper(handleAddRole)}>
									Add new role
								</MenuItem>
								<MenuItem onClick={onClose}>Delete role</MenuItem>
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);
};

const RolesGraph = ({
	roles,
	setRoles,
	setSelectedRole,
	user,
	setEditorIsCreatingNewRole,
	setName,
	setPermissions,
	setUsers,
}) => {
	const [selected, setSelected] = useState([]);

	const nodes = [];
	const edges = [];

	roles.forEach((role) => {
		nodes.push({
			id: role.roleId,
			label: role.name,
			data: role,
			fill: "#1f77b4", // fill should depend on current user's roles
		});

		role.managedRoles.forEach((managedRole) => {
			edges.push({
				source: role.roleId,
				target: managedRole.roleId,
				id: role.roleId + "-" + managedRole.roleId,
			});
		});
	});

	useEffect(() => {
		nodes.forEach((node) => {
			const userIds = node.data.users.map((user) => user.id);
			if (userIds.includes(user.id)) {
				node.fill = "#ff7f0e";
			}
		});
		// TODO: set to user's roles
		setSelected([nodes[0].id]);
	}, []);

	return (
		<Box
			sx={{
				position: "relative",
				width: "99%",
				height: "99%",
				border: 1,
			}}
		>
			<GraphCanvas
				nodes={nodes}
				edges={edges}
				node={
					// Customize the node appearance
					{
						style: {
							width: 100,
							height: 50,
							fill: "#1f77b4",
						},
					}
				}
				edge={
					// Customize the edge appearance
					{
						style: {
							stroke: "#999",
							strokeWidth: 5,
						},
					}
				}
				layoutType="treeTd2d"
				selections={selected}
				actives={["1"]}
				onNodeClick={(node) => {
					console.log("clicked" + node);
					setSelected(node.id);
					setSelectedRole(node.data);
					setEditorIsCreatingNewRole(false);
				}}
				contextMenu={({ data, onClose }) => (
					<GraphPopup
						node={data}
						onClose={onClose}
						setSelectedRole={setSelectedRole}
						setRoles={setRoles}
						setEditorIsCreatingNewRole={setEditorIsCreatingNewRole}
						setName={setName}
						setPermissions={setPermissions}
						setUsers={setUsers}
					/>
				)}
				theme={graphTheme}
			/>
		</Box>
	);
};

const PermissionRow = ({
	permission,
	value,
	setPermissions,
	permissionIndex,
	key,
}) => {
	const togglePermission = () => {
		setPermissions((prevPermissions) => {
			const newPermissions = [...prevPermissions];
			newPermissions[permissionIndex][1] = !newPermissions[permissionIndex][1];
			return newPermissions;
		});
	};
	return (
		<Box sx={{ display: "flex", justifyContent: "space-between", m: 4, pl: 4 }}>
			<Typography sx={{}}>{permission}</Typography>
			{value === true || value === false ? (
				<Switch checked={value} onChange={togglePermission} />
			) : (
				// TODO: permissions that are not true/false
				<TextField></TextField>
			)}
		</Box>
	);
};

const UserRow = ({ user }) => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				m: 2,
				pl: 4,
			}}
		>
			<Chip label={user.firstName + " " + user.lastName} variant="outlined" />
			<IconButton
				onClick={() => {
					console.log("set the function in UserRow");
				}}
			>
				<CloseIcon />
			</IconButton>
		</Box>
	);
};

const RoleEditor = ({
	name,
	setName,
	permissions,
	setPermissions,
	users,
	setUsers,
	selectedRole,
	setSelectedRole,
	editorIsCreatingNewRole,
	setRoles,
}) => {
	if (selectedRole === null) {
		return <Typography>Please select a role</Typography>;
	}

	// const handleAddRoleToGraph = () => {
	// 	setRoles((prevRoles) => {
	// 		const parentRoleId = node.data.roleId;
	// 		const parentRole = prevRoles.find((role) => role.roleId === parentRoleId);
	// 		const newRole = {
	// 			roleId: "1",
	// 			name: "New Role",
	// 			permissions: {},
	// 			users: [],
	// 			managedRoles: [],
	// 			managedBy: node.data,
	// 		};
	// 		parentRole.managedRoles.push(newRole);
	// 		const untouchedRoles = prevRoles.filter(
	// 			(role) => role.roleId !== parentRoleId,
	// 		);
	// 		return [...untouchedRoles, parentRole, newRole];
	// 	});
	// };

	const handleEditRole = async () => {
		const permissionsString = permissions
			.map((pair) => {
				return pair[0] + ":" + pair[1];
			})
			.join(",");
		const userIds = users.map((user) => user.id);
		const editedRoleDto = {
			name: name,
			permissions: permissionsString,
			users: userIds,
		};
		try {
			const newRole = await editRole(selectedRole.roleId, editedRoleDto);
			setRoles((prevRoles) => {
				const untouchedRoles = prevRoles.filter(
					(role) => role.roleId !== newRole.roleId,
				);
				return [...untouchedRoles, newRole];
			});
			setSelectedRole(newRole);
		} catch {
			console.error("Save failed");
		}
	};

	return (
		<>
			<Typography variant="h6" sx={{ mb: 1 }}>
				{editorIsCreatingNewRole ? "Create new role:" : "Role Details:"}
			</Typography>
			<TextField
				label="Name"
				type="text"
				autoFocus
				fullWidth
				variant="standard"
				value={name}
				onChange={(e) => setName(e.target.value)}
				sx={{ mb: 2 }}
				InputProps={{ sx: { fontSize: "1.5rem" } }}
				InputLabelProps={{ sx: { fontSize: "1.5rem" } }}
			/>
			<List sx={{ overflow: "auto" }}>
				<BaseCollapse
					Icon={ShieldIcon}
					Label={"Permissions"}
					key={"Permissions"}
					defaultOpen={editorIsCreatingNewRole}
				>
					{permissions.map((pair, index) => (
						<PermissionRow
							permission={pair[0]}
							value={pair[1]}
							setPermissions={setPermissions}
							permissionIndex={index}
							key={index}
						/>
					))}
				</BaseCollapse>
				<BaseCollapse
					Icon={PeopleIcon}
					Label={"Users"}
					key={"Users"}
					defaultOpen={editorIsCreatingNewRole}
				>
					{/* TODO: Add a user text field and dropdown */}
					{users.map((user) => (
						<UserRow user={user} key={user.id} />
					))}
				</BaseCollapse>
			</List>
			<Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
				{editorIsCreatingNewRole ? (
					<Button variant="contained" color="primary">
						Create
					</Button>
				) : (
					<Button variant="contained" color="primary" onClick={handleEditRole}>
						Save
					</Button>
				)}
			</Box>
		</>
	);
};

const RolesTabSettings = ({ settings, user }) => {
	const [selectedRole, setSelectedRole] = useState(null);
	const [name, setName] = useState("");
	const [roles, setRoles] = useState(settings);
	const [permissions, setPermissions] = useState([]);
	const [users, setUsers] = useState([]);
	const [editorIsCreatingNewRole, setEditorIsCreatingNewRole] = useState(false);

	useEffect(() => {
		if (!selectedRole) {
			return;
		}

		setName(selectedRole.name);
		const permissionPairs = selectedRole.permissions
			.split(",")
			.map((kvPair) => kvPair.split(":"))
			.map((pair) => [pair[0], pair[1].includes("true")]);
		setPermissions(permissionPairs);
		setUsers(selectedRole.users);
	}, [selectedRole]);

	if (!settings || settings.length === 0 || !user) {
		return <>Loading</>;
	}

	return (
		<>
			<Typography variant="h5">Roles</Typography>
			<Box sx={{ height: "55vh", display: "flex", gap: 1 }}>
				<Box
					sx={{
						width: "45%",
						pt: 1,
						overflow: "auto",
					}}
				>
					<RolesGraph
						roles={roles}
						setRoles={setRoles}
						setSelectedRole={setSelectedRole}
						user={user}
						setEditorIsCreatingNewRole={setEditorIsCreatingNewRole}
						setName={setName}
						setPermissions={setPermissions}
						setUsers={setUsers}
					/>
				</Box>
				<Box
					sx={{
						width: "55%",
						pt: 1,
						overflow: "auto",
					}}
				>
					<RoleEditor
						name={name}
						setName={setName}
						users={users}
						setUsers={setUsers}
						permissions={permissions}
						setPermissions={setPermissions}
						selectedRole={selectedRole}
						setSelectedRole={setSelectedRole}
						editorIsCreatingNewRole={editorIsCreatingNewRole}
						setRoles={setRoles}
					/>
				</Box>
			</Box>
		</>
	);
};

const RolesTab = ({ settings, user, onClick, selected, indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={AccountTreeIcon}
			Label={"Roles"}
			selected={selected}
			indentLevel={indentLevel}
			onClick={onClick}
			SettingsPage={<RolesTabSettings settings={settings} user={user} />}
		/>
	);
};

export default RolesTab;
