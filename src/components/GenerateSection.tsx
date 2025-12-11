import { useState } from "react";
import { Download, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { TextField, ImageElement } from "@/types/certificate";

interface GenerateSectionProps {
  templateUrl: string;
  textFields: TextField[];
  imageElements: ImageElement[];
  studentData: Record<string, string>[];
  isReady: boolean;
  onGenerate?: (count: number) => void;
}

export const GenerateSection = ({
  templateUrl,
  textFields,
  imageElements,
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
    if (!isReady) return;

    setIsGenerating(true);
    setProgress(0);
    setCompleted(false);

    const zip = new JSZip();
    const total = studentData.length;

    // Load template image
    const templateImg = await loadImage(templateUrl);

    // Preload all stickers/images
    const imageCache: Record<string, HTMLImageElement> = {};
    for (const element of imageElements) {
      try {
        imageCache[element.id] = await loadImage(element.src);
      } catch (e) {
        console.error('Failed to load image:', element.src);
      }
    }

    // Calculate scale factor - the editor scales the image to fit within 800x600
    const editorScale = Math.min(800 / templateImg.width, 600 / templateImg.height);
    const scaleBack = 1 / editorScale;

    for (let i = 0; i < studentData.length; i++) {
      const student = studentData[i];
      
      // Create canvas for this certificate
      const canvas = document.createElement("canvas");
      canvas.width = templateImg.width;
      canvas.height = templateImg.height;
      const ctx = canvas.getContext("2d")!;

      // Draw template
      ctx.drawImage(templateImg, 0, 0);

      // Draw images/stickers - scale positions and size back to original image size
      for (const element of imageElements) {
        const img = imageCache[element.id];
        if (img) {
          const scaledLeft = element.left * scaleBack;
          const scaledTop = element.top * scaleBack;
          const scaledWidth = img.width * element.scaleX * scaleBack;
          const scaledHeight = img.height * element.scaleY * scaleBack;
          
          ctx.drawImage(img, scaledLeft, scaledTop, scaledWidth, scaledHeight);
        }
      }

      // Draw text fields - scale positions and font size back to original image size
      textFields.forEach((field) => {
        const value = student[field.fieldName] || "";
        const scaledFontSize = Math.round(field.fontSize * scaleBack);
        const scaledLeft = field.left * scaleBack;
        const scaledTop = field.top * scaleBack;
        
        const fontStyle = field.fontStyle === "italic" ? "italic" : "";
        const fontWeight = field.fontWeight === "bold" ? "bold" : "";
        ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${field.fontFamily}`.trim();
        ctx.fillStyle = field.fill;
        ctx.textBaseline = "top";
        ctx.fillText(value, scaledLeft, scaledTop);
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      // Add to zip with student name or index
      const fileName = student["Name"] || student["name"] || `certificate_${i + 1}`;
      zip.file(`${fileName.replace(/[^a-zA-Z0-9]/g, "_")}.png`, blob);

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    // Generate and download zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "certificates.zip");

    setIsGenerating(false);
    setCompleted(true);
    onGenerate?.(studentData.length);
  };

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
              ? `Ready to generate ${studentData.length} certificates`
              : "Complete all steps above to generate certificates"}
          </p>
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
                <span className={templateUrl ? "text-primary" : ""}>
                  {templateUrl ? "✓" : "○"}
                </span>
                Uploaded a certificate template
              </li>
              <li className="flex items-center gap-2">
                <span className={textFields.length > 0 ? "text-primary" : ""}>
                  {textFields.length > 0 ? "✓" : "○"}
                </span>
                Added at least one text field
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
