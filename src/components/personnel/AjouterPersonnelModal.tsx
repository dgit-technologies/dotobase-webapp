'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { api, toDisplayMessage } from '@/lib/api';
import type { RoleEtablissement, Specialite } from '@/lib/api/types';

interface AjouterPersonnelModalProps {
  open: boolean;
  onClose: () => void;
  etablissementId: string;
  specialites: Specialite[];
  onSuccess: () => void;
}

type ProfessionType = 'medecin' | 'infirmier';

export default function AjouterPersonnelModal({
  open,
  onClose,
  etablissementId,
  specialites,
  onSuccess,
}: AjouterPersonnelModalProps) {
  const [type, setType] = useState<ProfessionType>('medecin');
  const [creationMode, setCreationMode] = useState<'invitation' | 'password'>('invitation');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [npi, setNpi] = useState('');
  const [specialiteId, setSpecialiteId] = useState('');
  const [service, setService] = useState('');
  const [role, setRole] = useState<RoleEtablissement>('medecin');
  const [estPrincipal, setEstPrincipal] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (newType: ProfessionType) => {
    setType(newType);
    setRole(newType === 'medecin' ? 'medecin' : 'infirmier');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nom.trim() || !prenom.trim() || !telephone.trim()) {
      setError('Veuillez renseigner le nom, prénom et téléphone.');
      return;
    }

    if (creationMode === 'invitation' && !email.trim()) {
      setError('Une adresse email est obligatoire pour envoyer le lien d’activation.');
      return;
    }

    if (creationMode === 'password') {
      if (!password || password.length < 8) {
        setError('Le mot de passe provisoire doit comporter au moins 8 caractères.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (type === 'medecin') {
        const nouveauMedecin = await api.medecins.create({
          nom: nom.trim(),
          prenom: prenom.trim(),
          telephone: telephone.trim(),
          password: creationMode === 'password' ? password : undefined,
          email: email.trim() || undefined,
          npi: npi.trim() || undefined,
          specialite_id: specialiteId || undefined,
          etablissement_id: etablissementId,
        });

        // Le backend rattache automatiquement avec role: 'medecin'. Si un autre rôle (admin/directeur)
        // a été sélectionné, on met à jour le rattachement.
        if (role !== 'medecin' || !estPrincipal) {
          const affectations = await api.medecinEtablissements.list({
            medecin_id: nouveauMedecin.id,
            etablissement_id: etablissementId,
          });
          if (affectations[0]) {
            await api.medecinEtablissements.update(affectations[0].id, {
              role,
              est_principal: estPrincipal,
            });
          }
        }
      } else {
        const nouvelInfirmier = await api.infirmiers.create({
          nom: nom.trim(),
          prenom: prenom.trim(),
          telephone: telephone.trim(),
          password: creationMode === 'password' ? password : undefined,
          email: email.trim() || undefined,
          npi: npi.trim() || undefined,
          service: service.trim() || undefined,
          etablissement_id: etablissementId,
        });

        if (role !== 'infirmier' || !estPrincipal) {
          const affectations = await api.infirmierEtablissements.list({
            infirmier_id: nouvelInfirmier.id,
            etablissement_id: etablissementId,
          });
          if (affectations[0]) {
            await api.infirmierEtablissements.update(affectations[0].id, {
              role,
              est_principal: estPrincipal,
            });
          }
        }
      }

      toast.success(
        creationMode === 'invitation' ? 'Invitation envoyée' : 'Personnel ajouté',
        `${type === 'medecin' ? 'Dr.' : ''} ${prenom} ${nom} a été rattaché avec succès à votre établissement.`
      );

      // Reset form
      setNom('');
      setPrenom('');
      setTelephone('');
      setEmail('');
      setPassword('');
      setNpi('');
      setSpecialiteId('');
      setService('');
      setType('medecin');
      setRole('medecin');
      setEstPrincipal(true);

      onSuccess();
      onClose();
    } catch (err) {
      setError(toDisplayMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions =
    type === 'medecin'
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

  const specialiteOptions = specialites.map((s) => ({
    value: s.id,
    label: s.nom,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter un membre du personnel"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-[#FCEAEA] p-3 text-xs font-medium text-[#D14343]">
            {error}
          </div>
        )}

        {/* Sélection Profession */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6E7C91]">
            Corps de métier *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('medecin')}
              className={`flex items-center justify-center rounded-lg border p-2.5 text-sm font-medium transition-all ${
                type === 'medecin'
                  ? 'border-[#8BD2F2] bg-[#8BD2F2]/10 text-[#0E1B2A] font-semibold ring-2 ring-[#8BD2F2]/20'
                  : 'border-[#E3EDF7] bg-white text-[#6E7C91] hover:bg-slate-50'
              }`}
            >
              Médecin / Praticien
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('infirmier')}
              className={`flex items-center justify-center rounded-lg border p-2.5 text-sm font-medium transition-all ${
                type === 'infirmier'
                  ? 'border-[#8BD2F2] bg-[#8BD2F2]/10 text-[#0E1B2A] font-semibold ring-2 ring-[#8BD2F2]/20'
                  : 'border-[#E3EDF7] bg-white text-[#6E7C91] hover:bg-slate-50'
              }`}
            >
              Infirmier / Soignant
            </button>
          </div>
        </div>

        {/* Identité */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Prénom"
            required
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Ex: Koffi"
          />
          <Input
            label="Nom"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Mensah"
          />
        </div>

        {/* Mode d'activation */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#6E7C91]">
            Mode d&apos;accès initial *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCreationMode('invitation')}
              className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                creationMode === 'invitation'
                  ? 'border-[#8BD2F2] bg-[#8BD2F2]/10 ring-2 ring-[#8BD2F2]/20'
                  : 'border-[#E3EDF7] bg-white hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold text-[#0E1B2A]">Invitation par email</span>
              <span className="text-[11px] text-[#6E7C91]">Lien d&apos;activation envoyé au soignant</span>
            </button>
            <button
              type="button"
              onClick={() => setCreationMode('password')}
              className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                creationMode === 'password'
                  ? 'border-[#8BD2F2] bg-[#8BD2F2]/10 ring-2 ring-[#8BD2F2]/20'
                  : 'border-[#E3EDF7] bg-white hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold text-[#0E1B2A]">Mot de passe provisoire</span>
              <span className="text-[11px] text-[#6E7C91]">Défini manuellement par l&apos;admin</span>
            </button>
          </div>
        </div>

        {/* Coordonnées */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Téléphone (identifiant de connexion)"
            required
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="Ex: +2290161000000"
            helper="Utilisé pour se connecter à Dotobase"
          />
          <Input
            label="Adresse email"
            type="email"
            required={creationMode === 'invitation'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collaborateur@hopital.bj"
            helper={creationMode === 'invitation' ? "Obligatoire pour l'envoi du lien" : undefined}
          />
        </div>

        {creationMode === 'password' && (
          <div>
            <Input
              label="Mot de passe provisoire"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Au moins 8 caractères (lettres + chiffres)"
              helper="Le collaborateur pourra le modifier ultérieurement"
            />
          </div>
        )}

        <div>
          <Input
            label="NPI national"
            value={npi}
            onChange={(e) => setNpi(e.target.value)}
            placeholder="10 chiffres (optionnel)"
          />
        </div>

        {/* Spécialité ou Service */}
        {type === 'medecin' ? (
          <Select
            label="Spécialité médicale"
            placeholder="Sélectionnez une spécialité..."
            options={specialiteOptions}
            value={specialiteId}
            onChange={(e) => setSpecialiteId(e.target.value)}
          />
        ) : (
          <Input
            label="Service d'affectation"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Ex: Urgences, Pédiatrie, Maternité..."
          />
        )}

        {/* Rôle dans l'établissement */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-center pt-2 border-t border-[#E3EDF7]">
          <Select
            label="Rôle dans l'hôpital"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value as RoleEtablissement)}
          />

          <label className="flex items-center gap-2 pt-6 text-sm text-[#0E1B2A] cursor-pointer">
            <input
              type="checkbox"
              checked={estPrincipal}
              onChange={(e) => setEstPrincipal(e.target.checked)}
              className="h-4 w-4 rounded border-[#E3EDF7] text-[#8BD2F2] focus:ring-[#8BD2F2]"
            />
            <span>Établissement de rattachement principal</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E3EDF7]">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" loading={isLoading}>
            Ajouter au personnel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
