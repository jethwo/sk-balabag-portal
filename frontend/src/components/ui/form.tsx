import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { cn } from "@/lib/utils";

const field = "w-full rounded-md border border-ink/20 bg-cream px-3 py-2 text-sm text-ink focus:outline-2 focus:outline-purple";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...p }, ref) => <input ref={ref} className={cn(field, className)} {...p} />);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...p }, ref) => <textarea ref={ref} className={cn(field, className)} {...p} />);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...p }, ref) => <select ref={ref} className={cn(field, className)} {...p} />);
Select.displayName = "Select";

export const Label = ({ className, ...p }: React.ComponentProps<typeof LabelPrimitive.Root>) =>
  <LabelPrimitive.Root className={cn("mb-1 mt-3 block text-sm font-semibold", className)} {...p} />;

export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) =>
  <div className={cn("rounded-lg border border-ink/15 bg-paper p-4 shadow-sm", className)} {...p} />;
