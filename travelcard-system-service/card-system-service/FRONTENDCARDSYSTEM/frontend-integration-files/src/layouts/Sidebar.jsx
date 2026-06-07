import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import DirectionsTransitRoundedIcon from '@mui/icons-material/DirectionsTransitRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import TrainRoundedIcon from '@mui/icons-material/TrainRounded';

export const SIDEBAR_WIDTH = 292;

const NAV_ITEMS = [
    {
        label: 'Dashboard',
        path: '/',
        icon: <DashboardRoundedIcon />,
    },
    {
        label: 'Create Card',
        path: '/register',
        icon: <CreditCardRoundedIcon />,
    },
    {
        label: 'Recharge Balance',
        path: '/topup',
        icon: <AccountBalanceWalletRoundedIcon />,
    },
    {
        label: 'Start Journey',
        path: '/start-journey',
        icon: <DirectionsTransitRoundedIcon />,
    },
    {
        label: 'End Journey',
        path: '/end-journey',
        icon: <FlagRoundedIcon />,
    },
    {
        label: 'Check Card',
        path: '/card-details',
        icon: <SearchRoundedIcon />,
    },
    {
        label: 'Journey History',
        path: '/history',
        icon: <HistoryRoundedIcon />,
    },
    {
        label: 'Stations & Zones',
        path: '/stations',
        icon: <TrainRoundedIcon />,
    },
];

export default function Sidebar({ onNavigate }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        if (onNavigate) {
            onNavigate();
        }
    };

    return (
        <Box
            component="nav"
            sx={{
                width: SIDEBAR_WIDTH,
                height: '100vh',
                background: (theme) =>
                    theme.palette.mode === 'light'
                        ? 'linear-gradient(180deg, #111827 0%, #1e1b4b 48%, #0f172a 100%)'
                        : 'linear-gradient(180deg, #020617 0%, #111827 52%, #172554 100%)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Brand block */}
            <Box
                sx={{
                    px: 2.5,
                    pt: 2.5,
                    pb: 2,
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '28px',
                        background:
                            'linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(234, 88, 12, 0.92) 38%, rgba(30, 64, 175, 0.92) 100%)',
                        boxShadow: 'rgba(245, 158, 11, 0.30) 0px 18px 38px',
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: 150,
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -40,
                            right: -30,
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.18)',
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: '0.74rem',
                            letterSpacing: '0.18em',
                            fontWeight: 900,
                            opacity: 0.86,
                        }}
                    >
                        SMART TRANSIT
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.2,
                            fontSize: '1.85rem',
                            lineHeight: 1,
                            fontWeight: 950,
                            letterSpacing: '-0.06em',
                        }}
                    >
                        AL NAQEEL
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.6,
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.84)',
                        }}
                    >
                        Fare Card System
                    </Typography>

                    <Box
                        sx={{
                            mt: 2.2,
                            height: 34,
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.18em',
                            color: 'rgba(255,255,255,0.88)',
                            background: 'rgba(255,255,255,0.12)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        UAE 473 · DEMO CARD
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

            <Box sx={{ flex: 1, overflowY: 'auto', py: 1.8 }}>
                <Typography
                    variant="caption"
                    sx={{
                        px: 2.7,
                        mb: 1,
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                        color: 'rgba(255,255,255,0.48)',
                        fontWeight: 900,
                    }}
                >
                    Navigation
                </Typography>

                <List dense disablePadding>
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Tooltip key={item.path} title={item.label} placement="right">
                                <ListItemButton
                                    onClick={() => handleNavigate(item.path)}
                                    selected={isActive}
                                    sx={{
                                        mx: 1.5,
                                        mb: 0.65,
                                        borderRadius: '18px',
                                        color: '#ffffff',
                                        border: '1px solid',
                                        borderColor: isActive
                                            ? 'rgba(245, 158, 11, 0.55)'
                                            : 'transparent',
                                        background: isActive
                                            ? 'linear-gradient(90deg, rgba(245,158,11,0.24), rgba(59,130,246,0.16))'
                                            : 'transparent',
                                        '&.Mui-selected': {
                                            background:
                                                'linear-gradient(90deg, rgba(245,158,11,0.24), rgba(59,130,246,0.16))',
                                        },
                                        '&.Mui-selected:hover': {
                                            background:
                                                'linear-gradient(90deg, rgba(245,158,11,0.30), rgba(59,130,246,0.20))',
                                        },
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.08)',
                                            transform: 'translateX(4px)',
                                        },
                                        transition: 'all 160ms ease',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 40,
                                            color: isActive ? '#fbbf24' : 'rgba(255,255,255,0.66)',
                                        }}
                                    >
                                        {React.cloneElement(item.icon, { fontSize: 'small' })}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: '0.9rem',
                                            fontWeight: isActive ? 900 : 600,
                                            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.78)',
                                        }}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        );
                    })}
                </List>
            </Box>

            <Box
                sx={{
                    m: 2,
                    p: 1.8,
                    borderRadius: '22px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                }}
            >
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 900 }}>
                    Demo Mode
                </Typography>
                <Typography
                    sx={{
                        mt: 0.4,
                        fontSize: '0.72rem',
                        color: 'rgba(255,255,255,0.58)',
                        lineHeight: 1.4,
                    }}
                >
                    Register, recharge, tap in/out, and check station zones.
                </Typography>
            </Box>
        </Box>
    );
}