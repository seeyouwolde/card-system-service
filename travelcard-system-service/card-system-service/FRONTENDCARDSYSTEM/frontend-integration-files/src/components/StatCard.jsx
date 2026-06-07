import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

/**
 * Dashboard KPI card — icon + label + value.
 *
 * @param {object}        props
 * @param {React.ReactNode} props.icon       - MUI SvgIcon element (rendered large)
 * @param {string}        props.label        - Subtitle / metric name
 * @param {string|number} props.value        - Main value to display
 * @param {string}        [props.iconColor]  - CSS colour for the icon background tint
 * @param {string}        [props.trend]      - Optional trend text (e.g. "+12% this week")
 * @param {boolean}       [props.loading]    - Show skeleton while data loads
 */
export default function StatCard({
  icon,
  label,
  value,
  iconColor = '#4285f4',
  trend,
  loading = false,
}) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 3.25, '&:last-child': { pb: 3.25 } }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          {/* Value + label */}
          <Box flex={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={700}
              sx={{ mb: 0.5 }}
            >
              {label}
            </Typography>
            {loading ? (
              <Skeleton width={80} height={40} />
            ) : (
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {value}
              </Typography>
            )}
            {trend && !loading && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {trend}
              </Typography>
            )}
          </Box>

          {/* Icon badge */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${iconColor}22, ${iconColor}0d)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              flexShrink: 0,
              ml: 2,
            }}
          >
            {React.cloneElement(icon, { fontSize: 'medium' })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
