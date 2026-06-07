import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import DirectionsTransitRoundedIcon from '@mui/icons-material/DirectionsTransitRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import RouterRoundedIcon from '@mui/icons-material/RouterRounded';

import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import { fetchAllCards, ping } from '../api/travelCardApi';

export default function Dashboard() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [apiOnline, setApiOnline] = useState(null); // null = checking, true/false
  const [loadingCards, setLoadingCards] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const refresh = useCallback(async () => {
    setLoadingCards(true);
    setApiOnline(null);

    const [pingResult, cardsResult] = await Promise.allSettled([
      ping(),
      fetchAllCards(),
    ]);

    setApiOnline(pingResult.status === 'fulfilled');
    if (cardsResult.status === 'fulfilled') {
      setCards(cardsResult.value.data ?? []);
    }
    setLoadingCards(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const quickActions = [
    {
      label: 'Register Card',
      path: '/register',
      icon: <CreditCardRoundedIcon />,
      color: '#0f766e',
      description: 'Create a new travel card',
    },
    {
      label: 'Top Up',
      path: '/topup',
      icon: <AccountBalanceWalletRoundedIcon />,
      color: '#16a34a',
      description: 'Add credit to a card',
    },
    {
      label: 'Start Journey',
      path: '/start-journey',
      icon: <DirectionsTransitRoundedIcon />,
      color: '#2563eb',
      description: 'Check in at a station',
    },
    {
      label: 'End Journey',
      path: '/end-journey',
      icon: <FlagRoundedIcon />,
      color: '#f97316',
      description: 'Check out at a station',
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Control Center"
        subtitle="A refreshed operations view for cards, balance, stations, and journeys"
        action={
          <Tooltip title="Refresh data">
            <IconButton onClick={refresh} size="small">
              <RefreshRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />

      {/* ── KPI Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<CreditCardRoundedIcon />}
            label="Active Fare Cards"
            value={loadingCards ? '—' : cards.length}
            iconColor="#4285f4"
            loading={loadingCards}
            trend="Registered in the system"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<RouterRoundedIcon />}
            label="Service Connection"
            value={
              apiOnline === null ? 'Checking…' : apiOnline ? 'Online' : 'Offline'
            }
            iconColor={apiOnline === null ? '#fbbc04' : apiOnline ? '#34a853' : '#ea4335'}
            loading={apiOnline === null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<LayersRoundedIcon />}
            label="Latest Sync"
            value={lastRefresh ? lastRefresh.toLocaleTimeString() : '—'}
            iconColor="#9c27b0"
            loading={loadingCards}
            trend="Use refresh to resync"
          />
        </Grid>
      </Grid>

      {/* ── Operations + Card List ── */}
      <Grid container spacing={3}>
        {/* Operations */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700}>
                Operations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                Frequently used card actions
              </Typography>
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={1.5}>
                {quickActions.map((action) => (
                  <Grid item xs={6} key={action.path}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate(action.path)}
                      sx={{
                        py: 2,
                        px: 1.5,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 0.75,
                        borderColor: 'divider',
                        borderRadius: 2.5,
                        textAlign: 'left',
                        '&:hover': {
                          borderColor: action.color,
                          backgroundColor: `${action.color}08`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1.5,
                          backgroundColor: `${action.color}14`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: action.color,
                        }}
                      >
                        {React.cloneElement(action.icon, { fontSize: 'small' })}
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                          lineHeight={1.3}
                        >
                          {action.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" lineHeight={1.3}>
                          {action.description}
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Registered Cards List */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Registered Cards
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {cards.length} card{cards.length !== 1 ? 's' : ''} in the system
                </Typography>
              </Box>
              <Button
                size="small"
                endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
                onClick={() => navigate('/card-details')}
                sx={{ fontSize: '0.8rem' }}
              >
                View Details
              </Button>
            </Box>

            <CardContent sx={{ p: 0 }}>
              {loadingCards ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading cards…
                  </Typography>
                </Box>
              ) : cards.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CreditCardRoundedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No cards registered yet.
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/register')}
                    sx={{ mt: 2 }}
                  >
                    Register First Card
                  </Button>
                </Box>
              ) : (
                <List
                  dense
                  disablePadding
                  sx={{ maxHeight: 340, overflowY: 'auto' }}
                >
                  {cards.map((cardNumber, idx) => (
                    <React.Fragment key={cardNumber}>
                      <ListItem
                        sx={{ px: 3, py: 1.25 }}
                        secondaryAction={
                          <Button
                            size="small"
                            variant="text"
                            sx={{ fontSize: '0.75rem', py: 0.5 }}
                            onClick={() =>
                              navigate(`/card-details?card=${encodeURIComponent(cardNumber)}`)
                            }
                          >
                            Details
                          </Button>
                        }
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CreditCardRoundedIcon
                            fontSize="small"
                            sx={{ color: 'text.secondary' }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                              {cardNumber}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {idx < cards.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
