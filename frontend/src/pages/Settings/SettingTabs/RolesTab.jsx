import { useCallback, useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import {
	Autocomplete,
	Box,
	Button,
	ClickAwayListener,
	FormControl,
	Grow,
	IconButton,
	InputLabel,
	List,
	MenuItem,
	MenuList,
	Paper,
	Popper,
	Select,
	Switch,
	TextField,
} from "@mui/material";
import BaseCollapse from "../SettingsCollapses/BaseCollapse";
import { GraphCanvas, lightTheme } from "reagraph";
import { createRole, deleteRole, editRole } from "../../../API/RoleAPI";
import UserChip from "../../../components/common/UserChip";
import {
	CloseIcon,
	PeopleIcon,
	PermissionIcon,
	RoleManagedByIcon,
	RolesIcon,
} from "../../../constants/icons";

const lockedRoleColor = "#B8B8B8";
const controlledRoleColor = "#A2E6FF";
const ownedRoleColor = "#3B89F3";
const selectedColor = "#ff7f0e";
const selectedColorRing = "#ff7f0e";
const edgeColor = "#a3bdc4";
const inactiveOpacity = 0.4;
const canvasBackgroundColor = "#f0f0f0";

const graphTheme = {
	...lightTheme,
	node: {
		...lightTheme.node,
		activeFill: selectedColor,
		inactiveOpacity: inactiveOpacity,
		label: {
			...lightTheme.node.label,
			stroke: canvasBackgroundColor,
			activeColor: selectedColorRing,
		},
	},
	ring: {
		...lightTheme.ring,
		activeFill: selectedColorRing,
	},
	edge: {
		...lightTheme.edge,
		fill: edgeColor,
		activeFill: edgeColor,
		inactiveOpacity: inactiveOpacity,
	},
	arrow: {
		...lightTheme.arrow,
		fill: edgeColor,
		activeFill: edgeColor,
	},
	canvas: {
		...lightTheme.canvas,
		background: canvasBackgroundColor,
	},
};

const GraphPopup = ({
	node,
	onClose,
	roles,
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

	const handleDeleteRole = async () => {
		const getRoleSubtreeIds = (role) => {
			const roleIds = [role.roleId];
			const roleWithData = roles.find((r) => r.roleId === role.roleId);
			roleWithData.managedRoles.forEach((managedRole) => {
				roleIds.push(...getRoleSubtreeIds(managedRole));
			});
			return roleIds;
		};

		try {
			await deleteRole(node.data.roleId);
			setSelectedRole(null);
			setSelectedNode(null);
			const roleIdsToDelete = getRoleSubtreeIds(node.data);
			setRoles((prevRoles) => {
				const newRoles = prevRoles.filter(
					(role) => !roleIdsToDelete.includes(role.roleId),
				);
				newRoles.forEach((role) => {
					role.managedRoles = role.managedRoles.filter(
						(managedRole) => !roleIdsToDelete.includes(managedRole.roleId),
					);
				});
				return newRoles;
			});
		} catch {
			console.error("Delete failed");
		}
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
								<MenuItem
									onClick={menuClickWrapper(handleDeleteRole)}
									style={{ color: "red" }}
								>
									Delete role
								</MenuItem>
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
	selectedRole,
	setSelectedRole,
	user,
	setEditorIsCreatingNewRole,
	setName,
	setPermissions,
	setUsers,
}) => {
	const [selected, setSelected] = useState([]);

	useEffect(() => {
		if (selectedRole === null) {
			setSelected([]);
		}
	}, [selectedRole]);

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
		const poppedRole = controlledRoles.pop();
		const role = roles.find((role) => role.roleId === poppedRole.roleId);
		roleIdToNodeDict[role.roleId].fill = controlledRoleColor;
		role.managedRoles.forEach((managedRole) => {
			if (!controlledRoles.includes(managedRole)) {
				controlledRoles.push(managedRole);
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
				width: "100%",
				height: "100%",
				backgroundColor: canvasBackgroundColor,
				borderRadius: 3,
				// center the graph's Box
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Box
				sx={{
					position: "relative",
					width: "97%", // must match this to borderradius
					height: "97%",
					backgroundColor: canvasBackgroundColor,
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
							roles={roles}
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
		</Box>
	);
};

const PermissionRow = ({
	permission,
	value,
	setPermissions,
	permissionIndex,
	editTrackerWrapper,
}) => {
	const togglePermission = () => {
		setPermissions((prevPermissions) => {
			const newPermissions = [...prevPermissions];
			newPermissions[permissionIndex][1] = !newPermissions[permissionIndex][1];
			return newPermissions;
		});
	};
	return (
		<Box
			key={`permission-box-${permissionIndex}`}
			sx={{ display: "flex", justifyContent: "space-between", m: 4, pl: 4 }}
		>
			<Typography key={`permissiontext-${permissionIndex}`} sx={{}}>
				{permission}
			</Typography>
			{value === true || value === false ? (
				<Switch
					key={`permission-switch-${permissionIndex}`}
					checked={value}
					onChange={editTrackerWrapper(togglePermission)}
				/>
			) : (
				// TODO: permissions that are not true/false
				<TextField key={permissionIndex}></TextField>
			)}
		</Box>
	);
};

const UserRow = ({ user, setUsers, editTrackerWrapper }) => {
	return (
		<Box
			key={`userrow-box-${user.id}`}
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				m: 2,
				pl: 4,
			}}
		>
			<UserChip user={user} />
			<IconButton
				onClick={editTrackerWrapper(() => {
					setUsers((prevUsers) => {
						const newUsers = prevUsers.filter(
							(roleUser) => roleUser.id !== user.id,
						);
						return newUsers.sort((a, b) => a.lastName > b.lastName);
					});
				})}
				key={`userrow-button-${user.id}`}
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
	setEditorIsCreatingNewRole,
	roles,
	setRoles,
}) => {
	const [organizationUsers, setOrganizationUsers] = useState(null);
	const [managedById, setManagedById] = useState(null);
	const [nonDescendants, setNonDescendants] = useState([]);
	const [editMade, setEditMade] = useState(false);

	const updateOrganizationUsers = useCallback(() => {
		if (selectedRole) {
			setOrganizationUsers(selectedRole.organization.users);
		}
	}, [selectedRole]);

	useEffect(() => {
		updateOrganizationUsers();
	}, [updateOrganizationUsers]);

	const findManagingRole = (managedRole) => {
		return roles.find((role) =>
			role.managedRoles.map((role) => role.roleId).includes(managedRole.roleId),
		);
	};

	useEffect(() => {
		if (!selectedRole) {
			return;
		}

		const managedByRole = findManagingRole(selectedRole);
		setEditMade(false);

		if (!managedByRole) {
			setManagedById(null);
			return;
		}

		setManagedById(managedByRole.roleId);
	}, [selectedRole, roles]);

	const getRolesWithoutSubtree = (role, excludedSubtreeRoot) => {
		const roleWithRecentData = roles.find((r) => r.roleId === role.roleId);
		const rolesWithoutSubtree = [roleWithRecentData];
		roleWithRecentData.managedRoles.forEach((managedRole) => {
			if (managedRole.roleId !== excludedSubtreeRoot.roleId) {
				rolesWithoutSubtree.push(
					...getRolesWithoutSubtree(managedRole, excludedSubtreeRoot),
				);
			}
		});
		return rolesWithoutSubtree;
	};

	const findRootRole = (roles) => {
		const managedRoleIds = roles.flatMap((role) =>
			role.managedRoles.map((managedRole) => managedRole.roleId),
		);
		const rootRole = roles.find(
			(role) => !managedRoleIds.includes(role.roleId),
		);
		return rootRole;
	};

	useEffect(() => {
		if (!roles || !selectedRole) {
			return;
		}

		setNonDescendants(
			getRolesWithoutSubtree(findRootRole(roles), selectedRole),
		);
	}, [selectedRole, roles]);

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
			setEditorIsCreatingNewRole(false);
			setSelectedRole(null);
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
			managedById: managedById,
		};
		try {
			const editedRole = await editRole(selectedRole.roleId, editedRoleDto);
			setRoles((prevRoles) => {
				const oldManagedByRole = findManagingRole(selectedRole);

				// case: editing root node (no managedBy)
				// case: same managedBy role
				if (!oldManagedByRole || oldManagedByRole.roleId === managedById) {
					const untouchedRoles = prevRoles.filter(
						(role) => role.roleId !== editedRole.roleId,
					);
					return [...untouchedRoles, editedRole];
				}

				// case: new managedBy role
				if (oldManagedByRole.roleId !== managedById) {
					oldManagedByRole.managedRoles = oldManagedByRole.managedRoles.filter(
						(role) => role.roleId !== editedRole.roleId,
					);

					const newManagedByRole = prevRoles.find(
						(role) => role.roleId === managedById,
					);
					newManagedByRole.managedRoles.push(editedRole);

					const untouchedRoles = prevRoles.filter(
						(role) =>
							role.roleId !== editedRole.roleId &&
							role.roleId !== oldManagedByRole.roleId &&
							role.roleId !== newManagedByRole.roleId &&
							role.roleId !== managedById.roleId,
					);

					const touchedRoles = [editedRole, oldManagedByRole, newManagedByRole];

					return [...untouchedRoles, ...touchedRoles];
				}
			});
			setSelectedRole(editedRole);
			setEditMade(false);
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

	const editTrackerWrapper = (onChangeFunction) => {
		return (e, extra) => {
			onChangeFunction(e, extra);
			setEditMade(true);
		};
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
				onChange={editTrackerWrapper((e) => setName(e.target.value))}
				sx={{ mb: 2 }}
				InputProps={{ sx: { fontSize: "1.5rem" } }}
				InputLabelProps={{ sx: { fontSize: "1.5rem" } }}
			/>
			{!editorIsCreatingNewRole && managedById && (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						alignItems: "center",
					}}
				>
					<RoleManagedByIcon />
					<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
						<InputLabel>Managed by</InputLabel>
						<Select
							value={managedById}
							onChange={editTrackerWrapper((e) => {
								setManagedById(e.target.value);
							})}
							label="Managed by"
						>
							{nonDescendants.map((role) => (
								<MenuItem value={role.roleId} key={role.roleId}>
									{role.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			)}
			<List sx={{ overflow: "auto" }}>
				<BaseCollapse
					Icon={PermissionIcon}
					Label={"Permissions"}
					key={"Permissions"}
					defaultOpen={editorIsCreatingNewRole}
					useIndentLevel={false}
				>
					{permissions.map((pair, index) => (
						<PermissionRow
							permission={pair[0]}
							value={pair[1]}
							setPermissions={setPermissions}
							permissionIndex={index}
							key={`permission-${permissions[index]}`}
							editTrackerWrapper={editTrackerWrapper}
						/>
					))}
				</BaseCollapse>
				<BaseCollapse
					Icon={PeopleIcon}
					Label={"Users"}
					key={"Users"}
					defaultOpen={editorIsCreatingNewRole}
					useIndentLevel={false}
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
						onChange={editTrackerWrapper(handleAddPerson)}
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
						<UserRow
							user={user}
							setUsers={setUsers}
							key={`chip-${user.id}`}
							editTrackerWrapper={editTrackerWrapper}
						/>
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
					editMade && (
						<Button
							variant="contained"
							color="primary"
							onClick={handleEditRole}
						>
							Save
						</Button>
					)
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
		setUsers(selectedRole.users.sort((a, b) => a.lastName > b.lastName));

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
	}, [selectedRole, editorIsCreatingNewRole]);

	if (!settings || settings.length === 0 || !user) {
		return <>Loading</>;
	}

	return (
		<>
			<Typography variant="h5">Roles</Typography>
			<Box sx={{ height: "100%", display: "flex", gap: 1 }}>
				<Box
					sx={{
						width: "45%",
						height: "100%",
						pt: 1,
						overflow: "auto",
					}}
				>
					<RolesGraph
						roles={roles}
						setRoles={setRoles}
						selectedRole={selectedRole}
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
						setEditorIsCreatingNewRole={setEditorIsCreatingNewRole}
						roles={roles}
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
			Icon={RolesIcon}
			Label={"Roles"}
			selected={selected}
			indentLevel={indentLevel}
			onClick={onClick}
			SettingsPage={<RolesTabSettings settings={settings} user={user} />}
		/>
	);
};

export default RolesTab;
