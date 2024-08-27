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
import { useNavigate, useParams } from "react-router-dom";

const Sidebar = ({ selected, children }) => {
	const { orgId } = useParams();
	const navigate = useNavigate();

	const options = [
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
					<ListItem>
						<ListItemText
							primary={<Typography variant="h6">Applications</Typography>}
						/>
					</ListItem>

					<Divider />

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
				</List>
			</Drawer>
			<Box sx={{ flexGrow: 1 }}>{children}</Box>
		</Box>
	);
};

export default Sidebar;
