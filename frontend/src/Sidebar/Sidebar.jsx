import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers/icons";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useParams } from "react-router-dom";
import SettingsButton from "../Settings/SettingsButton";

const Sidebar = ({ selected, children }) => {
	const { orgId } = useParams();
	const navigate = useNavigate();

	// TODO: Move settings to its own page instead of dialog box
	const options = [
		{
			label: "Home",
			icon: <HomeIcon />,
			navigation: () => navigate(`/organization/${orgId}`),
		},
		{
			label: "Calendar",
			icon: <CalendarIcon />,
			navigation: () => navigate(`/organization/${orgId}/calendar`),
		},
		{
			label: "Email",
			icon: <EmailIcon />,
			navigation: () => navigate(`/organization/${orgId}/email`),
		},
		// {
		// 	label: "Settings",
		// 	icon: <SettingsIcon />,
		// 	navigation: () => navigate(`/organization/${orgId}/settings`),
		// }
	];

	return (
		<Box sx={{ display: "flex" }}>
			<Drawer
				variant="permanent"
				anchor="left"
				sx={{
					width: 240,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: 240,
						boxSizing: "border-box",
					},
				}}
			>
				<Toolbar />
				<List>
					{options.map((option) => (
						<ListItem>
							<ListItemButton
								selected={selected === option.label}
								onClick={option.navigation}
							>
								<ListItemIcon>{option.icon}</ListItemIcon>
								<ListItemText primary={option.label} />
							</ListItemButton>
						</ListItem>
					))}
					<ListItem>
						<SettingsButton orgId={orgId} />
					</ListItem>
				</List>
			</Drawer>
			<Box sx={{ flexGrow: 1 }}>{children}</Box>
		</Box>
	);
};

export default Sidebar;
