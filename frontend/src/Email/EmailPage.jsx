import { useParams } from "react-router-dom";
import { useState } from "react";
import {
	Typography,
	Box,
	TextField,
	List,
	ListItemButton,
	ListItemText,
	IconButton,
	Divider,
	Button,
	Toolbar,
	Drawer,
	Menu,
	MenuItem,
} from "@mui/material";
import RichTextEditor from "./RichTextEditor";
import OrganizationPeopleAutocomplete from "../common/OrganizationPeopleAutocomplete";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

const TemplateTab = ({
	name,
	file,
	onClick,
	handleDeleteTemplate,
	selected,
	index,
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleOptionsClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleOptionsClose = () => {
		setAnchorEl(null);
	};

	return (
		<ListItemButton
			selected={selected === index}
			onClick={() => {
				onClick(file, index);
			}}
			sx={{
				"&:hover .MuiIconButton-root": {
					visibility: "visible",
				},
			}}
		>
			<ListItemText
				primary={name}
				sx={{
					overflow: "hidden",
					whiteSpace: "nowrap",
					ml: 2,
				}}
			/>
			<IconButton
				onClick={handleOptionsClick}
				sx={{ visibility: open ? "visible" : "hidden" }}
			>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleOptionsClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem onClick={handleOptionsClose}>Edit</MenuItem>
				<MenuItem onClick={handleOptionsClose} sx={{ color: "red" }}>
					Delete
				</MenuItem>
			</Menu>
		</ListItemButton>
	);
};

const TemplateDrawer = ({
	templates,
	selected,
	handleAddTemplate,
	handleTemplateClick,
	handleDeleteTemplate,
}) => {
	const drawerWidth = 256;

	return (
		<Box
			component="nav"
			sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			aria-label="mailbox folders"
		>
			<Drawer
				variant="permanent"
				sx={{
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: drawerWidth,
					},
				}}
				open
			>
				<Toolbar>
					<Box
						sx={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Typography variant="h6" noWrap>
							Templates
						</Typography>
						<IconButton onClick={handleAddTemplate}>
							<AddCircleOutlineOutlinedIcon />
						</IconButton>
					</Box>
				</Toolbar>
				<Divider />
				<List
					sx={{
						overflowY: "auto",
						pt: 0,
					}}
				>
					{templates.map((template, index) => (
						<TemplateTab
							name={template.name}
							file={template.file}
							selected={selected}
							onClick={handleTemplateClick}
							handleDeleteTemplate={handleDeleteTemplate}
							index={index}
							key={index}
						/>
					))}
				</List>
			</Drawer>
		</Box>
	);
};

const TemplateMenu = ({ open, toggleTemplateMenu }) => {
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
	const [isEditing, setIsEditing] = useState(false);

	const closeTemplateMenu = () => {
		if (isEditing === true) {
			return;
		}

		toggleTemplateMenu(false)();
	};

	const handleAddTemplate = () => {
		console.log("TODO: Handle adding new templates");
	};

	const handleToggleEditTemplate = () => {
		setIsEditing(!isEditing);
	};

	const handleTemplateSave = () => {
		console.log("TODO: Handle saving templates");
		handleToggleEditTemplate(!isEditing);
	};

	const handleTemplateClick = (file, index) => {
		setTemplatePreview(file);
		setSelected(index);
	};

	const handleDeleteTemplate = () => {
		console.log(
			"TODO: Handle deleting templates. Probably have to pass this function to the TemplateTab component",
		);
	};

	const handleUseTemplate = () => {
		console.log("TODO: Handle using templates");
		closeTemplateMenu();
	};

	const TemplateTopbar = ({}) => {
		return (
			<Toolbar>
				<Box
					sx={{
						width: "100%",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h6">Preview</Typography>
					<Box>
						{isEditing ? (
							<>
								<Button variant="outlined" onClick={handleToggleEditTemplate}>
									Cancel
								</Button>
								<Button
									variant="contained"
									onClick={handleTemplateSave}
									sx={{ ml: 1 }}
								>
									Save
								</Button>
							</>
						) : (
							<>
								<Button variant="outlined" onClick={handleToggleEditTemplate}>
									Edit
								</Button>
								<Button
									variant="contained"
									onClick={handleUseTemplate}
									sx={{ ml: 1 }}
								>
									Use template
								</Button>
							</>
						)}
						<IconButton onClick={closeTemplateMenu} sx={{ ml: 1 }}>
							<CloseIcon />
						</IconButton>
					</Box>
				</Box>
			</Toolbar>
		);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Drawer
				open={open}
				onClose={toggleTemplateMenu(false)}
				PaperProps={{
					sx: {
						width: "85%",
					},
				}}
			>
				<Box sx={{ display: "flex", width: "100%", height: "87%" }}>
					<TemplateDrawer
						templates={templates}
						selected={selected}
						handleAddTemplate={handleAddTemplate}
						handleTemplateClick={handleTemplateClick}
						handleDeleteTemplate={handleDeleteTemplate}
					/>
					<Box
						sx={{
							width: "100%",
						}}
					>
						<TemplateTopbar />
						<Divider sx={{ mb: 2 }} />
						{/* Delete this Typography when you figure out how to pass the template into slate */}
						{/* <Typography>{templatePreview}</Typography> */}
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								height: "100%",
							}}
						>
							<RichTextEditor
								readOnly={!isEditing}
								toolbarStyle={{ width: "95%" }}
								editorStyle={{
									width: "95%",
									height: "100%",
								}}
								initialText={templatePreview}
							/>
						</Box>
					</Box>
				</Box>
			</Drawer>
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
				<RichTextEditor editorStyle={{ height: "50vh" }} />
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

const EmailPage = ({}) => {
	const { orgId } = useParams();
	const [open, setOpen] = useState(false);

	const toggleDrawer = (newOpen) => () => {
		if (typeof newOpen === "boolean") {
			setOpen(newOpen);
			return;
		}
		setOpen(!open);
	};

	return (
		<>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					pr: 1,
				}}
			>
				<Typography variant="h5">Compose email</Typography>
				<Button onClick={toggleDrawer(true)} variant="outlined">
					Use a template
				</Button>
			</Box>
			<Divider sx={{ m: 2 }} />
			<EmailEditor orgId={orgId} />

			<TemplateMenu open={open} toggleTemplateMenu={toggleDrawer} />
		</>
	);
};

export default EmailPage;
