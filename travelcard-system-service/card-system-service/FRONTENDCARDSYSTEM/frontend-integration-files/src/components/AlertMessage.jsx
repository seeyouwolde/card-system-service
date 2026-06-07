import React from 'react';


import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

/**
 * Dismissable alert banner with optional title.
 *
 * @param {object}  props
 * @param {'success'|'error'|'warning'|'info'} [props.severity='info']
 * @param {string}  [props.title]    - Bold title line (optional)
 * @param {string}  props.message    - Main message text
 * @param {boolean} props.open       - Visibility flag
 * @param {Function} props.onClose   - Called when the × button is clicked
 * @param {object}  [props.sx]       - Extra MUI sx styles
 */
export default function AlertMessage({
  severity = 'info',
  title,
  message,
  open,
  onClose,
  sx = {},
}) {
  return (
    <Collapse in={open} unmountOnExit>
      <Alert
        severity={severity}
        variant="outlined"
        action={
          onClose ? (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseRoundedIcon fontSize="inherit" />
            </IconButton>
          ) : undefined
        }
        sx={{
          mb: 2,
          borderRadius: 2,
          alignItems: 'flex-start',
          ...sx,
        }}
      >
        {title && <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
}
