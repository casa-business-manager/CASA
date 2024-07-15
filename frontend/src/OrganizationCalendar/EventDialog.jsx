import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ApartmentIcon from '@mui/icons-material/Apartment';

const EventDialog = ({ open, onClose, onSave, initialTitle = '', initialDescription = '', initialLocation = '' }) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [location, setLocation] = useState(initialLocation);
  const [startTime, setStartTime] = React.useState(dayjs('2022-04-17T15:30'));
  const [endTime, setEndTime] = React.useState(dayjs('2022-04-17T15:30'));

  useEffect(() => {
    setTitle(initialTitle);
    setLocation(initialLocation);
  }, [initialTitle, initialLocation]);

  const handleSave = () => {
    onSave(title, location);
    setTitle('');
    setLocation('');
  };

  const organizations = [
    "Personal",
    "org 1",
    "Org 2"
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>New Event</DialogTitle>
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
          InputProps={{ sx: {fontSize: '1.5rem'} }}
          InputLabelProps={{ sx: {fontSize: '1.5rem'} }}
        />

        {/* Description */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
          <ViewHeadlineIcon sx={{ color: 'action.active', mr: 1.5, my: 2.5 }} />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            variant="standard" // maybe outlined is better?
          />
        </Box>

        {/* Time Picker */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start'}}>
          <AccessTimeFilledIcon sx={{ color: 'action.active', mr: 1.5, my: 2 }} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ mr: 2 }}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
              />
            </Box>
            <Box>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
              />
            </Box>
          </LocalizationProvider>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start'}}>
          <LocationOnIcon sx={{ color: 'action.active', mr: 1.5, my: 3.5 }} />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            multiline
            maxRows={2}
            value={location}
            variant="standard"
            onChange={(e) => setLocation(e.target.value)}
          />
        </Box>

        {/* People */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start'}}>
          <PeopleAltIcon sx={{ color: 'action.active', mr: 1.5, my: 3.5 }} />
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
          <ApartmentIcon sx={{ color: 'action.active', mr: 1.5, my: 2.7 }} />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button onClick={onClose} color="error" variant='contained'>
            Delete
          </Button>
          <Box>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant='contained'>
              Save
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
