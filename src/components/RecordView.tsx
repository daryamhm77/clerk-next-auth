'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface RecordViewProps {
  movieId: string;
  title: string;
  image: string;
  year: string;
}

export default function RecordView({ movieId, title, image, year }: RecordViewProps) {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    fetch('/api/user/recently-viewed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, title, image, year }),
    }).catch(() => {});
  }, [movieId, title, image, year, isLoaded, isSignedIn]);

  return null;
}
