import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "yyyy.MM.dd.(E) HH:mm", {
    locale: ko,
  });
}

export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
    7,
    11
  )}`;
}

export const formatNumberWithCommas = (value: number | string): string => {
  let num: number;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return "";

    const sanitized = trimmed.replace(/,/g, "");
    // Only allow sign, digits, and optional decimal point
    if (!/^[-+]?\d*(\.\d+)?$/.test(sanitized)) return "";

    const parsed = Number(sanitized);
    if (Number.isNaN(parsed)) return "";
    num = Math.round(parsed);
  } else {
    num = Math.round(value);
  }

  return num.toLocaleString("ko-KR");
};

export const parseFormattedNumber = (value: string): number => {
  const match = value.match(/[-+]?\d[\d,]*(?:\.\d+)?/);
  if (!match) return 0;

  const numericString = match[0].replace(/,/g, "");
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : Math.trunc(parsed);
};
