'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import { useSnackbar } from 'notistack';
import { useUrlContext } from '@/contexts/UrlContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

export const UserInputMask: React.FC = () => {
  const { lastEditedUrl, setLastEditedUrl } = useUrlContext();
  const [url, setUrl] = useState(lastEditedUrl?.url || '');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLanguage();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await api.createUrl({ url, ttlInSeconds: null });
      const newShortUrl = `https://urlshortener.smef.io/${data.id}`;
      setShortUrl(newShortUrl);
      setLastEditedUrl(data);
      enqueueSnackbar(t('url.addSuccess'), { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('url.error.add'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      enqueueSnackbar(t('url.copySuccess'), { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('url.error.copy'), { variant: 'error' });
    }
  };

  const handleTest = () => {
    window.open(shortUrl, '_blank');
  };

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('url.create.title')}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label={t('url.enter')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          variant="outlined"
          placeholder={t('url.create.placeholder')}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !url}
        >
          {loading ? <CircularProgress size={24} /> : t('url.create.button')}
        </Button>
      </Box>

      {shortUrl && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            label={t('url.shortened')}
            value={shortUrl}
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <Tooltip title={t('url.test')}>
            <IconButton onClick={handleTest} color="primary">
              <LaunchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('url.copy')}>
            <IconButton onClick={handleCopy} color="primary">
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};