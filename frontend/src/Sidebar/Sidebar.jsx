import { Box, Drawer } from "@mui/material";

const Sidebar = ({ children }) => {
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
			></Drawer>
			<Box sx={{ flexGrow: 1 }}>{children}</Box>
		</Box>
	);
};

export default Sidebar;
