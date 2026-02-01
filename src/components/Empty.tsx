import { Construction } from "lucide-react";

interface EmptyProps {
  title?: string;
  description?: string;
}

export default function Empty({ title = "Coming Soon", description = "This feature is currently under development." }: EmptyProps) {
  return (
    <div className="flex flex-col h-[60vh] items-center justify-center text-center p-8">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <Construction className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
