// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import SimulationInputs from './components/SimulationInputs';
import SimulationOutputs from './components/SimulationOutputs';
import SimulationCharts from './components/SimulationCharts';
import SimulationDataTable from './components/SimulationDataTable';
import SimulationFormulas from './components/SimulationFormulas';

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
  momentumFactor: number;
  tvlInertia: number;
  emissionSmoothing: number;
  marketDepthFactor: number;
  tvlPriceCorrelation: number;
}

const initialParameters: SimulationParameters = {
  xrdPrice: 0.0129,
  tvl: 24.11,
  baseEmission: 300,
  tvlTarget: 100,
  anthicDailyVolume: 500000,
  takerFeePercent: 0.1,
  dynamicEmission: false,
  emissionToMarketPercent: 50,
  momentumFactor: 0.3,
  tvlInertia: 0.7,
  emissionSmoothing: 0.8,
  marketDepthFactor: 0.5,
  tvlPriceCorrelation: 0.6,
};

const PRESETS = {
  conservative: {
    name: "Conservative",
    data: {
      xrdPrice: 0.0129,
      tvl: 25,
      baseEmission: 300,
      tvlTarget: 100,
      anthicDailyVolume: 1000000,
      takerFeePercent: 0.05,
      dynamicEmission: true,
      emissionToMarketPercent: 50,
    }
  },
  moderate: {
    name: "Moderate",
    data: {
      xrdPrice: 0.02,
      tvl: 25,
      baseEmission: 250,
      tvlTarget: 250,
      anthicDailyVolume: 3000000,
      takerFeePercent: 0.05,
      dynamicEmission: true,
      emissionToMarketPercent: 40,
    }
  },
  optimistic: {
    name: "Optimistic",
    data: {
      xrdPrice: 0.0129,
      tvl: 25,
      baseEmission: 200,
      tvlTarget: 500,
      anthicDailyVolume: 5000000,
      takerFeePercent: 0.05,
      dynamicEmission: true,
      emissionToMarketPercent: 50,
    }
  },
  bullish: {
    name: "Bullish",
    data: {
      xrdPrice: 0.0129,
      tvl: 25,
      baseEmission: 150,
      tvlTarget: 1000,
      anthicDailyVolume: 20000000,
      takerFeePercent: 0.05,
      dynamicEmission: true,
      emissionToMarketPercent: 50,
    }
  }
};

function calculateSimulation(params: SimulationParameters): Array<SimulationData> {
  const data: Array<SimulationData> = [];
  const MIN_TVL = params.tvl * 0.5;

  let currentPrice = params.xrdPrice;
  let currentTvl = params.tvl;
  let momentum = 0;
  let cumulativeAnnualBuyback = 0;
  let cumulativeAnnualLocked = 0;
  let previousEmission = params.baseEmission * 1_000_000;

  const baseEmissionInXRD = params.baseEmission * 1_000_000;

  for (let day = 0; day < 365; day++) {
    let annualEmission: number;
    if (params.dynamicEmission) {
      const tvlProgress = currentTvl / params.tvlTarget;
      const activityProgress = params.anthicDailyVolume / 10000000;

      const targetEmission = baseEmissionInXRD * (
        0.7 * (1 / Math.pow(tvlProgress, 0.7)) +
        0.3 * (1 / Math.pow(activityProgress, 0.5))
      );

      annualEmission = previousEmission * params.emissionSmoothing + targetEmission * (1 - params.emissionSmoothing);
      previousEmission = annualEmission;
    } else {
      annualEmission = baseEmissionInXRD;
    }

    const emissionToMarket = (annualEmission / 365) * (params.emissionToMarketPercent / 100);
    const dailyEmission = emissionToMarket;

    const dailyFees = params.anthicDailyVolume * (params.takerFeePercent / 100);
    const dailyBuyback = (dailyFees / currentPrice) * 0.5;
    const dailyLocked = dailyBuyback;

    cumulativeAnnualBuyback += dailyBuyback;
    cumulativeAnnualLocked += dailyLocked;

    const netSupply = dailyEmission - dailyBuyback - dailyLocked;
    const marketDepth = currentTvl * params.marketDepthFactor;
    const supplyDemandPressure = -netSupply / marketDepth;

    momentum = momentum * params.momentumFactor + supplyDemandPressure * (1 - params.momentumFactor);
    const priceChange = momentum;

    const maxDailyChange = 0.1;
    const boundedPriceChange = Math.max(
      Math.min(priceChange, maxDailyChange),
      -maxDailyChange
    );
    currentPrice = Math.max(currentPrice * (1 + boundedPriceChange), 0.001);

    // TVL Dynamics (VEREINFACHTE FORMEL - PROPORTIONAL)
    const targetTvl = params.tvl * (currentPrice / params.xrdPrice); // Exponent 1.0 (proportional)
    const tvlChange = (targetTvl - currentTvl) * (1 - params.tvlInertia);
    currentTvl = Math.max(MIN_TVL, currentTvl + tvlChange);

    data.push({
      day,
      price: currentPrice,
      tvl: currentTvl,
      emission: dailyEmission,
      buyback: dailyBuyback,
      locked: dailyLocked,
      annualBuybackCumulative: cumulativeAnnualBuyback,
      annualLockedCumulative: cumulativeAnnualLocked
    });
  }

  return data;
}

