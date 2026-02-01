import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Metric, Recommendation } from "../types";
import metricsData from "../mocks/metrics.json";

interface ModifyMetricsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation;
  onSave: (updatedMetrics: Metric[]) => void;
}

export const ModifyMetricsDialog: React.FC<ModifyMetricsDialogProps> = ({
  isOpen,
  onClose,
  recommendation,
  onSave,
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    recommendation.metrics.map((m) => m.id)
  );

  const handleToggle = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleSave = () => {
    const updated = (metricsData as Metric[]).filter((m) =>
      selectedMetrics.includes(m.id)
    );
    onSave(updated);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modify Metrics</DialogTitle>
          <DialogDescription>
            Select or deselect metrics for this evaluation.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid gap-4 py-4">
            {(metricsData as Metric[]).map((metric) => (
              <div key={metric.id} className="flex items-start space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={() => handleToggle(metric.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={metric.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
