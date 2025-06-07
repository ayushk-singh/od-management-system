import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getParamFromURL(url: string, slug: string): string | null {
  const regex = new RegExp(`${slug}/([^/]+)$`);
  const match = new URL(url).pathname.match(regex);
  return match?.[1] ?? null;
}
