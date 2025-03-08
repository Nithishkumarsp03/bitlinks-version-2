import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function ViewContactDialog({ open, contact, onClose, api }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>View Contact</DialogTitle>
      <DialogContent dividers>
        {contact && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <strong>Full Name:</strong> {contact.fullname}
            </div>
            <div>
              <strong>Companyname:</strong> {contact.companyname}
            </div>
            <div>
              <strong>Role:</strong> {contact.role}
            </div>
            <div>
              <strong>Guest Name:</strong> {contact.guest_name}
            </div>
            <div>
              <strong>Phone Number:</strong> {contact.phonenumber || 'N/A'}
            </div>
            <div>
              <strong>Email:</strong> {contact.email || 'N/A'}
            </div>
            <div>
              <strong>Date of Birth:</strong> {contact.dob || 'N/A'}
            </div>
            <div>
              <strong>Designation:</strong> {contact.designation}
            </div>
            <div>
              <strong>LinkedIn URL:</strong> {contact.linkedinurl || 'N/A'}
            </div>
            <div>
              <strong>Visiting Card:</strong>{' '}
              {contact.visitingcard ? (
                <img
                  src={`${api}${contact.visitingcard}`}
                  alt="Visiting Card"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                'N/A'
              )}
            </div>
            <div>
              <strong>Rating:</strong> {contact.rating}
            </div>
            <div>
              <strong>Hashtags:</strong> {contact.hashtags || 'N/A'}
            </div>
            <div>
              <strong>Address:</strong> {contact.address || 'N/A'}
            </div>
            <div>
              <strong>Purpose:</strong> {contact.purpose || 'N/A'}
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
