import { useCallback, useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {
	Autocomplete,
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
import { createRole, editRole } from "../../APIUtils/APIUtils";

const graphTheme = {
	...lightTheme,
	node: {
		...lightTheme.node,
		activeFill: "#ff7f0e",
	},
};

const lockedRoleColor = "#E8E8E8";
const controlledRoleColor = "#A2E6FF";
const ownedRoleColor = "#3B89F3";

const GraphPopup = ({
	node,
	onClose,
	setSelectedRole,
	setRoles,
	setEditorIsCreatingNewRole,
	setName,
	setPermissions,
	setUsers,
	setSelectedNode,
}) => {
	const menuClickWrapper = (handlerFunction) => {
		return (event) => {
			event.stopPropagation();
			handlerFunction();
			onClose();
		};
	};

	const handleOpenDetails = () => {
		setEditorIsCreatingNewRole(false);
		setSelectedRole(node.data);
		setSelectedNode(node.id);
	};

	const handleAddRole = () => {
		setSelectedRole(node.data);
		setSelectedNode(node.id);
		setEditorIsCreatingNewRole(true);
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

	const roleIdToNodeDict = {};
	const controlledRoles = [];
	const userRoles = [];
	const edges = [];

	roles.forEach((role) => {
		roleIdToNodeDict[role.roleId] = {
			id: role.roleId,
			label: role.name,
			data: role,
			fill: lockedRoleColor, // will be overridden later
		};
		if (role.users.map((roleUser) => roleUser.id).includes(user.id)) {
			controlledRoles.push(role);
			userRoles.push(role);
		}

		role.managedRoles.forEach((managedRole) => {
			edges.push({
				source: role.roleId,
				target: managedRole.roleId,
				id: role.roleId + "-" + managedRole.roleId,
			});
		});
	});

	// DFS to color controlled nodes
	while (controlledRoles.length > 0) {
		const role = controlledRoles.pop();
		role.managedRoles.forEach((managedRole) => {
			if (!controlledRoles.includes(managedRole)) {
				controlledRoles.push(managedRole);
				roleIdToNodeDict[managedRole.roleId].fill = controlledRoleColor;
			}
		});
	}

	// one more pass to color owned nodes
	for (const role of userRoles) {
		roleIdToNodeDict[role.roleId].fill = ownedRoleColor;
	}

	// compile into sorted list (sorted gives consistency in tree ordering)
	const nodes = Object.values(roleIdToNodeDict).sort(
		(a, b) => a.label > b.label,
	);

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
				layoutType="treeTd2d"
				selections={selected}
				onNodeClick={(node) => {
					setSelected(node.id);
					setSelectedRole(node.data);
					setEditorIsCreatingNewRole(false);
				}}
				onCanvasClick={() => {
					setSelected([]);
					setSelectedRole(null);
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
						setSelectedNode={setSelected}
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

const UserRow = ({ user, setUsers }) => {
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
					setUsers((prevUsers) => {
						const newUsers = prevUsers.filter(
							(roleUser) => roleUser.id !== user.id,
						);
						return newUsers.sort((a, b) => a.lastName > b.lastName);
					});
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
	const [organizationUsers, setOrganizationUsers] = useState(null);

	const updateOrganizationUsers = useCallback(() => {
		if (selectedRole) {
			setOrganizationUsers(selectedRole.organization.users);
		}
	}, [selectedRole]);

	useEffect(() => {
		updateOrganizationUsers();
	}, [updateOrganizationUsers]);

	if (selectedRole === null || organizationUsers === null) {
		return <Typography>Please select a role</Typography>;
	}

	const handleAddRoleToGraph = async () => {
		const parentRoleId = selectedRole.roleId;
		const parentRole = selectedRole;
		const newRoleDto = {
			name: name,
			permissions: permissions
				.map((pair) => {
					return pair[0] + ":" + pair[1];
				})
				.join(","),
			userIds: users.map((user) => user.id),
			managedById: parentRoleId,
		};
		try {
			const newRole = await createRole(
				parentRole.organization.orgId,
				newRoleDto,
			);
			parentRole.managedRoles.push(newRole);
			setRoles((prevRoles) => {
				const untouchedRoles = prevRoles.filter(
					(role) => role.roleId !== parentRoleId,
				);
				return [...untouchedRoles, parentRole, newRole];
			});
		} catch {
			console.error("Save failed");
			return;
		}
	};

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
			userIds: userIds,
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

	const getUserFullName = (userObject) =>
		userObject.firstName + " " + userObject.lastName;

	const handleAddPerson = (e, newUserList) => {
		// newUserList is [newUserObject]
		setUsers((prevUsers) => {
			const newUsers = [...prevUsers, newUserList[0]];
			return newUsers.sort((a, b) => a.lastName > b.lastName);
		});
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
					<Autocomplete
						multiple
						id="tags-outlined"
						options={organizationUsers.filter(
							(orgUser) =>
								!users.map((roleUser) => roleUser.id).includes(orgUser.id),
						)}
						getOptionLabel={(option) => getUserFullName(option)}
						defaultValue={[]}
						value={[]}
						onChange={handleAddPerson}
						filterSelectedOptions
						renderInput={(params) => (
							<TextField
								{...params}
								label="Users"
								placeholder="Add user"
								variant="standard"
							/>
						)}
						sx={{ pl: 4, width: "83%" }}
					/>
					{users.map((user) => (
						<UserRow user={user} setUsers={setUsers} key={user.id} />
					))}
				</BaseCollapse>
			</List>
			<Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
				{editorIsCreatingNewRole ? (
					<Button
						variant="contained"
						color="primary"
						onClick={handleAddRoleToGraph}
					>
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

		if (editorIsCreatingNewRole) {
			setName("");
			setPermissions((oldPermissions) => {
				const newPermissions = [...oldPermissions];
				for (let i = 0; i < newPermissions.length; i++) {
					newPermissions[i][1] = false;
				}
				return newPermissions;
			});
			setUsers([]);
			return;
		}

		setName(selectedRole.name);
		const permissionPairs = selectedRole.permissions
			.split(",")
			.map((kvPair) => kvPair.split(":"))
			.map((pair) => [pair[0], pair[1].includes("true")]);
		setPermissions(permissionPairs);
		setUsers(selectedRole.users.sort((a, b) => a.lastName > b.lastName));
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
