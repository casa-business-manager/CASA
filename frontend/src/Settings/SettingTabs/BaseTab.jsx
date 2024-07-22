import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const BaseTab = ({ Icon, Label, selected, indentLevel = 0, onClick }) => {
	return (
		<ListItemButton
			selected={selected}
			onClick={onClick}
			sx={{
				// also in CollapseTab
				pl: 2 * indentLevel + 2,
			}}
		>
			<ListItemIcon>
				<Icon />
			</ListItemIcon>
			<ListItemText primary={Label} />
		</ListItemButton>
	);
};

export default BaseTab;
