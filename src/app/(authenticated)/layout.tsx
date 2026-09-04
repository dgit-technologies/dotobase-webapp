'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { api } from '@/lib/api';
import { useAuth, libelleRole, nomAffiche } from '@/lib/hooks/use-auth';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, role, etablissementActif, signOut } = useAuth();
  const [notificationsNonLues, setNotificationsNonLues] = useState(0);

  // Les notifications sont indexées par medecin_id (admin et directeur
  // partagent la table medecins) — rien à charger pour un infirmier.
  useEffect(() => {
    if (!user || user.type === 'infirmier' || user.type === 'patient') return;

    let cancelled = false;

    api.notifications
      .list({ medecin_id: user.id })
      .then((liste) => {
        if (!cancelled) {
          setNotificationsNonLues(liste.filter((item) => !item.est_lue).length);
        }
      })
      .catch(() => {
        // Compteur non critique : on laisse la cloche à zéro.
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        clinicName={etablissementActif?.nom}
        clinicType={etablissementActif?.ville}
        onLogout={signOut}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          doctorName={nomAffiche(user)}
          doctorRole={libelleRole(role)}
          notificationCount={notificationsNonLues}
        />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
