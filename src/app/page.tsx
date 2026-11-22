"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type SolutionKey = "indoor" | "outdoor" | "transparent" | "rental";

interface SolutionConfig {
  id: SolutionKey;
  label: string;
  tag: string;
  title: string;
  description: string;
  pitch: string;
  nits: string;
  defaultW: number;
  defaultH: number;
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
  step: number;
}

const SOLUTIONS: SolutionConfig[] = [
  {
    id: "indoor",
    label: "Interior & Retail",
    tag: "FINE PITCH · ALTA RESOLUCIÓN",
    title: "Nitidez a corta distancia para retail, corporate y salas de control.",
    description:
      "Imágenes limpias, transiciones suaves y mantenimiento frontal pensados para espacios interiores donde el público está cerca de la pantalla.",
    pitch: "P1.25 – P2.5 mm",
    nits: "800 – 1.200 nits",
    defaultW: 4,
    defaultH: 2.25,
    minW: 1.5,
    maxW: 12,
    minH: 1,
    maxH: 6,
    step: 0.25,
  },
  {
    id: "outdoor",
    label: "Exterior & Gran Formato",
    tag: "IP65 · VISIBILIDAD SOLAR",
    title: "Presencia continua bajo sol directo en fachadas, comercios y vía pública.",
    description:
      "Cabinets preparados para intemperie, alto contraste diurno y fiabilidad sostenida durante jornadas largas de operación.",
    pitch: "P4 – P10 mm",
    nits: "5.500 – 8.000 nits",
    defaultW: 6,
    defaultH: 3,
    minW: 2,
    maxW: 18,
    minH: 1.5,
    maxH: 9,
    step: 0.5,
  },
  {
    id: "transparent",
    label: "Malla Transparente",
    tag: "ARQUITECTURA · LUZ NATURAL",
    title: "Impacto visual en escaparates y fachadas sin bloquear la luz natural.",
    description:
      "Estructura ligera y abierta que conserva la visibilidad hacia el interior y aporta dinamismo arquitectónico.",
    pitch: "P3.91 – P10.4 mm",
    nits: "4.500 – 5.500 nits",
    defaultW: 5,
    defaultH: 3,
    minW: 2,
    maxW: 14,
    minH: 1.5,
    maxH: 8,
    step: 0.5,
  },
  {
    id: "rental",
    label: "Rental & Eventos",
    tag: "MONTAJE RÁPIDO · ESCENARIO",
    title: "Configuraciones modulares ágiles para eventos, ferias y directos.",
    description:
      "Diseñadas para montajes rápidos, transporte seguro y respuesta limpia frente a cámaras y focos.",
    pitch: "P2.6 – P4.8 mm",
    nits: "1.500 – 5.000 nits",
    defaultW: 7,
    defaultH: 4,
    minW: 3,
    maxW: 20,
    minH: 2,
    maxH: 10,
    step: 0.5,
  },
];
const VIEW_DISTANCE: Record<SolutionKey, string> = {
  indoor: "Desde ~1,5 m – 3 m (corta distancia)",
  outdoor: "Desde ~5 m – 15 m (fachada / vía pública)",
  transparent: "Desde ~4 m – 12 m (escaparate / fachada)",
  rental: "Desde ~3 m – 10 m (escenario / feria)",
};
const USE_CASES = [
  {
    title: "Fachada comercial o cartel exterior",
    detail: "Alto brillo para competir con la luz del día y resistencia a la intemperie.",
    href: "/configurador?tipo=outdoor&w=6&h=3",
    cta: "Configurar Exterior",
  },
  {
    title: "Escaparate con luz natural",
    detail: "Mantiene visibilidad interior y paso de luz sin perder impacto visual.",
    href: "/configurador?tipo=transparent&w=5&h=3",
    cta: "Configurar Malla",
  },
  {
    title: "Evento, congreso o escenario puntual",
    detail: "Formato modular pensado para montaje ágil y uso temporal.",
    href: "/configurador?tipo=rental&w=7&h=4",
    cta: "Configurar Rental",
  },
];
function formatDimension(val: number): string {
  return Number.isInteger(val) ? val.toFixed(0) : val.toFixed(2).replace(/\.?0+$/, "");
}

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<SolutionKey>("outdoor");
  const activeSolution = useMemo(
    () => SOLUTIONS.find((s) => s.id === selectedId) ?? SOLUTIONS[1],
    [selectedId]
  );

  const [widthM, setWidthM] = useState<number>(activeSolution.defaultW);
  const [heightM, setHeightM] = useState<number>(activeSolution.defaultH);

  const handleSelectSolution = (nextId: SolutionKey) => {
    const found = SOLUTIONS.find((s) => s.id === nextId);
    setSelectedId(nextId);
    if (found) {
      setWidthM(found.defaultW);
      setHeightM(found.defaultH);
    }
  };

  const updateWidth = (delta: number) => {
    setWidthM((prev) => {
      const next = Math.min(
        activeSolution.maxW,
        Math.max(activeSolution.minW, Number((prev + delta).toFixed(2)))
      );
      return next;
    });
  };

  const updateHeight = (delta: number) => {
    setHeightM((prev) => {
      const next = Math.min(
        activeSolution.maxH,
        Math.max(activeSolution.minH, Number((prev + delta).toFixed(2)))
      );
      return next;
    });
  };

  const areaM2 = (widthM * heightM).toFixed(2);
  const aspectRatioLabel = `${(widthM / heightM).toFixed(2)}:1`;

  const ratio = widthM / heightM;
  const previewStyle: React.CSSProperties =
    ratio >= 1.6
      ? { width: "100%", height: `${Math.max(44, Math.min(130, 130 / ratio))}px` }
      : { height: "120px", width: `${Math.max(52, Math.min(240, 120 * ratio))}px` };

  const configuratorHref = `/configurador?tipo=${activeSolution.id}&w=${widthM}&h=${heightM}`;

  return (
    <main className="min-h-screen bg-[#070b14] pb-24 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b14]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 text-base font-black tracking-wider text-white sm:text-lg">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span>CORECHROMA</span>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-widest text-slate-300 md:flex">
            <a href="#simulador" className="transition hover:text-cyan-400">
              Simulador
            </a>
            <a href="#proceso" className="transition hover:text-cyan-400">
              Flujo
            </a>
            <Link href="/configurador" className="transition hover:text-cyan-400">
              Configurador
            </Link>
          </nav>

          <Link
            href="/configurador"
            className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-950 transition hover:bg-amber-300"
          >
            Pedir Cotización
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 lg:pb-20 lg:pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300">
            <span>{activeSolution.tag}</span>
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Pantallas LED diseñadas a medida de tu espacio.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {activeSolution.title} Explora dimensiones y entornos aquí mismo y pasa al
            configurador técnico para obtener cálculo de cabinets y solicitar presupuesto al instante.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href={configuratorHref}
              className="rounded-xl bg-amber-400 px-6 py-3.5 text-xs font-extrabold uppercase tracking-widest text-slate-950 transition hover:bg-amber-300"
            >
              Configurar {formatDimension(widthM)}m × {formatDimension(heightM)}m
            </Link>

            <a
              href="#simulador"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              Probar Medidas Rápidas
            </a>
          </div>
        </div>

        {/* Bottom Telemetry Strip */}
        <div className="border-t border-white/10 bg-black/35">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2 text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Cálculo Técnico en Vivo · Registro Directo de Solicitudes</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{activeSolution.pitch}</span>
              <span className="text-white/20">•</span>
              <span>{activeSolution.nits}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pre-Configurator / Simulator */}
      <section id="simulador" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Explorador Interactivo
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ajusta el entorno y la escala inicial
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {SOLUTIONS.map((sol) => {
              const isSelected = sol.id === selectedId;
              return (
                <button
                  key={sol.id}
                  type="button"
                  onClick={() => handleSelectSolution(sol.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition ${isSelected
                      ? "bg-cyan-400 text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white"
                    }`}
                >
                  {sol.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-8 rounded-2xl border border-white/10 bg-slate-900/65 p-6 sm:p-8 lg:grid-cols-12">
          {/* Controls */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                {activeSolution.label}
              </span>
              <h3 className="mt-1.5 text-xl font-bold text-white">{activeSolution.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {activeSolution.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Width Control */}
              <div className="rounded-xl border border-white/10 bg-[#070b14]/70 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Ancho</span>
                  <span>
                    {activeSolution.minW}m – {activeSolution.maxW}m
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => updateWidth(-activeSolution.step)}
                    aria-label="Reducir ancho"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-base font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black text-white">
                    {formatDimension(widthM)}{" "}
                    <span className="text-sm font-semibold text-cyan-300">m</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => updateWidth(activeSolution.step)}
                    aria-label="Aumentar ancho"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-base font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Height Control */}
              <div className="rounded-xl border border-white/10 bg-[#070b14]/70 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Alto</span>
                  <span>
                    {activeSolution.minH}m – {activeSolution.maxH}m
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => updateHeight(-activeSolution.step)}
                    aria-label="Reducir alto"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-base font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black text-white">
                    {formatDimension(heightM)}{" "}
                    <span className="text-sm font-semibold text-cyan-300">m</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => updateHeight(activeSolution.step)}
                    aria-label="Aumentar alto"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-base font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#070b14]/50 px-4 py-3 text-xs text-slate-300">
              <span className="font-bold uppercase tracking-wider text-cyan-400">
                Distancia de visión orientativa:{" "}
              </span>
              <span className="font-mono tabular-nums text-white">
                {VIEW_DISTANCE[activeSolution.id]}
              </span>
            </div>
          </div>

          {/* Live Proportion Stage */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#070b14]/80 p-6 lg:col-span-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-widest text-cyan-400">
                Vista Proporcional
              </span>
              <span className="font-semibold text-slate-300">Ratio {aspectRatioLabel}</span>
            </div>

            <div className="my-6 flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-slate-950/60 p-4">
              <div
                style={previewStyle}
                className="flex flex-col items-center justify-center rounded-lg border border-cyan-400/60 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-amber-400/15 px-3 text-center transition-all duration-200"
              >
                <span className="text-sm font-black text-white sm:text-base">
                  {formatDimension(widthM)}m × {formatDimension(heightM)}m
                </span>
                <span className="text-xs font-semibold text-cyan-300">{areaM2} m² aprox.</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-400">
                Superficie estimada: <strong className="text-white">{areaM2} m²</strong> ·{" "}
                <strong className="text-slate-200">{activeSolution.pitch}</strong>
              </div>

              <Link
                href={configuratorHref}
                className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-slate-950 transition hover:bg-amber-300"
              >
                Ir al Configurador →
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Use Cases Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Aplicaciones Frecuentes
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Escenarios listos para cargar en el configurador
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {USE_CASES.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-6"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {item.detail}
                </p>
              </div>
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center text-xs font-extrabold uppercase tracking-wider text-cyan-400 transition hover:text-cyan-300"
              >
                {item.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="proceso" className="border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Cómo Funciona
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Tres pasos hasta tu propuesta técnica
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
              <span className="text-xs font-extrabold text-cyan-400">01 / CONFIGURA</span>
              <h3 className="mt-2 text-lg font-bold text-white">Define modelo y medidas</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Ajusta el ancho, alto y serie en el configurador para obtener medidas reales,
                cabinets y estimación.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
              <span className="text-xs font-extrabold text-cyan-400">02 / ENVÍA</span>
              <h3 className="mt-2 text-lg font-bold text-white">Adjunta tu cálculo automáticamente</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Completa tus datos y tipo de operación sin copiar parámetros a mano.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
              <span className="text-xs font-extrabold text-cyan-400">03 / RECIBE RESPUESTA</span>
              <h3 className="mt-2 text-lg font-bold text-white">Revisión y seguimiento ordenado</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Cada solicitud queda registrada con sus especificaciones técnicas lista para cotizar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}