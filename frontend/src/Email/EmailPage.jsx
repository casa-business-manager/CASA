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
import WarningDialog from "../common/WarningDialog";

const TemplateTab = ({
	name,
	file,
	onClick,
	handleEditTemplate,
	handleDeleteTemplate,
	selected,
	index,
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [warningDialogOpen, setWarningDialogOpen] = useState(false);

	const open = Boolean(anchorEl);

	const handleTabClick = () => {
		onClick(file, index);
	};

	const handleOptionsClick = (e) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};

	const handleOptionsClose = (e) => {
		e.stopPropagation();
		setAnchorEl(null);
	};

	const askBeforeDelete = (e) => {
		e.stopPropagation();
		setWarningDialogOpen(true);
	};

	const handleEditTemplateWrapper = () => {
		handleTabClick();
		handleEditTemplate();
	};

	const handleDeleteTemplateWrapper = () => {
		handleDeleteTemplate();
		setAnchorEl(null);
	};

	return (
		<ListItemButton
			selected={selected === index}
			onClick={handleTabClick}
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
				<MenuItem onClick={handleEditTemplateWrapper}>Edit</MenuItem>
				<MenuItem onClick={askBeforeDelete} sx={{ color: "red" }}>
					Delete
				</MenuItem>
				<WarningDialog
					open={warningDialogOpen}
					setOpen={setWarningDialogOpen}
					func={handleDeleteTemplateWrapper}
					variant="delete"
				/>
			</Menu>
		</ListItemButton>
	);
};

const TemplateDrawer = ({
	templates,
	selected,
	handleAddTemplate,
	handleTemplateClick,
	handleEditTemplate,
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
							handleEditTemplate={handleEditTemplate}
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

const TemplateMenu = ({ open, closeDrawer }) => {
	const [templates, setTemplates] = useState([
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

	const [warningDialogOpen, setWarningDialogOpen] = useState(false);
	const [warningDialogFunction, setWarningDialogFunction] = useState(() => {});
	const [warningDialogParams, setWarningDialogParams] = useState([]);

	const warnIfEditing = (func) => {
		return isEditing === true
			? (...params) => {
					setWarningDialogOpen(true);
					setWarningDialogFunction(() => func);
					setWarningDialogParams(params);
				}
			: func;
	};

	const handleAddTemplate = () => {
		console.log("TODO: Handle adding new templates");
	};

	const closeDrawerWrapper = () => {
		closeDrawer();
		setIsEditing(false);
	};

	const handleEnableEditing = () => {
		setIsEditing(true);
	};

	const handleDisableEditing = () => {
		setIsEditing(false);
	};

	const handleTemplateSave = () => {
		console.log("TODO: Handle saving templates");
		handleDisableEditing();
	};

	const handleTemplateClick = (file, index) => {
		setTemplatePreview(file);
		setSelected(index);
		setIsEditing(false);
	};

	const handleDeleteTemplate = () => {
		console.log(
			"TODO: Handle deleting templates. Probably have to pass this function to the TemplateTab component",
		);
	};

	const handleUseTemplate = () => {
		console.log("TODO: Handle using templates");
		warnIfEditing(closeDrawerWrapper)();
	};

	const TemplateTopbar = ({}) => {
		return (
			<>
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
									<Button
										variant="outlined"
										onClick={warnIfEditing(handleDisableEditing)}
									>
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
									<Button variant="outlined" onClick={handleEnableEditing}>
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
							<IconButton
								onClick={warnIfEditing(closeDrawerWrapper)}
								sx={{ ml: 1 }}
							>
								<CloseIcon />
							</IconButton>
							<WarningDialog
								open={warningDialogOpen}
								setOpen={setWarningDialogOpen}
								func={warningDialogFunction}
								params={warningDialogParams}
							/>
						</Box>
					</Box>
				</Toolbar>
			</>
		);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Drawer
				open={open}
				onClose={warnIfEditing(closeDrawerWrapper)}
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
						handleAddTemplate={warnIfEditing(handleAddTemplate)}
						handleTemplateClick={warnIfEditing(handleTemplateClick)}
						handleEditTemplate={handleEnableEditing}
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
	const [openTemplateMenu, setOpenTemplateMenu] = useState(false);

	const openDrawer = () => {
		setOpenTemplateMenu(true);
	};

	const closeDrawer = () => {
		setOpenTemplateMenu(false);
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
				<Button onClick={openDrawer} variant="outlined">
					Use a template
				</Button>
			</Box>
			<Divider sx={{ m: 2 }} />
			<EmailEditor orgId={orgId} />
			<TemplateMenu open={openTemplateMenu} closeDrawer={closeDrawer} />
		</>
	);
};

export default EmailPage;
