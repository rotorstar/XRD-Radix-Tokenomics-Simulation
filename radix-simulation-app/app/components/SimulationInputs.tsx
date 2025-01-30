// src/app/components/SimulationInputs.tsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface SimulationInputsProps {
  initialData: {
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
  };
  onParameterChange: (parameters: {
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
  }) => void;
  showAdvancedParams?: boolean;
}

const PRESETS = {
  conservative: {
    name: "Conservative",
    data: {
      xrdPrice: 0.02,
      tvl: 25,
      baseEmission: 300,
      tvlTarget: 100,
      anthicDailyVolume: 1000000,
      takerFeePercent: 0.05,
      dynamicEmission: false,
      emissionToMarketPercent: 50,
      momentumFactor: 0.5,
      tvlInertia: 0.5,
      emissionSmoothing: 0.5,
      marketDepthFactor: 0.5,
      tvlPriceCorrelation: 0.5,
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
      dynamicEmission: false,
      emissionToMarketPercent: 50,
      momentumFactor: 0.5,
      tvlInertia: 0.5,
      emissionSmoothing: 0.5,
      marketDepthFactor: 0.5,
      tvlPriceCorrelation: 0.5,
    }
  },
  optimistic: {
    name: "Optimistic",
    data: {
      xrdPrice: 0.02,
      tvl: 25,
      baseEmission: 200,
      tvlTarget: 500,
      anthicDailyVolume: 5000000,
      takerFeePercent: 0.05,
      dynamicEmission: false,
      emissionToMarketPercent: 50,
      momentumFactor: 0.5,
      tvlInertia: 0.5,
      emissionSmoothing: 0.5,
      marketDepthFactor: 0.5,
      tvlPriceCorrelation: 0.5,
    }
  },
  bullish: {
    name: "Bullish",
    data: {
      xrdPrice: 0.02,
      tvl: 25,
      baseEmission: 150,
      tvlTarget: 1000,
      anthicDailyVolume: 10000000,
      takerFeePercent: 0.05,
      dynamicEmission: false,
      emissionToMarketPercent: 50,
      momentumFactor: 0.5,
      tvlInertia: 0.5,
      emissionSmoothing: 0.5,
      marketDepthFactor: 0.5,
      tvlPriceCorrelation: 0.5,
    }
  }
};

