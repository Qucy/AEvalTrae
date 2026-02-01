import React, { useRef, useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Sparkles, Pencil } from "lucide-react";
import { ChatMessage, Recommendation, Metric } from "../types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ModifyMetricsDialog } from "./ModifyMetricsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onAcceptRecommendation: (rec: any) => void;
  onModifyRecommendation: (rec: any) => void;
  onUpdateMetrics: (rec: Recommendation, metrics: Metric[]) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onAcceptRecommendation,
  onModifyRecommendation,
  onUpdateMetrics,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [editingRec, setEditingRec] = useState<Recommendation | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [evalName, setEvalName] = useState("");
  const [evalDesc, setEvalDesc] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show name dialog only on first load if no messages yet (except welcome)
    // Or we could trigger it manually. For now, let's keep it simple and maybe add a button in header.
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm relative">
      <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold leading-none">AI Evaluation Assistant</h3>
            <p className="text-xs text-muted-foreground mt-1">Powered by Prototype Logic</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-7"
          onClick={() => setShowNameDialog(true)}
        >
          <Pencil className="w-3 h-3 mr-1" />
          {evalName ? "Edit Info" : "Name Evaluation"}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="flex flex-col gap-6">
          {evalName && (
             <div className="bg-muted/30 p-3 rounded-lg border text-sm text-center mb-2 mx-auto max-w-md">
               <span className="font-semibold block">{evalName}</span>
               {evalDesc && <span className="text-muted-foreground text-xs">{evalDesc}</span>}
             </div>
          )}
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onAcceptRecommendation={() => onAcceptRecommendation(msg.recommendation)}
              onModifyRecommendation={() => setEditingRec(msg.recommendation!)}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Input
            placeholder="Describe your evaluation goal (e.g., 'Test RAG safety')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isTyping}
            autoFocus
          />
          <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-[10px] text-center text-muted-foreground">
          AI may generate inaccurate results. This is a prototype.
        </p>
      </div>

      {editingRec && (
        <ModifyMetricsDialog
          isOpen={!!editingRec}
          onClose={() => setEditingRec(null)}
          recommendation={editingRec}
          onSave={(metrics) => onUpdateMetrics(editingRec, metrics)}
        />
      )}

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evaluation Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Evaluation Name</Label>
              <Input 
                id="name" 
                value={evalName} 
                onChange={(e) => setEvalName(e.target.value)}
                placeholder="e.g. Weekly RAG Check"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Input 
                id="desc" 
                value={evalDesc} 
                onChange={(e) => setEvalDesc(e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowNameDialog(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
