import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { TemplateUploader } from "./TemplateUploader";
import { ExcelUploader } from "./ExcelUploader";
import { CertificateEditor } from "./CertificateEditor";
import { GenerateSection } from "./GenerateSection";
import { TextField, ImageElement } from "@/types/certificate";

interface CertificateGeneratorProps {
  onBack: () => void;
}

export const CertificateGenerator = ({ onBack }: CertificateGeneratorProps) => {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateUrl, setTemplateUrl] = useState<string>("");
  const [studentData, setStudentData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [textFields, setTextFields] = useState<TextField[]>([]);
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleTemplateUpload = useCallback((file: File) => {
    setTemplateFile(file);
    const url = URL.createObjectURL(file);
    setTemplateUrl(url);
    setTextFields([]);
    setImageElements([]);
  }, []);

  const handleDataUpload = useCallback((data: Record<string, string>[], headerList: string[]) => {
    setStudentData(data);
    setHeaders(headerList);
    if (data.length > 0) {
      setUploadedFileName(`${data.length} students`);
    } else {
      setUploadedFileName(null);
    }
  }, []);

  const isReady = templateUrl && textFields.length > 0 && studentData.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold">Certificate Generator</h1>
            <p className="text-sm text-muted-foreground">Create certificates in bulk</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Uploads */}
          <div className="lg:col-span-1 space-y-6">
            <TemplateUploader
              onTemplateUpload={handleTemplateUpload}
              templatePreview={templateUrl}
            />

            <ExcelUploader
              onDataUpload={handleDataUpload}
              uploadedFileName={uploadedFileName}
              dataCount={studentData.length}
            />

            <GenerateSection
              templateUrl={templateUrl}
              textFields={textFields}
              imageElements={imageElements}
              studentData={studentData}
              isReady={!!isReady}
            />
          </div>

          {/* Right column - Editor */}
          <div className="lg:col-span-2">
            {templateUrl ? (
              <CertificateEditor
                templateUrl={templateUrl}
                availableFields={headers}
                textFields={textFields}
                imageElements={imageElements}
                onTextFieldsChange={setTextFields}
                onImageElementsChange={setImageElements}
              />
            ) : (
              <div className="h-96 rounded-2xl border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Upload a template to get started
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your certificate design will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
