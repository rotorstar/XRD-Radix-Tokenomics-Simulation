import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}

const formatNumber = (num: number, decimals: number = 4): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

const SimulationDataTable: React.FC<SimulationDataTableProps> = ({ simulationData }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Data Table (Day-by-Day)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse table-fixed">
              <thead className="bg-secondary text-secondary-foreground sticky top-0">
                <tr>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[80px]">Day</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[120px]">Price (USD)</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[150px]">TVL (M USD)</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[150px]">Emission (XRD)</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[120px]">Buyback (XRD)</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[120px]">Locked (XRD)</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[200px]">Annual Buyback Cum. (XRD)</th>
                  <th className="border border-secondary-foreground font-medium px-4 py-2 text-left w-[200px]">Annual Locked Cum. (XRD)</th>
                </tr>
              </thead>
              <tbody>
                {simulationData.map((dataPoint, index) => (
                  <tr key={index} className="hover:bg-accent hover:text-accent-foreground">
                    <td className="border border-secondary-foreground px-4 py-2 font-mono text-right">{dataPoint.day + 1}</td>
                    <td className="border border-secondary-foreground px-4 py-2 font-mono text-right">{formatNumber(dataPoint.price, 4)}</td>
                    <td className="border border-secondary-foreground px-4 py-2 font-mono text-right">{formatNumber(dataPoint.tvl, 2)}</td>
                    <td className="border border-secondary-foreground px-4 py-2 font-mono text-right">{formatNumber(dataPoint.emission, 0)}</td>
                    <td className="border border-secondary-foreground px-4 py-2 font-mono text-right">{formatNumber(dataPoint.buyback, 0)}</td>
                    <td className="border border-secondary-foreground px-4 py-2 font-mono text-right">{formatNumber(dataPoint.locked, 0)}</td>
                    <td className="border border-secondary-foreground px-4 py-2 font-mono text-right">{formatNumber(dataPoint.annualBuybackCumulative, 0)}</td>
                    <td className="border border-secondary-foreground px-4 py-2 font-mono text-right">{formatNumber(dataPoint.annualLockedCumulative, 0)}</td>
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