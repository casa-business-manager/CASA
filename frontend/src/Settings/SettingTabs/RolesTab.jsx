import { useEffect, useState } from "react";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {
	Box,
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

const graphTheme = {
	...lightTheme,
	node: {
		...lightTheme.node,
		activeFill: "#ff7f0e",
	},
};

const GraphPopup = ({ data, onClose, setSelectedRole }) => {
	const menuClickWrapper = (handlerFunction) => {
		return () => {
			handlerFunction();
			onClose();
		};
	};

	const openDetails = () => {
		console.log(data);
		console.log(data.data);
		setSelectedRole(data.data);
	};

	return (
		<Popper
			open={true}
			anchorEl={true}
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
								<MenuItem onClick={menuClickWrapper(openDetails)}>
									Open details
								</MenuItem>
								<MenuItem onClick={onClose}>Add new role</MenuItem>
								<MenuItem onClick={onClose}>Delete role</MenuItem>
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);
};

const RolesGraph = ({ roles, setSelectedRole }) => {
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
				}}
				contextMenu={({ data, onClose }) => (
					<GraphPopup
						data={data}
						onClose={onClose}
						setSelectedRole={setSelectedRole}
					/>
				)}
				theme={graphTheme}
			/>
		</Box>
	);
};

const PermissionRow = ({ permission, value }) => {
	return (
		<Box sx={{ display: "flex", justifyContent: "space-between", m: 4, pl: 4 }}>
			<Typography sx={{}}>{permission}</Typography>
			{value === true || value === false ? (
				<Switch checked={value} onChange={() => {}} />
			) : (
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

const RolesTabSettings = ({ settings }) => {
	const [selectedRole, setSelectedRole] = useState(null);
	const [name, setName] = useState("");
	const [roles, setRoles] = useState(settings);
	const [permissions, setPermissions] = useState({
		"Can poop": true,
		"can fart": true,
		"can backflip": false,
		"Can leave all this behind and live a more meaningful life in the mountains as a hermit for the rest of their days": false,
		"Can pee": true,
	});
	const [users, setUsers] = useState([]);

	useEffect(() => {
		if (!selectedRole) {
			return;
		}

		setName(selectedRole.name);
		setPermissions(selectedRole.permissions);
		setUsers(selectedRole.users);
	}, [selectedRole]);

	if (!settings || settings.length === 0) {
		return <>Loading</>;
	}

	const permissionPairs = Object.keys(permissions).map((key) => [
		key,
		permissions[key],
	]);

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
					<RolesGraph roles={roles} setSelectedRole={setSelectedRole} />
				</Box>
				<Box
					sx={{
						width: "55%",
						pt: 1,
						overflow: "auto",
					}}
				>
					{selectedRole === null ? (
						<Typography>Please select a role</Typography>
					) : (
						<>
							<Typography variant="h6" sx={{ mb: 1 }}>
								Role Details:
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
								<BaseCollapse Icon={ShieldIcon} Label={"Permissions"}>
									{permissionPairs.map((pair) => (
										<PermissionRow permission={pair[0]} value={pair[1]} />
									))}
								</BaseCollapse>
								<BaseCollapse Icon={PeopleIcon} Label={"Users"}>
									{users.map((user) => (
										<UserRow user={user} />
									))}
								</BaseCollapse>
							</List>
						</>
					)}
				</Box>
			</Box>
		</>
	);
};

const RolesTab = ({ settings, onClick, selected, indentLevel = 0 }) => {
	return (
		<BaseTab
			Icon={AccountTreeIcon}
			Label={"Roles"}
			selected={selected}
			indentLevel={indentLevel}
			onClick={onClick}
			SettingsPage={<RolesTabSettings settings={settings} />}
		/>
	);
};

export default RolesTab;
