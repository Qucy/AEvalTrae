import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full gap-3 justify-start">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted border border-primary/10">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-muted/50 border border-primary/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 h-[46px]">
        <motion.div
          className="h-2 w-2 bg-primary/40 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        />
        <motion.div
          className="h-2 w-2 bg-primary/40 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="h-2 w-2 bg-primary/40 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
    </div>
  );
};
