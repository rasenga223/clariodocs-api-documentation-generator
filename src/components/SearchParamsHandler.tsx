'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  // This component doesn't render anything visible
  return null;
}