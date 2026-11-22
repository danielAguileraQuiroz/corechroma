'use client';

import React, { useState } from 'react';
import { LedSpec, OperationType, ScreenCalculation } from '@/types/led';

interface QuoteFormProps {
  selectedSpec: LedSpec | null;
  calculation: ScreenCalculation | null;
}

const WHATSAPP_PHONE = '34637122102'; // Sustituye por tu número con prefijo (sin '+' ni espacios)

export default function QuoteForm({ selectedSpec, calculation }: QuoteFormProps) {
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [operationType, setOperationType] = useState<OperationType>('BUY');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const whatsappUrl = (() => {
    const lines = [
      'Hola CoreChroma, quiero consultar esta configuración de pantalla LED:',
      `• Modelo: ${selectedSpec?.name ?? selectedSpec?.id ?? 'Sin seleccionar'}`,
      calculation
        ? `• Medidas reales: ${calculation.realWidthM}m × ${calculation.realHeightM}m (${calculation.totalAreaM2} m²)`
        : null,
      calculation ? `• Cabinets: ${calculation.totalCabinets} uds` : null,
      calculation
        ? `• Estimación: ${calculation.estimatedPriceEur.toLocaleString('es-ES')} €`
        : null,
      fullName ? `• Contacto: ${fullName}` : null,
      company ? `• Empresa: ${company}` : null,
    ].filter(Boolean);

    return `https://wa.me/${637122102}?text=${encodeURIComponent(lines.join('\n'))}`;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const now = new Date();
    const submittedDate = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(now);

    const submittedTime = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);

    const payload = {
      brand: 'CoreChroma',
      lead: {
        fullName,
        company,
        email,
        phone,
        operationType,
        notes,
      },
      product: selectedSpec,
      technicalCalculation: calculation,
      submittedAt: now.toISOString(),
      submittedDate,
      submittedTime,
      submittedDateTime: `${submittedDate} ${submittedTime}`,
    };

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_QUOTE_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error('Falta configurar NEXT_PUBLIC_N8N_QUOTE_WEBHOOK_URL');
      }

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Error al enviar solicitud');
      }

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-200 lg:p-8">
        <h3 className="text-xl font-bold">¡Solicitud enviada a CoreChroma!</h3>
        <p className="text-sm text-emerald-300/90">
          Hemos registrado tu configuración técnica ({calculation?.totalAreaM2 ?? 0} m² ·{' '}
          {calculation?.totalCabinets ?? 0} cabinets). Te contactaremos en breve con la propuesta detallada.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-100 transition hover:bg-emerald-500/30"
        >
          Continuar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-white/10 bg-slate-900/90 p-6 lg:p-8"
    >
      <div className="border-b border-white/10 pb-3">
        <h3 className="text-xl font-bold text-white">Solicitar Cotización Personalizada</h3>
        <p className="mt-1 text-xs text-slate-400">
          Incluye automáticamente los parámetros calculados de tu pantalla LED.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Nombre y apellidos"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"
        />
        <input
          type="text"
          placeholder="Empresa / Negocio"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="email"
          required
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"
        />
        <input
          type="tel"
          required
          placeholder="Teléfono de contacto"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value as OperationType)}
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"
        >
          <option value="BUY">Compra / Instalación fija</option>
          <option value="RENT">Alquiler / Evento</option>
        </select>
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-slate-300">
          <span>Configuración adjunta:</span>
          <span className="font-mono tabular-nums text-cyan-400">
            {calculation ? `${calculation.totalAreaM2} m² (${calculation.totalCabinets} cab.)` : 'Pendiente'}
          </span>
        </div>
      </div>

      <textarea
        rows={3}
        placeholder="Ubicación de instalación, tipo de estructura, fecha estimada..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"
      />

      {status === 'error' && (
        <p className="text-xs text-rose-400">
          No se pudo enviar la solicitud. Revisa la URL del webhook en `.env.local` o inténtalo de nuevo.
        </p>
      )}

      <div className="space-y-2.5 pt-1">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 py-3 text-sm font-extrabold text-slate-950 transition hover:opacity-95 disabled:opacity-50"
        >
          {status === 'loading' ? 'ENVIANDO SOLICITUD...' : 'ENVIAR COTIZACIÓN TÉCNICA'}
        </button>


      </div>
    </form>
  );
}