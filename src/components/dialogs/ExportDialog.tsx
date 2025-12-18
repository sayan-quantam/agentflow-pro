import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "contacts" | "analytics" | "campaigns";
  totalItems?: number;
}

const formatOptions = [
  { id: "csv", name: "CSV", icon: FileText, description: "Comma-separated values" },
  { id: "xlsx", name: "Excel", icon: FileSpreadsheet, description: "Microsoft Excel format" },
];

const contactColumns = [
  { id: "name", label: "Name", default: true },
  { id: "email", label: "Email", default: true },
  { id: "phone", label: "Phone", default: true },
  { id: "company", label: "Company", default: true },
  { id: "status", label: "Status", default: true },
  { id: "tags", label: "Tags", default: false },
  { id: "source", label: "Source", default: false },
  { id: "lastContact", label: "Last Contact", default: false },
  { id: "createdAt", label: "Created At", default: false },
];

const analyticsColumns = [
  { id: "date", label: "Date", default: true },
  { id: "totalCalls", label: "Total Calls", default: true },
  { id: "successRate", label: "Success Rate", default: true },
  { id: "avgDuration", label: "Avg Duration", default: true },
  { id: "outbound", label: "Outbound Calls", default: false },
  { id: "inbound", label: "Inbound Calls", default: false },
];

export function ExportDialog({ open, onOpenChange, type, totalItems = 0 }: ExportDialogProps) {
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);
  
  const columns = type === "contacts" ? contactColumns : analyticsColumns;
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.filter(c => c.default).map(c => c.id)
  );

  const toggleColumn = (columnId: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to export");
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate download
    const blob = new Blob(["Export data here"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully`);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
          <DialogDescription>
            {totalItems > 0 
              ? `Export ${totalItems.toLocaleString()} ${type}` 
              : `Export your ${type} data`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setFormat(option.id)}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    format === option.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{option.name}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Columns to Export</Label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedColumns(columns.map(c => c.id))}
              >
                Select All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-auto">
              {columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => toggleColumn(column.id)}
                  />
                  <label
                    htmlFor={column.id}
                    className="text-sm cursor-pointer"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? "Exporting..." : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
