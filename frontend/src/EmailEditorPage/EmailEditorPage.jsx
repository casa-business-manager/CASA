import { useParams } from "react-router-dom";
import { useState } from "react";
import {
	Typography,
	Box,
	TextField,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListItem,
	IconButton,
} from "@mui/material";
import RichTextEditor from "./RichTextEditor";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import FileDownloadDoneOutlinedIcon from "@mui/icons-material/FileDownloadDoneOutlined";

const TemplateTab = ({ name, file, setTemplatePreview }) => {
	return (
		<ListItemButton
			selected={false}
			onClick={() => {
				setTemplatePreview(file);
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
			<IconButton>
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

	return (
		<Box>
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
						overflow: "auto",
					}}
					component="nav"
					aria-labelledby="nested-list-subheader"
				>
					<ListItem sx={{ bgcolor: "lightgray" }}>
						<ListItemText primary="Templates" />
						<IconButton>
							<AddCircleOutlineOutlinedIcon />
						</IconButton>
					</ListItem>
					{templates.map((template, index) => (
						<TemplateTab
							name={template.name}
							file={template.file}
							setTemplatePreview={setTemplatePreview}
							key={index}
						/>
					))}
				</List>
				<Box>
					{/* TODO: Read only slate box to display xml or whatever format */}
					<Typography>{templatePreview}</Typography>
				</Box>
			</Box>
		</Box>
	);
};

const EmailEditor = ({ sx }) => {
	return (
		<Box sx={sx}>
			<TextField label="Subject" fullWidth />
			<TextField
				label="Recipients"
				fullWidth
				sx={{
					mt: 1,
				}}
			/>
			<Box
				sx={{
					border: "1px solid #ccc",
					borderRadius: "8px",
					padding: "16px",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
					mt: 1,
				}}
			>
				<RichTextEditor />
			</Box>
		</Box>
	);
};

const EmailEditorPage = ({}) => {
	const { orgId } = useParams();

	return (
		<>
			<Typography variant="h4">Email Templates</Typography>
			<TemplateMenu />
			<Typography variant="h4" sx={{ mt: 1 }}>
				Email Editor
			</Typography>
			<EmailEditor
				sx={{
					mt: 1,
					//  width: "50%"
				}}
			/>
		</>
	);
};

export default EmailEditorPage;
