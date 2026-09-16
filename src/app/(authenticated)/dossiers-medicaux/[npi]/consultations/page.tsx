'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PatientConsultationsRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const npi = params?.npi as string | undefined;

  useEffect(() => {
    if (npi) {
      router.replace(`/patients/${npi}`);
    } else {
      router.replace('/consultations');
    }
  }, [npi, router]);

  return null;
}
