import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight, Check } from "lucide-react";

interface WizardData {
  role: string;
  goal: string;
  agentName: string;
}

export const WizardDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({ role: "", goal: "", agentName: "" });

  useEffect(() => {
    const hasOnboarded = localStorage.getItem("aeval_onboarded");
    if (!hasOnboarded) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("aeval_onboarded", "true");
    localStorage.setItem("aeval_user_context", JSON.stringify(data));
    setIsOpen(false);
    // Optional: Reload or trigger a state update to refresh the greeting
    window.location.reload(); 
  };

  const handleChange = (field: keyof WizardData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to AEval</DialogTitle>
          <DialogDescription>
            Let's set up your workspace in 3 simple steps.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {step === 1 && (
            <div className="grid gap-2">
              <Label htmlFor="role">What is your role?</Label>
              <Input
                id="role"
                placeholder="e.g. AI Engineer, Product Manager"
                value={data.role}
                onChange={(e) => handleChange("role", e.target.value)}
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-2">
              <Label htmlFor="goal">What is your primary evaluation goal?</Label>
              <Input
                id="goal"
                placeholder="e.g. Reduce hallucinations, Improve accuracy"
                value={data.goal}
                onChange={(e) => handleChange("goal", e.target.value)}
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-2">
              <Label htmlFor="agentName">What's the name of the agent you're testing?</Label>
              <Input
                id="agentName"
                placeholder="e.g. SupportBot v2"
                value={data.agentName}
                onChange={(e) => handleChange("agentName", e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between items-center">
            <div className="text-xs text-muted-foreground">Step {step} of 3</div>
            <Button onClick={handleNext} disabled={step === 1 && !data.role || step === 2 && !data.goal || step === 3 && !data.agentName}>
              {step === 3 ? "Finish" : "Next"}
              {step === 3 ? <Check className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
