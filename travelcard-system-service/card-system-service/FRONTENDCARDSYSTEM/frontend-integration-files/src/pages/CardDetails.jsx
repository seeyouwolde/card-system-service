import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import DirectionsTransitRoundedIcon from '@mui/icons-material/DirectionsTransitRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TrainRoundedIcon from '@mui/icons-material/TrainRounded';
import DirectionsBusRoundedIcon from '@mui/icons-material/DirectionsBusRounded';

import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCardDetails } from '../api/travelCardApi';
import { useHistory } from '../context/HistoryContext';

export default function CardDetails() {
  const [searchParams] = useSearchParams();
  const { addEntry } = useHistory();

  const [cardNumber, setCardNumber] = useState(searchParams.get('card') || '');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [alert, setAlert] = useState({ open: false, severity: 'error', message: '' });

  // Auto-search if card number is pre-filled from URL
  useEffect(() => {
    if (searchParams.get('card')) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    const trimmed = cardNumber.trim();
    if (!trimmed) {
      setAlert({ open: true, severity: 'warning', message: 'Please enter a card number.' });
      return;
    }

    setLoading(true);
    setCardData(null);
    setAlert({ open: false, severity: 'error', message: '' });

    try {
      const res = await getCardDetails(trimmed);
      setCardData(res.data);
      addEntry({
        type: 'CARD_LOOKUP',
        cardNumber: trimmed,
        details: { balance: res.data?.balance, inTransit: res.data?.inTransit },
        status: 'SUCCESS',
      });
    } catch (err) {
      addEntry({ type: 'CARD_LOOKUP', cardNumber: trimmed, details: {}, status: 'FAILED', message: err.message });
      setAlert({ open: true, severity: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Box>
      <PageHeader
        title="Card Details"
        subtitle="Look up any registered travel card by its number"
      />

      {/* ── Search bar ── */}
      <FormCard sx={{ mb: 3, maxWidth: '100%' }}>
        <Box display="flex" gap={1.5} flexWrap="wrap">
          <TextField
            label="Card Number"
            placeholder="e.g. UAE-101"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardRoundedIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            startIcon={<SearchRoundedIcon />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {loading ? 'Searching…' : 'Search'}
          </Button>
          {cardData && (
            <Tooltip title="Refresh">
              <IconButton onClick={handleSearch} disabled={loading}>
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </FormCard>

      <AlertMessage
        severity={alert.severity}
        message={alert.message}
        open={alert.open}
        onClose={() => setAlert((a) => ({ ...a, open: false }))}
      />

      {/* ── Results ── */}
      {loading && <LoadingSpinner message="Fetching card details…" />}

      {!loading && cardData && (
        <Grid container spacing={3}>
          {/* Main card info */}
          <Grid item xs={12} md={5}>
            {/* Visual card representation */}
            <Box
              sx={{
                borderRadius: 3,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
                    : 'linear-gradient(135deg, #202124 0%, #3c4043 100%)',
                color: 'white',
                p: 3,
                mb: 2.5,
                position: 'relative',
                overflow: 'hidden',
                minHeight: 180,
              }}
            >
              {/* Decorative circles */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -60,
                  left: -20,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    UAE Travel Card
                  </Typography>
                  <Chip
                    label={cardData.inTransit ? 'In Transit' : 'Available'}
                    size="small"
                    sx={{
                      backgroundColor: cardData.inTransit
                        ? 'rgba(251,188,4,0.25)'
                        : 'rgba(52,168,83,0.25)',
                      color: cardData.inTransit ? '#fbbc04' : '#34a853',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      border: 'none',
                    }}
                  />
                </Box>

                <Typography variant="h5" fontWeight={700} fontFamily="monospace" letterSpacing="0.08em" mb={1}>
                  {cardData.cardNumber}
                </Typography>

                <Typography variant="h6" fontWeight={300} sx={{ opacity: 0.9 }}>
                  AED {Number(cardData.balance).toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  Current Balance
                </Typography>
              </Box>
            </Box>

            {/* Detail rows */}
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                {[
                  {
                    icon: <CreditCardRoundedIcon fontSize="small" />,
                    label: 'Card Number',
                    value: cardData.cardNumber,
                    mono: true,
                  },
                  {
                    icon: <AccountBalanceWalletRoundedIcon fontSize="small" />,
                    label: 'Balance',
                    value: `AED ${Number(cardData.balance).toFixed(2)}`,
                  },
                  {
                    icon: <DirectionsTransitRoundedIcon fontSize="small" />,
                    label: 'Transit Status',
                    valueNode: (
                      <Chip
                        label={cardData.inTransit ? 'In Transit' : 'Available'}
                        size="small"
                        color={cardData.inTransit ? 'warning' : 'success'}
                        variant="outlined"
                      />
                    ),
                  },
                  ...(cardData.transportType
                    ? [
                        {
                          icon:
                            cardData.transportType === 'TRAIN' ? (
                              <TrainRoundedIcon fontSize="small" />
                            ) : (
                              <DirectionsBusRoundedIcon fontSize="small" />
                            ),
                          label: 'Transport Type',
                          valueNode: (
                            <Chip
                              label={cardData.transportType}
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                          ),
                        },
                      ]
                    : []),
                ].map((row, idx, arr) => (
                  <React.Fragment key={row.label}>
                    <Box
                      display="flex"
                      alignItems="center"
                      px={2.5}
                      py={1.75}
                      gap={1.5}
                    >
                      <Box sx={{ color: 'text.secondary', display: 'flex' }}>{row.icon}</Box>
                      <Typography variant="body2" color="text.secondary" flex={1}>
                        {row.label}
                      </Typography>
                      {row.valueNode ? (
                        row.valueNode
                      ) : (
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          fontFamily={row.mono ? 'monospace' : 'inherit'}
                        >
                          {row.value}
                        </Typography>
                      )}
                    </Box>
                    {idx < arr.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Journey info */}
          <Grid item xs={12} md={7}>
            <FormCard title="Journey Status">
              {cardData.inTransit ? (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: 'warning.light',
                    border: '1px solid',
                    borderColor: 'warning.main',
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight={700} color="warning.main" mb={0.5}>
                    Journey in Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This card is currently active on the{' '}
                    <strong>{cardData.transportType}</strong> network. The maximum fare has been
                    held. Check out to complete the journey and settle the actual fare.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: 'success.light',
                    border: '1px solid',
                    borderColor: 'success.main',
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight={700} color="success.main" mb={0.5}>
                    Card Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This card is not currently in transit. It is ready to begin a new journey.
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Note:</strong> Journey history and per-trip fare details are tracked
                in the Activity Log under Journey History.
              </Typography>
            </FormCard>
          </Grid>
        </Grid>
      )}

      {!loading && !cardData && !alert.open && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <SearchRoundedIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
          <Typography variant="body1" fontWeight={500}>
            Enter a card number above to view its details
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            You can also click "Details" on any card from the Dashboard
          </Typography>
        </Box>
      )}
    </Box>
  );
}
