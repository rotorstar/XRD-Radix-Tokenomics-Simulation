import type { SimulationParameters } from '../types';

export const initialParameters: SimulationParameters = {
  xrdPrice: 0.02,        // Current market price
  tvl: 24.11,           // Current TVL in millions
  baseEmission: 300,     // Base emission in millions per year
  tvlTarget: 100,        // Conservative TVL target
  anthicDailyVolume: 100000, // $100K daily volume
  takerFeePercent: 0.05,      // 0.05% taker fee
  dynamicEmission: true,  // Dynamic emission enabled by default
}; 