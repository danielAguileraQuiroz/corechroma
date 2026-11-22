'use client';

import React from 'react';
import { LedSpec, ScreenCalculation } from '@/types/led';

interface ScreenLivePreviewProps {
  selectedSpec: LedSpec | null;
  calculation: ScreenCalculation | null;
}

function formatDimension(val: number): string {
  return Number.isInteger(val) ? val.toFixed(0) : val.toFixed(2).replace(/\.?0+$/, '');
}

export default function ScreenLivePreview({
  selectedSpec,
  calculation,
}: ScreenLivePreviewProps) {
  const realW = calculation?.realWidthM ?? 5.76;
  const realH = calculation?.realHeightM ?? 2.88;
  const cabinets = calculation?.totalCabinets ?? 18;
  const area = calculation?.totalAreaM2 ?? 16.59;

  const maxBoxW = 280;
  const maxBoxH = 150;
  const safeW = Math.max(realW, 0.5);
  const safeH = Math.max(realH, 0.5);
  const scale = Math.min(maxBoxW / safeW, maxBoxH / safeH);

  const boxWidthPx = Math.max(76, Math.round(safeW * scale));
  const boxHeightPx = Math.max(54, Math.round(safeH * scale));

  const formattedArea =
    typeof area === 'number' ? area.toFixed(2) : Number(area).toFixed(2);

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          <span className="font-bold uppercase tracking-wider text-slate-300">
            Simulación en vivo
          </span>
          {selectedSpec?.name && (
            <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[11px] text-cyan-300">
              {selectedSpec.name}
            </span>
          )}
        </div>

        <span className="font-mono text-[11px] tabular-nums text-slate-400">
          {formatDimension(realW)}m × {formatDimension(realH)}m · {formattedArea} m² · {cabinets} cab.
        </span>
      </div>

      <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-white/5 bg-[#04070e] p-4">
        <div
          style={{
            width: `${boxWidthPx}px`,
            height: `${boxHeightPx}px`,
          }}
          className="flex flex-col items-center justify-center rounded-lg border border-cyan-400/60 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-amber-400/15 px-3 text-center shadow-[0_0_28px_rgba(34,211,238,0.14)] transition-all duration-300 ease-out"
        >
          <span className="text-sm font-black tabular-nums text-white sm:text-base">
            {formatDimension(realW)}m × {formatDimension(realH)}m
          </span>
          <span className="text-xs font-semibold tabular-nums text-cyan-300">
            {formattedArea} m² aprox.
          </span>
        </div>
      </div>
    </div>
  );
}