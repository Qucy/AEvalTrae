import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Recommendation } from "../types";
import { ChevronDown, ChevronUp, Check, Settings2, Database, BarChart2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept: () => void;
  onModify: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAccept,
  onModify,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full max-w-md border-primary/20 bg-background/50 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary">
            Recommended Configuration
          </CardTitle>
          <Badge variant="outline" className="border-primary/30 text-primary">
            {recommendation.scenario.name}
          </Badge>
        </div>
        <CardDescription>
          Based on your intent, here is the optimal evaluation setup.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dataset Section */}
        <div className="flex items-start space-x-3 rounded-lg border p-3 bg-card/50">
          <Database className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <h4 className="font-semibold text-sm">Dataset</h4>
            <p className="text-sm text-muted-foreground">{recommendation.dataset.name}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-[10px] h-5">{recommendation.dataset.size}</Badge>
              {recommendation.dataset.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-[10px] h-5">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Section */}
        <div className="flex items-start space-x-3 rounded-lg border p-3 bg-card/50">
          <Bot className="mt-1 h-5 w-5 text-purple-500" />
          <div>
            <h4 className="font-semibold text-sm">Agent</h4>
            <p className="text-sm text-muted-foreground">{recommendation.agent.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{recommendation.agent.type}</p>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="flex items-start space-x-3 rounded-lg border p-3 bg-card/50">
          <BarChart2 className="mt-1 h-5 w-5 text-green-500" />
          <div className="w-full">
            <h4 className="font-semibold text-sm mb-1">Key Metrics</h4>
            <div className="flex flex-wrap gap-2">
              {recommendation.metrics.map((metric) => (
                <Badge key={metric.id} variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200">
                  {metric.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Why this recommendation? */}
        <div className="pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <span>Why this recommendation?</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                  "{recommendation.reason}"
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-3 pt-2">
        <Button variant="outline" className="w-full" onClick={onModify}>
          <Settings2 className="mr-2 h-4 w-4" />
          Modify
        </Button>
        <Button className="w-full" onClick={onAccept}>
          <Check className="mr-2 h-4 w-4" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};
