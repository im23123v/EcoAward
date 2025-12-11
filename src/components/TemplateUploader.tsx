import { useCallback, useRef } from "react";
import { Upload, Image, X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { CertificateTemplate } from "@/types/certificate";

interface TemplateUploaderProps {
  templates: CertificateTemplate[];
  activeTemplateId: string | null;
  onTemplateUpload: (file: File) => void;
  onTemplateSelect: (id: string) => void;
  onTemplateRemove: (id: string) => void;
  maxTemplates?: number;
}

export const TemplateUploader = ({
  templates,
  activeTemplateId,
  onTemplateUpload,
  onTemplateSelect,
  onTemplateRemove,
  maxTemplates = 3,
}: TemplateUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onTemplateUpload(file);
      }
      e.target.value = "";
    },
    [onTemplateUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onTemplateUpload(file);
      }
    },
    [onTemplateUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Image className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Certificate Templates</h3>
          <p className="text-sm text-muted-foreground">
            Upload up to {maxTemplates} templates for batch generation
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      {templates.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                activeTemplateId === template.id
                  ? "border-primary shadow-elevated"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <img
                src={template.url}
                alt={template.name}
                className="w-full h-20 object-cover"
              />
              <button
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTemplateRemove(template.id);
                }}
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                <p className="text-[10px] text-white truncate">{template.name}</p>
              </div>
              {activeTemplateId === template.id && (
                <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {templates.length < maxTemplates && (
        <div
          className="border-2 border-dashed border-border rounded-2xl p-6 hover:border-primary/50 hover:bg-secondary/30 transition-all cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center text-center">
            {templates.length === 0 ? (
              <>
                <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-4 shadow-gold">
                  <Upload className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="font-medium mb-1">Drop your template here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (PNG, JPG)
                </p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-2">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium">Add another template</p>
                <p className="text-xs text-muted-foreground">
                  {maxTemplates - templates.length} slot{maxTemplates - templates.length !== 1 ? 's' : ''} remaining
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {templates.length >= maxTemplates && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          Maximum {maxTemplates} templates reached
        </p>
      )}
    </div>
  );
};
