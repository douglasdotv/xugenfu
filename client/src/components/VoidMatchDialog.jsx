import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';

const VoidMatchDialog = ({
  open,
  onClose,
  match,
  onSubmit,
  initialIsVoided = false,
  initialVoidReason = '',
}) => {
  const [isVoided, setIsVoided] = useState(initialIsVoided);
  const [voidReason, setVoidReason] = useState(initialVoidReason);

  useEffect(() => {
    setIsVoided(initialIsVoided);
    setVoidReason(initialVoidReason);
  }, [initialIsVoided, initialVoidReason]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(isVoided, voidReason);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Update Match Status: {match?.homeTeam} vs {match?.awayTeam}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isVoided}
                  onChange={(e) => setIsVoided(e.target.checked)}
                />
              }
              label="Mark as Voided"
            />
          </Box>
          {isVoided && (
            <TextField
              label="Void Reason"
              fullWidth
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              required={isVoided}
              multiline
              rows={3}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VoidMatchDialog;
