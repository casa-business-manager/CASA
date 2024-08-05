import { useParams } from "react-router-dom";
import {
	Typography,
	Box,
	TextField,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import RichTextEditor from "./RichTextEditor";
import OrganizationTab from "../Settings/SettingTabs/OrganizationTab";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { useState } from "react";

const TemplateTab = ({ name, file, setTemplatePreview }) => {
	console.log(`name is ${name}`);
	return (
		<ListItemButton
			selected={false}
			onClick={() => {
				setTemplatePreview(file);
			}}
		>
			<ListItemIcon>
				<ArticleOutlinedIcon />
			</ListItemIcon>
			<ListItemText primary={name} />
		</ListItemButton>
	);
};

const TemplateGrid = ({}) => {
	const [templates, setTemplates] = useState([
		{ name: "test", file: "test contents here" },
		{ name: "test2", file: "test2 contents here" },
		{ name: "test3", file: "test3 contents here" },
	]);
	const [templatePreview, setTemplatePreview] = useState(
		"Please select a template to preview",
	);

	console.log(templates);

	return (
		<Box>
			<Typography variant="h4">Email Templates</Typography>
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
						width: "35%",
						overflow: "auto",
					}}
					component="nav"
					aria-labelledby="nested-list-subheader"
				>
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
					<Typography>Template preview</Typography>
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
			<TemplateGrid />
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
