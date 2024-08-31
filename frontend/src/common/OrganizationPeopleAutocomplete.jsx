import { Autocomplete, Chip, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getOrganizationInfo } from "../API/OrganizationAPI";
import UserChip from "./UserChip";

/// Must pass in organizationId or organizationPeopleList
/// If both are passed in, will use organizationPeopleList over Id
/// If Id is used, will make a backend call to get the people
const OrganizationPeopleAutocomplete = ({
	parentSetSelectedPeople,
	organizationId,
	organizationPeopleList,
	defaultPeopleList = [],
	filterOptions,
	rejectAddPersonFunction = () => false,
	userIsDeletableFunction = () => true,
	disabled,
	variant = "outlined",
	fullWidth = null,
	controlled = false,
	sx,
	...props
}) => {
	const [orgPeople, setOrgPeople] = useState([]);
	const [selectedPeople, setSelectedPeople] = useState([...defaultPeopleList]);

	const filterOptionsFunction =
		filterOptions ??
		((optionPerson) =>
			!selectedPeople.some((person) => person.id === optionPerson.id));

	// Get organization people
	// TODO: GET only if organizationPeopleList is not passed in
	useEffect(() => {
		if (!organizationId) {
			return;
		}

		const fetchPeople = async () => {
			const orgInfo = await getOrganizationInfo(organizationId);

			setOrgPeople(orgInfo.people);
		};

		fetchPeople();
	}, [organizationId]);

	useEffect(() => {
		if (controlled) {
			setSelectedPeople(defaultPeopleList);
		}
	}, [defaultPeopleList]);

	const setSelectedPeopleWrapper = (newSelectedPeople) => {
		parentSetSelectedPeople(newSelectedPeople);
		setSelectedPeople(newSelectedPeople);
	};

	const handleAddPerson = (e, newUserList) => {
		if (rejectAddPersonFunction(newUserList)) {
			return;
		}
		setSelectedPeopleWrapper(newUserList);
	};

	const handleDeletePerson = (userId) => {
		setSelectedPeopleWrapper((oldSelectedPeople) =>
			oldSelectedPeople.filter((person) => person.id !== userId),
		);
	};

	const getUserFullName = (userObject) =>
		userObject.firstName + " " + userObject.lastName;

	return (
		<Autocomplete
			disabled={disabled}
			fullWidth={fullWidth}
			multiple
			freeSolo
			disableClearable
			options={orgPeople ? orgPeople.filter(filterOptionsFunction) : []}
			getOptionLabel={getUserFullName}
			value={
				orgPeople
					? orgPeople.filter((orgPerson) =>
							selectedPeople.some(
								(selectedPerson) => selectedPerson.id === orgPerson.id,
							),
						)
					: defaultPeopleList
			}
			onChange={handleAddPerson}
			renderTags={(value, getTagProps) =>
				value.map((user, index) => {
					const deletable = userIsDeletableFunction(user);
					const handleDeleteSpecificPerson = deletable
						? () => handleDeletePerson(user.id)
						: undefined;
					return (
						<UserChip
							key={index}
							user={user}
							onDelete={handleDeleteSpecificPerson}
						/>
					);
				})
			}
			renderInput={(params) => (
				<TextField
					{...params}
					variant={variant}
					label="People"
					placeholder="Add people"
					InputProps={{
						...params.InputProps,
						endAdornment: null,
					}}
					sx={sx}
				/>
			)}
		/>
	);
};

export default OrganizationPeopleAutocomplete;
