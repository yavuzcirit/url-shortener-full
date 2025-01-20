'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { AdminUrlTable } from './AdminUrlTable';
import { Navigation } from './Navigation';
import { UserInputMask } from './UserInputMask';
import { useUrlContext } from '@/contexts/UrlContext';
import { UrlDto } from '@/types/url';

interface MainContentProps {
  initialUrls: UrlDto[];
}

export default function MainContent({ initialUrls }: MainContentProps) {
  const [currentPage, setCurrentPage] = useState<'input' | 'admin'>('input');
  const { setUrls } = useUrlContext();

  // Initialize URLs with server-side data
  useEffect(() => {
    setUrls(initialUrls);
  }, [initialUrls, setUrls]);

  return (
    <Container maxWidth="lg">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Box component={Paper} sx={{ mt: 2, p: 2 }}>
        {currentPage === 'input' ? <UserInputMask /> : <AdminUrlTable />}
      </Box>
    </Container>
  );
} 