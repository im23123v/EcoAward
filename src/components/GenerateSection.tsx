import { useState } from "react";
import { Download, Loader2, CheckCircle, Sparkles, FileStack } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { CertificateTemplate } from "@/types/certificate";

interface GenerateSectionProps {
  templates: CertificateTemplate[];
  studentData: Record<string, string>[];
  isReady: boolean;
  onGenerate?: (count: number) => void;
}

export const GenerateSection = ({
  templates,
  studentData,
  isReady,
  onGenerate,
}: GenerateSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const generateCertificates = async () => {
    if (!isReady || templates.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    setCompleted(false);

    const zip = new JSZip();
    const totalOperations = templates.length * studentData.length;
    let completedOperations = 0;

    for (const template of templates) {
      console.log('Processing template:', template.name, 'with', template.textFields.length, 'text fields');
      if (template.textFields.length === 0) continue;

      // Load template image
      const templateImg = await loadImage(template.url);

      // Preload all stickers/images for this template
      const imageCache: Record<string, HTMLImageElement> = {};
      for (const element of template.imageElements) {
        try {
          imageCache[element.id] = await loadImage(element.src);
        } catch (e) {
          console.error('Failed to load image:', element.src);
        }
      }

      // Calculate scale factor
      const editorScale = Math.min(800 / templateImg.width, 600 / templateImg.height);
      const scaleBack = 1 / editorScale;

      // Create folder for this template if multiple templates
      const folderName = templates.length > 1 ? `${template.name}/` : "";

      for (let i = 0; i < studentData.length; i++) {
        const student = studentData[i];
        
        // Create canvas for this certificate
        const canvas = document.createElement("canvas");
        canvas.width = templateImg.width;
        canvas.height = templateImg.height;
        const ctx = canvas.getContext("2d")!;

        // Draw template
        ctx.drawImage(templateImg, 0, 0);

        // Draw images/stickers
        for (const element of template.imageElements) {
          const img = imageCache[element.id];
          if (img) {
            ctx.save();
            ctx.globalAlpha = element.opacity ?? 1;
            
            const scaledLeft = element.left * scaleBack;
            const scaledTop = element.top * scaleBack;
            const scaledWidth = img.width * element.scaleX * scaleBack;
            const scaledHeight = img.height * element.scaleY * scaleBack;
            
            if (element.rotation) {
              const centerX = scaledLeft + scaledWidth / 2;
              const centerY = scaledTop + scaledHeight / 2;
              ctx.translate(centerX, centerY);
              ctx.rotate((element.rotation * Math.PI) / 180);
              ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
            } else {
              ctx.drawImage(img, scaledLeft, scaledTop, scaledWidth, scaledHeight);
            }
            ctx.restore();
          }
        }

        // Draw text fields
        console.log('Drawing text fields:', template.textFields);
        template.textFields.forEach((field) => {
          const value = student[field.fieldName] || field.fieldName;
          console.log('Field:', field.fieldName, 'Value:', value, 'Position:', field.left, field.top);
          const scaledFontSize = Math.round(field.fontSize * scaleBack);
          const scaledLeft = field.left * scaleBack;
          const scaledTop = field.top * scaleBack;
          
          ctx.save();
          ctx.globalAlpha = field.opacity ?? 1;
          
          const fontStyle = field.fontStyle === "italic" ? "italic" : "";
          const fontWeight = field.fontWeight === "bold" ? "bold" : "";
          ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${field.fontFamily}`.trim();
          ctx.fillStyle = field.fill;
          ctx.textBaseline = "top";
          
          // Apply shadow if enabled
          if (field.shadow) {
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 4 * scaleBack;
            ctx.shadowOffsetX = 2 * scaleBack;
            ctx.shadowOffsetY = 2 * scaleBack;
          }

          // Apply stroke if enabled
          if (field.strokeWidth && field.strokeWidth > 0 && field.strokeColor) {
            ctx.strokeStyle = field.strokeColor;
            ctx.lineWidth = field.strokeWidth * scaleBack;
            ctx.strokeText(value, scaledLeft, scaledTop);
          }

          ctx.fillText(value, scaledLeft, scaledTop);

          // Draw underline if enabled
          if (field.underline) {
            const textWidth = ctx.measureText(value).width;
            ctx.beginPath();
            ctx.moveTo(scaledLeft, scaledTop + scaledFontSize + 2);
            ctx.lineTo(scaledLeft + textWidth, scaledTop + scaledFontSize + 2);
            ctx.strokeStyle = field.fill;
            ctx.lineWidth = Math.max(1, scaledFontSize / 15);
            ctx.stroke();
          }

          ctx.restore();
        });

        // Convert to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png");
        });

        // Add to zip with student name or index
        const fileName = student["Name"] || student["name"] || `certificate_${i + 1}`;
        zip.file(`${folderName}${fileName.replace(/[^a-zA-Z0-9]/g, "_")}.png`, blob);

        completedOperations++;
        setProgress(Math.round((completedOperations / totalOperations) * 100));
      }
    }

    // Generate and download zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "certificates.zip");

    setIsGenerating(false);
    setCompleted(true);
    
    const totalGenerated = templates.filter(t => t.textFields.length > 0).length * studentData.length;
    onGenerate?.(totalGenerated);
  };

  const templatesWithFields = templates.filter(t => t.textFields.length > 0);
  const totalCertificates = templatesWithFields.length * studentData.length;

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border gradient-card p-8 shadow-elevated">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="font-display text-2xl font-bold mb-2">Generate Certificates</h3>
          <p className="text-muted-foreground">
            {isReady
              ? `Ready to generate ${totalCertificates} certificate${totalCertificates !== 1 ? 's' : ''}`
              : "Complete all steps above to generate certificates"}
          </p>
          {templatesWithFields.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-accent-foreground">
              <FileStack className="w-4 h-4" />
              <span>{templatesWithFields.length} templates × {studentData.length} students</span>
            </div>
          )}
        </div>

        {isGenerating ? (
          <div className="space-y-4">
            <Progress value={progress} className="h-3" />
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating certificates... {progress}%</span>
            </div>
          </div>
        ) : completed ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-primary mb-4">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">All certificates generated successfully!</span>
            </div>
            <Button onClick={generateCertificates} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Generate Again
            </Button>
          </div>
        ) : (
          <Button
            onClick={generateCertificates}
            disabled={!isReady}
            variant="hero"
            size="lg"
            className="w-full gap-2"
          >
            <Download className="w-5 h-5" />
            Generate & Download ZIP
          </Button>
        )}

        {!isReady && (
          <div className="mt-6 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Before generating, make sure you have:</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span className={templates.length > 0 ? "text-primary" : ""}>
                  {templates.length > 0 ? "✓" : "○"}
                </span>
                Uploaded at least one certificate template
              </li>
              <li className="flex items-center gap-2">
                <span className={templatesWithFields.length > 0 ? "text-primary" : ""}>
                  {templatesWithFields.length > 0 ? "✓" : "○"}
                </span>
                Added at least one text field to a template
              </li>
              <li className="flex items-center gap-2">
                <span className={studentData.length > 0 ? "text-primary" : ""}>
                  {studentData.length > 0 ? "✓" : "○"}
                </span>
                Uploaded student data
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};