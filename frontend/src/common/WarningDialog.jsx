import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";

const variantMessages = {
	standard: "This action will cause you to lose any unsaved changes.",
	delete:
		"This action cannot be undone. Are you sure you want to delete this item?",
};

const variantConfirmButtonFunction = {
	standard: ({ func }) => (
		<Button variant="outlined" onClick={func}>
			Confirm
		</Button>
	),
	delete: ({ func }) => (
		<Button variant="error" onClick={func}>
			Delete
		</Button>
	),
};

const WarningDialog = ({
	open,
	setOpen,
	func = () => {},
	variant = "standard",
}) => {
	const [confirmFunction, setConfirmFunction] = useState(() => func);

	const dialogTitle = "Are you sure?";
	const dialogMessage = variantMessages[variant];
	const DialogConfirmButton = variantConfirmButtonFunction[variant];

	useEffect(() => {
		setConfirmFunction(() => func);
	}, [func]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleConfirm = () => {
		confirmFunction();
		setOpen(false);
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>{dialogTitle}</DialogTitle>
			<DialogContent>
				<DialogContentText>{dialogMessage}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleClose} variant="contained">
					Cancel
				</Button>
				<DialogConfirmButton func={handleConfirm} />
			</DialogActions>
		</Dialog>
	);
};

export default WarningDialog;
