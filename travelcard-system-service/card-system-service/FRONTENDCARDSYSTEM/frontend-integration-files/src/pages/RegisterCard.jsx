import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import AlertMessage from '../components/AlertMessage';
import { registerCard } from '../api/travelCardApi';
import { useHistory } from '../context/HistoryContext';

const INITIAL_FORM = { cardNumber: '', balance: '' };

export default function RegisterCard() {
  const { addEntry } = useHistory();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  // ── Validation ──
  const validate = () => {
    const newErrors = {};
    if (!form.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required.';
    } else if (form.cardNumber.trim().length < 3) {
      newErrors.cardNumber = 'Card number must be at least 3 characters.';
    }
    const bal = parseFloat(form.balance);
    if (form.balance === '') {
      newErrors.balance = 'Initial balance is required.';
    } else if (isNaN(bal) || bal < 0) {
      newErrors.balance = 'Balance must be a non-negative number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handlers ──
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setAlert({ open: false, severity: 'success', message: '' });

    try {
      await registerCard({
        cardNumber: form.cardNumber.trim(),
        balance: parseFloat(form.balance),
      });

      addEntry({
        type: 'REGISTER',
        cardNumber: form.cardNumber.trim(),
        details: { initialBalance: parseFloat(form.balance) },
        status: 'SUCCESS',
      });

      setAlert({
        open: true,
        severity: 'success',
        message: `Card "${form.cardNumber.trim()}" has been registered successfully with a balance of AED ${parseFloat(form.balance).toFixed(2)}.`,
      });
      setForm(INITIAL_FORM);
    } catch (err) {
      addEntry({
        type: 'REGISTER',
        cardNumber: form.cardNumber.trim(),
        details: { initialBalance: parseFloat(form.balance) },
        status: 'FAILED',
        message: err.message,
      });

      setAlert({
        open: true,
        severity: 'error',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Register Travel Card"
        subtitle="Create a new travel card with an initial balance"
      />

      <Grid container spacing={3}>
        {/* ── Form ── */}
        <Grid item xs={12} md={7}>
          <FormCard
            title="Card Registration"
            subtitle="Fill in the details below to register a new travel card"
          >
            <AlertMessage
              severity={alert.severity}
              message={alert.message}
              open={alert.open}
              onClose={() => setAlert((a) => ({ ...a, open: false }))}
            />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Card Number */}
                <TextField
                  label="Card Number"
                  placeholder="e.g. UAE-101"
                  value={form.cardNumber}
                  onChange={handleChange('cardNumber')}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber || 'Unique identifier for this travel card'}
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

                {/* Initial Balance */}
                <TextField
                  label="Initial Balance (AED)"
                  placeholder="e.g. 100"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={form.balance}
                  onChange={handleChange('balance')}
                  error={!!errors.balance}
                  helperText={errors.balance || 'Starting balance loaded onto the card'}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyRoundedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Divider />

                {/* Actions */}
                <Box display="flex" gap={1.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    sx={{ flex: 1 }}
                  >
                    {loading ? 'Registering…' : 'Register Card'}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={loading}
                    size="large"
                    onClick={() => {
                      setForm(INITIAL_FORM);
                      setErrors({});
                      setAlert((a) => ({ ...a, open: false }));
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </Box>
          </FormCard>
        </Grid>

        {/* ── Info panel ── */}
        <Grid item xs={12} md={5}>
          <FormCard title="How Registration Works">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                {
                  step: '01',
                  title: 'Choose a Card Number',
                  text: 'Pick a unique identifier for the card (e.g. UAE-101, A201). It cannot be changed later.',
                },
                {
                  step: '02',
                  title: 'Set Initial Balance',
                  text: 'Load an initial AED balance onto the card. Cards with zero balance can still be registered.',
                },
                {
                  step: '03',
                  title: 'Start Travelling',
                  text: 'Once registered, the card can be used to start and end journeys across the UAE transit network.',
                },
              ].map((item) => (
                <Box key={item.step} display="flex" gap={2}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'action.selected',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      {item.step}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
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
