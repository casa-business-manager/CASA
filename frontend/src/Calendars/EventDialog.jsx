import React, { useState, useEffect } from "react";
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
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Autocomplete } from "@mui/material";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ApartmentIcon from "@mui/icons-material/Apartment";

const EventDialog = ({
	open,
	onClose,
	onSave,
	onEdit,
	onDelete,
	initialEvent,
	initialIsEditing = false,
	currentUser,
	orgInfo,
}) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startTime, setStartTime] = useState(dayjs());
	const [endTime, setEndTime] = useState(dayjs());
	const [location, setLocation] = useState("");
	const [people, setPeople] = useState([]);
	const [organization, setOrganization] = useState(orgInfo[0]);

	const [titleError, setTitleError] = useState(false);
	const [locationError, setLocationError] = useState(false);
	const [deleteConfirmed, setDeleteConfirmed] = useState(false);

	// TODO: GET organization's meeting services/saved locations
	// Want to turn this into a map for "Create Zoom" -> GET new link -> text field has link now
	const [meetingLocations, setMeetingLocations] = useState([
		"Location 1",
		"Location 2",
		"Location 3",
	]);

	useEffect(() => {
		setTitle(initialEvent.title ?? "");
		setDescription(initialEvent.description ?? "");
		setStartTime(dayjs(initialEvent.start));
		setEndTime(dayjs(initialEvent.end));
		setLocation(initialEvent.location ?? "");
		setPeople(initialEvent.eventAccessors ?? []);
		setOrganization(initialEvent.organization ?? orgInfo[0]); // TODO: No orgs?
	}, [initialEvent]);

	const handleBackend = async (isEdit = false) => {
		let hasError = false;

		if (!title) {
			setTitleError(true);
			hasError = true;
		} else {
			setTitleError(false);
		}

		if (endTime.isBefore(startTime)) {
			// errors are handled by the components themselves
			hasError = true;
		}

		if (!location) {
			setLocationError(true);
			hasError = true;
		} else {
			setLocationError(false);
		}

		if (hasError) {
			return;
		}

		const saveFunction = isEdit
			? onEdit(initialEvent.eventId)
			: onSave(organization.orgId);
		await saveFunction(
			title,
			description,
			startTime.toDate(),
			endTime.toDate(),
			location,
			people
		);

		onCloseWrapper();
	};

	const handleSave = () => handleBackend(false);

	const handleEdit = () => handleBackend(true);

	const handleAddPerson = (e, newUserList) => {
		setPeople(newUserList);
	};

	const handleDeletePerson = (userId) => {
		setPeople(people.filter((person) => person.id !== userId));
	};

	const onCloseWrapper = () => {
		onClose();
		setTitleError(false);
		setLocationError(false);
		setDeleteConfirmed(false);
	};

	function isEventCreator() {
		return (
			initialEvent &&
			initialEvent.eventCreator &&
			currentUser.id === initialEvent.eventCreator.id
		);
	}

	const getUserFullName = (userObject) =>
		userObject.firstName + " " + userObject.lastName;

	if (!organization) {
		return <>Loading</>;
	}

	return (
		<Dialog open={open} onClose={onCloseWrapper} fullWidth>
			<DialogTitle>
				<Box display="flex" alignItems="center">
					<Box flexGrow={1}>
						{isEventCreator()
							? initialIsEditing
								? "Edit event"
								: "New event"
							: "View event"}
					</Box>
					<Box>
						<IconButton onClick={onCloseWrapper}>
							<CloseIcon />
						</IconButton>
					</Box>
				</Box>
			</DialogTitle>

			<DialogContent>
				{/* Title */}
				<TextField
					disabled={!isEventCreator()}
					autoFocus
					label="Title"
					type="text"
					fullWidth
					value={title}
					variant="standard"
					onChange={(e) => setTitle(e.target.value)}
					error={titleError}
					helperText={titleError && "Missing Entry"}
					sx={{ marginBottom: 2 }}
					InputProps={{ sx: { fontSize: "1.5rem" } }}
					InputLabelProps={{ sx: { fontSize: "1.5rem" } }}
				/>

				{/* Description */}
				<Box
					sx={{
						display: "flex",
						alignItems: "flex-start",
						marginBottom: 4,
					}}
				>
					<ViewHeadlineIcon
						sx={{ color: "action.active", mr: 1, my: 2.5 }}
					/>
					<TextField
						disabled={!isEventCreator()}
						label="Description"
						multiline
						rows={3}
						fullWidth
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						variant="standard"
					/>
				</Box>

				{/* Time Picker */}
				<Box
					sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}
				>
					<AccessTimeFilledIcon
						sx={{ color: "action.active", mr: 1, mt: 2 }}
					/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box sx={{ mr: 0 }}>
							<TimePicker
								disabled={!isEventCreator()}
								label="Start Time"
								value={startTime}
								onChange={(newValue) => setStartTime(newValue)}
								maxTime={endTime}
								slotProps={{
									textField: {
										helperText:
											endTime.isBefore(startTime) &&
											"Please select a valid time range",
									},
								}}
								sx={{ width: "60%" }}
							/>
						</Box>
						<Box sx={{ ml: -12 }}>
							<TimePicker
								disabled={!isEventCreator()}
								label="End Time"
								value={endTime}
								onChange={(newValue) => setEndTime(newValue)}
								minTime={startTime}
								sx={{ width: "60%" }}
							/>
						</Box>
					</LocalizationProvider>
				</Box>

				{/* Location */}
				<Box sx={{ display: "flex", alignItems: "flex-start" }}>
					<LocationOnIcon
						sx={{ color: "action.active", mr: 1, my: 3.5 }}
					/>
					<Autocomplete
						disabled={!isEventCreator()}
						freeSolo
						options={meetingLocations}
						inputValue={location}
						fullWidth
						onInputChange={(event, newInputValue) =>
							setLocation(newInputValue)
						}
						renderInput={(params) => (
							<TextField
								{...params}
								margin="dense"
								label="Location"
								type="text"
								fullWidth
								multiline
								maxRows={2}
								variant="standard"
								error={locationError}
								helperText={locationError && "Missing Entry"}
							/>
						)}
					/>
				</Box>

				{/* People */}
				<Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
					<PeopleAltIcon
						sx={{ color: "action.active", mr: 1, my: 2.5 }}
					/>
					<Autocomplete
						disabled={!isEventCreator()}
						multiple
						freeSolo
						disableClearable
						options={
							organization && orgInfo
								? orgInfo
										.find(
											(org) =>
												org.orgId === organization.orgId
										)
										.people.filter(
											(person) =>
												person.id !== currentUser.id
										)
								: []
						}
						getOptionLabel={(option) => getUserFullName(option)}
						value={
							organization && orgInfo
								? orgInfo
										.find(
											(org) =>
												org.orgId === organization.orgId
										)
										.people.filter((user) =>
											people
												.map((user) => user.id)
												.includes(user.id)
										)
								: [currentUser]
						}
						onChange={handleAddPerson}
						renderTags={(value, getTagProps) =>
							value.map((user, index) => {
								const deletable =
									isEventCreator() &&
									user.id !== currentUser.id;
								return (
									<Chip
										label={getUserFullName(user)}
										{...getTagProps({ index })}
										onDelete={
											deletable
												? () =>
														handleDeletePerson(
															user.id
														)
												: undefined
										}
										key={user.id}
									/>
								);
							})
						}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="standard"
								label="People"
								placeholder="Add people"
								InputProps={{
									...params.InputProps,
									endAdornment: null,
								}}
								sx={{ width: "500px" }} // Fixed width
							/>
						)}
					/>
				</Box>

				{/* Organization */}
				<Box sx={{ display: "flex", alignItems: "flex-start" }}>
					<ApartmentIcon
						sx={{ color: "action.active", mr: 1, my: 2.7 }}
					/>
					<TextField
						disabled={!isEventCreator() || initialIsEditing}
						select
						label="Organization"
						value={organization}
						variant="standard"
						sx={{ width: "30%" }}
						onChange={(e) => setOrganization(e.target.value)}
						SelectProps={{
							renderValue: (selected) => selected.name,
						}}
					>
						{orgInfo.map((org, index) => (
							<MenuItem key={index} value={org}>
								{org.name}
							</MenuItem>
						))}
					</TextField>
				</Box>
			</DialogContent>

			<DialogActions>
				{initialIsEditing ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						{deleteConfirmed ? (
							<Button
								onClick={() => {
									onDelete(initialEvent.eventId);
								}}
								color="error"
								variant="contained"
							>
								Confirm Delete
							</Button>
						) : (
							<Button
								disabled={!isEventCreator()}
								onClick={() => {
									setDeleteConfirmed(true);
								}}
								color="error"
								variant="contained"
							>
								Delete
							</Button>
						)}
						<Box>
							<Button onClick={onCloseWrapper} color="primary">
								Cancel
							</Button>
							{isEventCreator() && (
								<Button
									onClick={handleEdit}
									color="primary"
									variant="contained"
								>
									Save
								</Button>
							)}
						</Box>
					</Box>
				) : (
					<>
						<Button onClick={onCloseWrapper} color="primary">
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							color="primary"
							variant="contained"
						>
							Create
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default EventDialog;