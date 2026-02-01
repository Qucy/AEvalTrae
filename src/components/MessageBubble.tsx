import React from "react";
import { cn } from "../lib/utils";
import { ChatMessage } from "../types";
import { RecommendationCard } from "./RecommendationCard";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  onAcceptRecommendation: () => void;
  onModifyRecommendation: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onAcceptRecommendation,
  onModifyRecommendation,
}) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted border border-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className={cn("flex flex-col gap-2 max-w-[80%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted/50 border border-primary/5 text-foreground rounded-bl-none"
          )}
        >
          {message.content}
        </div>

        {message.recommendation && (
          <div className="mt-2">
            <RecommendationCard
              recommendation={message.recommendation}
              onAccept={onAcceptRecommendation}
              onModify={onModifyRecommendation}
            />
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
};
