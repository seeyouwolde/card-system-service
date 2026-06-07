import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

/**
 * Consistent page title + subtitle header used at the top of every page.
 *
 * @param {object}         props
 * @param {string}         props.title      - Page title (h5)
 * @param {string}         [props.subtitle] - Optional descriptive subtitle
 * @param {React.ReactNode} [props.action]  - Optional element anchored to the right (e.g. a button)
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.03em' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
      <Divider sx={{ mt: 2.25, borderColor: 'divider' }} />
    </Box>
  );
}
