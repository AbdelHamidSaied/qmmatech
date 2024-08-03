"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

type Props = {
  excelFile: File | undefined;
  setExcelFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  disabled?: boolean;
};

export const ExcelUpload = ({
  excelFile,
  setExcelFile,
  disabled = false,
}: Props) => {
  const [items, setItems] = useState<
    Array<{ sr: string; phone: string; name: string; mail: string }>
  >([]);

  const headers = ["sr", "phone", "name", "mail"];
  const body = items.map((item) => [item.sr, item.phone, item.name, item.mail]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setExcelFile(file);

    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      // @ts-ignore
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target?.result;
        const wb = XLSX.read(bufferArray, {
          type: "buffer",
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      // @ts-ignore
      setItems(d);
    });
  };

  return (
    <div className="col-span-full">
      <div className="flex justify-between items-center mb-4">
        <Label
          htmlFor="excel"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Excel
        </Label>
        {excelFile && (
          <Button
            onClick={() => setExcelFile(undefined)}
            type="button"
            className="flex space-x-2 rounded-md shadow py-2 px-4"
            disabled={disabled}
          >
            <Pencil className="w-5 h-5" />
            <span>Change Excel</span>
          </Button>
        )}
      </div>
      {excelFile ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                {headers.map((_item, index) => (
                  <TableHead key={index}>{_item}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {body.map((row: string[], index) => (
                <TableRow key={index}>
                  {row.map((cell, index) => (
                    <TableCell key={index}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid w-full max-w-sm items-center space-y-2">
          <Input
            id="excel"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleUpload}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};
