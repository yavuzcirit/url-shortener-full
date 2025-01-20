'use client';

import { AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItemIcon, ListItemText, ListItemButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LinkIcon from '@mui/icons-material/Link';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationProps {
  currentPage: 'input' | 'admin';
  setCurrentPage: (page: 'input' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const menuItems = [
    { id: 'input', label: t('url.input'), icon: <LinkIcon /> },
    { id: 'admin', label: t('url.admin'), icon: <AdminPanelSettingsIcon /> },
  ] as const;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('url.shortener')} - {currentPage === 'input' ? t('url.input') : t('url.admin')}
          </Typography>
          <Button 
            color="inherit"
            onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
          >
            {language.toUpperCase()}
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map(({ id, label, icon }) => (
              <ListItemButton
                key={id}
                onClick={() => {
                  setCurrentPage(id);
                  toggleDrawer();
                }}
                selected={currentPage === id}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
} 