export default function Home() {
  const [parameters, setParameters] = useState<SimulationParameters>(initialParameters);
  const [simulationData, setSimulationData] = useState<SimulationData[]>([]);

  useEffect(() => {
    const data = calculateSimulation(parameters);
    setSimulationData(data);
  }, [parameters]);

  const handleParameterChange = (newParameters: SimulationParameters) => {
    setParameters(newParameters);
  };

  return (
    <main className="container mx-auto py-6 px-4 min-h-screen relative">
      <h1 className="text-3xl font-bold text-center mb-8">Radix Tokenomics Simulation</h1>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Views</TabsTrigger>
          <TabsTrigger value="inputs">Parameters</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="data">Data Table</TabsTrigger>
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <SimulationInputs
            initialData={parameters}
            onParameterChange={handleParameterChange}
            showAdvancedParams={false}
          />
          <SimulationOutputs simulationData={simulationData} parameters={parameters} />
          <SimulationCharts simulationData={simulationData} parameters={parameters} />
          <SimulationFormulas simulationData={simulationData} parameters={parameters} />
          <SimulationDataTable simulationData={simulationData} parameters={parameters} />
        </TabsContent>

        <TabsContent value="inputs">
          <SimulationInputs
            initialData={parameters}
            onParameterChange={handleParameterChange}
            showAdvancedParams={true}
          />
        </TabsContent>

        <TabsContent value="results">
          <div className="space-y-6">
            <SimulationOutputs simulationData={simulationData} parameters={parameters} />
            <SimulationCharts simulationData={simulationData} parameters={parameters} />
          </div>
        </TabsContent>

        <TabsContent value="data">
          <SimulationDataTable simulationData={simulationData} parameters={parameters} />
        </TabsContent>

        <TabsContent value="formulas">
          <SimulationFormulas simulationData={simulationData} parameters={parameters} />
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg">
        <HoverCard>
          <HoverCardTrigger>
            <div className="flex items-center gap-2">
              <Switch
                checked={parameters.dynamicEmission}
                onCheckedChange={(checked) => {
                  setParameters({
                    ...parameters,
                    dynamicEmission: checked
                  });
                }}
              />
              <span className="text-sm font-medium">
                {parameters.dynamicEmission ? "Dynamic" : "Static"} Emission
              </span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Emission Mode</h4>
              <p className="text-sm text-muted-foreground">
                Dynamic emission adjusts based on TVL and network activity progress.
                Static emission distributes tokens evenly throughout the year.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </main>
  );
}