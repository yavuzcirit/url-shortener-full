'use client';

import { useEffect } from 'react';
import { useUrlContext } from '@/contexts/UrlContext';
import { api } from '@/lib/api';
import { useSnackbar } from 'notistack';

export function useUrls() {
  const { urls, setUrls, setLoading } = useUrlContext();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setLoading(true);
        const data = await api.getAllUrls();
        setUrls(data);
      } catch (error) {
        console.error(error)
        enqueueSnackbar('Failed to fetch URLs', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [setUrls, setLoading, enqueueSnackbar]);

  return { urls };
} 