import React, { useState } from 'react'; // Import React and useState
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { addContactMessage } from 'src/services/contactUsApi';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// ----------------------------------------------------------------------

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [error, setError] = useState(''); // For storing error messages
  const [open, setOpen] = useState(false); // State for dialog visibility

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear any previous error

    // Validation: Check for empty fields
    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required.'); // Set error message
      return; // Stop the function from executing further
    }

    try {
      const response = await addContactMessage(formData); // Call the API
      // console.log('Contact message sent successfully:', response);
      
      // Show the success dialog
      setOpen(true);

      // Reset the form
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (apiError) {
      console.error('Error adding contact message:', apiError);
      setError('Failed to send message. Please try again.'); // Update error state
    }
  };

  // Function to handle dialog close
  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  return (
    <div>
      <Typography variant="h3">
        Feel free to contact us. <br />
        We&apos;ll be glad to hear from you buddy.
      </Typography>

      <Box component="form" gap={3} display="flex" flexDirection="column" sx={{ my: 5 }} onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name" // Add name attribute
          value={formData.name}
          onChange={handleInputChange}
          error={!formData.name && Boolean(error)} // Show error if name is empty and error exists
          helperText={!formData.name && Boolean(error) ? error : ''} // Display error message
        />
        <TextField
          fullWidth
          label="Email"
          name="email" // Add name attribute
          value={formData.email}
          onChange={handleInputChange}
          error={!formData.email && Boolean(error)} // Show error if email is empty and error exists
          helperText={!formData.email && Boolean(error) ? error : ''} // Display error message
        />
        <TextField
          fullWidth
          label="Enter your message here."
          name="message" // Add name attribute
          value={formData.message}
          multiline
          rows={4}
          onChange={handleInputChange}
          error={!formData.message && Boolean(error)} // Show error if message is empty and error exists
          helperText={!formData.message && Boolean(error) ? error : ''} // Display error message
        />

        <Button size="large" variant="contained" type="submit">
          Submit
        </Button>
      </Box>

      {/* Success Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your message has been sent successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
