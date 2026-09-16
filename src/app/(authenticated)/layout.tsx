'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Spinner from '@/components/ui/spinner';
import { api } from '@/lib/api';
import { useAuth, libelleRole, nomAffiche } from '@/lib/hooks/use-auth';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    user,
    role,
    isEtablissementAdmin,
    etablissementActif,
    etablissements = [],
    changerEtablissementActif,
    signOut,
    isLoading,
    isAuthenticated,
  } = useAuth();
  const [notificationsNonLues, setNotificationsNonLues] = useState(0);

  // Redirection automatique vers /login si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        clinicName={etablissementActif?.nom}
        clinicType={etablissementActif?.ville}
        userRole={role}
        isEtablissementAdmin={isEtablissementAdmin}
        onLogout={signOut}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          doctorName={nomAffiche(user)}
          doctorRole={libelleRole(role)}
          notificationCount={notificationsNonLues}
          currentHospital={etablissementActif?.nom}
          currentHospitalId={etablissementActif?.id}
          hospitals={etablissements.map((e) => ({
            id: e.id,
            nom: e.nom,
            ville: e.ville,
          }))}
          onSelectHospital={(hospitalId) => {
            const chosen = etablissements.find((e) => e.id === hospitalId);
            if (chosen && changerEtablissementActif) {
              changerEtablissementActif(chosen);
            }
          }}
        />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
