export interface SimulationData {
  day: number;
  price: number;
  tvl: number;
  emission: number;
  buyback: number;
  locked: number;
  annualBuybackCumulative: number;
  annualLockedCumulative: number;
}

export interface SimulationParameters {
  xrdPrice: number;
  tvl: number;
  baseEmission: number;
  tvlTarget: number;
  anthicDailyVolume: number;
  takerFeePercent: number;
  dynamicEmission: boolean;
} 