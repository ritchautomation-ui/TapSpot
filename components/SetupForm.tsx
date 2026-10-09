"use client";

import type { Product } from "@/lib/types";
import type { Errors } from "@/lib/validation";
import { Field, inputClass } from "./ui";

export function SetupForm({ product, values, errors, onChange }: {
  product: Product; values: Record<string, string>; errors: Errors; onChange: (key: string, value: string) => void;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 text-lg font-bold">Your setup details</legend>
      <p className="text-sm text-mute">We use these to program your NFC. Our team reviews them before programming.</p>
      {product.setupFields.map((f) => {
        const id = `setup-${product.id}-${f.key}`;
        const err = errors[f.key];
        const common = {
          id, name: f.key, value: values[f.key] ?? "", placeholder: f.placeholder,
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(f.key, e.target.value),
          className: inputClass(!!err), "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-error` : f.help ? `${id}-help` : undefined,
          required: f.required,
        };
        return (
          <Field key={f.key} id={id} label={f.label} error={err} help={f.help} optional={!f.required}>
            {f.type === "textarea" ? (
              <textarea {...common} rows={3} />
            ) : (
              <input {...common} type={f.type === "url" ? "url" : f.type === "email" ? "email" : f.type === "tel" ? "tel" : "text"}
                inputMode={f.type === "url" ? "url" : f.type === "tel" ? "tel" : undefined} autoCapitalize="off" />
            )}
          </Field>
        );
      })}
      {product.setupNote && <p className="rounded-xl bg-paper p-3 text-sm text-mute">{product.setupNote}</p>}
    </fieldset>
  );
}
