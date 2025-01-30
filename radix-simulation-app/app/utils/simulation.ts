import type { SimulationData, SimulationParameters } from '../types';

export function calculateSimulation(parameters: SimulationParameters): SimulationData[] {
  const data: SimulationData[] = [];
  let cumulativeAnnualBuyback = 0;
  let cumulativeAnnualLocked = 0;

  // Convert baseEmission from millions to absolute XRD amount
  const baseEmissionInXRD = parameters.baseEmission * 1_000_000;

  for (let day = 0; day < 365; day++) {
    // Calculate daily emission (baseEmission is in millions, so we need to convert to absolute XRD)
    const dailyEmission = baseEmissionInXRD / 365;
    const dailyVolume = parameters.anthicDailyVolume;
    const dailyBuyback = dailyVolume * (parameters.takerFeePercent / 100);
    const dailyLocked = dailyBuyback * 0.4; // 40% of buyback is locked

    cumulativeAnnualBuyback += dailyBuyback;
    cumulativeAnnualLocked += dailyLocked;

    // Simple price and TVL progression
    const progressFactor = (day + 1) / 365;
    const price = parameters.xrdPrice + (parameters.tvlTarget - parameters.xrdPrice) * progressFactor;
    const tvl = parameters.tvl + (parameters.tvlTarget - parameters.tvl) * progressFactor;

    data.push({
      day,
      price,
      tvl,
      emission: dailyEmission,
      buyback: dailyBuyback,
      locked: dailyLocked,
      annualBuybackCumulative: cumulativeAnnualBuyback,
      annualLockedCumulative: cumulativeAnnualLocked
    });
  }

  return data;
} 