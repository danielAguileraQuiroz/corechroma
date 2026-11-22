"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LedCalculator from "@/components/calculator/LedCalculator";
import QuoteForm from "@/components/calculator/QuoteForm";
import { useWhatsAppConfig } from "@/context/WhatsAppContext";
import { LedSpec, ScreenCalculation } from "@/types/led";
import ScreenLivePreview from "@/components/calculator/ScreenLivePreview";

function ConfiguradorContent() {
    const searchParams = useSearchParams();
    const { setActiveConfig, clearActiveConfig } = useWhatsAppConfig();

    const initialParams = useMemo(() => {
        const tipo = searchParams.get("tipo") ?? "outdoor";
        const wRaw = Number(searchParams.get("w"));
        const hRaw = Number(searchParams.get("h"));

        return {
            tipo,
            widthM: Number.isFinite(wRaw) && wRaw > 0 ? wRaw : undefined,
            heightM: Number.isFinite(hRaw) && hRaw > 0 ? hRaw : undefined,
        };
    }, [searchParams]);

    const [selectedProduct, setSelectedProduct] = useState<LedSpec | null>(null);
    const [calculation, setCalculation] = useState<ScreenCalculation | null>(null);

    const handleCalculationChange = (spec: LedSpec, calcData: ScreenCalculation) => {
        setSelectedProduct(spec);
        setCalculation(calcData);
    };

    useEffect(() => {
        setActiveConfig({ spec: selectedProduct, calculation });
    }, [selectedProduct, calculation, setActiveConfig]);

    useEffect(() => {
        return () => {
            clearActiveConfig();
        };
    }, [clearActiveConfig]);

    const previewKey = `${selectedProduct?.id ?? "none"}-${calculation?.realWidthM ?? "defW"}-${calculation?.realHeightM ?? "defH"}`;

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#070b14] pb-24 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
            <header className="border-b border-white/10 bg-[#070b14]/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2.5 text-base font-black tracking-wider text-white">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                        <span>CORECHROMA</span>
                    </Link>

                    <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-slate-300">
                        <Link href="/" className="transition hover:text-cyan-400">
                            Inicio
                        </Link>
                        <span className="text-amber-300">Configurador</span>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                        Ingeniería y Presupuesto
                    </p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Configurador de Pantalla LED
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Ajusta dimensiones y serie para calcular cabinets y enviar tu solicitud de cotización.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                    <div className="space-y-6 lg:col-span-7">
                        <ScreenLivePreview
                            key={previewKey}
                            selectedSpec={selectedProduct}
                            calculation={calculation}
                        />
                        <LedCalculator
                            initialTipo={initialParams.tipo}
                            initialWidth={initialParams.widthM}
                            initialHeight={initialParams.heightM}
                            onCalculationChange={handleCalculationChange}
                        />
                    </div>

                    <div className="min-w-0 lg:col-span-5">
                        <QuoteForm selectedSpec={selectedProduct} calculation={calculation} />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function ConfiguradorPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-sm text-slate-400">
                    Cargando configurador...
                </div>
            }
        >
            <ConfiguradorContent />
        </Suspense>
    );
}