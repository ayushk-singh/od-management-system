//FIXME: multiple submission if done one after another

"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { differenceInDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    dateFrom: z.date({ required_error: "Start date is required." }),
    dateTo: z.date({ required_error: "End date is required." }),
    location: z.string().min(2),
    reason: z.string().min(10),
    facultyId: z.string().min(1, { message: "Please select a faculty" }),
  })
  .refine((data) => data.dateTo >= data.dateFrom, {
    message: "End date must be after start date",
    path: ["dateTo"],
  });

export function ApplyOd({
  faculties,
}: {
  faculties?: { id: string; name: string }[];
}) {
  const [totalDays, setTotalDays] = useState<number | null>(null);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [odId, setOdId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      reason: "",
      facultyId: "",
    },
  });

  const dateFrom = form.watch("dateFrom");
  const dateTo = form.watch("dateTo");

  useEffect(() => {
    if (dateFrom && dateTo) {
      const days = differenceInDays(dateTo, dateFrom) + 1;
      setTotalDays(days > 0 ? days : null);
    } else {
      setTotalDays(null);
    }
  }, [dateFrom, dateTo]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setStatus(null);
    setErrorMessage(null);

    const payload = {
      ...values,
      totalDays,
    };

    try {
      const res = await fetch("/api/od/student/create-od", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setOdId(data.odApplication.id); // <-- Store OD ID
        setShowSuccessDialog(true); // <-- Trigger Dialog
        form.reset();
        setTotalDays(null);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit application");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage((error as Error).message || "Network error");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Date */}
            <FormField
              control={form.control}
              name="dateFrom"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* To Date */}
            <FormField
              control={form.control}
              name="dateTo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>To Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date <
                          (form.getValues("dateFrom") ||
                            new Date(new Date().setHours(0, 0, 0, 0)))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Days */}
            <FormItem>
              <FormLabel>Total Days</FormLabel>
              <FormControl>
                <Input
                  disabled
                  value={totalDays !== null ? totalDays.toString() : ""}
                  placeholder="Calculated automatically"
                />
              </FormControl>
              <FormDescription>Calculated based on date range</FormDescription>
            </FormItem>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location of Event</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., HICAS, Coimbatore" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Faculty to apply to */}
            <FormField
              control={form.control}
              name="facultyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apply To (Faculty)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(faculties ?? []).map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Reason */}
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for OD</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide a detailed reason for the on-duty application..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TODO: make a pop up for success and failure with OD id and button to download application as pdf */}

          {/* Status messages */}
          {status === "success" && (
            <p className="text-green-600 font-medium">
              Your application has been submitted successfully.
            </p>
          )}
          {status === "error" && errorMessage && (
            <p className="text-red-600 font-medium">Error: {errorMessage}</p>
          )}

          <Button type="submit" className="w-full md:w-auto">
            Submit OD Application
          </Button>
        </form>
      </Form>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">
              OD Submitted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>Your OD application has been submitted.</p>
            <p className="font-medium">
              OD ID: <span className="text-blue-600">{odId}</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (odId) {
                  window.open(`/api/od/utils/generate-od-pdf/${odId}`, "_blank");
                }
              }}
            >
              Download PDF
            </Button>
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
