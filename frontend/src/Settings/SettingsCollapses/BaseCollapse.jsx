import { Children, cloneElement, useState } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

const BaseCollapse = ({ Icon, Label, indentLevel = 0, children }) => {
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	const indentedChildren = Children.map(children, (child) =>
		cloneElement(child, { indentLevel: indentLevel + 1 }),
	);

	return (
		<>
			<ListItemButton
				onClick={handleClick}
				sx={{ pl: 2 * indentLevel + 2 }} // also in BaseTab
			>
				<ListItemIcon>
					<Icon />
				</ListItemIcon>
				<ListItemText primary={Label} />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>

			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{indentedChildren}
				</List>
			</Collapse>
		</>
	);
};

export default BaseCollapse;
