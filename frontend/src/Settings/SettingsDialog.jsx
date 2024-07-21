import React, { useState, useEffect, Fragment } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	Box,
	MenuItem,
	IconButton,
	Chip,
} from "@mui/material";
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// orgId may be null
const SettingsDialog = ({ open, onClose, onSave, orgSettings }) => {
	const settingsCategories = [
		createData("Organization"),
		createData("Integrations"),
	];

	const onCloseWrapper = () => {
		onClose();
	};

	const onSaveWrapper = () => {
		onCloseWrapper();
		onSave();
	};

	// TODO: replace with any awaited components
	if (open && !orgSettings.services) {
		return <Dialog open={false} />;
	}

	function createData(name) {
		return {
			name,
			history: [
				{
					date: "2020-01-05",
				},
			],
		};
	}

	function Row(props) {
		const { row } = props;
		const [open, setOpen] = useState(false);

		return (
			<Fragment>
				<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
					<TableCell component="th" scope="row">
						{row.name}
					</TableCell>
					<TableCell align="right">
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => setOpen(!open)}
						>
							{open ? (
								<KeyboardArrowUpIcon />
							) : (
								<KeyboardArrowDownIcon />
							)}
						</IconButton>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ paddingBottom: 1, paddingTop: 0 }}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Table size="small" aria-label="purchases">
								<TableBody>
									{row.history.map((historyRow) => (
										<TableRow key={historyRow.date}>
											<TableCell
												component="th"
												scope="row"
											>
												{historyRow.date}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Collapse>
					</TableCell>
				</TableRow>
			</Fragment>
		);
	}

	return (
		<Dialog
			open={open}
			onClose={onCloseWrapper}
			fullWidth
			maxWidth="xl"
			PaperProps={{
				sx: {
					height: "80vh",
				},
			}}
			// fullScreen // Too thick
		>
			<DialogTitle>Organization settings</DialogTitle>

			<DialogContent>
				<Box height="65vh" sx={{ display: "flex" }}>
					<TableContainer component={Paper} sx={{ flex: 1 }}>
						<Table aria-label="collapsible table">
							<TableBody>
								{settingsCategories.map((row) => (
									<Row key={row.name} row={row} />
								))}
							</TableBody>
						</Table>
					</TableContainer>
					{/* TODO: change this to the actual setting page */}
					<Paper sx={{ flex: 3 }}>
						<Typography>Settings page goes here</Typography>
						<Typography>
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
							balls balls balls balls balls balls balls balls
						</Typography>
					</Paper>
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={onCloseWrapper} color="primary">
					Cancel
				</Button>
				<Button
					onClick={onSaveWrapper}
					color="primary"
					variant="contained"
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SettingsDialog;
