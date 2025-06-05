"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { OdApplication } from "./column";

type Props = {
  open: boolean;
  initialData: OdApplication | null;
  onSubmit: (updated: OdApplication) => void;
  onCancel: () => void;
};

export function EditOdDialog({ open, initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<OdApplication | null>(initialData);

  // ✅ Ensure form updates when dialog is opened with new data
  useEffect(() => {
    if (open && initialData) {
      setForm(initialData);
    }
  }, [open, initialData]);

  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit OD Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Reason</Label>
            <Input name="reason" value={form.reason} onChange={handleChange} />
          </div>
          <div>
            <Label>Location</Label>
            <Input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div>
            <Label>Date From</Label>
            <Input
              type="date"
              name="dateFrom"
              value={form.dateFrom.slice(0, 10)}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Date To</Label>
            <Input
              type="date"
              name="dateTo"
              value={form.dateTo.slice(0, 10)}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
