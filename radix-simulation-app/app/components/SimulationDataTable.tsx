import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SimulationParameters {
  xrdPrice: number;
  tvl: number;
  baseEmission: number;
  tvlTarget: number;
  anthicDailyVolume: number;
  takerFeePercent: number;
  dynamicEmission: boolean;
}

interface SimulationDataTableProps {
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

const formatPrice = (num: number): string => {
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
};

const formatTVL = (num: number): string => {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}k`;
  }
  return `$${num.toFixed(2)}`;
};

const formatLargeNumber = (num: number, type: 'xrd' | 'usd'): string => {
  const prefix = type === 'usd' ? '$' : '';
  const suffix = type === 'xrd' ? ' XRD' : '';
  
  if (Math.abs(num) >= 1000000000) {
    return `${prefix}${(num / 1000000000).toFixed(1)}B${suffix}`;
  } else if (Math.abs(num) >= 1000000) {
    return `${prefix}${(num / 1000000).toFixed(1)}M${suffix}`;
  } else if (Math.abs(num) >= 1000) {
    return `${prefix}${(num / 1000).toFixed(1)}k${suffix}`;
  } else if (Math.abs(num) >= 100) {
    return `${prefix}${Math.round(num)}${suffix}`;
  }
  return `${prefix}${num.toFixed(2)}${suffix}`;
};

const formatTableCell = (xrdValue: number, usdValue: number): string => {
  const xrdFormatted = formatLargeNumber(xrdValue, 'xrd');
  const usdFormatted = formatLargeNumber(usdValue, 'usd');
  return `${xrdFormatted} | ${usdFormatted}`;
};

const SimulationDataTable: React.FC<SimulationDataTableProps> = ({ simulationData, parameters }) => {
  if (!simulationData || simulationData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulation Data Table</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No simulation data available. Run the simulation to populate the table.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate cumulative USD values
  const cumulativeUsdValues = simulationData.map((_, index) => {
    let buybackUsdSum = 0;
    let lockedUsdSum = 0;
    
    // Sum up all values up to current index, multiplying each by its respective day's price
    for (let i = 0; i <= index; i++) {
      buybackUsdSum += simulationData[i].buyback * simulationData[i].price;
      lockedUsdSum += simulationData[i].locked * simulationData[i].price;
    }
    
    return {
      buybackUsdSum,
      lockedUsdSum
    };
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Simulation Data Table (Day-by-Day)</CardTitle>
            <Badge variant={parameters.dynamicEmission ? "default" : "secondary"} className="text-xs">
              {parameters.dynamicEmission ? "Dynamic" : "Static"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse table-fixed">
              <thead className="bg-secondary text-secondary-foreground sticky top-0">
                <tr>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[80px]">Day</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[120px]">Price (USD)</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[120px]">TVL (USD)</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[180px]">
                    Emission<br/>
                    XRD | USD
                  </th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[180px]">
                    Buyback<br/>
                    XRD | USD
                  </th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[180px]">
                    Locked<br/>
                    XRD | USD
                  </th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[200px]">
                    Annual Buyback Cum.<br/>
                    XRD | USD
                  </th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[200px]">
                    Annual Locked Cum.<br/>
                    XRD | USD
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {simulationData.map((dataPoint, index) => (
                  <tr key={index} className="hover:bg-accent hover:text-accent-foreground">
                    <td className="border border-secondary-foreground px-4 py-2 text-right">{dataPoint.day + 1}</td>
                    <td className="border border-secondary-foreground px-4 py-2 text-right">{formatPrice(dataPoint.price)}</td>
                    <td className="border border-secondary-foreground px-4 py-2 text-right">{formatTVL(dataPoint.tvl)}</td>
                    <td className="border border-secondary-foreground px-4 py-2 text-right whitespace-nowrap">
                      {formatTableCell(dataPoint.emission, dataPoint.emission * dataPoint.price)}
                    </td>
                    <td className="border border-secondary-foreground px-4 py-2 text-right whitespace-nowrap">
                      {formatTableCell(dataPoint.buyback, dataPoint.buyback * dataPoint.price)}
                    </td>
                    <td className="border border-secondary-foreground px-4 py-2 text-right whitespace-nowrap">
                      {formatTableCell(dataPoint.locked, dataPoint.locked * dataPoint.price)}
                    </td>
                    <td className="border border-secondary-foreground px-4 py-2 text-right whitespace-nowrap">
                      {formatTableCell(dataPoint.annualBuybackCumulative, cumulativeUsdValues[index].buybackUsdSum)}
                    </td>
                    <td className="border border-secondary-foreground px-4 py-2 text-right whitespace-nowrap">
                      {formatTableCell(dataPoint.annualLockedCumulative, cumulativeUsdValues[index].lockedUsdSum)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SimulationDataTable; 