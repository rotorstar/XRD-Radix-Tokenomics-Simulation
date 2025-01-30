// src/app/components/SimulationCharts.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

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
}

interface SimulationChartsProps {
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

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">Day {label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatNumber(entry.value,
              entry.name === 'XRD Price Trend' ? 4 :
              entry.name === 'Daily Emission' ? 2 :
              entry.name.includes('Cumulative') ? 0 : 2
            )}
            {entry.name === 'XRD Price Trend' ? ' USD' :
              entry.name === 'TVL Trend' ? ' M USD' :
              entry.name === 'Daily Emission' ? ' M XRD/day' :
              ' XRD'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const EmissionChart = ({ data, parameters }: { data: SimulationData[], parameters: SimulationParameters }) => {
  // Gruppiere die Daten in Monatsintervalle (30 Tage)
  const monthlyData = [];
  for (let i = 0; i < data.length; i += 30) {
    const monthSlice = data.slice(i, Math.min(i + 30, data.length));
    
    // Berechne die tatsächliche Summe für diesen Monat
    const monthSum = {
      month: Math.floor(i / 30),
      totalEmission: monthSlice.reduce((sum, day) => sum + day.emission, 0),
      marketEmission: monthSlice.reduce((sum, day) => sum + day.emission * parameters.emissionToMarketPercent / 100, 0),
      buyback: monthSlice.reduce((sum, day) => sum + day.buyback, 0),
      locked: monthSlice.reduce((sum, day) => sum + day.locked, 0)
    };
    
    monthlyData.push(monthSum);
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlyData}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            label={{ value: 'Month', position: 'insideBottom', offset: -10 }}
            tick={{ fontSize: '0.7em', fill: '#6b7280' }}
          />
          <YAxis 
            label={{ 
              value: 'XRD', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: '0.8em', fill: '#6b7280' }
            }}
            tick={{ fontSize: '0.7em', fill: '#6b7280' }}
          />
          <Tooltip 
            formatter={(value: number) => value.toLocaleString(undefined, {maximumFractionDigits: 0})}
            contentStyle={{ fontSize: '0.8em' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '0.8em' }}
            iconSize={8}
          />
          <Bar 
            dataKey="totalEmission" 
            fill="#8884d8" 
            name="Total Emission"
          />
          <Bar 
            dataKey="marketEmission" 
            fill="#82ca9d" 
            name="Market Emission"
          />
          <Bar 
            dataKey="buyback" 
            stackId="buybackLock" 
            fill="#ffc658" 
            name="Buyback"
          />
          <Bar 
            dataKey="locked" 
            stackId="buybackLock" 
            fill="#ff7300" 
            name="Locked"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const SimulationCharts = ({ simulationData, parameters }: SimulationChartsProps) => {
  if (!simulationData || simulationData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No simulation data available. Adjust parameters to start the simulation.</p>
        </CardContent>
      </Card>
    );
  }

  const ChartCard = ({
    title,
    dataKey,
    color,
    yAxisLabel,
    decimals = 2,
    showDynamicBadge = false
  }: {
    title: string;
    dataKey: string;
    color: string;
    yAxisLabel: string;
    decimals?: number;
    showDynamicBadge?: boolean;
  }) => (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">{title}</CardTitle>
            {showDynamicBadge && (
              <Badge variant={parameters.dynamicEmission ? "default" : "secondary"} className="text-xs">
                {parameters.dynamicEmission ? "Dynamic" : "Static"}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {showDynamicBadge && parameters.dynamicEmission
            ? "Dynamic emission adjusts based on TVL & activity."
            : "Static emission distributes tokens evenly."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="day"
                label={<Label value="Days" offset={-5} style={{ fontSize: '0.8em', fill: '#6b7280' }} position="insideBottom" />}
                tick={{ fontSize: '0.7em', fill: '#6b7280' }}
              />
              <YAxis
                label={<Label value={yAxisLabel} angle={-90} style={{ fontSize: '0.8em', fill: '#6b7280' }} position="insideLeft" offset={10} />}
                tickFormatter={(value) => formatNumber(value, decimals)}
                tick={{ fontSize: '0.7em', fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                name={title}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard
          title="XRD Price Trend"
          dataKey="price"
          color="#0ea5e9"
          yAxisLabel="Price (USD)"
          decimals={4}
          showDynamicBadge={true}
        />
        <ChartCard
          title="TVL Trend"
          dataKey="tvl"
          color="#22c55e"
          yAxisLabel="TVL (Million USD)"
        />
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm">Monthly Emission Distribution</CardTitle>
                <Badge variant={parameters.dynamicEmission ? "default" : "secondary"} className="text-xs">
                  {parameters.dynamicEmission ? "Dynamic" : "Static"}
                </Badge>
              </div>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Shows total emission, market emission (after holders), and buyback+lock amounts per month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <EmissionChart data={simulationData} parameters={parameters} />
            </div>
          </CardContent>
        </Card>
        <ChartCard
          title="Annual Locked Trend (Cumulative)"
          dataKey="annualLockedCumulative"
          color="#6366f1"
          yAxisLabel="Locked XRD (Cumulative)"
          decimals={0}
        />
      </div>
    </div>
  );
};

export default SimulationCharts; 