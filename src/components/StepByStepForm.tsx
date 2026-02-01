import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, ArrowRight, Check, Database, BarChart, FileCheck, Layers, ListFilter, Type } from "lucide-react";
import datasets from "../mocks/datasets.json";
import metrics from "../mocks/metrics.json";
import { cn } from "../lib/utils";

interface StepByStepFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function StepByStepForm({ onComplete, onCancel }: StepByStepFormProps) {
  const [step, setStep] = useState(0);
  const [evalName, setEvalName] = useState("");
  const [evalDescription, setEvalDescription] = useState("");
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metricsMode, setMetricsMode] = useState<"scenario" | "manual">("scenario");

  const steps = [
    { id: 0, title: "Basic Info", icon: Type },
    { id: 1, title: "Select Dataset", icon: Database },
    { id: 2, title: "Choose Metrics", icon: BarChart },
    { id: 3, title: "Review", icon: FileCheck },
  ];

  const scenarios = [
    {
      id: "rag",
      name: "RAG Evaluation",
      description: "Best for Retrieval-Augmented Generation systems. Focuses on faithfulness and relevance.",
      metrics: ["met-004", "met-010", "met-011", "met-020"]
    },
    {
      id: "chatbot",
      name: "Conversational Chatbot",
      description: "Evaluates general chat capabilities, tone, coherence, and safety.",
      metrics: ["met-005", "met-012", "met-013", "met-015", "met-017"]
    },
    {
      id: "code",
      name: "Code Generation",
      description: "Strict evaluation for coding assistants. Checks syntax and execution.",
      metrics: ["met-001", "met-007", "met-016"]
    }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1500);
  };

  const toggleMetric = (id: string) => {
    setSelectedMetricIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const selectScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedMetricIds(scenario.metrics);
    }
  };

  const selectedDataset = datasets.find(d => d.id === selectedDatasetId);
  const selectedMetricsList = metrics.filter(m => selectedMetricIds.includes(m.id));

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header / Stepper */}
      <div className="p-6 border-b bg-muted/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Evaluation</h2>
          <span className="text-sm text-muted-foreground">Step {step + 1} of 4</span>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors duration-300",
                  step >= s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s.id ? <Check className="w-4 h-4" /> : s.id + 1}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={cn("text-sm font-medium", step >= s.id ? "text-foreground" : "text-muted-foreground")}>
                  {s.title}
                </p>
              </div>
              {s.id < 3 && (
                <div className="flex-1 h-[2px] mx-4 bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: step > s.id ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="p-6 pb-24">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 max-w-lg mx-auto pt-8"
                >
                  <div className="space-y-2 text-center mb-8">
                    <h3 className="text-lg font-semibold">Name your evaluation</h3>
                    <p className="text-sm text-muted-foreground">
                      Give your evaluation task a clear name and description to identify it later.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="evalName">Evaluation Name</Label>
                      <Input 
                        id="evalName" 
                        placeholder="e.g. Q1 Customer Support Quality Check" 
                        value={evalName}
                        onChange={(e) => setEvalName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="evalDesc">Description (Optional)</Label>
                      <textarea
                        id="evalDesc"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe the purpose of this evaluation..."
                        value={evalDescription}
                        onChange={(e) => setEvalDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {datasets.map((ds) => (
                      <Card 
                        key={ds.id} 
                        className={cn(
                          "cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                          selectedDatasetId === ds.id ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                        )}
                        onClick={() => setSelectedDatasetId(ds.id)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between items-start">
                            {ds.name}
                            {selectedDatasetId === ds.id && <Check className="h-4 w-4 text-primary" />}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">{ds.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">{ds.size}</Badge>
                            {ds.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Tabs value={metricsMode} onValueChange={(v) => setMetricsMode(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="scenario">
                        <Layers className="w-4 h-4 mr-2" />
                        Scenario Based (Recommended)
                      </TabsTrigger>
                      <TabsTrigger value="manual">
                        <ListFilter className="w-4 h-4 mr-2" />
                        Manual Selection
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="scenario" className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {scenarios.map((scenario) => {
                          // Check if all metrics in this scenario are selected
                          const isSelected = scenario.metrics.every(id => selectedMetricIds.includes(id)) && 
                                           scenario.metrics.length === selectedMetricIds.length;
                          
                          return (
                            <Card 
                              key={scenario.id}
                              className={cn(
                                "cursor-pointer transition-all hover:border-primary/50",
                                isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                              )}
                              onClick={() => selectScenario(scenario.id)}
                            >
                              <CardHeader>
                                <CardTitle className="text-base flex justify-between items-center">
                                  {scenario.name}
                                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                                </CardTitle>
                                <CardDescription>{scenario.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {scenario.metrics.map(mid => {
                                    const m = metrics.find(metric => metric.id === mid);
                                    return m ? (
                                      <Badge key={m.id} variant="secondary" className="text-xs font-normal">
                                        {m.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-6">
                      {["Accuracy", "Safety", "Quality", "Code", "Performance"].map((category) => {
                        const categoryMetrics = metrics.filter(m => m.category === category);
                        if (categoryMetrics.length === 0) return null;
                        return (
                          <div key={category} className="space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{category}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {categoryMetrics.map((metric) => (
                                <div
                                  key={metric.id}
                                  className={cn(
                                    "flex items-start space-x-3 p-3 rounded-lg border transition-colors",
                                    selectedMetricIds.includes(metric.id) 
                                      ? "bg-primary/5 border-primary" 
                                      : "hover:bg-muted/50"
                                  )}
                                >
                                  <Checkbox 
                                    id={metric.id} 
                                    checked={selectedMetricIds.includes(metric.id)}
                                    onCheckedChange={() => toggleMetric(metric.id)}
                                  />
                                  <div className="grid gap-1.5 leading-none">
                                    <Label 
                                      htmlFor={metric.id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                      {metric.name}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      {metric.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Evaluation Summary</h3>

                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="grid gap-1">
                          <h4 className="font-semibold text-base">{evalName}</h4>
                          {evalDescription && (
                            <p className="text-sm text-muted-foreground">{evalDescription}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Selected Dataset</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedDataset ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{selectedDataset.name}</p>
                              <p className="text-sm text-muted-foreground">{selectedDataset.description}</p>
                            </div>
                            <Badge>{selectedDataset.size}</Badge>
                          </div>
                        ) : (
                          <p className="text-destructive">No dataset selected</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex justify-between items-center">
                          <span>Selected Metrics</span>
                          <Badge variant="secondary">{selectedMetricIds.length} selected</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedMetricsList.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedMetricsList.map(m => (
                              <Badge key={m.id} variant="outline" className="pl-1 pr-2 py-1">
                                <span className={cn(
                                  "mr-1.5 inline-block w-2 h-2 rounded-full",
                                  m.category === "Safety" ? "bg-red-500" :
                                  m.category === "Accuracy" ? "bg-green-500" :
                                  "bg-blue-500"
                                )} />
                                {m.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-destructive">No metrics selected</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <div className="bg-muted/30 p-4 rounded-lg border border-dashed">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Estimated Duration</span>
                        <span className="font-medium">~{Math.max(1, Math.round(selectedMetricIds.length * 1.5))} mins</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Cost</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ${(selectedMetricIds.length * 0.05).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background/95 backdrop-blur-sm flex justify-between items-center z-10">
        <Button variant="ghost" onClick={step === 0 ? onCancel : handleBack}>
          {step === 0 ? "Cancel" : "Back"}
        </Button>
        
        {step < 3 ? (
          <Button 
            onClick={handleNext} 
            disabled={
              (step === 0 && !evalName.trim()) ||
              (step === 1 && !selectedDatasetId)
            }
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedDatasetId || selectedMetricIds.length === 0 || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>Running Evaluation...</>
            ) : (
              <>
                Start Evaluation
                <Play className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Helper icon component since Play is not imported in the component above
function Play(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
