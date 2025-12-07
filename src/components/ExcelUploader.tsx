import { useCallback } from "react";
import { FileSpreadsheet, Upload, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";

interface ExcelUploaderProps {
  onDataUpload: (data: Record<string, string>[], headers: string[]) => void;
  uploadedFileName: string | null;
  dataCount: number;
}

export const ExcelUploader = ({ onDataUpload, uploadedFileName, dataCount }: ExcelUploaderProps) => {
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, {
            defval: "",
          });
          
          if (jsonData.length > 0) {
            const headers = Object.keys(jsonData[0]);
            onDataUpload(jsonData, headers);
          }
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [onDataUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const input = document.getElementById("excel-upload") as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    },
    []
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Student Data</h3>
          <p className="text-sm text-muted-foreground">Upload Excel with student information</p>
        </div>
      </div>

      {!uploadedFileName ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 cursor-pointer group"
        >
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
            id="excel-upload"
          />
          <label htmlFor="excel-upload" className="cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
            </div>
            <p className="text-foreground font-medium mb-1">
              Drop your Excel file here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports XLSX, XLS, CSV
            </p>
          </label>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                <Check className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{uploadedFileName}</p>
                <p className="text-sm text-muted-foreground">
                  {dataCount} records found
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onDataUpload([], []);
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
