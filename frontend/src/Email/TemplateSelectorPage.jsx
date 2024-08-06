import { useParams } from "react-router-dom";
import { useState } from "react";
import {
	Typography,
	Box,
	TextField,
	List,
	ListItemButton,
	ListItemText,
	ListItem,
	IconButton,
	Divider,
	Button,
	CssBaseline,
	AppBar,
	Toolbar,
	Drawer,
	ListItemIcon,
} from "@mui/material";
import RichTextEditor from "./RichTextEditor";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import FileDownloadDoneOutlinedIcon from "@mui/icons-material/FileDownloadDoneOutlined";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/Inbox";
import OrganizationPeopleAutocomplete from "../common/OrganizationPeopleAutocomplete";

const TemplateTab = ({ name, file, onClick, selected, index }) => {
	return (
		<ListItemButton
			selected={selected === index}
			onClick={() => {
				onClick(file, index);
			}}
		>
			<ListItemText
				primary={name}
				sx={{
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					ml: 2,
				}}
			/>
			<IconButton
				onClick={() => {
					console.log("Click will propagate to ListItemButton's onClick");
					console.log("Delete this log");
				}}
			>
				<ManageSearchOutlinedIcon />
			</IconButton>
			<IconButton>
				<FileDownloadDoneOutlinedIcon />
			</IconButton>
		</ListItemButton>
	);
};

const TemplateMenu = ({}) => {
	const [templates, setTemplates] = useState([
		{ name: "Blank email", file: "" }, // always available
		{ name: "test", file: "test contents here" },
		{ name: "test2", file: "test2 contents here" },
		{ name: "test3", file: "test3 contents here" },
		{
			name: "Really long name on this one to test the list overflow",
			file: "other test file contents here",
		},
		{ name: "other test file", file: "other test file contents here" },
		{ name: "other test file", file: "other test file contents here" },
		{ name: "other test file", file: "other test file contents here" },
		{ name: "other test file", file: "other test file contents here" },
		{ name: "other test file", file: "other test file contents here" },
		{ name: "other test file", file: "other test file contents here" },
		{ name: "other test file", file: "other test file contents here" },
		{ name: "other test file", file: "other test file contents here" },
	]);
	const [templatePreview, setTemplatePreview] = useState(
		"Please select a template to preview",
	);
	const [selected, setSelected] = useState(-1);

	const handleTemplateClick = (file, index) => {
		setTemplatePreview(file);
		setSelected(index);
	};

	const drawerWidth = 240;

	const drawer = (
		<>
			<Toolbar>
				<Typography variant="h6" noWrap>
					Templates
				</Typography>
			</Toolbar>
			<Divider />
			<List>
				{["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
					<>
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
						<Divider />
					</>
				))}
			</List>
		</>
	);

	return (
		<Box sx={{ display: "flex" }}>
			{/* Not sure what CssBaseline does */}
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
				}}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						Responsive drawer
					</Typography>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
				}}
			>
				<Toolbar />
				<Typography paragraph>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
				</Typography>
			</Box>
		</Box>
	);

	return (
		<Box
			sx={{
				borderRadius: "8px",
				border: "1px solid #ccc",
				boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
				overflowX: "auto",
				padding: 1,
				mt: 1,
				display: "flex",
				height: "35vh",
				gap: 2,
			}}
		>
			<List
				sx={{
					width: "40%",
					maxWidth: "500px",
					overflow: "auto",
				}}
				component="nav"
				aria-labelledby="nested-list-subheader"
			>
				<ListItem sx={{ mt: -1, bgcolor: "lightgray" }}>
					<ListItemText primary="Templates" />
					<IconButton>
						<AddCircleOutlineOutlinedIcon />
					</IconButton>
				</ListItem>
				{templates.map((template, index) => (
					<TemplateTab
						name={template.name}
						file={template.file}
						selected={selected}
						onClick={handleTemplateClick}
						index={index}
						key={index}
					/>
				))}
			</List>
			<Box sx={{ overflowX: "auto" }}>
				{/* TODO: Read only slate box to display xml or whatever format */}
				<Typography>{templatePreview}</Typography>
			</Box>
		</Box>
	);
};

const EmailEditor = ({ orgId, sx }) => {
	const [subject, setSubject] = useState("");
	const [people, setPeople] = useState([]);

	const handleSendEmail = async () => {
		// send email
		console.log(`subject is ${subject}`);
		console.log(`people are ${people}`);
		console.log(`TODO: get the body info from the RichTextEditor`);

		try {
			const sendEmail = async (people, subject, body) => {
				// TODO: get backend function to send email
				return;
			};
			const response = await sendEmail(people, subject, "body");
		} catch {
			console.error("Failed to send email");
		}
	};

	return (
		<Box sx={sx}>
			<TextField
				label="Subject"
				fullWidth
				onChange={(e) => setSubject(e.target.value)}
			/>
			<OrganizationPeopleAutocomplete
				parentSetSelectedPeople={setPeople}
				organizationId={orgId}
				sx={{ mt: 1 }}
			/>
			<Box
				sx={{
					border: "1px solid #ccc",
					borderRadius: "8px",
					padding: "16px",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
					mt: 1,
					// width: "50%",
				}}
			>
				<RichTextEditor editorStyle={{ height: "80vh" }} />
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
				<Button variant="outlined">
					Discard
					<DeleteIcon sx={{ ml: 1 }} />
				</Button>
				<Button variant="contained">
					Send
					<SendIcon sx={{ ml: 1 }} />
				</Button>
			</Box>
		</Box>
	);
};

const TemplateSelectorPage = ({}) => {
	const { orgId } = useParams();

	return (
		<>
			<TemplateMenu />
		</>
	);
};

export default TemplateSelectorPage;
