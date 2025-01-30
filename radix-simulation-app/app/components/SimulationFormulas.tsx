// src/app/components/SimulationFormulas.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import interfaces directly from page
interface SimulationData {
  day: number;
  price: number;
  tvl: number;
  emission: number;
  buyback: number;
  locked: number;
  annualBuybackCumulative: number;
  annualLockedCumulative: number;
}

interface SimulationParameters {
  xrdPrice: number;
  tvl: number;
  baseEmission: number;
  tvlTarget: number;
  anthicDailyVolume: number;
  takerFeePercent: number;
  dynamicEmission: boolean;
  emissionToMarketPercent: number;
  tvlInertia: number;
}

interface SimulationFormulasProps {
  parameters: SimulationParameters;
  simulationData: SimulationData[];
}

const SimulationFormulas: React.FC<SimulationFormulasProps> = ({ parameters, simulationData }) => {
  // Get the latest data point
  const currentData = simulationData[simulationData.length - 1] || {
    price: parameters.xrdPrice,
    tvl: parameters.tvl,
    emission: parameters.baseEmission / 365,
    buyback: 0,
    locked: 0
  };

  // Calculate current values for formulas
  const tvlProgress = currentData.tvl / parameters.tvlTarget;
  const activityProgress = parameters.anthicDailyVolume / 10000000;
  const dailyFees = parameters.anthicDailyVolume * (parameters.takerFeePercent / 100);
  const dailyBuyback = (dailyFees / currentData.price) * 0.5;
  const netSupply = currentData.emission - dailyBuyback - dailyBuyback; // dailyLocked equals dailyBuyback
  const marketDepth = currentData.tvl * 0.5; // Updated from 0.0001 to 0.5
  const supplyDemandPressure = -netSupply / marketDepth;

  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 100) {
      return Math.round(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulation Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Daily Emission</h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono mb-2">
                  {parameters.dynamicEmission ? (
                    <>
                      {/* Progress Metrics */}
                      TVL_Progress = current_TVL / TVL_Target
                      Activity_Progress = daily_Volume / 10M USD

                      {/* Target Emission (before smoothing) */}
                      targetEmission = baseEmission * (
                        0.7 * (1 / TVL_Progress^0.7) +  {/* TVL Factor */}
                        0.3 * (1 / Activity_Progress^0.5)  {/* Activity Factor */}
                      )

                      {/* Final Daily Emission with Smoothing */}
                      smoothedEmission = targetEmission * 0.2 + baseEmission * 0.8
                      dailyBaseEmission = smoothedEmission / 365

                      {/* Market Emission Adjustment */}
                      dailyEmission = dailyBaseEmission * (emissionToMarketPercent / 100)
                    </>
                  ) : (
                    <>
                      dailyBaseEmission = baseEmission / 365  {/* Static Emission */}
                      dailyEmission = dailyBaseEmission * (emissionToMarketPercent / 100)  {/* Market Adjustment */}
                    </>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {parameters.dynamicEmission ? (
                    <>
                      Dynamic emission adjusts based on TVL and Activity progress:<br />
                      - Lower progress = higher emission<br />
                      - 80% smoothing to prevent sudden changes<br />
                      - 70% weight on TVL, 30% on Activity<br />
                      - Only {parameters.emissionToMarketPercent}% of emission enters market
                    </>
                  ) : (
                    <>
                      Static emission: Base emission is distributed evenly across the year<br />
                      Only {parameters.emissionToMarketPercent}% of emission enters market
                    </>
                  )}
                </p>
              </div>
              
              <div className="bg-green-950 p-4 rounded-lg">
                <p className="font-mono text-sm mb-2 text-green-400">
                  Current Values:<br />
                  {parameters.dynamicEmission ? (
                    <>
                      TVL_Progress = {formatNumber(currentData.tvl)} / {formatNumber(parameters.tvlTarget)} = {formatNumber(tvlProgress)}<br />
                      Activity_Progress = {formatNumber(parameters.anthicDailyVolume)} / 10M = {formatNumber(activityProgress)}<br />
                      <br />
                      baseEmissionInXRD = {formatNumber(parameters.baseEmission)} * 1,000,000 = {formatNumber(parameters.baseEmission * 1_000_000)} XRD<br />
                      targetEmission = {formatNumber(parameters.baseEmission * 1_000_000)} * (<br />
                      &nbsp;&nbsp;0.7 * (1 / {formatNumber(tvlProgress)}^0.7) +<br />
                      &nbsp;&nbsp;0.3 * (1 / {formatNumber(activityProgress)}^0.5)<br />
                      ) = {formatNumber(parameters.baseEmission * 1_000_000 * (
                        0.7 * (1 / Math.pow(tvlProgress, 0.7)) +
                        0.3 * (1 / Math.pow(activityProgress, 0.5))
                      ))} XRD<br />
                      <br />
                      smoothedEmission = {formatNumber(parameters.baseEmission * 1_000_000 * (
                        0.7 * (1 / Math.pow(tvlProgress, 0.7)) +
                        0.3 * (1 / Math.pow(activityProgress, 0.5))
                      ))} * 0.2 + {formatNumber(parameters.baseEmission * 1_000_000)} * 0.8<br />
                      <br />
                      dailyBaseEmission = smoothedEmission / 365 = {formatNumber(currentData.emission / (parameters.emissionToMarketPercent / 100))} XRD/day<br />
                      dailyEmission = {formatNumber(currentData.emission / (parameters.emissionToMarketPercent / 100))} * {formatNumber(parameters.emissionToMarketPercent)}% = {formatNumber(currentData.emission)} XRD/day
                    </>
                  ) : (
                    <>
                      baseEmissionInXRD = {formatNumber(parameters.baseEmission)} * 1,000,000 = {formatNumber(parameters.baseEmission * 1_000_000)} XRD<br />
                      dailyBaseEmission = {formatNumber(parameters.baseEmission * 1_000_000)} / 365 = {formatNumber(currentData.emission / (parameters.emissionToMarketPercent / 100))} XRD/day<br />
                      dailyEmission = {formatNumber(currentData.emission / (parameters.emissionToMarketPercent / 100))} * {formatNumber(parameters.emissionToMarketPercent)}% = {formatNumber(currentData.emission)} XRD/day
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Daily Buyback & Locked</h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono mb-2">
                  dailyFees = dailyVolume * (takerFeePercent / 100)<br />
                  dailyBuyback = (dailyFees / currentPrice) * 0.5<br />
                  dailyLocked = dailyBuyback  {/* Equal amount is locked */}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  50% of fees are used for buybacks,<br />
                  the same amount is subsequently locked
                </p>
              </div>

              <div className="bg-green-950 p-4 rounded-lg">
                <p className="font-mono text-sm mb-2 text-green-400">
                  Current Values:<br />
                  dailyFees = {formatNumber(parameters.anthicDailyVolume)} * ({formatNumber(parameters.takerFeePercent)} / 100) = {formatNumber(dailyFees)}<br />
                  dailyBuyback = ({formatNumber(dailyFees)} / {formatNumber(currentData.price)}) * 0.5 = {formatNumber(dailyBuyback)} XRD<br />
                  dailyLocked = {formatNumber(dailyBuyback)} XRD
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Price Development</h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono mb-2">
                  netSupply = dailyEmission - dailyBuyback - dailyLocked<br />
                  marketDepth = currentTVL * 0.5<br />
                  supplyDemandPressure = -netSupply / marketDepth<br />
                  momentum = momentum * 0.3 + supplyDemandPressure * 0.7<br />
                  priceChange = momentum<br />
                  boundedPriceChange = max(min(priceChange, 0.1), -0.1)  {/* 10% daily limit */}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Price is influenced by supply/demand and market depth.<br />
                  A momentum factor of 0.3 smooths price movements, with a 10% daily change limit.
                </p>
              </div>

              <div className="bg-green-950 p-4 rounded-lg">
                <p className="font-mono text-sm mb-2 text-green-400">
                  Current Values:<br />
                  netSupply = {formatNumber(currentData.emission)} - {formatNumber(dailyBuyback)} - {formatNumber(dailyBuyback)} = {formatNumber(netSupply)} XRD<br />
                  marketDepth = {formatNumber(currentData.tvl)} * 0.5 = {formatNumber(marketDepth)}<br />
                  supplyDemandPressure = -{formatNumber(netSupply)} / {formatNumber(marketDepth)} = {formatNumber(-netSupply/marketDepth)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">TVL Development</h3>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono mb-2">
                  targetTVL = initialTVL * (currentPrice / initialPrice) {/* Proportional model */}<br />
                  tvlChange = (targetTVL - currentTVL) * (1 - tvlInertia)<br />
                  currentTVL = max(MIN_TVL, currentTVL + tvlChange)
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  TVL follows price development proportionally with {parameters.tvlInertia * 100}% inertia.<br />
                  Simplified model: TVL scales linearly with price changes.
                </p>
              </div>

              <div className="bg-green-950 p-4 rounded-lg">
                <p className="font-mono text-sm mb-2 text-green-400">
                  Current Values:<br />
                  targetTVL = {formatNumber(parameters.tvl)} * ({formatNumber(currentData.price)} / {formatNumber(parameters.xrdPrice)}) = {
                    formatNumber(parameters.tvl * (currentData.price / parameters.xrdPrice))
                  }<br />
                  tvlChange = ({formatNumber(parameters.tvl * (currentData.price / parameters.xrdPrice))} - {formatNumber(currentData.tvl)}) * {formatNumber(1 - parameters.tvlInertia)}<br />
                  currentTVL = {formatNumber(currentData.tvl)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationFormulas; 