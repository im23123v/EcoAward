import { useState, useCallback } from "react";
import { ArrowLeft, Layers } from "lucide-react";
import { Button } from "./ui/button";
import { TemplateUploader } from "./TemplateUploader";
import { ExcelUploader } from "./ExcelUploader";
import { CertificateEditor } from "./CertificateEditor";
import { GenerateSection } from "./GenerateSection";
import { TextField, ImageElement, CertificateTemplate } from "@/types/certificate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface CertificateGeneratorProps {
  onBack: () => void;
  onGenerate?: (count: number) => void;
}

export const CertificateGenerator = ({ onBack, onGenerate }: CertificateGeneratorProps) => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  const handleTemplateUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const newTemplate: CertificateTemplate = {
      id: `template-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      file,
      url,
      textFields: [],
      imageElements: [],
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplateId(newTemplate.id);
  }, []);

  const handleTemplateRemove = useCallback((id: string) => {
    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== id);
      if (activeTemplateId === id) {
        setActiveTemplateId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  }, [activeTemplateId]);

  const handleTextFieldsChange = useCallback((fields: TextField[]) => {
    setTemplates(prev => {
      const currentActiveId = prev.find(t => t.textFields !== fields)?.id || activeTemplateId;
      return prev.map(t =>
        t.id === activeTemplateId ? { ...t, textFields: fields } : t
      );
    });
  }, [activeTemplateId]);

  const handleImageElementsChange = useCallback((elements: ImageElement[]) => {
    setTemplates(prev => prev.map(t =>
      t.id === activeTemplateId ? { ...t, imageElements: elements } : t
    ));
  }, [activeTemplateId]);

  const handleDataUpload = useCallback((data: Record<string, string>[], headerList: string[]) => {
    setStudentData(data);
    setHeaders(headerList);
    if (data.length > 0) {
      setUploadedFileName(`${data.length} students`);
    } else {
      setUploadedFileName(null);
    }
  }, []);

  const isReady = templates.length > 0 && 
    templates.some(t => t.textFields.length > 0) && 
    studentData.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-xl font-bold">Certificate Generator</h1>
              <p className="text-sm text-muted-foreground">Create certificates in bulk</p>
            </div>
          </div>
          {templates.length > 1 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">{templates.length} Templates</span>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Uploads */}
          <div className="lg:col-span-1 space-y-6">
            <TemplateUploader
              templates={templates}
              activeTemplateId={activeTemplateId}
              onTemplateUpload={handleTemplateUpload}
              onTemplateSelect={(id: string) => setActiveTemplateId(id)}
              onTemplateRemove={handleTemplateRemove}
              maxTemplates={3}
            />

            <ExcelUploader
              onDataUpload={handleDataUpload}
              uploadedFileName={uploadedFileName}
              dataCount={studentData.length}
            />

            <GenerateSection
              templates={templates}
              studentData={studentData}
              isReady={!!isReady}
              onGenerate={onGenerate}
            />
          </div>

          {/* Right column - Editor */}
          <div className="lg:col-span-2">
            {templates.length > 0 && activeTemplate ? (
              <div className="space-y-4">
                {templates.length > 1 && (
                  <Tabs value={activeTemplateId || ""} onValueChange={setActiveTemplateId}>
                    <TabsList className="w-full">
                      {templates.map((template, idx) => (
                        <TabsTrigger key={template.id} value={template.id} className="flex-1">
                          Template {idx + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
                <CertificateEditor
                  key={activeTemplateId}
                  templateUrl={activeTemplate.url}
                  availableFields={headers}
                  textFields={activeTemplate.textFields}
                  imageElements={activeTemplate.imageElements}
                  onTextFieldsChange={handleTextFieldsChange}
                  onImageElementsChange={handleImageElementsChange}
                />
              </div>
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