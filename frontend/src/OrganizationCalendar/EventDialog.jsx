import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, MenuItem, IconButton } from '@mui/material';
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

const EventDialog = ({ open, onClose, onSave, initialEvent, isEditing = false, isOrganizationCalendar = true}) => {
  const [title, setTitle] = useState(initialEvent.title ?? '');
  const [description, setDescription] = useState(initialEvent.description ?? '');
  const [startTime, setStartTime] = useState(dayjs(initialEvent.start));
  const [endTime, setEndTime] = useState(dayjs(initialEvent.end));
  const [location, setLocation] = useState(initialEvent.location ?? '');

  // TODO: Initialize this to a list of User Objects and email strings depending on accessors
  // Make sure event.eventCreator is the first in the list
  // Implement the Avatar Chips display from the design 
  const [people, setPeople] = useState([]);

  // TODO: Depending on whether you're currently on the personal calendar or an org's calendar
  // Display organizations if its personal and use the default option "Personal"
  // If youre editing an organization's calendar, you cannot be allowed to change where this event goes
  const [organizations, setOrganizations] = useState(["Personal", "org 1", "Org 2"]);
  
  // TODO: GET organization's meeting services/saved locations
  // Want to turn this into a map for "Create Zoom" -> GET new link -> text field has link now
  const [meetingLocations, setMeetingLocations] = useState(["Location 1", "Location 2", "Location 3"]); 

  useEffect(() => {
    setTitle(initialEvent.title ?? '');
    setDescription(initialEvent.description ?? '');
    setStartTime(dayjs(initialEvent.start));
    setEndTime(dayjs(initialEvent.end));
    setLocation(initialEvent.location ?? '');
  }, [initialEvent]);

  const handleSave = () => {
    if (!title || !description || !location) {
      // TODO: Use Textfield Error colors to show missing fields
      // TODO: Check End time is after start time
      return;
    }
    onSave(title, description, location); // Will need people. Maybe org too?
    setTitle('');
    setDescription('');
    setLocation('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1} >{ isEditing ? "Edit Event" : "New event" }</Box>
          <Box>
            <IconButton onClick={onClose}>
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
            variant="standard" // maybe outlined is better?
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
                sx={{ width: '60%' }}
              />
            </Box>
            <Box sx={{ ml: -12 }}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
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
              />
            )}
          />
        </Box>

        {/* People */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <PeopleAltIcon sx={{ color: 'action.active', mr: 1, my: 3.5 }} />
          <TextField
            margin="dense"
            label="People"
            type="text"
            fullWidth
            variant="standard"
          />
        </Box>

        {/* Organization */}
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

      </DialogContent>

      <DialogActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Button onClick={onClose} color="error" variant="contained">
            Delete
          </Button>
          <Box>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
