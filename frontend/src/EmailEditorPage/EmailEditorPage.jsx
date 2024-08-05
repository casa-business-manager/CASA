import { Typography, Box, TextField } from "@mui/material";
import RichTextEditor from "./RichTextEditor";
import { Grid } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const TemplateGrid = () => {
	const templates = Array.from({ length: 12 });

	return (
		<Box
			sx={{
				borderRadius: "8px",
				border: "1px solid #ccc",
				boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
				overflowX: "auto",
				padding: 1,
				mt: 1,
			}}
		>
			<Grid container spacing={2}>
				{templates.map((_, index) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={Math.floor(templates.length / 3) + 1}
						lg={3}
						key={index}
					>
						<Box
							sx={{
								border: "1px solid #ccc",
								borderRadius: "8px",
								padding: "16px",
								boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
								mt: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Typography>Template name</Typography>
							<RadioButtonUncheckedIcon />
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

const EmailEditorPage = ({}) => {
	return (
		<>
			<Typography variant="h4">Email Templates</Typography>
			<TemplateGrid />
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
		</>
	);
};

export default EmailEditorPage;
