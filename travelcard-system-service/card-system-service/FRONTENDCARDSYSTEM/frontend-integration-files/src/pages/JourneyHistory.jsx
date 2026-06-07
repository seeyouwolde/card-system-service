import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { useHistory } from '../context/HistoryContext';

/** Human-readable operation type labels */
const TYPE_LABELS = {
  REGISTER:      { label: 'Register',       color: 'info'    },
  TOP_UP:        { label: 'Top Up',         color: 'success' },
  START_JOURNEY: { label: 'Start Journey',  color: 'primary' },
  END_JOURNEY:   { label: 'End Journey',    color: 'warning' },
  CARD_LOOKUP:   { label: 'Card Lookup',    color: 'default' },
};

/** Format a detail object into a readable string */
function formatDetails(type, details) {
  if (!details) return '—';
  switch (type) {
    case 'REGISTER':
      return `Initial balance: AED ${Number(details.initialBalance ?? 0).toFixed(2)}`;
    case 'TOP_UP':
      return `Amount: AED ${Number(details.amount ?? 0).toFixed(2)}`;
    case 'START_JOURNEY':
      return `Station: ${details.station ?? '?'} · Transport: ${details.transportType ?? '?'}${details.balanceAfter != null ? ` · Balance after: AED ${Number(details.balanceAfter).toFixed(2)}` : ''}`;
    case 'END_JOURNEY':
      return `Station: ${details.station ?? '?'} · Transport: ${details.transportType ?? '?'}${details.balanceAfter != null ? ` · Balance after: AED ${Number(details.balanceAfter).toFixed(2)}` : ''}`;
    case 'CARD_LOOKUP':
      return details.balance != null
        ? `Balance: AED ${Number(details.balance).toFixed(2)} · ${details.inTransit ? 'In Transit' : 'Available'}`
        : '—';
    default:
      return JSON.stringify(details);
  }
}

/** Table column definitions */
const COLUMNS = [
  {
    id: 'timestamp',
    label: 'Time',
    minWidth: 140,
    render: (val) => new Date(val).toLocaleString(),
  },
  {
    id: 'type',
    label: 'Operation',
    minWidth: 140,
    render: (val) => {
      const meta = TYPE_LABELS[val] ?? { label: val, color: 'default' };
      return (
        <Chip
          label={meta.label}
          size="small"
          color={meta.color}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      );
    },
  },
  {
    id: 'cardNumber',
    label: 'Card Number',
    minWidth: 120,
    render: (val) => (
      <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
        {val}
      </Typography>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 90,
    render: (val) => (
      <Chip
        label={val}
        size="small"
        color={val === 'SUCCESS' ? 'success' : 'error'}
        variant="filled"
        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
      />
    ),
  },
  {
    id: 'detailsStr',
    label: 'Details',
    minWidth: 200,
    render: (val, row) =>
      row.status === 'FAILED' ? (
        <Typography variant="caption" color="error">
          {row.message || 'Request failed'}
        </Typography>
      ) : (
        <Typography variant="caption" color="text.secondary">
          {val}
        </Typography>
      ),
  },
];

export default function JourneyHistory() {
  const { entries, clearHistory } = useHistory();
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Enrich entries with computed detailsStr for table display
  const enriched = entries.map((e) => ({
    ...e,
    detailsStr: formatDetails(e.type, e.details),
  }));

  // Apply type filter
  const filtered =
    typeFilter === 'ALL' ? enriched : enriched.filter((e) => e.type === typeFilter);

  const handleClear = () => {
    clearHistory();
    setConfirmOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Journey History"
        subtitle="Activity log of all operations performed in this session"
        action={
          entries.length > 0 ? (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteRoundedIcon />}
              onClick={() => setConfirmOpen(true)}
            >
              Clear History
            </Button>
          ) : null
        }
      />

      {entries.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
          <HistoryRoundedIcon sx={{ fontSize: 64, opacity: 0.25, mb: 2 }} />
          <Typography variant="body1" fontWeight={500}>
            No activity yet
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Operations like registrations, top-ups, and journeys will appear here.
          </Typography>
        </Box>
      ) : (
        <>
          {/* ── Filter tabs ── */}
          <Box sx={{ mb: 2.5, overflowX: 'auto' }}>
            <ToggleButtonGroup
              value={typeFilter}
              exclusive
              onChange={(_, val) => val && setTypeFilter(val)}
              size="small"
            >
              <ToggleButton value="ALL" sx={{ fontWeight: 600, textTransform: 'none' }}>
                All ({entries.length})
              </ToggleButton>
              {Object.entries(TYPE_LABELS).map(([key, meta]) => {
                const count = entries.filter((e) => e.type === key).length;
                if (count === 0) return null;
                return (
                  <ToggleButton
                    key={key}
                    value={key}
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                  >
                    {meta.label} ({count})
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </Box>

          {/* ── Table ── */}
          <DataTable
            columns={COLUMNS}
            rows={filtered}
            searchableFields={['cardNumber', 'type', 'status', 'detailsStr']}
            emptyMessage="No entries match your search."
          />
        </>
      )}

      {/* ── Clear confirmation dialog ── */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}
      >
        <DialogTitle fontWeight={700}>Clear History?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete all {entries.length} activity log entries. This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleClear} variant="contained" color="error">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