const SimulationInputs: React.FC<SimulationInputsProps> = ({ initialData, onParameterChange, showAdvancedParams = false }) => {
  const [parameters, setParameters] = useState(initialData);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    setParameters(initialData);
  }, [initialData]);

  const handleInputChange = (field: keyof typeof parameters, value: number | boolean) => {
    const newParameters = { ...parameters, [field]: value };
    setParameters(newParameters);
    setActivePreset(null);
    onParameterChange(newParameters);
  };

  const handlePresetClick = (preset: keyof typeof PRESETS) => {
    setParameters(PRESETS[preset].data);
    setActivePreset(preset);
    onParameterChange(PRESETS[preset].data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              variant={activePreset === key ? "default" : "outline"}
              onClick={() => handlePresetClick(key as keyof typeof PRESETS)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Price & TVL Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">XRD Price & TVL Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="xrdPrice">XRD Price (USD)</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>Current market price of XRD in USD</HoverCardContent>
                  </HoverCard>
                </div>
                <Input
                  id="xrdPrice"
                  type="number"
                  value={parameters.xrdPrice}
                  onChange={(e) => handleInputChange('xrdPrice', parseFloat(e.target.value))}
                  step="0.001"
                  min="0.001"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tvl">Current TVL (M)</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>Current Total Value Locked in millions USD</HoverCardContent>
                  </HoverCard>
                </div>
                <Input
                  id="tvl"
                  type="number"
                  value={parameters.tvl}
                  onChange={(e) => handleInputChange('tvl', parseFloat(e.target.value))}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tvlTarget">Target TVL (M)</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>Target Total Value Locked in millions USD</HoverCardContent>
                  </HoverCard>
                </div>
                <Input
                  id="tvlTarget"
                  type="number"
                  value={parameters.tvlTarget}
                  onChange={(e) => handleInputChange('tvlTarget', parseFloat(e.target.value))}
                  step="1"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volume & Fees Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Anthic Volume & Fee Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="anthicDailyVolume">Daily Volume</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>Expected daily trading volume in USD</HoverCardContent>
                  </HoverCard>
                </div>
                <Input
                  id="anthicDailyVolume"
                  type="number"
                  value={parameters.anthicDailyVolume}
                  onChange={(e) => handleInputChange('anthicDailyVolume', parseFloat(e.target.value))}
                  step="100000"
                  min="0"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="takerFeePercent">Taker Fee (%)</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>Taker fee percentage for trades</HoverCardContent>
                  </HoverCard>
                </div>
                <Input
                  id="takerFeePercent"
                  type="number"
                  value={parameters.takerFeePercent}
                  onChange={(e) => handleInputChange('takerFeePercent', parseFloat(e.target.value))}
                  step="0.01"
                  min="0"
                  max="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emission Settings Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Emission Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="baseEmission">Base Emission (M/year)</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>Base emission rate in millions of XRD per year</HoverCardContent>
                  </HoverCard>
                </div>
                <Input
                  id="baseEmission"
                  type="number"
                  value={parameters.baseEmission}
                  onChange={(e) => handleInputChange('baseEmission', parseFloat(e.target.value))}
                  step="1"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emissionToMarketPercent">To Market (%)</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>Percentage of daily emission that enters the market</HoverCardContent>
                  </HoverCard>
                </div>
                <Input
                  id="emissionToMarketPercent"
                  type="number"
                  value={parameters.emissionToMarketPercent}
                  onChange={(e) => handleInputChange('emissionToMarketPercent', parseFloat(e.target.value))}
                  step="1"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dynamicEmission">Dynamic Emission</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      Dynamic emission adjusts based on TVL and network activity progress. Static emission distributes tokens evenly throughout the year.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="flex items-center h-10">
                  <Switch
                    id="dynamicEmission"
                    checked={parameters.dynamicEmission}
                    onCheckedChange={(checked) => handleInputChange('dynamicEmission', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Parameters Card - nur anzeigen wenn showAdvancedParams true ist */}
        {showAdvancedParams && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Advanced Simulation Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="momentumFactor">Momentum Factor</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>Controls how much previous price momentum influences future price changes</HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input
                    id="momentumFactor"
                    type="number"
                    value={parameters.momentumFactor}
                    onChange={(e) => handleInputChange('momentumFactor', parseFloat(e.target.value))}
                    step="0.1"
                    min="0"
                    max="1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tvlInertia">TVL Inertia</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>Controls how quickly TVL adjusts to price changes</HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input
                    id="tvlInertia"
                    type="number"
                    value={parameters.tvlInertia}
                    onChange={(e) => handleInputChange('tvlInertia', parseFloat(e.target.value))}
                    step="0.1"
                    min="0"
                    max="1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emissionSmoothing">Emission Smoothing</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>Controls how gradually emission changes in dynamic mode</HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input
                    id="emissionSmoothing"
                    type="number"
                    value={parameters.emissionSmoothing}
                    onChange={(e) => handleInputChange('emissionSmoothing', parseFloat(e.target.value))}
                    step="0.1"
                    min="0"
                    max="1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketDepthFactor">Market Depth Factor</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>Controls how much TVL influences price stability</HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input
                    id="marketDepthFactor"
                    type="number"
                    value={parameters.marketDepthFactor}
                    onChange={(e) => handleInputChange('marketDepthFactor', parseFloat(e.target.value))}
                    step="0.1"
                    min="0"
                    max="1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tvlPriceCorrelation">TVL-Price Correlation</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>Controls how strongly TVL follows price changes</HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input
                    id="tvlPriceCorrelation"
                    type="number"
                    value={parameters.tvlPriceCorrelation}
                    onChange={(e) => handleInputChange('tvlPriceCorrelation', parseFloat(e.target.value))}
                    step="0.1"
                    min="0"
                    max="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SimulationInputs; 