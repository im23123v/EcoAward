import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, IText, FabricImage, FabricObject } from "fabric";
import { Plus, Type, Trash2, Move } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface TextField {
  id: string;
  fieldName: string;
  left: number;
  top: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
}

interface CertificateEditorProps {
  templateUrl: string;
  availableFields: string[];
  textFields: TextField[];
  onTextFieldsChange: (fields: TextField[]) => void;
}

// Extended type for fabric objects with custom data
interface FabricObjectWithData extends FabricObject {
  data?: { fieldId: string; fieldName: string };
}

export const CertificateEditor = ({
  templateUrl,
  availableFields,
  textFields,
  onTextFieldsChange,
}: CertificateEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedField, setSelectedField] = useState<string>("");
  const [canvasReady, setCanvasReady] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f5f5f5",
      selection: true,
    });

    fabricCanvasRef.current = canvas;
    setCanvasReady(true);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
      setCanvasReady(false);
    };
  }, []);

  // Load template image
  useEffect(() => {
    if (!canvasReady || !fabricCanvasRef.current || !templateUrl) return;

    const canvas = fabricCanvasRef.current;

    FabricImage.fromURL(templateUrl, { crossOrigin: "anonymous" }).then((img) => {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const scale = Math.min(containerWidth / (img.width || 800), 600 / (img.height || 600));
      
      canvas.setDimensions({
        width: (img.width || 800) * scale,
        height: (img.height || 600) * scale,
      });

      img.set({
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      });

      canvas.backgroundImage = img;
      canvas.renderAll();

      // Recreate text fields
      textFields.forEach((field) => {
        addTextToCanvas(field, false);
      });
    });
  }, [templateUrl, canvasReady]);

  const addTextToCanvas = useCallback((field: TextField, isNew: boolean = true) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    
    const text = new IText(`{{${field.fieldName}}}`, {
      left: field.left,
      top: field.top,
      fontSize: field.fontSize,
      fontFamily: field.fontFamily,
      fill: field.fill,
      editable: false,
    });

    // Set custom data property
    (text as FabricObjectWithData).data = { fieldId: field.id, fieldName: field.fieldName };

    text.on("moving", () => {
      const updatedFields = textFields.map((f) =>
        f.id === field.id ? { ...f, left: text.left || 0, top: text.top || 0 } : f
      );
      onTextFieldsChange(updatedFields);
    });

    text.on("modified", () => {
      const updatedFields = textFields.map((f) =>
        f.id === field.id
          ? {
              ...f,
              left: text.left || 0,
              top: text.top || 0,
              fontSize: text.fontSize || 24,
            }
          : f
      );
      onTextFieldsChange(updatedFields);
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, [textFields, onTextFieldsChange]);

  const handleAddField = () => {
    if (!selectedField || !fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const newField: TextField = {
      id: `field-${Date.now()}`,
      fieldName: selectedField,
      left: canvas.width! / 2 - 50,
      top: canvas.height! / 2 - 15,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#1a1a1a",
    };

    const updatedFields = [...textFields, newField];
    onTextFieldsChange(updatedFields);
    addTextToCanvas(newField);
    setSelectedField("");
  };

  const handleRemoveSelected = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject() as FabricObjectWithData | undefined;
    
    if (activeObject && activeObject.data?.fieldId) {
      const fieldId = activeObject.data.fieldId;
      canvas.remove(activeObject);
      canvas.renderAll();
      
      const updatedFields = textFields.filter((f) => f.id !== fieldId);
      onTextFieldsChange(updatedFields);
    }
  };

  const usedFields = textFields.map((f) => f.fieldName);
  const availableToAdd = availableFields.filter((f) => !usedFields.includes(f));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Type className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Place Text Fields</h3>
          <p className="text-sm text-muted-foreground">Drag fields to position them on your template</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a field" />
          </SelectTrigger>
          <SelectContent>
            {availableToAdd.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAddField} disabled={!selectedField} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Field
        </Button>

        <div className="h-6 w-px bg-border" />

        <Button onClick={handleRemoveSelected} variant="destructive" size="sm" className="gap-2">
          <Trash2 className="w-4 h-4" />
          Remove Selected
        </Button>

        <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
          <Move className="w-4 h-4" />
          Drag to reposition
        </div>
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="rounded-2xl border border-border overflow-hidden shadow-elevated bg-muted/30"
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Field list */}
      {textFields.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {textFields.map((field) => (
            <div
              key={field.id}
              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              {field.fieldName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
