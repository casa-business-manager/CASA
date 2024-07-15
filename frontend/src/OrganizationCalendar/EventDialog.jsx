import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const EventDialog = ({ open, onClose, onSave, initialTitle = '', initialLocation = '' }) => {
  const [title, setTitle] = useState(initialTitle);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    setTitle(initialTitle);
    setLocation(initialLocation);
  }, [initialTitle, initialLocation]);

  const handleSave = () => {
    onSave(title, location);
    setTitle('');
    setLocation('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Event</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Event Name"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Event Location"
          type="text"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant='contained'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
