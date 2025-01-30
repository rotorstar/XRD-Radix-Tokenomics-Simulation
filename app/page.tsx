import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimulationInputs from './components/SimulationInputs';
import SimulationOutputs from './components/SimulationOutputs';
import SimulationCharts from './components/SimulationCharts';
import SimulationDataTable from './components/SimulationDataTable';

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Radix Tokenomics Simulation</h1>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Views</TabsTrigger>
          <TabsTrigger value="inputs">Parameters</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="data">Data Table</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <SimulationInputs
            initialData={initialParameters}
            onParameterChange={handleParameterChange}
          />
          <SimulationOutputs simulationData={simulationData} />
          <SimulationCharts simulationData={simulationData} />
          <SimulationDataTable simulationData={simulationData} />
        </TabsContent>

        <TabsContent value="inputs">
          <SimulationInputs
            initialData={initialParameters}
            onParameterChange={handleParameterChange}
          />
        </TabsContent>

        <TabsContent value="results">
          <div className="space-y-6">
            <SimulationOutputs simulationData={simulationData} />
            <SimulationCharts simulationData={simulationData} />
          </div>
        </TabsContent>

        <TabsContent value="data">
          <SimulationDataTable simulationData={simulationData} />
        </TabsContent>
      </Tabs>
    </main>
  );
} 