import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, MenuItem, IconButton, Chip } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete } from '@mui/material';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { getUsersInOrganization } from '../APIUtils/APIUtils';

const EventDialog = ({ open, onClose, onSave, onDelete, initialEvent, initialIsEditing = false, isOrganizationCalendar = true , organizationId, currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [location, setLocation] = useState('');

  const [titleError, setTitleError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [people, setPeople] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // TODO:
  // Display organization selection if and only if on personal calendar
  // Use the default option "Personal" and the dropdown contains user's orgs
  const [organizations, setOrganizations] = useState(["Personal", "org 1", "Org 2"]);

  // TODO: GET organization's meeting services/saved locations
  // Want to turn this into a map for "Create Zoom" -> GET new link -> text field has link now
  const [meetingLocations, setMeetingLocations] = useState(["Location 1", "Location 2", "Location 3"]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersInOrganization(organizationId);
        const usersWithFullName = response.map(user => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`
        }));
        setAllUsers(usersWithFullName);

        // Set default people based on initialEvent.eventAccessorIds
        if (initialEvent && initialEvent.eventAccessorIds) {
          const defaultPeople = usersWithFullName.filter(user =>
            initialEvent.eventAccessorIds.includes(user.id)
          ).map(user => user.id);
          setPeople(defaultPeople);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (open) {
      fetchUsers();
      if (!initialIsEditing && currentUser) {
        setPeople([currentUser.id]);
      }
    }
  }, [open, initialEvent, initialIsEditing, organizationId, currentUser]);

  const handleSave = () => {
    let hasError = false;

    if (!title) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    if (endTime.isBefore(startTime)) {
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

    onSave(title, description, startTime.toDate(), endTime.toDate(), location, people);
    onCloseWrapper();
  };

  const handleAddPerson = (event, newValue) => {
    const validUsers = newValue.filter(value => {
      const user = allUsers.find(user => user.fullName.toLowerCase() === value.toLowerCase());
      return user && !people.includes(user.id);
    }).map(value => {
      return allUsers.find(user => user.fullName.toLowerCase() === value.toLowerCase()).id;
    });

    setPeople(prevPeople => [...new Set([...prevPeople, ...validUsers])]);
  };

  const handleDeletePerson = (userId) => {
    setPeople(people.filter(id => id !== userId));
  };

  const onCloseWrapper = () => {
    onClose();
    setTitleError(false);
    setLocationError(false);
    setDeleteConfirmed(false);
  }

  return (
    <Dialog open={open} onClose={onCloseWrapper} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>{initialIsEditing ? "Edit Event" : "New event"}</Box>
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
          InputProps={{ sx: { fontSize: '1.5rem' } }}
          InputLabelProps={{ sx: { fontSize: '1.5rem' } }}
        />

        {/* Description */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
          <ViewHeadlineIcon sx={{ color: 'action.active', mr: 1, my: 2.5 }} />
          <TextField
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
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
          <AccessTimeFilledIcon sx={{ color: 'action.active', mr: 1, mt: 2 }} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mr: 0 }}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                maxTime={endTime}
                slotProps={{
                  textField: {
                    helperText: endTime.isBefore(startTime) && "Please select a valid time range",
                  },
                }}
                sx={{ width: '60%' }}
              />
            </Box>
            <Box sx={{ ml: -12 }}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                minTime={startTime}
                sx={{ width: '60%' }}
              />
            </Box>
          </LocalizationProvider>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <LocationOnIcon sx={{ color: 'action.active', mr: 1, my: 3.5 }} />
          <Autocomplete
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
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <PeopleAltIcon sx={{ color: 'action.active', mr: 1, my: 2.5 }} />
          <Autocomplete
            multiple
            freeSolo
            disableClearable
            options={allUsers.map(user => user.fullName)}
            getOptionLabel={(option) => option}
            value={allUsers.filter(user => people.includes(user.id)).map(user => user.fullName)}
            onChange={handleAddPerson}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const user = allUsers.find(user => user.fullName === option);
                return (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    onDelete={() => handleDeletePerson(user.id)}
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
                  endAdornment: null
                }}
                sx={{ width: '500px' }} // Fixed width
              />
            )}
          />
        </Box>

        {/* Organization - only shown in user calendar */}
        {
          !isOrganizationCalendar &&
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <ApartmentIcon sx={{ color: 'action.active', mr: 1, my: 2.7 }} />
            <TextField
              select
              label="Organization"
              defaultValue="Personal"
              variant="standard"
              sx={{ width: '30%' }}
            >
              {organizations.map((org, index) => (
                <MenuItem key={index} value={org}>
                  {org}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        }

      </DialogContent>

      <DialogActions>
        {
          initialIsEditing ?
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {
              deleteConfirmed ? 
                <Button onClick={() => {onDelete(initialEvent.eventId)}} color="error" variant="contained">
                  Confirm Delete
                </Button>
              :
                <Button onClick={() => {setDeleteConfirmed(true)}} color="error" variant="contained">
                  Delete
                </Button>
            }
            <Box>
              <Button onClick={onCloseWrapper} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSave} color="primary" variant="contained">
                Save
              </Button>
            </Box>
          </Box>
          :
          <>
            <Button onClick={onCloseWrapper} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </>
        }
        
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
