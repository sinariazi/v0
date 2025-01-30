"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/language-context";
import { Download, FileText } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

interface ImportUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportUsersDialogClient({
  isOpen,
  onClose,
}: ImportUsersDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to import.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import-users", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Imported ${result.importedCount} users successfully.`,
        });
        onClose();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error importing users:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to import users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("userManagement.importUsersDialogTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("userManagement.importUsersDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              {t("userManagement.importUsersAlertDescription")}
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              {t("userManagement.selectCSVFile")}
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".csv"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link
            href="/api/sample-users-csv"
            className="flex items-center text-sm text-blue-600 hover:underline"
          >
            <Download className="h-4 w-4 mr-1" />
            {t("userManagement.downloadSampleCSV")}
          </Link>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("userManagement.cancel")}
            </Button>
            <Button onClick={handleImport} disabled={!file || isUploading}>
              {isUploading
                ? t("userManagement.importing")
                : t("userManagement.import")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
