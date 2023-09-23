import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getKeyFromUrl = (url: string) => {
  return url.split("https://utfs.io/f/")[1]
}

export const isSelfHostedImage = (url: string) => {
  return url.includes("https://utfs.io/f")
}