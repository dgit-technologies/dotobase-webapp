'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { api, toDisplayMessage } from '@/lib/api';
import type { RoleEtablissement } from '@/lib/api/types';
import { AlertTriangle, Trash2 } from 'lucide-react';

export interface StaffMemberItem {
  id: string;
  affectationId: string;
  type: 'medecin' | 'infirmier';
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  npi?: string;
  specialite?: string;
  service?: string;
  role: RoleEtablissement;
  estPrincipal: boolean;
  createdAt: string;
}

interface ModifierPersonnelModalProps {
  open: boolean;
  onClose: () => void;
  member: StaffMemberItem | null;
  onSuccess: () => void;
}

export default function ModifierPersonnelModal({
  open,
  onClose,
  member,
  onSuccess,
}: ModifierPersonnelModalProps) {
  const [role, setRole] = useState<RoleEtablissement>('medecin');
  const [estPrincipal, setEstPrincipal] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setRole(member.role);
      setEstPrincipal(member.estPrincipal);
      setConfirmRevoke(false);
      setError(null);
    }
  }, [member]);

  if (!member) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (member.type === 'medecin') {
        await api.medecinEtablissements.update(member.affectationId, {
          role,
          est_principal: estPrincipal,
        });
      } else {
        await api.infirmierEtablissements.update(member.affectationId, {
          role,
          est_principal: estPrincipal,
        });
      }

      toast.success(
        'Modifications enregistrées',
        `Le rôle de ${member.prenom} ${member.nom} a été mis à jour.`
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(toDisplayMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    setError(null);
    setIsRevoking(true);

    try {
      if (member.type === 'medecin') {
        await api.medecinEtablissements.remove(member.affectationId);
      } else {
        await api.infirmierEtablissements.remove(member.affectationId);
      }

      toast.success(
        'Accès retiré',
        `${member.prenom} ${member.nom} a été retiré de votre établissement.`
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(toDisplayMessage(err));
    } finally {
      setIsRevoking(false);
    }
  };

  const roleOptions =
    member.type === 'medecin'
      ? [
          { value: 'medecin', label: 'Médecin soignant' },
          { value: 'admin', label: 'Administrateur d’établissement' },
          { value: 'directeur', label: 'Directeur d’établissement' },
        ]
      : [
          { value: 'infirmier', label: 'Infirmier soignant' },
          { value: 'admin', label: 'Administrateur d’établissement' },
          { value: 'directeur', label: 'Directeur d’établissement' },
        ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gérer le membre du personnel"
      size="md"
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-lg bg-[#FCEAEA] p-3 text-xs font-medium text-[#D14343]">
            {error}
          </div>
        )}

        {/* Info collaborateur */}
        <div className="rounded-xl border border-[#E3EDF7] bg-[#FAFCFF] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0E1B2A]">
                {member.type === 'medecin' ? 'Dr. ' : ''}
                {member.prenom} {member.nom}
              </p>
              <p className="text-xs text-[#6E7C91]">
                {member.type === 'medecin' ? 'Médecin' : 'Infirmier'}
                {member.specialite ? ` • Spécialité : ${member.specialite}` : ''}
                {member.service ? ` • Service : ${member.service}` : ''}
              </p>
            </div>
            <span className="rounded-md bg-[#8BD2F2]/20 px-2.5 py-1 text-xs font-semibold text-[#0E1B2A]">
              {member.role === 'admin'
                ? 'Admin hôpital'
                : member.role === 'directeur'
                ? 'Directeur'
                : 'Praticien'}
            </span>
          </div>

          {member.telephone && (
            <p className="mt-2 text-xs text-[#6E7C91]">
              <span className="font-medium text-[#0E1B2A]">Téléphone :</span> {member.telephone}
            </p>
          )}
        </div>

        {/* Formulaire de modification */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <Select
            label="Rôle dans votre établissement"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value as RoleEtablissement)}
          />

          <label className="flex items-center gap-2 text-sm text-[#0E1B2A] cursor-pointer">
            <input
              type="checkbox"
              checked={estPrincipal}
              onChange={(e) => setEstPrincipal(e.target.checked)}
              className="h-4 w-4 rounded border-[#E3EDF7] text-[#8BD2F2] focus:ring-[#8BD2F2]"
            />
            <span>Établissement principal</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading || isRevoking}
            >
              Fermer
            </Button>
            <Button type="submit" loading={isLoading} disabled={isRevoking}>
              Enregistrer
            </Button>
          </div>
        </form>

        {/* Zone de retrait / révocation */}
        <div className="border-t border-[#E3EDF7] pt-4">
          {!confirmRevoke ? (
            <button
              type="button"
              onClick={() => setConfirmRevoke(true)}
              className="flex items-center gap-2 text-xs font-semibold text-[#D14343] hover:underline"
            >
              <Trash2 size={14} />
              Retirer ce collaborateur de l’établissement
            </button>
          ) : (
            <div className="rounded-lg border border-[#FCEAEA] bg-[#FFF5F5] p-3">
              <div className="flex items-start gap-2 text-xs text-[#D14343]">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Confirmer le retrait ?</p>
                  <p className="text-[11px] text-[#A63030]">
                    Ce collaborateur ne sera plus rattaché à votre établissement et perdra ses accès associés.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmRevoke(false)}
                  disabled={isRevoking}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleRevoke}
                  loading={isRevoking}
                >
                  Confirmer le retrait
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
