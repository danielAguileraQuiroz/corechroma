import { LedSpec, ScreenCalculation } from '@/types/led';

export function calculateLedScreen(
  targetWidthM: number,
  targetHeightM: number,
  spec: LedSpec
): ScreenCalculation {
  const safeWidth = Math.max(0.5, Number(targetWidthM) || 0.5);
  const safeHeight = Math.max(0.5, Number(targetHeightM) || 0.5);

  const cabinetWidthMm = Number(spec.cabinetWidthMm);
  const cabinetHeightMm = Number(spec.cabinetHeightMm);
  const pixelPitchMm = Number(spec.pixelPitchMm);
  const maxPowerWm2 = Number(spec.maxPowerWm2);
  const weightKgCabinet = Number(spec.weightKgCabinet);
  const pricePerM2 = Number(spec.pricePerM2 ?? 0);

  const cols = Math.max(1, Math.round((safeWidth * 1000) / cabinetWidthMm));
  const rows = Math.max(1, Math.round((safeHeight * 1000) / cabinetHeightMm));

  const realWidthM = Number(((cols * cabinetWidthMm) / 1000).toFixed(2));
  const realHeightM = Number(((rows * cabinetHeightMm) / 1000).toFixed(2));
  const totalCabinets = cols * rows;
  const totalAreaM2 = Number((realWidthM * realHeightM).toFixed(2));

  const resolutionX = Math.round((realWidthM * 1000) / pixelPitchMm);
  const resolutionY = Math.round((realHeightM * 1000) / pixelPitchMm);

  const minViewingDistanceM = Number(pixelPitchMm.toFixed(1));
  const maxPowerKw = Number(((totalAreaM2 * maxPowerWm2) / 1000).toFixed(2));
  const avgPowerKw = Number((maxPowerKw * 0.35).toFixed(2));
  const totalWeightKg = Number((totalCabinets * weightKgCabinet).toFixed(1));
  const estimatedPriceEur = Math.round(totalAreaM2 * pricePerM2);

  return {
    cols,
    rows,
    totalCabinets,
    realWidthM,
    realHeightM,
    totalAreaM2,
    resolutionX,
    resolutionY,
    minViewingDistanceM,
    maxPowerKw,
    avgPowerKw,
    totalWeightKg,
    estimatedPriceEur,
  };
}