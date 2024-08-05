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
	Autocomplete,
	Chip,
} from "@mui/material";
import RichTextEditor from "./RichTextEditor";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import FileDownloadDoneOutlinedIcon from "@mui/icons-material/FileDownloadDoneOutlined";
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

	const sendEmail = async () => {
		// send email
		console.log(`subject is ${subject}`);
		console.log(`people are ${people}`);
		console.log(`TODO: get the body info from the RichTextEditor`);

		try {
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
			<OrganizationPeopleAutocomplete organizationId={orgId} sx={{ mt: 1 }} />
			<Box
				sx={{
					border: "1px solid #ccc",
					borderRadius: "8px",
					padding: "16px",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
					mt: 1,
				}}
			>
				<RichTextEditor style={{ height: "80vh" }} />
			</Box>
			<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
				<Button variant="contained">Send</Button>
			</Box>
		</Box>
	);
};

const EmailEditorPage = ({}) => {
	const { orgId } = useParams();

	return (
		<>
			<TemplateMenu />
			<Divider variant="middle" sx={{ pt: 2 }} />{" "}
			<EmailEditor
				orgId={orgId}
				sx={{
					mt: 1,
					pt: 1,
					//  width: "50%"
				}}
			/>
		</>
	);
};

export default EmailEditorPage;
