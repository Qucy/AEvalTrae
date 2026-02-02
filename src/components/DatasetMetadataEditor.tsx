import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "./ui/badge";
import { Sparkles, RotateCcw, Check, X, Wand2 } from "lucide-react";
import { cn } from "../lib/utils";

interface MetadataField {
  value: string;
  confidence: number;
  isModified: boolean;
}

interface DatasetMetadataEditorProps {
  initialData: {
    name: string;
    description: string;
    tags: string[];
  };
  onSave: (data: { name: string; description: string; tags: string[] }) => void;
  onCancel: () => void;
  onRegenerateField?: (field: 'name' | 'description' | 'tags') => Promise<{ value: any; confidence: number }>;
  isGenerating?: boolean;
}

export function DatasetMetadataEditor({ initialData, onSave, onCancel, onRegenerateField, isGenerating = false }: DatasetMetadataEditorProps) {
  const [name, setName] = useState<MetadataField>({ value: initialData.name, confidence: 0.92, isModified: false });
  const [description, setDescription] = useState<MetadataField>({ value: initialData.description, confidence: 0.88, isModified: false });
  const [tags, setTags] = useState<{ value: string[]; confidence: number; isModified: boolean }>({ value: initialData.tags, confidence: 0.85, isModified: false });
  const [newTag, setNewTag] = useState("");
  const [isRegenerating, setIsRegenerating] = useState<Record<string, boolean>>({});

  const handleRegenerateField = async (field: 'name' | 'description' | 'tags') => {
    if (!onRegenerateField) return;
    
    setIsRegenerating(prev => ({ ...prev, [field]: true }));
    try {
      const result = await onRegenerateField(field);
      if (field === 'name') setName({ value: result.value, confidence: result.confidence, isModified: false });
      if (field === 'description') setDescription({ value: result.value, confidence: result.confidence, isModified: false });
      if (field === 'tags') setTags({ value: result.value, confidence: result.confidence, isModified: false });
    } finally {
      setIsRegenerating(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleRegenerateAll = async () => {
    setIsRegenerating({ name: true, description: true, tags: true });
    try {
      await Promise.all([
        handleRegenerateField('name'),
        handleRegenerateField('description'),
        handleRegenerateField('tags')
      ]);
    } finally {
      setIsRegenerating({});
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 0.7) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  const handleAddTag = () => {
    if (newTag && !tags.value.includes(newTag)) {
      setTags({ ...tags, value: [...tags.value, newTag], isModified: true });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags({ ...tags, value: tags.value.filter(t => t !== tagToRemove), isModified: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI-Generated Metadata
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRegenerateAll} 
          disabled={Object.values(isRegenerating).some(Boolean) || isGenerating}
        >
          <RotateCcw className={cn("mr-2 h-3 w-3", Object.values(isRegenerating).some(Boolean) && "animate-spin")} />
          Regenerate All
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="name">Dataset Name</Label>
            <Badge variant="secondary" className={cn("text-[10px] font-mono", getConfidenceColor(name.confidence))}>
              {Math.round(name.confidence * 100)}% Confidence
            </Badge>
          </div>
          <div className="flex gap-2">
            <Input
              id="name"
              value={name.value}
              onChange={(e) => setName({ ...name, value: e.target.value, isModified: true })}
              className={cn(name.isModified && "border-primary/50")}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0" 
              title="Regenerate Name Only"
              onClick={() => handleRegenerateField('name')}
              disabled={isRegenerating.name}
            >
              <Wand2 className={cn("h-4 w-4 text-muted-foreground", isRegenerating.name && "animate-pulse")} />
            </Button>
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Description</Label>
            <Badge variant="secondary" className={cn("text-[10px] font-mono", getConfidenceColor(description.confidence))}>
              {Math.round(description.confidence * 100)}% Confidence
            </Badge>
          </div>
          <div className="flex gap-2">
            <Textarea
              id="description"
              value={description.value}
              onChange={(e) => setDescription({ ...description, value: e.target.value, isModified: true })}
              className={cn("min-h-[80px]", description.isModified && "border-primary/50")}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0" 
              title="Regenerate Description Only"
              onClick={() => handleRegenerateField('description')}
              disabled={isRegenerating.description}
            >
              <Wand2 className={cn("h-4 w-4 text-muted-foreground", isRegenerating.description && "animate-pulse")} />
            </Button>
          </div>
        </div>

        {/* Tags Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Semantic Tags</Label>
            <Badge variant="secondary" className={cn("text-[10px] font-mono", getConfidenceColor(tags.confidence))}>
              {Math.round(tags.confidence * 100)}% Confidence
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/10 min-h-[42px]">
            {tags.value.map((tag) => (
              <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <div className="flex items-center gap-2 min-w-[120px]">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add tag..."
                className="h-6 text-xs border-none shadow-none focus-visible:ring-0 bg-transparent p-0"
              />
            </div>
          </div>
          <div className="flex justify-end mt-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-[10px] text-muted-foreground hover:text-primary"
              onClick={() => handleRegenerateField('tags')}
              disabled={isRegenerating.tags}
            >
              <Wand2 className={cn("mr-1 h-3 w-3", isRegenerating.tags && "animate-pulse")} />
              Regenerate Tags
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave({ name: name.value, description: description.value, tags: tags.value })}>
          <Check className="mr-2 h-4 w-4" />
          Confirm & Save
        </Button>
      </div>
    </div>
  );
}
