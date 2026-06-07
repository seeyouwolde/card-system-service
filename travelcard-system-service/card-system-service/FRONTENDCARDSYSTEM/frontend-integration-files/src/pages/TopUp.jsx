import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import AlertMessage from '../components/AlertMessage';
import { rechargeCard, getCardDetails } from '../api/travelCardApi';
import { useHistory } from '../context/HistoryContext';

/** Preset quick-add amounts */
const PRESET_AMOUNTS = [10, 20, 50, 100, 200];

const INITIAL_FORM = { cardNumber: '', amount: '' };

export default function TopUp() {
  const { addEntry } = useHistory();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cardPreview, setCardPreview] = useState(null); // TravelCardResponse
  const [previewLoading, setPreviewLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  // ── Live card preview when user finishes typing card number ──
  useEffect(() => {
    const trimmed = form.cardNumber.trim();
    if (!trimmed) {
      setCardPreview(null);
      return;
    }
    const timer = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const res = await getCardDetails(trimmed);
        setCardPreview(res.data);
      } catch {
        setCardPreview(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [form.cardNumber]);

  // ── Validation ──
  const validate = () => {
    const newErrors = {};
    if (!form.cardNumber.trim()) newErrors.cardNumber = 'Card number is required.';
    const amt = parseFloat(form.amount);
    if (form.amount === '') {
      newErrors.amount = 'Recharge amount is required.';
    } else if (isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Amount must be a positive number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePreset = (amount) => {
    setForm((prev) => ({ ...prev, amount: String(amount) }));
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setAlert({ open: false, severity: 'success', message: '' });

    try {
      await rechargeCard(form.cardNumber.trim(), parseFloat(form.amount));

      addEntry({
        type: 'TOP_UP',
        cardNumber: form.cardNumber.trim(),
        details: { amount: parseFloat(form.amount) },
        status: 'SUCCESS',
      });

      setAlert({
        open: true,
        severity: 'success',
        message: `AED ${parseFloat(form.amount).toFixed(2)} added to card "${form.cardNumber.trim()}" successfully.`,
      });

      // Refresh card preview
      try {
        const res = await getCardDetails(form.cardNumber.trim());
        setCardPreview(res.data);
      } catch {
        /* ignore preview update failure */
      }

      setForm((prev) => ({ ...prev, amount: '' }));
    } catch (err) {
      addEntry({
        type: 'TOP_UP',
        cardNumber: form.cardNumber.trim(),
        details: { amount: parseFloat(form.amount) },
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
        title="Top Up Card"
        subtitle="Add credit (AED) to a registered travel card"
      />

      <Grid container spacing={3}>
        {/* ── Form ── */}
        <Grid item xs={12} md={7}>
          <FormCard title="Recharge Travel Card" subtitle="Enter the card number and amount to add">
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
                  helperText={errors.cardNumber || (previewLoading ? 'Looking up card…' : '')}
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

                {/* Amount + presets */}
                <Box>
                  <TextField
                    label="Top-Up Amount (AED)"
                    placeholder="e.g. 50"
                    type="number"
                    inputProps={{ min: 0.01, step: 0.01 }}
                    value={form.amount}
                    onChange={handleChange('amount')}
                    error={!!errors.amount}
                    helperText={errors.amount}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountBalanceWalletRoundedIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* Quick presets */}
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    {PRESET_AMOUNTS.map((amt) => (
                      <Chip
                        key={amt}
                        label={`AED ${amt}`}
                        size="small"
                        variant={form.amount === String(amt) ? 'filled' : 'outlined'}
                        color={form.amount === String(amt) ? 'primary' : 'default'}
                        onClick={() => handlePreset(amt)}
                        sx={{ cursor: 'pointer', fontWeight: 600 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider />

                <Box display="flex" gap={1.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    sx={{ flex: 1 }}
                  >
                    {loading ? 'Processing…' : 'Top Up Card'}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={loading}
                    size="large"
                    onClick={() => {
                      setForm(INITIAL_FORM);
                      setErrors({});
                      setCardPreview(null);
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

        {/* ── Card Preview ── */}
        <Grid item xs={12} md={5}>
          <FormCard title="Card Preview">
            {!form.cardNumber.trim() ? (
              <Box sx={{ py: 2, textAlign: 'center' }}>
                <CreditCardRoundedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Enter a card number to see its current details.
                </Typography>
              </Box>
            ) : previewLoading ? (
              <Typography variant="body2" color="text.secondary">
                Loading card info…
              </Typography>
            ) : cardPreview ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Card Number', value: cardPreview.cardNumber },
                  {
                    label: 'Current Balance',
                    value: `AED ${Number(cardPreview.balance).toFixed(2)}`,
                  },
                  {
                    label: 'Status',
                    value: cardPreview.inTransit ? 'In Transit' : 'Available',
                    chip: true,
                    color: cardPreview.inTransit ? 'warning' : 'success',
                  },
                  ...(cardPreview.transportType
                    ? [{ label: 'Transport', value: cardPreview.transportType }]
                    : []),
                ].map((item) => (
                  <Box
                    key={item.label}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      pb: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { border: 0, pb: 0 },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    {item.chip ? (
                      <Chip label={item.value} size="small" color={item.color} />
                    ) : (
                      <Typography variant="body2" fontWeight={600} fontFamily={item.label === 'Card Number' ? 'monospace' : 'inherit'}>
                        {item.value}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ py: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="error">
                  Card not found. Please check the number.
                </Typography>
              </Box>
            )}
          </FormCard>
        </Grid>
      </Grid>
    </Box>
  );
}
