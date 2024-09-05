import { Autocomplete, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import UserChip from "./UserChip";
import OrganizationsContext from "../../contexts/OrganizationsContext";

const OrganizationPeopleAutocomplete = ({
	parentSetSelectedPeople,
	organizationId,
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
	const [organizations, _] = useContext(OrganizationsContext);
	const [orgPeople, setOrgPeople] = useState([]);
	const [selectedPeople, setSelectedPeople] = useState([...defaultPeopleList]);

	const filterOptionsFunction =
		filterOptions ??
		((optionPerson) =>
			!selectedPeople.some((person) => person.id === optionPerson.id));

	useEffect(() => {
		if (!organizationId) {
			return;
		}
		setOrgPeople(
			organizations.find((org) => org.orgId === organizationId)?.users,
		);
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
							orgId={organizationId}
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
