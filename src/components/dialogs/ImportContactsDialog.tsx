import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedContact {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export function ImportContactsDialog({ open, onOpenChange }: ImportContactsDialogProps) {
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "complete">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([]);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState({ success: 0, failed: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
      
      // Simulate parsing CSV
      const mockContacts: ParsedContact[] = [
        { name: "John Smith", email: "john@example.com", phone: "+1 555-0101", company: "Acme Inc" },
        { name: "Sarah Johnson", email: "sarah@company.com", phone: "+1 555-0102", company: "Tech Corp" },
        { name: "Mike Wilson", email: "mike@startup.io", phone: "+1 555-0103", company: "Startup.io" },
        { name: "Emily Brown", email: "emily@agency.com", phone: "+1 555-0104", company: "Creative Agency" },
        { name: "David Lee", email: "david@enterprise.com", phone: "+1 555-0105", company: "Enterprise Co" },
      ];
      
      setParsedContacts(mockContacts);
      setStep("preview");
    }
  };

  const handleImport = async () => {
    setStep("importing");
    setProgress(0);
    
    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    setImportResults({ success: parsedContacts.length, failed: 0 });
    setStep("complete");
  };

  const handleClose = () => {
    setStep("upload");
    setFile(null);
    setParsedContacts([]);
    setProgress(0);
    onOpenChange(false);
  };

  const handleComplete = () => {
    toast.success(`Successfully imported ${importResults.success} contacts`);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Import Contacts
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload a CSV file to import contacts"}
            {step === "preview" && "Review contacts before importing"}
            {step === "importing" && "Importing contacts..."}
            {step === "complete" && "Import complete"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Step */}
          {step === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium mb-1">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <Button type="button" variant="outline" size="sm">
                Select File
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                CSV should have columns: Name, Email, Phone, Company
              </p>
            </div>
          )}

          {/* Preview Step */}
          {step === "preview" && (
            <>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{file?.name}</p>
                    <p className="text-xs text-muted-foreground">{parsedContacts.length} contacts found</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => setStep("upload")}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[200px] overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Email</th>
                        <th className="text-left p-2 font-medium">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedContacts.map((contact, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{contact.name}</td>
                          <td className="p-2 text-muted-foreground">{contact.email}</td>
                          <td className="p-2 text-muted-foreground">{contact.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Importing Step */}
          {step === "importing" && (
            <div className="py-8 text-center">
              <div className="mb-4">
                <Progress value={progress} className="h-2" />
              </div>
              <p className="font-medium">Importing contacts...</p>
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          )}

          {/* Complete Step */}
          {step === "complete" && (
            <div className="py-8 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
              <p className="font-medium text-lg mb-2">Import Complete</p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {importResults.success} imported
                </div>
                {importResults.failed > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {importResults.failed} failed
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === "upload" && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button onClick={handleImport}>
                Import {parsedContacts.length} Contacts
              </Button>
            </>
          )}
          {step === "complete" && (
            <Button onClick={handleComplete}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
