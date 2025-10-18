import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOpenRouterKey = () => import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
