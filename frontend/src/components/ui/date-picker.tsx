"use client";
import { Input } from "./input";
import { Field } from "./field";

export function DatePicker({ value, onChange, label, required }: {
  value: string; onChange: (v: string) => void; label?: string; required?: boolean;
}) {
  const input = <Input type="date" value={value} onChange={e => onChange(e.target.value)} />;
  return label ? <Field label={label} required={required}>{input}</Field> : input;
}

