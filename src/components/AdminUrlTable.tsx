'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { UrlDto } from '@/types/url';
import { useUrlContext } from '@/contexts/UrlContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

export const AdminUrlTable: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<UrlDto>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUrl, setNewUrl] = useState<Partial<UrlDto>>({
    url: '',
    ttlInSeconds: null,
  });
  const [loading, setLoading] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const { urls, setUrls, setLastEditedUrl } = useUrlContext();
  const { t } = useLanguage();

  const handleEdit = (url: UrlDto) => {
    setEditingId(url.id!);
    setEditForm(url);
  };

  const handleSave = async (url: UrlDto) => {
    try {
      setLoading(url.id!);
      const updatedUrl = await api.updateUrl(url.id!, {
        url: editForm.url!,
        ttlInSeconds: editForm.ttlInSeconds ?? null,
      });

      setUrls(urls.map(u => u.id === url.id ? updatedUrl : u));
      setLastEditedUrl(updatedUrl);
      enqueueSnackbar(t('url.addSuccess'), { variant: 'success' });
    } catch (error) {
        console.error(error)

      enqueueSnackbar(t('url.error.update'), { variant: 'error' });
    } finally {
      setLoading(null);
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('url.confirmDelete'))) return;

    try {
      setLoading(id);
      await api.deleteUrl(id);
      setUrls(urls.filter(u => u.id !== id));
      enqueueSnackbar(t('url.deleteSuccess'), { variant: 'success' });
    } catch (error) {
        console.error(error)

      enqueueSnackbar(t('url.error.delete'), { variant: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const handleAdd = async () => {
    try {
      setLoading('new');
      const addedUrl = await api.createUrl({
        url: newUrl.url!,
        ttlInSeconds: newUrl.ttlInSeconds ?? null,
      });

      setUrls([...urls, addedUrl]);
      setLastEditedUrl(addedUrl);
      setIsAddDialogOpen(false);
      setNewUrl({ url: '', ttlInSeconds: null });
      enqueueSnackbar(t('url.addSuccess'), { variant: 'success' });
    } catch (error) {
        console.error(error)
      enqueueSnackbar(t('url.error.add'), { variant: 'error' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {t('url.admin')}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setIsAddDialogOpen(true)}
        >
          {t('url.create.button')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('url.table.id')}</TableCell>
              <TableCell>{t('url.table.url')}</TableCell>
              <TableCell>{t('url.table.ttl')}</TableCell>
              <TableCell>{t('url.table.createdDate')}</TableCell>
              <TableCell>{t('url.table.modifiedDate')}</TableCell>
              <TableCell align="right">{t('url.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.id} hover>
                <TableCell>{url.id}</TableCell>
                <TableCell>
                  {editingId === url.id ? (
                    <TextField
                      fullWidth
                      value={editForm.url}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                      size="small"
                      placeholder={t('url.create.placeholder')}
                    />
                  ) : (
                    url.url
                  )}
                </TableCell>
                <TableCell>
                  {editingId === url.id ? (
                    <TextField
                      type="number"
                      value={editForm.ttlInSeconds ?? ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        ttlInSeconds: e.target.value ? Number(e.target.value) : null
                      })}
                      size="small"
                      placeholder={t('url.ttl')}
                    />
                  ) : (
                    url.ttlInSeconds ?? t('url.permanent')
                  )}
                </TableCell>
                <TableCell>{new Date(url.createdDate!).toLocaleString()}</TableCell>
                <TableCell>{new Date(url.modifiedDate!).toLocaleString()}</TableCell>
                <TableCell align="right">
                  {loading === url.id ? (
                    <CircularProgress size={24} />
                  ) : editingId === url.id ? (
                    <>
                      <Tooltip title={t('url.save')}>
                        <IconButton onClick={() => handleSave(url)} color="primary">
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('url.cancel')}>
                        <IconButton onClick={() => setEditingId(null)} color="error">
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title={t('url.edit')}>
                        <IconButton onClick={() => handleEdit(url)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('url.delete')}>
                        <IconButton onClick={() => handleDelete(url.id!)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>{t('url.create.title')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('url.enter')}
            value={newUrl.url}
            onChange={(e) => setNewUrl({ ...newUrl, url: e.target.value })}
            fullWidth
            margin="normal"
            placeholder={t('url.create.placeholder')}
          />
          <TextField
            label={t('url.ttl')}
            type="number"
            value={newUrl.ttlInSeconds ?? ''}
            onChange={(e) => setNewUrl({
              ...newUrl,
              ttlInSeconds: e.target.value ? Number(e.target.value) : null
            })}
            fullWidth
            margin="normal"
            helperText={t('url.ttlHelp')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>
            {t('url.cancel')}
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={loading === 'new' || !newUrl.url}
            startIcon={loading === 'new' ? <CircularProgress size={20} /> : null}
          >
            {t('url.create.button')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};