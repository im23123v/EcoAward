import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, IText, FabricImage, FabricObject } from "fabric";
import { Plus, Type, Trash2, Move, Bold, Italic } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const FONT_OPTIONS = [
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Palatino Linotype", label: "Palatino" },
  { value: "Impact", label: "Impact" },
];

const FONT_SIZES = [16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

interface TextField {
  id: string;
  fieldName: string;
  left: number;
  top: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  fontWeight?: string;
  fontStyle?: string;
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
      fontWeight: field.fontWeight || "normal",
      fontStyle: field.fontStyle || "normal",
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
      fontWeight: "normal",
      fontStyle: "normal",
    };

    const updatedFields = [...textFields, newField];
    onTextFieldsChange(updatedFields);
    addTextToCanvas(newField);
    setSelectedField("");
  };

  const updateFieldStyle = (fieldId: string, updates: Partial<TextField>) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects() as FabricObjectWithData[];
    const textObj = objects.find((obj) => obj.data?.fieldId === fieldId) as IText | undefined;

    if (textObj) {
      if (updates.fontFamily) textObj.set("fontFamily", updates.fontFamily);
      if (updates.fontSize) textObj.set("fontSize", updates.fontSize);
      if (updates.fill) textObj.set("fill", updates.fill);
      if (updates.fontWeight) textObj.set("fontWeight", updates.fontWeight);
      if (updates.fontStyle) textObj.set("fontStyle", updates.fontStyle);
      canvas.renderAll();
    }

    const updatedFields = textFields.map((f) =>
      f.id === fieldId ? { ...f, ...updates } : f
    );
    onTextFieldsChange(updatedFields);
  };

  const toggleBold = (field: TextField) => {
    const newWeight = field.fontWeight === "bold" ? "normal" : "bold";
    updateFieldStyle(field.id, { fontWeight: newWeight });
  };

  const toggleItalic = (field: TextField) => {
    const newStyle = field.fontStyle === "italic" ? "normal" : "italic";
    updateFieldStyle(field.id, { fontStyle: newStyle });
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

      {/* Field styling list */}
      {textFields.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Style your fields:</p>
          <div className="grid gap-3">
            {textFields.map((field) => (
              <div
                key={field.id}
                className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border"
              >
                <span className="font-medium text-sm min-w-[80px]">{field.fieldName}</span>
                
                {/* Font Family */}
                <Select
                  value={field.fontFamily}
                  onValueChange={(value) => updateFieldStyle(field.id, { fontFamily: value })}
                >
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Font Size */}
                <Select
                  value={String(field.fontSize)}
                  onValueChange={(value) => updateFieldStyle(field.id, { fontSize: Number(value) })}
                >
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}px
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Bold */}
                <Button
                  variant={field.fontWeight === "bold" ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleBold(field)}
                >
                  <Bold className="w-4 h-4" />
                </Button>

                {/* Italic */}
                <Button
                  variant={field.fontStyle === "italic" ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleItalic(field)}
                >
                  <Italic className="w-4 h-4" />
                </Button>

                {/* Color Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: field.fill }}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Pick a color</p>
                      <div className="flex gap-2 flex-wrap max-w-[160px]">
                        {["#1a1a1a", "#ffffff", "#dc2626", "#16a34a", "#2563eb", "#9333ea", "#ca8a04", "#0891b2"].map((color) => (
                          <button
                            key={color}
                            className="w-6 h-6 rounded-full border-2 border-border hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => updateFieldStyle(field.id, { fill: color })}
                          />
                        ))}
                      </div>
                      <Input
                        type="color"
                        value={field.fill}
                        onChange={(e) => updateFieldStyle(field.id, { fill: e.target.value })}
                        className="h-8 w-full cursor-pointer"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
