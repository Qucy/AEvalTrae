import { useState } from "react";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { ChatInterface } from "./components/ChatInterface";
import { StepByStepForm } from "./components/StepByStepForm";
import { useChat } from "./hooks/useChat";
import { WizardDialog } from "./components/WizardDialog";
import { Sparkles, Play, BarChart, Settings, Bot, ListChecks, ArrowLeft } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<"agentic" | "manual" | null>(null);
  const { messages, isTyping, sendMessage, acceptRecommendation, modifyRecommendation, updateMetrics } = useChat();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setCreationMode(null), 300);
    }
  };

  const renderDialogContent = () => {
    if (!creationMode) {
      return (
        <div className="flex flex-col h-full bg-background p-6">
          <DialogTitle className="text-2xl font-bold text-center mb-2">Create Evaluation</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mb-8">
            Choose how you want to configure your new evaluation task.
          </DialogDescription>
          
          <div className="grid grid-cols-1 gap-4 flex-1">
            <button
              onClick={() => setCreationMode("agentic")}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-muted/50 transition-all group"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground text-center">
                Chat with our AI to automatically find the best datasets and metrics for your goal.
              </p>
            </button>

            <button
              onClick={() => setCreationMode("manual")}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-muted/50 transition-all group"
            >
              <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ListChecks className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Step-by-Step</h3>
              <p className="text-sm text-muted-foreground text-center">
                Manually select datasets and configure metrics through a guided wizard.
              </p>
            </button>
          </div>
        </div>
      );
    }

    if (creationMode === "agentic") {
      return (
        <>
          <VisuallyHidden.Root>
            <DialogTitle>AI Assistant Evaluation</DialogTitle>
            <DialogDescription>Chat with AI to configure your evaluation</DialogDescription>
          </VisuallyHidden.Root>
          <ChatInterface
            messages={messages}
            isTyping={isTyping}
            onSendMessage={sendMessage}
            onAcceptRecommendation={acceptRecommendation}
            onModifyRecommendation={modifyRecommendation}
            onUpdateMetrics={updateMetrics}
          />
        </>
      );
    }

    if (creationMode === "manual") {
      return (
        <>
          <VisuallyHidden.Root>
            <DialogTitle>Manual Evaluation Wizard</DialogTitle>
            <DialogDescription>Step-by-step wizard to configure your evaluation</DialogDescription>
          </VisuallyHidden.Root>
          <StepByStepForm
            onComplete={() => setIsOpen(false)}
            onCancel={() => setCreationMode(null)}
          />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <WizardDialog />
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>AEval</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Dashboard</a>
            <a href="#" className="hover:text-foreground transition-colors">Datasets</a>
            <a href="#" className="hover:text-foreground transition-colors">Agents</a>
            <a href="#" className="hover:text-foreground transition-colors">Settings</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">Documentation</Button>
            <div className="h-8 w-8 rounded-full bg-muted border"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600 pb-2">
              AI Evaluation Made Simple
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl max-w-[42rem] mx-auto leading-relaxed">
              Configure, run, and analyze evaluations for your LLM agents in minutes. 
              Let our AI assistant guide you to the perfect setup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Evaluation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] h-[90vh] p-0 gap-0 overflow-hidden border-none bg-background shadow-2xl flex flex-col">
                {creationMode === "agentic" && (
                  <div className="absolute top-4 left-4 z-50">
                    <Button variant="ghost" size="icon" onClick={() => setCreationMode(null)} className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  {renderDialogContent()}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              <Play className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 text-left">
            <div className="space-y-2 p-4 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="font-bold">Auto-Configuration</h3>
              <p className="text-sm text-muted-foreground">Just describe your goal, and we'll select the right datasets and metrics.</p>
            </div>
            <div className="space-y-2 p-4 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <BarChart className="h-5 w-5" />
              </div>
              <h3 className="font-bold">Comprehensive Metrics</h3>
              <p className="text-sm text-muted-foreground">Access 50+ built-in metrics from accuracy to safety and toxicity.</p>
            </div>
            <div className="space-y-2 p-4 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">Get deep insights and actionable recommendations to improve your agents.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
