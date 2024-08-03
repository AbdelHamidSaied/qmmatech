"use client";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertListSchema } from "@/db/schema";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Select as CustomSelect } from "@/components/select";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/date-picker";
import { DateTimePicker } from "@/components/ui/date-time-picker";

const formSchema = z.object({
  name: z.string(),
  campaignId: z.string(),
  dailyLimit: z.number().optional(),
  dailySendingLimit: z.number().optional(),
  fromSrl: z.number().optional(),
  toSrl: z.number().optional(),
  ignoreCustomersReceivedMessage: z.number().optional(),
  type: z.enum(["run-now", "schedule"]),
  scheduleDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
  campaignOptions?: { label: string; value: string }[];
};

export const ListForm = ({
  defaultValues,
  onSubmit,
  disabled,
  campaignOptions,
}: Props) => {
  const [sendingType, setSendingType] = useState<string | undefined>(
    "All Campaign Data"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Enter list name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-between gap-4">
          <FormField
            name="campaignId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Campaign</FormLabel>
                <FormControl>
                  <CustomSelect
                    placeholder="Select a campaign"
                    options={campaignOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-col w-full gap-2">
            <Label>Sending Type</Label>
            <CustomSelect
              onChange={(value) => setSendingType(value)}
              placeholder="Select a sending type"
              options={[
                { label: "All Campaign Data", value: "All Campaign Data" },
                { label: "All Remaining Data", value: "All Remaining Data" },
                {
                  label: "All Data on equal days",
                  value: "All Data on equal days",
                },
                {
                  label: "All Remaining Data on equal days",
                  value: "All Remaining Data on equal days",
                },
                {
                  label: "Based on serial",
                  value: "Based on serial",
                },
              ]}
              disabled={disabled}
              value={sendingType}
            />
          </div>
        </div>
        {sendingType === "All Data on equal days" && (
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col w-full gap-2">
              <Label>Total numbers in campaign</Label>
              <Input disabled value="20" />
            </div>
            <FormField
              name="dailyLimit"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Daily Limit</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="Enter daily limit"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
        {sendingType === "All Remaining Data on equal days" && (
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col w-full gap-2">
              <Label>Remaining numbers in campaign</Label>
              <Input disabled value="15" />
            </div>
            <FormField
              name="dailyLimit"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Daily Limit</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="Enter daily limit"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
        {sendingType === "Based on serial" && (
          <div className="flex flex-col gap-4 items-center justify-between w-full">
            <div className="flex flex-row items-center justify-between w-full gap-4">
              <FormField
                name="dailySendingLimit"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Daily Sending Limit</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabled}
                        placeholder="Enter daily sending limit"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="fromSrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>From Serial</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabled}
                        placeholder="Enter serial"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row items-center justify-between w-full gap-4">
              <div className="flex flex-col w-full gap-4">
                <Label>Remaining balance</Label>
                <Input disabled value="10" />
              </div>
              <FormField
                name="toSrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>To Serial</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabled}
                        placeholder="Enter serial"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        <FormField
          name="ignoreCustomersReceivedMessage"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ignore Customers Received Message within</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Enter maximum number"
                  type="number"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center justify-between">
                    <FormControl>
                      <RadioGroupItem value="run-now" />
                    </FormControl>
                    <FormLabel className="font-normal">Run now</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center justify-between">
                    <FormControl>
                      <RadioGroupItem value="schedule" />
                    </FormControl>
                    <FormLabel className="font-normal">Schedule</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        {form.getValues().type === "schedule" && (
          <FormField
            name="scheduleDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DateTimePicker
                    granularity={"minute"}
                    jsDate={field.value}
                    onJsDateChange={field.onChange}
                    isDisabled={disabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button className="w-full" disabled={disabled} type="submit">
          Create list
        </Button>
      </form>
    </Form>
  );
};
