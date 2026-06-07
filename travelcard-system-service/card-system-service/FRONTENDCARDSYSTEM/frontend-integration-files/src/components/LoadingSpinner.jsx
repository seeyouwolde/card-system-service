import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

/**
 * Centred loading spinner with an optional label.
 *
 * @param {object}  props
 * @param {string}  [props.message]  - Label shown below the spinner
 * @param {string}  [props.size]     - 'small' | 'medium' (default) | 'large'
 * @param {boolean} [props.fullPage] - If true, takes the full viewport height
 */
export default function LoadingSpinner({
  message = 'Loading…',
  size = 'medium',
  fullPage = false,
}) {
  const spinnerSize = size === 'small' ? 24 : size === 'large' ? 64 : 40;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{ minHeight: fullPage ? '60vh' : 160 }}
    >
      <CircularProgress size={spinnerSize} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}
