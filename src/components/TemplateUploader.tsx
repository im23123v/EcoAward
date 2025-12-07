import { useCallback } from "react";
import { Upload, Image } from "lucide-react";
import { Button } from "./ui/button";

interface TemplateUploaderProps {
  onTemplateUpload: (file: File) => void;
  templatePreview: string | null;
}

export const TemplateUploader = ({ onTemplateUpload, templatePreview }: TemplateUploaderProps) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onTemplateUpload(file);
      }
    },
    [onTemplateUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onTemplateUpload(file);
      }
    },
    [onTemplateUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Image className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Certificate Template</h3>
          <p className="text-sm text-muted-foreground">Upload your certificate design</p>
        </div>
      </div>

      {!templatePreview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-secondary/30 transition-all duration-300 cursor-pointer group"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="template-upload"
          />
          <label htmlFor="template-upload" className="cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-foreground font-medium mb-1">
              Drop your template here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PNG, JPG, JPEG (max 10MB)
            </p>
          </label>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-soft">
          <img
            src={templatePreview}
            alt="Template preview"
            className="w-full h-auto max-h-48 object-contain bg-muted/30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => document.getElementById("template-reupload")?.click()}
            >
              Change Template
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="template-reupload"
            />
          </div>
        </div>
      )}
    </div>
  );
};
