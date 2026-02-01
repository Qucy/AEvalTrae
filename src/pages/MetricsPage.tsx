import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Search, Plus, Ruler, Code, Brain, Zap, Check } from "lucide-react";
import metricsMock from "../mocks/metrics.json";
import { cn } from "../lib/utils";

export function MetricsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [metrics, setMetrics] = useState(metricsMock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMetricType, setNewMetricType] = useState<"code" | "llm">("code");

  // Group metrics by category
  const groupedMetrics = metrics.reduce((acc, metric) => {
    const category = metric.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, typeof metrics>);

  const filteredCategories = Object.entries(groupedMetrics).filter(([category, items]) => {
    const matchingItems = items.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchingItems.length > 0;
  });

  const handleAddMetric = () => {
    const newMetric = {
      id: `met-${Date.now()}`,
      name: "Custom Consistency Check",
      description: "Checks if the response tone matches the user persona.",
      category: "Quality",
      type: newMetricType
    };
    setMetrics([newMetric, ...metrics]);
    setIsDialogOpen(false);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metrics Library</h1>
          <p className="text-muted-foreground mt-2">
            Standard and custom metrics to evaluate your agents.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Metric
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Metric</DialogTitle>
              <DialogDescription>
                Define a new evaluation metric using Python code or LLM-as-a-Judge.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="code" onValueChange={(v) => setNewMetricType(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">
                  <Code className="w-4 h-4 mr-2" />
                  Python Code
                </TabsTrigger>
                <TabsTrigger value="llm">
                  <Brain className="w-4 h-4 mr-2" />
                  LLM Judge
                </TabsTrigger>
              </TabsList>
              
              <div className="py-4 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Metric Name</Label>
                  <Input id="name" placeholder="e.g., Tone Consistency" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Input id="desc" placeholder="What does this metric measure?" />
                </div>

                <TabsContent value="code" className="mt-0 space-y-2">
                  <Label>Python Implementation</Label>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm h-32 overflow-auto">
                    <span className="text-purple-400">def</span> <span className="text-blue-400">evaluate</span>(response, reference):<br/>
                    &nbsp;&nbsp;<span className="text-gray-400"># Your logic here</span><br/>
                    &nbsp;&nbsp;<span className="text-purple-400">return</span> score
                  </div>
                </TabsContent>

                <TabsContent value="llm" className="mt-0 space-y-2">
                  <Label>LLM Prompt Template</Label>
                  <div className="bg-muted p-4 rounded-lg text-sm h-32 overflow-auto whitespace-pre-wrap">
                    You are an expert evaluator. Please rate the following response on a scale of 1-5 based on...
                    {"\n\n"}
                    Response: {"{{response}}"}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter>
              <Button onClick={handleAddMetric}>
                <Check className="mr-2 h-4 w-4" />
                Create Metric
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-8">
        {filteredCategories.map(([category, items]) => {
            const filteredItems = items.filter(m => 
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                m.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (filteredItems.length === 0) return null;

            return (
                <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">{category}</h2>
                        <Badge variant="secondary" className="rounded-full px-2.5">{filteredItems.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((metric) => (
                        <Card key={metric.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                            <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className={cn(
                                    "h-10 w-10 rounded-lg flex items-center justify-center mb-2",
                                    metric.category === "Safety" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
                                    metric.category === "Accuracy" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                                    "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                )}>
                                <Ruler className="h-5 w-5" />
                                </div>
                                {metric.id.startsWith("met-") && <Badge variant="outline" className="font-mono text-[10px]">{metric.id}</Badge>}
                            </div>
                            <CardTitle className="text-base">{metric.name}</CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">
                                {metric.description}
                            </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {metric.category === "Code" ? <Code className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                                    <span>Standard Metric</span>
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </div>
            );
        })}
        {filteredCategories.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No metrics found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
