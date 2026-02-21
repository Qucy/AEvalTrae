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
import { ArrowLeft, ArrowRight, Check, Database, BarChart, FileCheck, Layers, ListFilter, Type, Pencil, Clock, Coins, Info, FileText, Sparkles, AlertCircle } from "lucide-react";
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
    },
    {
      id: "safety",
      name: "Safety & Alignment",
      description: "Rigorous testing for toxicity, bias, and jailbreak resistance.",
      metrics: ["met-004", "met-005", "met-006", "met-017", "met-018"]
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

  // Determine if a metric should be disabled based on the selected dataset's tags
  // This enforces the correlation between dataset type and relevant metrics
  const isMetricCompatible = (metric: any) => {
    if (!selectedDataset) return true;
    
    // Safety metrics are always relevant for Safety Bench
    if (selectedDataset.tags.includes("safety") && metric.category === "Safety") return true;
    // But other metrics might not be relevant for a pure safety test
    if (selectedDataset.tags.includes("safety") && metric.category !== "Safety") return false;

    // Code metrics are only relevant for Code datasets
    if (metric.category === "Code") {
      return selectedDataset.tags.includes("code");
    }

    // RAG metrics are only relevant for QA/Support datasets (simplification)
    if (metric.category === "RAG") {
      return selectedDataset.tags.includes("qa") || selectedDataset.tags.includes("support");
    }

    // Default to true for generic metrics (Performance, Style, etc.) unless specifically excluded
    return true;
  };

  // Check if a scenario is compatible with the selected dataset
  const isScenarioCompatible = (scenarioId: string) => {
    if (!selectedDataset) return true;

    if (scenarioId === "safety") {
      // Safety scenario is best for safety/adversarial datasets
      return selectedDataset.tags.includes("safety") || selectedDataset.tags.includes("adversarial");
    }

    if (scenarioId === "code") {
      return selectedDataset.tags.includes("code");
    }

    if (scenarioId === "rag") {
      return selectedDataset.tags.includes("qa") || selectedDataset.tags.includes("support");
    }

    // Chatbot is generally applicable but we can be strict if it's a specialized dataset
    if (scenarioId === "chatbot") {
      // Don't recommend general chatbot for pure code or safety datasets
      return !selectedDataset.tags.includes("code") && !selectedDataset.tags.includes("safety");
    }

    return true;
  };

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
                        {scenarios.sort((a, b) => {
                          const aCompatible = isScenarioCompatible(a.id);
                          const bCompatible = isScenarioCompatible(b.id);
                          if (aCompatible && !bCompatible) return -1;
                          if (!aCompatible && bCompatible) return 1;
                          return 0;
                        }).map((scenario) => {
                          // Check if all metrics in this scenario are selected
                          const isSelected = scenario.metrics.every(id => selectedMetricIds.includes(id)) && 
                                           scenario.metrics.length === selectedMetricIds.length;
                          const isCompatible = isScenarioCompatible(scenario.id);
                          
                          return (
                            <Card 
                              key={scenario.id}
                              className={cn(
                                "cursor-pointer transition-all hover:border-primary/50",
                                isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "",
                                !isCompatible && "opacity-50 cursor-not-allowed bg-muted/20"
                              )}
                              onClick={() => isCompatible && selectScenario(scenario.id)}
                            >
                              <CardHeader>
                                <CardTitle className={cn("text-base flex justify-between items-center", !isCompatible && "text-muted-foreground")}>
                                  {scenario.name}
                                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                                </CardTitle>
                                <CardDescription>
                                  {scenario.description}
                                  {!isCompatible && (
                                    <span className="block text-[10px] text-amber-600 font-medium mt-1">
                                      Not recommended for selected dataset
                                    </span>
                                  )}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {scenario.metrics.map(mid => {
                                    const m = metrics.find(metric => metric.id === mid);
                                    return m ? (
                                      <Badge key={m.id} variant={isCompatible ? "secondary" : "outline"} className={cn("text-xs font-normal", !isCompatible && "text-muted-foreground border-muted-foreground/30")}>
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
                        
                        // Sort metrics: compatible ones first
                        const sortedMetrics = [...categoryMetrics].sort((a, b) => {
                          const aCompatible = isMetricCompatible(a);
                          const bCompatible = isMetricCompatible(b);
                          if (aCompatible && !bCompatible) return -1;
                          if (!aCompatible && bCompatible) return 1;
                          return 0;
                        });

                        // Check if any metric in this category is compatible
                        const hasCompatibleMetrics = sortedMetrics.some(m => isMetricCompatible(m));
                        
                        return (
                          <div key={category} className={cn("space-y-3 transition-opacity", !hasCompatibleMetrics && "opacity-60")}>
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                              {category}
                              {!hasCompatibleMetrics && <span className="text-[10px] bg-muted px-2 py-0.5 rounded">Not Recommended</span>}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {sortedMetrics.map((metric) => {
                                const isCompatible = isMetricCompatible(metric);
                                return (
                                <div
                                  key={metric.id}
                                  className={cn(
                                    "flex items-start space-x-3 p-3 rounded-lg border transition-colors",
                                    selectedMetricIds.includes(metric.id) 
                                      ? "bg-primary/5 border-primary" 
                                      : isCompatible ? "hover:bg-muted/50" : "opacity-50 cursor-not-allowed bg-muted/20"
                                  )}
                                >
                                  <Checkbox 
                                    id={metric.id} 
                                    checked={selectedMetricIds.includes(metric.id)}
                                    onCheckedChange={() => isCompatible && toggleMetric(metric.id)}
                                    disabled={!isCompatible}
                                  />
                                  <div className="grid gap-1.5 leading-none">
                                    <Label 
                                      htmlFor={metric.id}
                                      className={cn(
                                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                        isCompatible ? "cursor-pointer" : "cursor-not-allowed"
                                      )}
                                    >
                                      {metric.name}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      {metric.description}
                                    </p>
                                    {!isCompatible && (
                                      <p className="text-[10px] text-amber-600 font-medium mt-1">
                                        Not recommended for selected dataset
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                              })}
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
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-1 border-b pb-4">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground/90">Review Evaluation Details</h3>
                    <p className="text-sm text-muted-foreground">Review your configuration before starting the evaluation run.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COL: Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* 1. Basic Info Card */}
                      <div className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Info className="w-4 h-4" />
                              </div>
                              <h4 className="font-semibold text-lg">Basic Info</h4>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-primary hover:text-primary/80 hover:bg-primary/5 font-medium opacity-0 group-hover:opacity-100 transition-opacity" 
                              onClick={() => setStep(0)}
                            >
                              Edit
                            </Button>
                          </div>
                          
                          <div className="pl-1">
                            <h3 className="text-xl font-bold text-foreground mb-2">{evalName || "Untitled Evaluation"}</h3>
                            {evalDescription ? (
                              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                {evalDescription}
                              </p>
                            ) : (
                              <p className="text-muted-foreground/50 text-sm italic">No description provided</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Dataset Card */}
                      <div className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Database className="w-4 h-4" />
                              </div>
                              <h4 className="font-semibold text-lg">Dataset</h4>
                              {selectedDataset && (
                                <span className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-200 dark:border-blue-800">
                                  {selectedDataset.size} samples
                                </span>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium opacity-0 group-hover:opacity-100 transition-opacity" 
                              onClick={() => setStep(1)}
                            >
                              Change
                            </Button>
                          </div>
                          
                          <div className="pl-1">
                            {selectedDataset ? (
                              <div className="flex gap-4 items-start">
                                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
                                  <FileText className="h-6 w-6 text-muted-foreground/50" />
                                </div>
                                <div className="space-y-1">
                                  <p className="font-semibold text-foreground">{selectedDataset.name}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{selectedDataset.description}</p>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {selectedDataset.tags.map(tag => (
                                      <span key={tag} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-gray-500/10">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-destructive text-sm p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                                <AlertCircle className="w-4 h-4" />
                                No dataset selected
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 3. Metrics Card */}
                      <div className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20 group-hover:bg-purple-500 transition-colors" />
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <BarChart className="w-4 h-4" />
                              </div>
                              <h4 className="font-semibold text-lg">Metrics</h4>
                              <span className="ml-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-purple-200 dark:border-purple-800">
                                {selectedMetricIds.length} selected
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium opacity-0 group-hover:opacity-100 transition-opacity" 
                              onClick={() => setStep(2)}
                            >
                              Change
                            </Button>
                          </div>
                          
                          <div className="pl-1">
                            {selectedMetricsList.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {selectedMetricsList.map(m => (
                                  <div 
                                    key={m.id} 
                                    className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                  >
                                    <span className={cn(
                                      "h-2 w-2 rounded-full",
                                      m.category === "Safety" ? "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.4)]" :
                                      m.category === "Accuracy" ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.4)]" :
                                      "bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.4)]"
                                    )} />
                                    {m.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-destructive text-sm p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                                <AlertCircle className="w-4 h-4" />
                                No metrics selected
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COL: Estimates Summary */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-6 rounded-xl border bg-muted/30 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Summary Estimates</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                              <Clock className="h-5 w-5" />
                              <span className="font-medium">Duration</span>
                            </div>
                            <span className="font-mono text-xl font-bold text-foreground">
                              ~{Math.max(1, Math.round(selectedMetricIds.length * 1.5))} <span className="text-sm font-normal text-muted-foreground">min</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                              <Coins className="h-5 w-5" />
                              <span className="font-medium">Est. Cost</span>
                            </div>
                            <span className="font-mono text-xl font-bold text-green-600 dark:text-green-400">
                              ${(selectedMetricIds.length * 0.05).toFixed(2)}
                            </span>
                          </div>

                          <div className="h-px bg-border my-6" />
                          
                          <div className="rounded-lg bg-background p-4 border text-xs text-muted-foreground">
                            <p className="flex gap-2">
                              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              Estimates are based on average processing times and current token pricing. Actual values may vary.
                            </p>
                          </div>
                        </div>
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
