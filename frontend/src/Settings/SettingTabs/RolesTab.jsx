import { useEffect, useRef, useState } from "react";
import BaseTab from "./BaseTab";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {
	Box,
	Chip,
	IconButton,
	List,
	SpeedDialIcon,
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

const RolesGraph = ({ roles }) => {
	const [selected, setSelected] = useState([]);

	const nodes = [];
	const edges = [];

	roles.forEach((role) => {
		nodes.push({
			id: role.roleId,
			label: role.name,
			fill: "#1f77b4",
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
				}}
				onNodeDoubleClick={(node) => {
					console.log("double click" + node);
				}}
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
	const [selectedRole, setSelectedRole] = useState({});
	const [name, setName] = useState("initial role name");
	const [roles, setRoles] = useState([
		{
			roleId: "1",
			name: "Admin",
			managedRoles: [
				{ roleId: "2", name: "Manager" },
				{ roleId: "3", name: "Supervisor" },
			],
		},
		{
			roleId: "2",
			name: "Manager",
			managedRoles: [{ roleId: "4", name: "Team Lead" }],
		},
		{
			roleId: "3",
			name: "Supervisor",
			managedRoles: [],
		},
		{
			roleId: "4",
			name: "Team Lead",
			managedRoles: [],
		},
	]);
	const [permissions, setPermissions] = useState({
		"Can poop": true,
		"can fart": true,
		"can backflip": false,
		"Can leave all this behind and live a more meaningful life in the mountains as a hermit for the rest of their days": false,
		"Can pee": true,
	});
	const [users, setUsers] = useState([
		{ roleId: "aaaa", firstName: "Waltuh", lastName: "White" },
		{ roleId: "bbbb", firstName: "Jessie", lastName: "Pinkman" },
	]);

	// useEffect(() => {
	// 	setName(selectedRole.name);
	//	setRoles(settings.roles);
	// 	setPermissions(selectedRole.permissions);
	// 	setUsers(selectedRole.users);
	// }, [selectedRole]);

	if (!settings || !settings.orgName) {
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
					<RolesGraph roles={roles} />
				</Box>
				<Box
					sx={{
						width: "55%",
						pt: 1,
						overflow: "auto",
					}}
				>
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
