import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractFields(obj, fields) {
  let result = {};
  for (const key of fields) {
    if (key in obj) result[key] = obj[key];
  }
  for (const val of Object.values(obj)) {
    if (typeof val === "object" && val !== null) {
      result = { ...result, ...extractFields(val, fields) };
    }
  }
  return result;
}
