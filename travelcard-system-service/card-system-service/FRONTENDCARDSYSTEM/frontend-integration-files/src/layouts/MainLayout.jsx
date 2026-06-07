import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: (theme) =>
                    theme.palette.mode === 'light'
                        ? 'radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.20), transparent 28%), radial-gradient(circle at 90% 5%, rgba(30, 64, 175, 0.16), transparent 30%), linear-gradient(135deg, #fff7ed 0%, #f8fafc 45%, #e0f2fe 100%)'
                        : 'radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.16), transparent 28%), radial-gradient(circle at 90% 5%, rgba(56, 189, 248, 0.13), transparent 30%), linear-gradient(135deg, #111827 0%, #1e1b4b 48%, #082f49 100%)',
            }}
        >
            {/* Always hidden sidebar. Opens only when menu button is clicked. */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: SIDEBAR_WIDTH,
                        border: 'none',
                        overflow: 'hidden',
                    },
                }}
                ModalProps={{ keepMounted: true }}
            >
                <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </Drawer>

            {/* Floating three-bar menu button on left */}
            <Tooltip title="Open menu">
                <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{
                        position: 'fixed',
                        top: 18,
                        left: 18,
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                        width: 46,
                        height: 46,
                        borderRadius: '16px',
                        background: (theme) =>
                            theme.palette.mode === 'light'
                                ? 'rgba(255, 255, 255, 0.92)'
                                : 'rgba(15, 23, 42, 0.90)',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'rgba(15, 23, 42, 0.18) 0px 12px 28px',
                        backdropFilter: 'blur(14px)',
                        '&:hover': {
                            background: (theme) =>
                                theme.palette.mode === 'light'
                                    ? '#ffffff'
                                    : '#1e293b',
                            transform: 'translateY(-1px)',
                        },
                    }}
                >
                    <MenuRoundedIcon />
                </IconButton>
            </Tooltip>

            <Box
                component="main"
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Navbar />

                <Box
                    sx={{
                        mt: '86px',
                        flex: 1,
                        p: { xs: 2, sm: 3 },
                        maxWidth: 1240,
                        width: '100%',
                        mx: 'auto',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}