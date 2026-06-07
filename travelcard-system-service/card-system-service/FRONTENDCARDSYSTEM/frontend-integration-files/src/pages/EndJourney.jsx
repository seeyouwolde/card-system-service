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
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import TrainRoundedIcon from '@mui/icons-material/TrainRounded';
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DirectionsTransitRoundedIcon from '@mui/icons-material/DirectionsTransitRounded';

import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { swipeCard, getStationsAndZones, getCardDetails } from '../api/travelCardApi';
import { useHistory } from '../context/HistoryContext';

const INITIAL_FORM = { cardNumber: '', stationName: '', transportType: '' };

export default function EndJourney() {
  const { addEntry } = useHistory();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);

  const [cardPreview, setCardPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [result, setResult] = useState(null);

  // ── Load stations ──
  useEffect(() => {
    getStationsAndZones()
      .then((res) => setStations(res.data ?? []))
      .catch(() => setStations([]))
      .finally(() => setStationsLoading(false));
  }, []);

  // ── Card preview + auto-fill transport type ──
  useEffect(() => {
    const trimmed = form.cardNumber.trim();
    if (!trimmed) { setCardPreview(null); return; }
    const t = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const res = await getCardDetails(trimmed);
        const data = res.data;
        setCardPreview(data);
        // Auto-fill transport type from card's current journey
        if (data.inTransit && data.transportType) {
          setForm((prev) => ({ ...prev, transportType: data.transportType }));
        }
      } catch {
        setCardPreview(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [form.cardNumber]);

  const validate = () => {
    const e = {};
    if (!form.cardNumber.trim()) e.cardNumber = 'Card number is required.';
    if (!form.stationName) e.stationName = 'Please select a destination station.';
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

    if (cardPreview && !cardPreview.inTransit) {
      setAlert({
        open: true,
        severity: 'warning',
        message: 'This card is not currently in transit. Please start a journey first.',
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
        type: 'END_JOURNEY',
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
        message: `Journey completed! Checked out at ${form.stationName}. Remaining balance: AED ${Number(res.data?.balance ?? 0).toFixed(2)}.`,
      });
      setForm(INITIAL_FORM);
      setCardPreview(null);
    } catch (err) {
      addEntry({
        type: 'END_JOURNEY',
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
        title="End Journey"
        subtitle="Check out at a destination station to complete your journey"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <FormCard title="Check Out" subtitle="Select your card and destination station">
            <AlertMessage
              severity={alert.severity}
              message={alert.message}
              open={alert.open}
              onClose={() => setAlert((a) => ({ ...a, open: false }))}
            />

            {/* Success summary */}
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
                    Journey Completed
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Remaining balance:{' '}
                  <strong>AED {Number(result.balance).toFixed(2)}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Card status: <strong>Available</strong>
                </Typography>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
                      ? `Balance: AED ${Number(cardPreview.balance).toFixed(2)} · ${cardPreview.inTransit ? '✓ In Transit' : '⚠ Not In Transit'}`
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

                {stationsLoading ? (
                  <LoadingSpinner message="Loading stations…" size="small" />
                ) : (
                  <TextField
                    select
                    label="Destination Station"
                    value={form.stationName}
                    onChange={handleChange('stationName')}
                    error={!!errors.stationName}
                    helperText={errors.stationName || 'Select where you are alighting'}
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

                <TextField
                  select
                  label="Transport Type"
                  value={form.transportType}
                  onChange={handleChange('transportType')}
                  error={!!errors.transportType}
                  helperText={
                    errors.transportType ||
                    (cardPreview?.inTransit && cardPreview.transportType
                      ? `Auto-filled from card's current journey`
                      : 'Confirm the transport type')
                  }
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
                      <TrainRoundedIcon fontSize="small" /> Train
                    </Box>
                  </MenuItem>
                  <MenuItem value="BUS">
                    <Box display="flex" alignItems="center" gap={1}>
                      <DirectionsBusRoundedIcon fontSize="small" /> Bus
                    </Box>
                  </MenuItem>
                </TextField>

                <Divider />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                  startIcon={<FlagRoundedIcon />}
                  fullWidth
                >
                  {loading ? 'Checking Out…' : 'End Journey'}
                </Button>
              </Box>
            </Box>
          </FormCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <FormCard title="How Check-Out Works">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                On check-out, the system replaces the maximum fare hold with the actual fare based on the zone pair you travelled.
              </Alert>
              {[
                {
                  icon: <CreditCardRoundedIcon fontSize="small" />,
                  title: 'Card must be in transit',
                  text: 'The card must have been checked in with Start Journey first.',
                },
                {
                  icon: <LocationOnRoundedIcon fontSize="small" />,
                  title: 'Select destination',
                  text: 'Pick the station where you are leaving the transit network.',
                },
                {
                  icon: <FlagRoundedIcon fontSize="small" />,
                  title: 'Fare is calculated automatically',
                  text: 'The backend deducts the correct fare based on origin–destination zone pair.',
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
