import React, { useState, useEffect, useContext, useCallback } from "react";
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
import OrganizationPeopleAutocomplete from "../common/OrganizationPeopleAutocomplete";
import CurrentUserContext from "../Contexts/CurrentUserContext";
import moment from "moment";
import { createEvent, updateEvent, deleteEvent } from "../API/EventAPI";

const EventDialog = ({
	open,
	onClose,
	initialEvent,
	initialIsEditing = false,
	orgInfo,
	setEvents = () => {},
}) => {
	const [currentUser, _] = useContext(CurrentUserContext);

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

	// Base function for both saving and editing an event, needing function and id
	const saveEvent = useCallback(
		(apiFunction, id) =>
			async (title, description, startTime, endTime, location, people) => {
				if (!currentUser) return;

				const peopleIds = people.map((person) => person.id);

				try {
					const newEvent = {
						title,
						description,
						location,
						start: moment(startTime).format(), // ISO time includes time zone so it is fine
						end: moment(endTime).format(), // ISO time includes time zone so it is fine
						allDay: false,
						eventCreatorId: currentUser.id,
						eventAccessorIds: peopleIds,
					};

					const createdEvent = await apiFunction(id, newEvent);

					setEvents((prev) => {
						const filterOutCurrentEvent = prev.filter(
							(event) => event.eventId !== createdEvent.eventId,
						);
						createdEvent.organization = {
							...createdEvent.organization,
							people: createdEvent.organization.users,
							name: createdEvent.organization.orgName,
						};
						return [
							...filterOutCurrentEvent,
							{
								...createdEvent,
								start: moment(createdEvent.start).local().toDate(), // Converting to date
								end: moment(createdEvent.end).local().toDate(), // Converting to date
							},
						];
					});
				} catch (error) {
					console.error("Error creating event:", error);
				} finally {
					onCloseWrapper();
				}
			},
	);

	// function to create a new event given orgID
	const onSave = useCallback(
		(orgId) => saveEvent(createEvent, orgId),
		[saveEvent],
	);

	// function to save an edited event
	const onEdit = useCallback(
		(eventId) => saveEvent(updateEvent, eventId),
		[saveEvent],
	);

	// control dialog for deleting an event
	const onDelete = useCallback(async (eventId) => {
		onCloseWrapper();
		await deleteEvent(eventId);
		setEvents((prevEvents) =>
			prevEvents.filter((prevEvent) => prevEvent.eventId !== eventId),
		);
	}, []);

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
			people,
		);

		onCloseWrapper();
	};

	const handleSave = () => handleBackend(false);

	const handleEdit = () => handleBackend(true);

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

	if (!organization) {
		return (
			<Dialog open={open} onClose={onCloseWrapper} fullWidth>
				Loading...
			</Dialog>
		);
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
					<ViewHeadlineIcon sx={{ color: "action.active", mr: 1, my: 2.5 }} />
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
				<Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
					<AccessTimeFilledIcon sx={{ color: "action.active", mr: 1, mt: 2 }} />
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
					<LocationOnIcon sx={{ color: "action.active", mr: 1, my: 3.5 }} />
					<Autocomplete
						disabled={!isEventCreator()}
						freeSolo
						options={meetingLocations}
						inputValue={location}
						fullWidth
						onInputChange={(event, newInputValue) => setLocation(newInputValue)}
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
					<PeopleAltIcon sx={{ color: "action.active", mr: 1, my: 2.5 }} />
					<OrganizationPeopleAutocomplete
						parentSetSelectedPeople={setPeople}
						organizationId={organization.orgId}
						defaultPeopleList={people ?? [currentUser]}
						rejectAddPersonFunction={(newUserList) =>
							!newUserList.find(
								(user) => user.id === initialEvent.eventCreator.id,
							)
						}
						userIsDeletableFunction={(user) =>
							isEventCreator() && user.id !== currentUser.id
						}
						disabled={!isEventCreator()}
						variant="standard"
						fullWidth={true}
						controlled={true}
					/>
				</Box>

				{/* Organization */}
				<Box sx={{ display: "flex", alignItems: "flex-start" }}>
					<ApartmentIcon sx={{ color: "action.active", mr: 1, my: 2.7 }} />
					<TextField
						disabled={!isEventCreator() || initialIsEditing}
						select
						label="Organization"
						value={organization}
						variant="standard"
						sx={{ width: "30%" }}
						onChange={(e) => setOrganization(e.target.value)}
						SelectProps={{
							renderValue: (selected) => selected.name ?? selected.orgName,
						}}
					>
						{orgInfo.map((org, index) => (
							<MenuItem key={index} value={org}>
								{org.name ?? org.orgName}
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
						<Button onClick={handleSave} color="primary" variant="contained">
							Create
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default EventDialog;
