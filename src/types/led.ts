export type OperationType = 'BUY' | 'RENT';

export interface LedSpec {
  id: string;
  name?: string;
  pitchMm?: number;
  brightnessNits?: number;
  environment?: 'indoor' | 'outdoor' | 'transparent' | 'rental' | string;
  pricePerM2?: number;
  [key: string]: unknown;
}

export interface ScreenCalculation {
  realWidthM: number;
  realHeightM: number;
  totalAreaM2: number;
  totalCabinets: number;
  estimatedPriceEur: number;
  [key: string]: unknown;
}