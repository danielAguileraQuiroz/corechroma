'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Preset {
    id: string;
    label: string;
    tipo: string;
    widthM: number;
    heightM: number;
    pitchLabel: string;
    tag: string;
}

const PRESETS: Preset[] = [
    {
        id: 'outdoor',
        label: 'Outdoor Max',
        tipo: 'outdoor',
        widthM: 6,
        heightM: 3,
        pitchLabel: 'P6 · IP65 Alto brillo',
        tag: 'Fachadas y gran formato',
    },
    {
        id: 'indoor',
        label: 'Indoor Pro',
        tipo: 'indoor',
        widthM: 4,
        heightM: 2.25,
        pitchLabel: 'P2.6 · Alta definición',
        tag: 'Retail, salas y control',
    },
    {
        id: 'glass',
        label: 'Glass View',
        tipo: 'glass',
        widthM: 5,
        heightM: 2.5,
        pitchLabel: 'P3.9 · Transparente',
        tag: 'Escaparates y arquitectura',
    },
    {
        id: 'stage',
        label: 'Stage Rental',
        tipo: 'stage',
        widthM: 7,
        heightM: 3.5,
        pitchLabel: 'P3.91 · Montaje rápido',
        tag: 'Eventos, conciertos y ferias',
    },
];

export default function HomeStageMotion() {
    const [selected, setSelected] = useState<Preset>(PRESETS[0]);
    const [scaleFactor, setScaleFactor] = useState<number>(1);

    const effectiveW = Number((selected.widthM * scaleFactor).toFixed(2));
    const effectiveH = Number((selected.heightM * scaleFactor).toFixed(2));
    const areaM2 = Number((effectiveW * effectiveH).toFixed(2));

    const cols = Math.min(Math.max(Math.round(effectiveW * 1.4), 3), 14);
    const rows = Math.min(Math.max(Math.round(effectiveH * 1.4), 2), 8);
    const totalCells = cols * rows;

    const configuratorHref = `/configurador?tipo=${encodeURIComponent(
        selected.tipo
    )}&w=${effectiveW}&h=${effectiveH}`;

    return (
        <section className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid gap-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
                <div className="space-y-5 lg:col-span-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 motion-reduce:hidden" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                        </span>
                        <span>Vista interactiva</span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                            Prueba una serie antes de configurar
                        </h2>
                        <p className="text-sm text-slate-400">
                            Cambia de serie o escala rápida y pasa directo al cálculo exacto de cabinets y presupuesto.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {PRESETS.map((preset) => {
                            const active = preset.id === selected.id;
                            return (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => {
                                        setSelected(preset);
                                        setScaleFactor(1);
                                    }}
                                    className={`rounded-xl border px-3.5 py-2.5 text-left transition ${active
                                            ? 'border-cyan-400 bg-cyan-500/15 text-white'
                                            : 'border-white/10 bg-slate-950/80 text-slate-300 hover:border-white/25'
                                        }`}
                                >
                                    <div className="text-xs font-extrabold">{preset.label}</div>
                                    <div className="mt-0.5 text-[11px] text-slate-400">{preset.pitchLabel}</div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Escala de prueba</span>
                            <span className="font-mono tabular-nums text-cyan-300">
                                {effectiveW}m × {effectiveH}m ({areaM2} m²)
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Compacta (0.8×)', val: 0.8 },
                                { label: 'Estándar (1×)', val: 1 },
                                { label: 'Gran formato (1.2×)', val: 1.2 },
                            ].map((opt) => (
                                <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => setScaleFactor(opt.val)}
                                    className={`rounded-lg border py-1.5 text-[11px] font-semibold transition ${scaleFactor === opt.val
                                            ? 'border-teal-400/60 bg-teal-400/15 text-teal-200'
                                            : 'border-white/10 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-1">
                        <Link
                            href={configuratorHref}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-950 transition hover:opacity-95"
                        >
                            Abrir en Configurador Técnico
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="rounded-xl border border-white/10 bg-[#04070e] p-5">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-slate-300">{selected.tag}</span>
                            <span className="font-mono text-[11px] tabular-nums text-cyan-400">
                                {selected.pitchLabel}
                            </span>
                        </div>

                        <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-white/5 bg-slate-950/70 p-4">
                            <div
                                style={{
                                    aspectRatio: `${Math.max(effectiveW, 0.5)} / ${Math.max(effectiveH, 0.5)}`,
                                }}
                                className="relative max-h-[185px] max-w-full overflow-hidden rounded border border-cyan-400/40 bg-slate-900 shadow-[0_0_35px_rgba(34,211,238,0.14)] transition-all duration-300 ease-out"
                            >
                                <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent animate-[pulse_3.5s_ease-in-out_infinite] motion-reduce:hidden" />

                                <div
                                    style={{
                                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                                        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                                    }}
                                    className="grid h-full w-full gap-[2px] p-[2px]"
                                >
                                    {Array.from({ length: totalCells }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-[1px] bg-cyan-400/15 ring-1 ring-inset ring-cyan-300/20 transition-colors duration-300 hover:bg-cyan-400/40"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}