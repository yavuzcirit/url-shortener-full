import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress, Container } from '@mui/material';

// Server component to fetch initial data
async function getInitialUrls() {
  const response = await fetch('https://urlshortener.smef.io/urls', {
    headers: {
      'Authorization': 'Basic ' + Buffer.from('abat:5hWDEcFK4FUW').toString('base64'),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch URLs');
  }

  return response.json();
}

const DynamicMainContent = dynamic(
  () => import('@/components/MainContent'),
  {
    ssr: true,
    loading: () => (
      <Container sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Container>
    ),
  }
);

export default async function Home() {
  const initialUrls = await getInitialUrls();

  return (
    <Suspense fallback={<CircularProgress />}>
      <DynamicMainContent initialUrls={initialUrls} />
    </Suspense>
  );
}
