/**
 * Utility Functions Module
 *
 * This module contains helper functions used throughout the application.
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and merges Tailwind CSS classes.
 *
 * This utility function allows for conditional class names and
 * properly merges conflicting Tailwind CSS utility classes.
 *
 * @param inputs - Class values to combine (strings, arrays, objects)
 * @returns Merged class name string
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", { "opacity-50": isDisabled })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
