"use client";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Select as CustomSelect } from "@/components/select";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/date-picker";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { useGetTemplateCategories } from "../api/use-get-template-categories";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string(),
  allowCategoryChange: z.boolean(),
  categoryId: z.string(),
  typeId: z.string(),
  languageId: z.string(),
  bodyMessage: z.string(),
  header: z.boolean().default(false),
  headerTypeId: z.string().optional(),
  headerText: z.string().optional(),
  footer: z.boolean().default(false),
  footerText: z.string().optional(),
  buttonsAvailable: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  disabled?: boolean;
  categoryOptions: { label: string; value: string }[];
  typeOptions: { label: string; value: string }[];
  languageOptions: { label: string; value: string }[];
  headerOptions: { label: string; value: string }[];
  buttonOptions: { label: string; value: string }[];
  onDelete?: (id: string) => void;
  id?: string;
};

export const TemplateForm = ({
  defaultValues,
  onSubmit,
  disabled,
  categoryOptions,
  typeOptions,
  languageOptions,
  headerOptions,
  buttonOptions,
  onDelete,
  id,
}: Props) => {
  const [type, setType] = useState<string | undefined>(undefined);
  const [headerType, setHeaderType] = useState<string | undefined>(undefined);
  const [header, setHeader] = useState<boolean>(false);
  const [footer, setFooter] = useState<boolean>(false);
  const [buttonsAvailable, setButtonsAvailable] = useState<boolean>(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    // @ts-ignore
    onDelete?.(id);
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
                  disabled={isSubmitting || disabled}
                  placeholder="Enter template name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allowCategoryChange"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting || disabled}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormDescription>
                  Check this box if you want to allow category change.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Combobox
                  options={categoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting || disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Combobox
                  options={typeOptions}
                  value={field.value}
                  onChange={(value?: string) => {
                    field.onChange(value);
                    if (value) {
                      setType(
                        typeOptions[Number(form.getValues().typeId) - 1].label
                      );
                    } else {
                      setType(undefined);
                    }
                  }}
                  disabled={isSubmitting || disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Combobox
                  options={languageOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting || disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="bodyMessage"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body message</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting || disabled}
                  placeholder="Enter template body message"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {type === "Media & Interactive" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row w-full gap-4">
              <FormField
                control={form.control}
                name="header"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // @ts-ignore
                          setHeader(checked);
                        }}
                        disabled={isSubmitting || disabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>Header</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="footer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // @ts-ignore
                          setFooter(checked);
                        }}
                        disabled={isSubmitting || disabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>Footer</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buttonsAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // @ts-ignore
                          setButtonsAvailable(checked);
                        }}
                        disabled={isSubmitting || disabled}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>Buttons</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {header === true && (
              <div>
                <FormField
                  control={form.control}
                  name="headerTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Header type</FormLabel>
                      <FormControl>
                        <Combobox
                          options={headerOptions}
                          value={field.value}
                          onChange={(value?: string) => {
                            field.onChange(value);
                            if (value) {
                              setHeaderType(
                                headerOptions[
                                  Number(form.getValues().headerTypeId) - 1
                                ].label
                              );
                            } else {
                              setHeaderType(undefined);
                            }
                          }}
                          disabled={isSubmitting || disabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {headerType === "Text" && (
                  <FormField
                    name="headerText"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header Text</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSubmitting || disabled}
                            placeholder="Enter header text"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
            {footer === true && (
              <FormField
                name="footerText"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer text</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting || disabled}
                        placeholder="Enter footer text"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create Template"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete Template
          </Button>
        )}
      </form>
    </Form>
  );
};
