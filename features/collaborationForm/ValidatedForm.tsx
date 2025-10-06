"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./DatePicker";
import { EyeIcon } from "lucide-react";
import { useState } from "react";

// --- Types & Schema ---
const FullFormSchema = z
  .object({
    username: z
      .string()
      .nonempty("必填")
      .min(3, "最少 3 字")
      .regex(/^[a-zA-Z0-9_]+$/, "僅允許英數字與底線"),
    email: z.email("Email 格式不正確").nonempty("必填"),
    password: z
      .string()
      .nonempty("必填")
      .min(8, "至少 8 碼")
      .regex(/[A-Z]/, "需包含大寫字母")
      .regex(/[a-z]/, "需包含小寫字母")
      .regex(/[0-9]/, "需包含數字"),
    confirmPassword: z.string().nonempty("必填"),
    country: z.string().min(1, "請選擇國家"),
    terms: z.boolean().refine((value) => value, "必須同意"),
    gender: z.string().nonempty("請選擇性別").min(1),
    birthday: z.date(),
    age: z
      .number()
      .int("必須是整數")
      .min(18, "至少 18 歲")
      .max(99, "不得超過 99 歲"),
    avatar: z
      .custom<FileList>()
      .refine((files) => files?.length === 1, "需上傳 1 張圖片")
      .refine(
        (files) => ["image/jpeg", "image/png"].includes(files?.[0]?.type ?? ""),
        "僅限 jpg/png"
      )
      .refine(
        (files) => (files?.[0]?.size ?? 0) <= 2 * 1024 * 1024,
        "需小於 2MB"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"], // Show error on confirmPassword field
  });

export function ValidatedForm() {
  const form = useForm<z.infer<typeof FullFormSchema>>({
    resolver: zodResolver(FullFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      terms: false,
      gender: "",
      birthday: new Date(),
      age: 18,
      avatar: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof FullFormSchema>) {
    console.log(values);
    alert("Form Submitted! Check the console for the data.");
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-8 mx-auto"
      >
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col align-items-start">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="gemini_user" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col align-items-start">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@google.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col align-items-start">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <EyeIcon
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    ></EyeIcon>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col align-items-start">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                    <EyeIcon
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                    ></EyeIcon>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-[240px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="taiwan">Taiwan</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="male" />
                    </FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="female" />
                    </FormControl>
                    <FormLabel className="font-normal">Female</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="other" />
                    </FormControl>
                    <FormLabel className="font-normal">Other</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <DatePicker field={field} text="Select a date"></DatePicker>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => onChange(e.target.files)}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
