"use client";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCampaignSchema } from "@/db/schema";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { ExcelUpload } from "./excel-upload";

const apiFormValues = z.object({
  name: z.string(),
  excel: z.string(),
});

type FormValues = z.input<typeof apiFormValues>;

type Props = {
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
};

export const CampaignForm = ({ onSubmit, disabled }: Props) => {
  const [name, setName] = useState("");
  const [excelFile, setExcelFile] = useState<File | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !excelFile) return;

    onSubmit({ name, excel: excelFile.name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid w-full max-w-sm items-center space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          disabled={disabled}
        />
      </div>
      <ExcelUpload
        excelFile={excelFile}
        setExcelFile={setExcelFile}
        disabled={disabled}
      />

      <Button className="w-full" type="submit" disabled={disabled}>
        Create Campaign
      </Button>
    </form>
  );
};
