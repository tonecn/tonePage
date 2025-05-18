import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import basex from "base-x"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const base62 = basex('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');