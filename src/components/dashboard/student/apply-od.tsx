"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useState, useEffect } from "react";
import { differenceInDays, format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  registerNumber: z.string().min(5, {
    message: "Register number must be at least 5 characters.",
  }),
  class: z.string().min(1, {
    message: "Class is required.",
  }),
  dateFrom: z.date({
    required_error: "Start date is required.",
  }),
  dateTo: z.date({
    required_error: "End date is required.",
  }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  applyTo: z.string().min(1, {
    message: "Please select who to apply to.",
  }),
}).refine(data => data.dateTo >= data.dateFrom, {
  message: "End date must be after start date",
  path: ["dateTo"],
});

export function ApplyOd(): React.ReactNode {
  const [totalDays, setTotalDays] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      registerNumber: "",
      class: "",
      reason: "",
      location: "",
      applyTo: "",
    },
  });

  // Calculate total days whenever dates change
  useEffect(() => {
    const dateFrom = form.watch("dateFrom");
    const dateTo = form.watch("dateTo");
    
    if (dateFrom && dateTo) {
      const days = differenceInDays(dateTo, dateFrom) + 1; // +1 to include both start and end dates
      setTotalDays(days > 0 ? days : null);
    } else {
      setTotalDays(null);
    }
  }, [form.watch("dateFrom"), form.watch("dateTo")]);




  function onSubmit(values: z.infer<typeof formSchema>) {
    // Add total days to the form values
    const submissionData = {
      ...values,
      totalDays: totalDays,
    };
    console.log(submissionData);
    // Here you would typically send the data to your backend
  }



  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="registerNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Register Number</FormLabel>
                <FormControl>
                  <Input placeholder="2021CSXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <Input placeholder="CSE-A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        variant={"outline"}
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
                  <PopoverContent className="w-auto p-0" align="start">
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
                        variant={"outline"}
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const fromDate = form.watch("dateFrom");
                        return date < (fromDate || new Date(new Date().setHours(0, 0, 0, 0)));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Total Days</FormLabel>
            <FormControl>
              <Input 
                disabled 
                value={totalDays !== null ? totalDays.toString() : ""}
                placeholder="Calculated automatically" 
              />
            </FormControl>
            <FormDescription>
              Will be calculated automatically based on date range
            </FormDescription>
          </FormItem>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location of Event</FormLabel>
                <FormControl>
                  <Input placeholder="City, Institution" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="applyTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apply To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hod">HOD</SelectItem>
                    <SelectItem value="principal">Principal</SelectItem>
                    <SelectItem value="classAdvisor">Class Advisor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for OD</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide detailed reason for on-duty application..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto">Submit OD Application</Button>
      </form>
    </Form>
  );
}