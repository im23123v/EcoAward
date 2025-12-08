import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, IText, FabricImage, FabricObject } from "fabric";
import { Plus, Type, Trash2, Move, Bold, Italic, Image, Sticker, Upload, RotateCw, FlipHorizontal, FlipVertical, Copy, Layers } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { TextField, ImageElement, CertificateElement, STICKERS, FONT_OPTIONS, FONT_SIZES } from "@/types/certificate";

interface CertificateEditorProps {
  templateUrl: string;
  availableFields: string[];
  textFields: TextField[];
  imageElements: ImageElement[];
  onTextFieldsChange: (fields: TextField[]) => void;
  onImageElementsChange: (elements: ImageElement[]) => void;
}

interface FabricObjectWithData extends FabricObject {
  data?: { id: string; type: 'text' | 'image' };
}

export const CertificateEditor = ({
  templateUrl,
  availableFields,
  textFields,
  imageElements,
  onTextFieldsChange,
  onImageElementsChange,
}: CertificateEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedField, setSelectedField] = useState<string>("");
  const [canvasReady, setCanvasReady] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f5f5f5",
      selection: true,
    });

    canvas.on("selection:created", (e) => {
      const obj = e.selected?.[0] as FabricObjectWithData;
      if (obj?.data?.id) setSelectedElementId(obj.data.id);
    });

    canvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0] as FabricObjectWithData;
      if (obj?.data?.id) setSelectedElementId(obj.data.id);
    });

    canvas.on("selection:cleared", () => {
      setSelectedElementId(null);
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

      // Recreate image elements
      imageElements.forEach((element) => {
        addImageToCanvas(element, false);
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

    (text as FabricObjectWithData).data = { id: field.id, type: 'text' };

    text.on("moving", () => {
      const updatedFields = textFields.map((f) =>
        f.id === field.id ? { ...f, left: text.left || 0, top: text.top || 0 } : f
      );
      onTextFieldsChange(updatedFields);
    });

    text.on("modified", () => {
      const updatedFields = textFields.map((f) =>
        f.id === field.id
          ? { ...f, left: text.left || 0, top: text.top || 0, fontSize: text.fontSize || 24 }
          : f
      );
      onTextFieldsChange(updatedFields);
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, [textFields, onTextFieldsChange]);

  const addImageToCanvas = useCallback((element: ImageElement, isNew: boolean = true) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    FabricImage.fromURL(element.src, { crossOrigin: "anonymous" }).then((img) => {
      img.set({
        left: element.left,
        top: element.top,
        scaleX: element.scaleX,
        scaleY: element.scaleY,
      });

      (img as FabricObjectWithData).data = { id: element.id, type: 'image' };

      img.on("moving", () => {
        const updated = imageElements.map((e) =>
          e.id === element.id ? { ...e, left: img.left || 0, top: img.top || 0 } : e
        );
        onImageElementsChange(updated);
      });

      img.on("scaling", () => {
        const updated = imageElements.map((e) =>
          e.id === element.id
            ? { ...e, scaleX: img.scaleX || 1, scaleY: img.scaleY || 1 }
            : e
        );
        onImageElementsChange(updated);
      });

      img.on("modified", () => {
        const updated = imageElements.map((e) =>
          e.id === element.id
            ? {
                ...e,
                left: img.left || 0,
                top: img.top || 0,
                scaleX: img.scaleX || 1,
                scaleY: img.scaleY || 1,
              }
            : e
        );
        onImageElementsChange(updated);
      });

      canvas.add(img);
      if (isNew) canvas.setActiveObject(img);
      canvas.renderAll();
    });
  }, [imageElements, onImageElementsChange]);

  const handleAddField = () => {
    if (!selectedField || !fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const newField: TextField = {
      id: `field-${Date.now()}`,
      type: 'text',
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

  const handleAddSticker = (sticker: typeof STICKERS[0]) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const newElement: ImageElement = {
      id: `sticker-${Date.now()}`,
      type: 'image',
      src: sticker.url,
      left: canvas.width! / 2 - 40,
      top: canvas.height! / 2 - 40,
      width: 80,
      height: 80,
      scaleX: 1,
      scaleY: 1,
    };

    const updated = [...imageElements, newElement];
    onImageElementsChange(updated);
    addImageToCanvas(newElement);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const canvas = fabricCanvasRef.current!;
      
      const newElement: ImageElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        src,
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 50,
        width: 100,
        height: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      };

      const updated = [...imageElements, newElement];
      onImageElementsChange(updated);
      addImageToCanvas(newElement);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const updateFieldStyle = (fieldId: string, updates: Partial<TextField>) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects() as FabricObjectWithData[];
    const textObj = objects.find((obj) => obj.data?.id === fieldId) as IText | undefined;

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
    
    if (activeObject && activeObject.data?.id) {
      const { id, type } = activeObject.data;
      canvas.remove(activeObject);
      canvas.renderAll();
      
      if (type === 'text') {
        const updatedFields = textFields.filter((f) => f.id !== id);
        onTextFieldsChange(updatedFields);
      } else if (type === 'image') {
        const updated = imageElements.filter((e) => e.id !== id);
        onImageElementsChange(updated);
      }
      setSelectedElementId(null);
    }
  };

  const handleDuplicate = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject() as FabricObjectWithData | undefined;
    
    if (activeObject && activeObject.data) {
      const { id, type } = activeObject.data;
      
      if (type === 'image') {
        const original = imageElements.find((e) => e.id === id);
        if (original) {
          const newElement: ImageElement = {
            ...original,
            id: `image-${Date.now()}`,
            left: original.left + 20,
            top: original.top + 20,
          };
          const updated = [...imageElements, newElement];
          onImageElementsChange(updated);
          addImageToCanvas(newElement);
        }
      }
    }
  };

  const handleRotate = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 45);
      canvas.renderAll();
    }
  };

  const handleFlipX = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("flipX", !activeObject.flipX);
      canvas.renderAll();
    }
  };

  const handleFlipY = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("flipY", !activeObject.flipY);
      canvas.renderAll();
    }
  };

  const handleBringForward = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringObjectForward(activeObject);
      canvas.renderAll();
    }
  };

  const handleSendBackward = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendObjectBackwards(activeObject);
      canvas.renderAll();
    }
  };

  const updateImageScale = (elementId: string, scale: number) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects() as FabricObjectWithData[];
    const imgObj = objects.find((obj) => obj.data?.id === elementId) as FabricImage | undefined;

    if (imgObj) {
      imgObj.set({ scaleX: scale, scaleY: scale });
      canvas.renderAll();
    }

    const updated = imageElements.map((e) =>
      e.id === elementId ? { ...e, scaleX: scale, scaleY: scale } : e
    );
    onImageElementsChange(updated);
  };

  const usedFields = textFields.map((f) => f.fieldName);
  const availableToAdd = availableFields.filter((f) => !usedFields.includes(f));

  const selectedImage = imageElements.find((e) => e.id === selectedElementId);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Type className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Certificate Editor</h3>
          <p className="text-sm text-muted-foreground">Add text fields, stickers, and images</p>
        </div>
      </div>

      {/* Main Toolbar with Tabs */}
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="text" className="gap-2">
            <Type className="w-4 h-4" />
            Text Fields
          </TabsTrigger>
          <TabsTrigger value="stickers" className="gap-2">
            <Sticker className="w-4 h-4" />
            Stickers
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <Image className="w-4 h-4" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-3">
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
          </div>
        </TabsContent>

        <TabsContent value="stickers" className="space-y-3">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground mb-3">Click a sticker to add it:</p>
            <div className="flex flex-wrap gap-2">
              {STICKERS.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleAddSticker(sticker)}
                  className="w-12 h-12 rounded-lg bg-background border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center text-2xl hover:scale-110"
                  title={sticker.name}
                >
                  {sticker.emoji}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-3">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Image
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Upload logos, signatures, or custom graphics
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transform Tools */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
        <Button onClick={handleRemoveSelected} variant="destructive" size="sm" className="gap-2">
          <Trash2 className="w-4 h-4" />
          Remove
        </Button>
        <div className="h-6 w-px bg-border" />
        <Button onClick={handleRotate} variant="outline" size="sm" className="gap-2" title="Rotate 45°">
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button onClick={handleFlipX} variant="outline" size="sm" className="gap-2" title="Flip Horizontal">
          <FlipHorizontal className="w-4 h-4" />
        </Button>
        <Button onClick={handleFlipY} variant="outline" size="sm" className="gap-2" title="Flip Vertical">
          <FlipVertical className="w-4 h-4" />
        </Button>
        <Button onClick={handleDuplicate} variant="outline" size="sm" className="gap-2" title="Duplicate">
          <Copy className="w-4 h-4" />
        </Button>
        <div className="h-6 w-px bg-border" />
        <Button onClick={handleBringForward} variant="outline" size="sm" className="gap-2" title="Bring Forward">
          <Layers className="w-4 h-4" />
          ↑
        </Button>
        <Button onClick={handleSendBackward} variant="outline" size="sm" className="gap-2" title="Send Backward">
          <Layers className="w-4 h-4" />
          ↓
        </Button>
        <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
          <Move className="w-4 h-4" />
          Drag to reposition
        </div>
      </div>

      {/* Image Scale Control */}
      {selectedImage && (
        <div className="p-4 rounded-xl bg-accent/20 border border-accent/30">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Size:</span>
            <Slider
              value={[selectedImage.scaleX]}
              onValueChange={([val]) => updateImageScale(selectedImage.id, val)}
              min={0.1}
              max={3}
              step={0.1}
              className="flex-1 max-w-xs"
            />
            <span className="text-sm text-muted-foreground w-16">
              {Math.round(selectedImage.scaleX * 100)}%
            </span>
          </div>
        </div>
      )}

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
          <p className="text-sm font-medium text-muted-foreground">Style your text fields:</p>
          <div className="grid gap-3">
            {textFields.map((field) => (
              <div
                key={field.id}
                className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border"
              >
                <span className="font-medium text-sm min-w-[80px]">{field.fieldName}</span>
                
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

                <Button
                  variant={field.fontWeight === "bold" ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleBold(field)}
                >
                  <Bold className="w-4 h-4" />
                </Button>

                <Button
                  variant={field.fontStyle === "italic" ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleItalic(field)}
                >
                  <Italic className="w-4 h-4" />
                </Button>

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

      {/* Image elements list */}
      {imageElements.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Added images & stickers: {imageElements.length}</p>
        </div>
      )}
    </div>
  );
};
