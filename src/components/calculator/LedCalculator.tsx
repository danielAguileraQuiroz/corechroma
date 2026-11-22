'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { LED_MODELS } from '@/lib/ledCatalog';
import { calculateLedScreen } from '@/lib/ledMath';
import { LedSpec, ScreenCalculation } from '@/types/led';

interface LedCalculatorProps {
    initialTipo?: string;
    initialWidth?: number;
    initialHeight?: number;
    onCalculationChange?: (spec: LedSpec, calc: ScreenCalculation) => void;
}

export default function LedCalculator({
    initialTipo,
    initialWidth,
    initialHeight,
    onCalculationChange,
}: LedCalculatorProps) {
    const matchedModel = useMemo(() => {
        if (!initialTipo) return LED_MODELS[1] ?? LED_MODELS[0];
        const lower = initialTipo.toLowerCase();
        return (
            LED_MODELS.find(
                (m) =>
                    m.id.toLowerCase().includes(lower) ||
                    m.name?.toLowerCase().includes(lower)
            ) ??
            LED_MODELS[1] ??
            LED_MODELS[0]
        );
    }, [initialTipo]);

    const [selectedId, setSelectedId] = useState<string>(matchedModel.id);
    const [widthM, setWidthM] = useState<number>(initialWidth ?? 6);
    const [heightM, setHeightM] = useState<number>(initialHeight ?? 3);

    const selectedSpec = useMemo(
        () => LED_MODELS.find((m) => m.id === selectedId) ?? LED_MODELS[0],
        [selectedId]
    );

    const calc = useMemo(
        () => calculateLedScreen(widthM, heightM, selectedSpec),
        [widthM, heightM, selectedSpec]
    );

    useEffect(() => {
        onCalculationChange?.(selectedSpec, calc);
    }, [selectedSpec, calc, onCalculationChange]);

    return (
        <div className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                        Especificación Técnica
                    </span>
                    <h2 className="mt-1 text-xl font-bold text-white">
                        {selectedSpec.name ?? selectedSpec.id}
                    </h2>
                </div>
                <span className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {selectedSpec.id}
                </span>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Modelo / Serie
                </label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {LED_MODELS.map((model) => {
                        const active = model.id === selectedId;
                        return (
                            <button
                                key={model.id}
                                type="button"
                                onClick={() => setSelectedId(model.id)}
                                className={`rounded-xl border px-4 py-3 text-left text-xs font-bold transition ${active
                                        ? 'border-cyan-400 bg-cyan-400/15 text-white'
                                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
                                    }`}
                            >
                                {model.name ?? model.id}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#070b14]/70 p-4">
                    <label
                        htmlFor="led-width"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                    >
                        Ancho deseado (m)
                    </label>
                    <input
                        id="led-width"
                        type="number"
                        min={0.5}
                        step={0.25}
                        value={widthM}
                        onChange={(e) => setWidthM(Math.max(0.5, Number(e.target.value) || 0.5))}
                        className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-base font-bold text-white focus:border-cyan-400 focus:outline-none"
                    />
                </div>

                <div className="rounded-xl border border-white/10 bg-[#070b14]/70 p-4">
                    <label
                        htmlFor="led-height"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-400"
                    >
                        Alto deseado (m)
                    </label>
                    <input
                        id="led-height"
                        type="number"
                        min={0.5}
                        step={0.25}
                        value={heightM}
                        onChange={(e) => setHeightM(Math.max(0.5, Number(e.target.value) || 0.5))}
                        className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-base font-bold text-white focus:border-cyan-400 focus:outline-none"
                    />
                </div>
            </div>

            <div className="grid gap-3 rounded-xl border border-white/10 bg-[#070b14]/80 p-4 sm:grid-cols-3">
                <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Medidas Reales
                    </span>
                    <p className="mt-1 text-base font-black text-white">
                        {calc.realWidthM}m × {calc.realHeightM}m
                    </p>
                </div>
                <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Cabinets
                    </span>
                    <p className="mt-1 text-base font-black text-cyan-300">
                        {calc.totalCabinets} uds
                    </p>
                </div>
                <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Estimación
                    </span>
                    <p className="mt-1 text-base font-black text-amber-300">
                        {calc.estimatedPriceEur.toLocaleString('es-ES')} €
                    </p>
                </div>
            </div>
        </div>
    );
}