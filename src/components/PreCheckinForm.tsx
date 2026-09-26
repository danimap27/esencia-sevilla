'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserPlus, User, FileText, Clock, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuestData {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  documentExpiry: string;
  nationality: string;
  birthDate: string;
  estimatedArrivalTime: string;
  specialNeeds: string;
}

export default function PreCheckinForm({ bookingRef }: { bookingRef?: string }) {
  const t = useTranslations('guestPortal');
  const tCommon = useTranslations('common');
  const [guests, setGuests] = useState<GuestData[]>([
    {
      firstName: '', lastName: '', documentType: 'passport', documentNumber: '',
      documentExpiry: '', nationality: '', birthDate: '', estimatedArrivalTime: '', specialNeeds: '',
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const addGuest = () => {
    setGuests([...guests, {
      firstName: '', lastName: '', documentType: 'passport', documentNumber: '',
      documentExpiry: '', nationality: '', birthDate: '', estimatedArrivalTime: '', specialNeeds: '',
    }]);
  };

  const removeGuest = (idx: number) => {
    if (idx > 0) setGuests(guests.filter((_, i) => i !== idx));
  };

  const updateGuest = (idx: number, field: keyof GuestData, value: string) => {
    setGuests(guests.map((g, i) => i === idx ? { ...g, [field]: value } : g));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/pre-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingRef: bookingRef || 'demo', guests }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || tCommon('sendError'));
      }
    } catch {
      setError(tCommon('connectionError'));
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-terracota-100 shadow-lg text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-serif text-tinta mb-2">{t('preCheckin.done')}</h3>
        <p className="text-tinta/70 mb-4">
          {t('preCheckin.success')}
        </p>
        <p className="text-xs text-tinta/50 bg-crema rounded-xl p-3">
          {t('preCheckin.legalNote')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Legal notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-ocre-50 border border-ocre-100">
        <AlertCircle size={18} className="text-ocre-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-tinta/70">{t('preCheckin.legalNote')}</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Guest forms */}
      {guests.map((guest, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-tinta/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-tinta flex items-center gap-2">
              <User size={18} className="text-terracota-500" />
              {t('preCheckin.guestN', { n: idx + 1 })}
            </h3>
            {idx > 0 && (
              <button
                type="button"
                onClick={() => removeGuest(idx)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* First name */}
            <div>
              <label className="block text-sm font-medium text-tinta/70 mb-1.5">{t('preCheckin.firstName')}</label>
              <input
                type="text"
                required
                value={guest.firstName}
                onChange={e => updateGuest(idx, 'firstName', e.target.value)}
                className="input"
              />
            </div>

            {/* Last name */}
            <div>
              <label className="block text-sm font-medium text-tinta/70 mb-1.5">{t('preCheckin.lastName')}</label>
              <input
                type="text"
                required
                value={guest.lastName}
                onChange={e => updateGuest(idx, 'lastName', e.target.value)}
                className="input"
              />
            </div>

            {/* Document type */}
            <div>
              <label className="block text-sm font-medium text-tinta/70 mb-1.5">{t('preCheckin.documentType')}</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta/40" />
                <select
                  required
                  value={guest.documentType}
                  onChange={e => updateGuest(idx, 'documentType', e.target.value)}
                  className="input pl-10"
                >
                  <option value="passport">{t('preCheckin.passport')}</option>
                  <option value="dni">{t('preCheckin.dni')}</option>
                  <option value="nie">{t('preCheckin.nie')}</option>
                </select>
              </div>
            </div>

            {/* Document number */}
            <div>
              <label className="block text-sm font-medium text-tinta/70 mb-1.5">{t('preCheckin.documentNumber')}</label>
              <input
                type="text"
                required
                value={guest.documentNumber}
                onChange={e => updateGuest(idx, 'documentNumber', e.target.value)}
                className="input uppercase"
              />
            </div>

            {/* Document expiry */}
            <div>
              <label className="block text-sm font-medium text-tinta/70 mb-1.5">{t('preCheckin.documentExpiry')}</label>
              <input
                type="date"
                value={guest.documentExpiry}
                onChange={e => updateGuest(idx, 'documentExpiry', e.target.value)}
                className="input"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-tinta/70 mb-1.5">{t('preCheckin.nationality')}</label>
              <input
                type="text"
                required
                value={guest.nationality}
                onChange={e => updateGuest(idx, 'nationality', e.target.value)}
                className="input"
              />
            </div>

            {/* Birth date */}
            <div>
              <label className="block text-sm font-medium text-tinta/70 mb-1.5">{t('preCheckin.birthDate')}</label>
              <input
                type="date"
                value={guest.birthDate}
                onChange={e => updateGuest(idx, 'birthDate', e.target.value)}
                className="input"
              />
            </div>

            {/* Estimated arrival time (only for first guest) */}
            {idx === 0 && (
              <div>
                <label className="block text-sm font-medium text-tinta/70 mb-1.5">{t('preCheckin.arrivalTime')}</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tinta/40" />
                  <select
                    value={guest.estimatedArrivalTime}
                    onChange={e => updateGuest(idx, 'estimatedArrivalTime', e.target.value)}
                    className="input pl-10"
                  >
                    <option value="">--:--</option>
                    {Array.from({ length: 9 }, (_, i) => `${i + 13}:00`).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                    <option value="23:00+">23:00+</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Special requests (only for first guest) */}
          {idx === 0 && (
            <div>
              <label className="block text-sm font-medium text-tinta/70 mb-1.5">
                {t('preCheckin.specialRequests')}
              </label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-3 top-3 text-tinta/40" />
                <textarea
                  value={guest.specialNeeds}
                  onChange={e => updateGuest(idx, 'specialNeeds', e.target.value)}
                  rows={2}
                  className="input pl-10 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add guest button */}
      {guests.length < 4 && (
        <button
          type="button"
          onClick={addGuest}
          className="w-full p-4 rounded-2xl border-2 border-dashed border-tinta/20 hover:border-terracota-300 hover:bg-terracota-50/50 transition-colors text-tinta/60 hover:text-terracota-600 flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />
          {t('preCheckin.addGuest')}
        </button>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className={cn('btn-primary w-full py-4 text-base', submitting && 'opacity-50')}
      >
        {submitting ? tCommon('loading') : t('preCheckin.submit')}
      </button>
    </form>
  );
}