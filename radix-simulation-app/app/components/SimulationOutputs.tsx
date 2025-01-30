// src/app/components/SimulationOutputs.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from 'lucide-react';

interface SimulationParameters {
  xrdPrice: number;
  tvl: number;
  baseEmission: number;
  tvlTarget: number;
  anthicDailyVolume: number;
  takerFeePercent: number;
  dynamicEmission: boolean;
  emissionToMarketPercent: number;
}

interface SimulationOutputsProps {
  simulationData: Array<{
    day: number;
    price: number;
    tvl: number;
    emission: number;
    buyback: number;
    locked: number;
    annualBuybackCumulative: number;
    annualLockedCumulative: number;
  }>;
  parameters: SimulationParameters;
}

const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

const SimulationOutputs = ({ simulationData, parameters }: SimulationOutputsProps) => {
  if (!simulationData || simulationData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No simulation data available. Adjust parameters to start the simulation.</p>
        </CardContent>
      </Card>
    );
  }

  const lastDay = simulationData[simulationData.length - 1];
  const firstDay = simulationData[0];
  
  const priceChange = ((lastDay.price - firstDay.price) / firstDay.price) * 100;
  const tvlChange = ((lastDay.tvl - firstDay.tvl) / firstDay.tvl) * 100;
  const tvlProgress = (lastDay.tvl / parameters.tvlTarget) * 100;

  const MetricCard = ({ 
    title, 
    value, 
    info, 
    change = null, 
    prefix = '', 
    suffix = '',
    decimals = 2,
    showDynamicBadge = false
  }: { 
    title: string;
    value: number;
    info: string;
    change?: number | null;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    showDynamicBadge?: boolean;
  }) => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 space-y-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground h-6 w-6">
                <InfoIcon className="h-4 w-4" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm text-muted-foreground">{info}</p>
              {showDynamicBadge && (
                <p className="text-sm text-muted-foreground mt-2">
                  {parameters.dynamicEmission
                    ? `Using dynamic emission based on TVL progress (70%), network activity (30%), and ${parameters.emissionToMarketPercent}% emission to market.`
                    : `Using static emission with base rate distributed evenly, and ${parameters.emissionToMarketPercent}% emission to market.`}
                </p>
              )}
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 space-y-1">
          <div className="text-2xl font-bold">
            {prefix}{formatNumber(value, decimals)}{suffix}
          </div>
          {change !== null && (
            <div className="flex items-center space-x-2">
              <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
                {change >= 0 ? '↑' : '↓'} {formatNumber(Math.abs(change))}%
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Final XRD Price"
          value={lastDay.price}
          info={`XRD price at the end of the 365-day simulation. ${
            parameters.dynamicEmission
              ? `Price is influenced by dynamic emission adjustments based on TVL and network activity, with ${parameters.emissionToMarketPercent}% emission to market.`
              : `Price development with static emission rate, and ${parameters.emissionToMarketPercent}% emission to market.`
          }`}
          change={priceChange}
          prefix="$"
          decimals={4}
          showDynamicBadge={true}
        />
        <MetricCard
          title="Final TVL"
          value={lastDay.tvl}
          info={`Total Value Locked at the end of the 365-day simulation, in millions of USD. Target: $${formatNumber(parameters.tvlTarget)}M. TVL is correlated with price and influenced by emission mode.`}
          change={tvlChange}
          prefix="$"
          suffix="M"
        />
        <MetricCard
          title="Total Annual Buyback"
          value={lastDay.annualBuybackCumulative}
          info={`Total XRD projected to be bought back over 365 days based on ${formatNumber(parameters.takerFeePercent, 2)}% taker fee, $${formatNumber(parameters.anthicDailyVolume)} daily volume, and price development.`}
          suffix=" XRD"
          decimals={0}
          showDynamicBadge={true}
        />
        <MetricCard
          title="Total Annual Locked"
          value={lastDay.annualLockedCumulative}
          info="Total XRD projected to be locked over 365 days (equal to buyback amount)."
          suffix=" XRD"
          decimals={0}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Progress Towards Targets (Day 365)
            <Badge variant={parameters.dynamicEmission ? "default" : "secondary"} className="text-xs">
              {parameters.dynamicEmission ? "Dynamic Emission" : "Static Emission"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>TVL Progress</span>
                <span className="text-muted-foreground">{formatNumber(tvlProgress)}% of ${formatNumber(parameters.tvlTarget)}M target</span>
              </div>
              <Progress value={Math.max(0, Math.min(100, tvlProgress))} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Daily Volume</span>
                <span className="text-muted-foreground">${formatNumber(parameters.anthicDailyVolume)}</span>
              </div>
              <Progress value={Math.min(100, (parameters.anthicDailyVolume / 10000000) * 100)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationOutputs; 