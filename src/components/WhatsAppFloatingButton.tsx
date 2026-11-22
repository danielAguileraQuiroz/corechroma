'use client';

import React from 'react';
import { useWhatsAppConfig } from '@/context/WhatsAppContext';

const WHATSAPP_PHONE = '34600000000'; // Sustituye por tu número con prefijo (sin '+' ni espacios)

export default function WhatsAppFloatingButton() {
  const { activeConfig } = useWhatsAppConfig();

  const buildWhatsAppUrl = () => {
    const spec = activeConfig?.spec ?? null;
    const calc = activeConfig?.calculation ?? null;

    if (!spec && !calc) {
      const defaultMsg =
        'Hola CoreChroma, necesito información sobre pantallas LED y cotizaciones.';
      return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(defaultMsg)}`;
    }

    const lines = [
      'Hola CoreChroma, quiero consultar esta configuración de pantalla LED:',
      spec ? `• Modelo: ${spec.name ?? spec.id}` : null,
      calc
        ? `• Medidas reales: ${calc.realWidthM}m × ${calc.realHeightM}m (${calc.totalAreaM2} m²)`
        : null,
      calc ? `• Cabinets: ${calc.totalCabinets} uds` : null,
      calc
        ? `• Estimación: ${calc.estimatedPriceEur.toLocaleString('es-ES')} €`
        : null,
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp con CoreChroma"
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-[#18b86c] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-lg shadow-emerald-950/50 transition hover:scale-[1.02] hover:bg-[#20cc7a] active:scale-[0.99]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-current"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.02c-.24.68-1.41 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.37-.15-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.01-2.42.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.24.58.83 2.02.9 2.17.07.15.12.32.02.52-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.66-.14.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.12.07.7-.17 1.38z" />
      </svg>
      <span>WHATSAPP</span>
    </a>
  );
}