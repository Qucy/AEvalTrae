import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Search, Plus, FileText, Database, Sparkles, Loader2, Check } from "lucide-react";
import datasetsMock from "../mocks/datasets.json";
import { cn } from "../lib/utils";

export function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [datasets, setDatasets] = useState(datasetsMock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: idle, 1: scanning, 2: detected
  
  // Filter datasets based on search
  const filteredDatasets = datasets.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleScan = () => {
    setIsScanning(true);
    setScanStep(1);
    
    // Simulate smart detection process
    setTimeout(() => {
      setScanStep(2);
      setIsScanning(false);
    }, 2000);
  };

  const handleAddDataset = () => {
    // Add a mock dataset
    const newDataset = {
      id: `ds-${Date.now()}`,
      name: "Customer Support Logs Q3",
      description: "Auto-detected from CSV upload. Contains conversation history and resolution status.",
      size: "15MB",
      tags: ["support", "conversation", "english"],
      date: "2023-10-25"
    };
    
    setDatasets([newDataset, ...datasets]);
    setIsDialogOpen(false);
    setScanStep(0);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
          <p className="text-muted-foreground mt-2">
            Manage your evaluation datasets. We automatically detect schema and suggest relevant tags.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Dataset</DialogTitle>
              <DialogDescription>
                Upload your data file (CSV, JSON, JSONL). We'll analyze it automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {scanStep === 0 && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleScan}>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Click to upload or drag file</h3>
                  <p className="text-sm text-muted-foreground">Support for CSV, JSON, JSONL</p>
                </div>
              )}

              {scanStep === 1 && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <div className="text-center space-y-1">
                    <p className="font-medium">Analyzing Data Structure...</p>
                    <p className="text-xs text-muted-foreground">Detecting columns, data types, and semantic context</p>
                  </div>
                </div>
              )}

              {scanStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Smart Detection Complete</h4>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        We identified <strong>Customer Support</strong> interactions. 
                        Suggested tags: <Badge variant="outline" className="bg-white/50 text-xs py-0 h-4">support</Badge> <Badge variant="outline" className="bg-white/50 text-xs py-0 h-4">conversation</Badge>
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Dataset Name</Label>
                    <Input id="name" defaultValue="Customer Support Logs Q3" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description</Label>
                    <Input id="desc" defaultValue="Auto-detected from CSV upload." />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {scanStep === 2 ? (
                <Button onClick={handleAddDataset}>
                  <Check className="mr-2 h-4 w-4" />
                  Save Dataset
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              )}
            </DialogFooter>
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
          <Card key={dataset.id} className="hover:border-primary/50 transition-colors group cursor-pointer">
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
    </div>
  );
}
