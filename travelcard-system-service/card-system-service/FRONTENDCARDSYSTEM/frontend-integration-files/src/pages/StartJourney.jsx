import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';

import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import DirectionsTransitRoundedIcon from '@mui/icons-material/DirectionsTransitRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import TrainRoundedIcon from '@mui/icons-material/TrainRounded';
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { swipeCard, getStationsAndZones, getCardDetails } from '../api/travelCardApi';
import { useHistory } from '../context/HistoryContext';

const INITIAL_FORM = { cardNumber: '', stationName: '', transportType: '' };

export default function StartJourney() {
  const { addEntry } = useHistory();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);

  const [cardPreview, setCardPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [result, setResult] = useState(null); // successful swipe response

  // ── Load stations on mount ──
  useEffect(() => {
    getStationsAndZones()
      .then((res) => setStations(res.data ?? []))
      .catch(() => setStations([]))
      .finally(() => setStationsLoading(false));
  }, []);

  // ── Debounced card preview ──
  useEffect(() => {
    const trimmed = form.cardNumber.trim();
    if (!trimmed) { setCardPreview(null); return; }
    const t = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const res = await getCardDetails(trimmed);
        setCardPreview(res.data);
      } catch {
        setCardPreview(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [form.cardNumber]);

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!form.cardNumber.trim()) e.cardNumber = 'Card number is required.';
    if (!form.stationName) e.stationName = 'Please select an origin station.';
    if (!form.transportType) e.transportType = 'Please select a transport type.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Warn if card is already in transit
    if (cardPreview?.inTransit) {
      setAlert({
        open: true,
        severity: 'warning',
        message: 'This card is already in transit. Please end the current journey first.',
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setAlert({ open: false, severity: 'success', message: '' });

    try {
      const res = await swipeCard({
        cardNumber: form.cardNumber.trim(),
        stationName: form.stationName,
        transportType: form.transportType,
      });

      addEntry({
        type: 'START_JOURNEY',
        cardNumber: form.cardNumber.trim(),
        details: {
          station: form.stationName,
          transportType: form.transportType,
          balanceAfter: res.data?.balance,
        },
        status: 'SUCCESS',
      });

      setResult(res.data);
      setAlert({
        open: true,
        severity: 'success',
        message: `Journey started! Card checked in at ${form.stationName} via ${form.transportType}.`,
      });
      setForm(INITIAL_FORM);
      setCardPreview(null);
    } catch (err) {
      addEntry({
        type: 'START_JOURNEY',
        cardNumber: form.cardNumber.trim(),
        details: { station: form.stationName, transportType: form.transportType },
        status: 'FAILED',
        message: err.message,
      });
      setAlert({ open: true, severity: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Start Journey"
        subtitle="Check in at an origin station to begin a new journey"
      />

      <Grid container spacing={3}>
        {/* ── Form ── */}
        <Grid item xs={12} md={7}>
          <FormCard
            title="Check In"
            subtitle="Select your card, station, and transport type"
          >
            <AlertMessage
              severity={alert.severity}
              message={alert.message}
              open={alert.open}
              onClose={() => setAlert((a) => ({ ...a, open: false }))}
            />

            {/* Success result card */}
            {result && (
              <Box
                sx={{
                  mb: 2.5,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'success.light',
                  border: '1px solid',
                  borderColor: 'success.main',
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CheckCircleRoundedIcon color="success" fontSize="small" />
                  <Typography variant="body2" fontWeight={700} color="success.main">
                    Journey Started
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Remaining balance: <strong>AED {Number(result.balance).toFixed(2)}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Card status: <strong>In Transit ({result.transportType})</strong>
                </Typography>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Card Number */}
                <TextField
                  label="Card Number"
                  placeholder="e.g. UAE-101"
                  value={form.cardNumber}
                  onChange={handleChange('cardNumber')}
                  error={!!errors.cardNumber}
                  helperText={
                    errors.cardNumber ||
                    (previewLoading
                      ? 'Looking up card…'
                      : cardPreview
                      ? `Balance: AED ${Number(cardPreview.balance).toFixed(2)} · ${cardPreview.inTransit ? 'In Transit ⚠' : 'Available ✓'}`
                      : '')
                  }
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardRoundedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Origin Station */}
                {stationsLoading ? (
                  <LoadingSpinner message="Loading stations…" size="small" />
                ) : (
                  <TextField
                    select
                    label="Origin Station"
                    value={form.stationName}
                    onChange={handleChange('stationName')}
                    error={!!errors.stationName}
                    helperText={errors.stationName || 'Select where you are boarding'}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnRoundedIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {stations.map((s) => (
                      <MenuItem key={s.stationName} value={s.stationName}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <span>{s.stationName}</span>
                          <Box display="flex" gap={0.5} ml={1}>
                            {s.zones?.map((z) => (
                              <Chip key={z} label={`Zone ${z}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                            ))}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {/* Transport Type */}
                <TextField
                  select
                  label="Transport Type"
                  value={form.transportType}
                  onChange={handleChange('transportType')}
                  error={!!errors.transportType}
                  helperText={errors.transportType || 'Train or Bus'}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DirectionsTransitRoundedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="TRAIN">
                    <Box display="flex" alignItems="center" gap={1}>
                      <TrainRoundedIcon fontSize="small" />
                      Train
                    </Box>
                  </MenuItem>
                  <MenuItem value="BUS">
                    <Box display="flex" alignItems="center" gap={1}>
                      <DirectionsBusRoundedIcon fontSize="small" />
                      Bus
                    </Box>
                  </MenuItem>
                </TextField>

                <Divider />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                  startIcon={<DirectionsTransitRoundedIcon />}
                  fullWidth
                >
                  {loading ? 'Checking In…' : 'Start Journey'}
                </Button>
              </Box>
            </Box>
          </FormCard>
        </Grid>

        {/* ── Info panel ── */}
        <Grid item xs={12} md={5}>
          <FormCard title="How Check-In Works">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                The maximum fare for your selected transport type is held on your card when you check in. It will be adjusted to the actual fare when you check out.
              </Alert>
              {[
                {
                  icon: <CreditCardRoundedIcon fontSize="small" />,
                  title: 'Card must be registered',
                  text: 'Only registered cards can start a journey.',
                },
                {
                  icon: <DirectionsTransitRoundedIcon fontSize="small" />,
                  title: 'Tap once to begin',
                  text: 'Selecting the origin station simulates a card swipe at the station terminal.',
                },
                {
                  icon: <LocationOnRoundedIcon fontSize="small" />,
                  title: 'Zones determine the fare',
                  text: 'Each station belongs to one or more fare zones. The zone pair of origin and destination determines your final fare.',
                },
              ].map((item) => (
                <Box key={item.title} display="flex" gap={1.5}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      backgroundColor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </FormCard>
        </Grid>
      </Grid>
    </Box>
  );
}
