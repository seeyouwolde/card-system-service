import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

/**
 * Consistent form wrapper — a MUI Card with a labelled header section.
 *
 * @param {object}          props
 * @param {string}          [props.title]     - Card section title
 * @param {string}          [props.subtitle]  - Card section subtitle
 * @param {React.ReactNode} props.children    - Form contents
 * @param {object}          [props.sx]        - Additional sx styles for the Card
 * @param {number}          [props.maxWidth]  - Max width constraint (default 600)
 */
export default function FormCard({ title, subtitle, children, sx = {}, maxWidth = 600 }) {
  return (
    <Card
      sx={{
        maxWidth,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    >
      {(title || subtitle) && (
        <>
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            {title && (
              <Typography variant="h6" fontWeight={800} color="text.primary">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Divider />
        </>
      )}
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        {children}
      </CardContent>
    </Card>
  );
}
