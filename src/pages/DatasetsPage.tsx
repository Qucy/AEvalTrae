import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Search, Plus, FileText, Database, Loader2 } from "lucide-react";
import datasetsMock from "../mocks/datasets.json";
import datasetDetailsMock from "../mocks/dataset_details.json";
import { DatasetMetadataEditor } from "../components/DatasetMetadataEditor";
import { Dataset, DatasetDetail } from "../types";

export function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [datasets, setDatasets] = useState<Dataset[]>(datasetsMock as Dataset[]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: upload, 1: scanning, 2: review
  const [appContext, setAppContext] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [datasetDetails, setDatasetDetails] = useState<DatasetDetail[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const handleViewDetails = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    const details = (datasetDetailsMock as DatasetDetail[]).filter(d => d.dataset_id === dataset.id);
    setDatasetDetails(details);
    setIsDetailOpen(true);
  };
  
  // Filter datasets based on search
  const filteredDatasets = datasets.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleScan = () => {
    setIsScanning(true);
    setScanStep(1);
    
    // Simulate smart detection process with context awareness
    setTimeout(() => {
      setScanStep(2);
      setIsScanning(false);
    }, 2000);
  };

  const handleSaveDataset = (metadata: { name: string; description: string; tags: string[] }) => {
    const newDataset: Dataset = {
      id: `ds-${Date.now()}`,
      name: metadata.name,
      description: metadata.description,
      size: "15MB", // Mocked
      tags: metadata.tags,
      file_format: "csv",
      metadata_quality_score: 0.95,
      created_at: new Date().toISOString(),
      total_records: 1250,
      application_context: appContext
    };
    
    setDatasets([newDataset, ...datasets]);
    setIsDialogOpen(false);
    setScanStep(0);
    setAppContext("");
  };

  const handleRegenerateField = async (field: 'name' | 'description' | 'tags') => {
    // Simulate AI regeneration delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const variations: Record<string, any[]> = {
      name: [
        "Refined " + (appContext ? "Telecom Support" : "Customer QA"),
        "Advanced " + (appContext ? "Contextual Logs" : "Support Interactions"),
        "High-Fidelity " + (appContext ? "Agent Dataset" : "Conversation Data")
      ],
      description: [
        "Enhanced version with improved semantic annotations and metadata.",
        "A comprehensive collection of real-world interactions for robust evaluation.",
        "Optimized dataset structure for deep learning and agentic testing."
      ],
      tags: [
        ["agentic", "llm-eval", "robustness"],
        ["production-grade", "quality", "semantic"],
        ["automated", "synthetic-augmented", "validation"]
      ]
    };

    const randomIndex = Math.floor(Math.random() * variations[field].length);
    return {
      value: variations[field][randomIndex],
      confidence: 0.90 + Math.random() * 0.09
    };
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
          <p className="text-muted-foreground mt-2">
            Manage your evaluation datasets. We automatically detect schema and suggest relevant tags based on your application context.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Dataset</DialogTitle>
              <DialogDescription>
                Upload your data file and provide context for better AI recommendations.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {scanStep === 0 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer group" onClick={handleScan}>
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">Click to upload or drag file</h3>
                    <p className="text-sm text-muted-foreground">Support for CSV, JSON, JSONL</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Application Context (Optional)
                    </label>
                    <Textarea 
                      placeholder="e.g. Customer support chatbot for a telecom company..."
                      value={appContext}
                      onChange={(e) => setAppContext(e.target.value)}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Helping AI understand your scenario improves metadata accuracy.
                    </p>
                  </div>
                  
                  <Button className="w-full" onClick={handleScan} disabled={isScanning}>
                    {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Analyze & Generate Metadata
                  </Button>
                </div>
              )}

              {scanStep === 1 && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <div className="text-center space-y-1">
                    <p className="font-medium text-lg">Analyzing Data Structure...</p>
                    <p className="text-sm text-muted-foreground">
                      Generating metadata based on {appContext ? "provided context" : "content analysis"}
                    </p>
                  </div>
                </div>
              )}

              {scanStep === 2 && (
                <DatasetMetadataEditor 
                  initialData={{
                    name: appContext ? "Telecom Support Logs" : "Customer Support Logs Q3",
                    description: appContext 
                      ? `Dataset tailored for ${appContext}. Contains conversation logs and intent classifications.` 
                      : "Auto-detected from CSV upload. Contains conversation history and resolution status.",
                    tags: appContext 
                      ? ["telecom", "support", "intent-detection"] 
                      : ["support", "conversation", "english"]
                  }}
                  onSave={handleSaveDataset}
                  onCancel={() => setIsDialogOpen(false)}
                  onRegenerateField={handleRegenerateField}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search datasets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <Card 
            key={dataset.id} 
            className="hover:border-primary/50 transition-colors group cursor-pointer"
            onClick={() => handleViewDetails(dataset)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="outline">{dataset.size}</Badge>
              </div>
              <CardTitle className="text-lg">{dataset.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {dataset.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dataset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-normal text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDatasets.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No datasets found matching your search.
          </div>
        )}
      </div>
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {selectedDataset?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedDataset?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            <div className="flex flex-wrap gap-2">
              {selectedDataset?.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Database className="h-4 w-4" />
                Sample Records ({datasetDetails.length})
              </h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Index</th>
                      <th className="px-4 py-2 text-left font-medium">Input</th>
                      <th className="px-4 py-2 text-left font-medium">Expected Output</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {datasetDetails.length > 0 ? (
                      datasetDetails.map((detail) => (
                        <tr key={detail.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-mono text-xs">{detail.row_index}</td>
                          <td className="px-4 py-3">
                            <div className="max-w-[200px] truncate" title={JSON.stringify(detail.input_data)}>
                              {typeof detail.input_data === 'string' ? detail.input_data : JSON.stringify(detail.input_data)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="max-w-[200px] truncate" title={JSON.stringify(detail.ground_truth_answer)}>
                              {typeof detail.ground_truth_answer === 'string' ? detail.ground_truth_answer : JSON.stringify(detail.ground_truth_answer)}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground italic">
                          No detail records found for this sample dataset.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-semibold mb-1">Format</p>
                <p className="uppercase">{selectedDataset?.file_format}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-semibold mb-1">Total Records</p>
                <p>{selectedDataset?.total_records?.toLocaleString() || "Unknown"}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
