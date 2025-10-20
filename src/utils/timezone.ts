/**
 * Timezone Utility Functions
 * Reusable functions for timezone detection and conversion
 * Can be used in any project without modifications
 */

import { format, parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime, fromZonedTime } from "date-fns-tz";

/**
 * Get the user's timezone from the browser
 * @returns IANA timezone string (e.g., "America/New_York")
 */
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error("Error detecting timezone:", error);
    return "UTC"; // Fallback to UTC
  }
};

/**
 * Convert a UTC date string to a specific timezone
 * @param utcDateString - ISO 8601 UTC date string
 * @param timezone - Target IANA timezone
 * @returns Date object in the target timezone
 */
export const convertUTCToTimezone = (
  utcDateString: string,
  timezone: string,
): Date => {
  try {
    const utcDate = parseISO(utcDateString);
    return toZonedTime(utcDate, timezone);
  } catch (error) {
    console.error("Error converting UTC to timezone:", error);
    throw new Error("Invalid date or timezone");
  }
};

/**
 * Convert a local date/time to UTC
 * @param localDateString - Local date string (from datetime-local input)
 * @param timezone - Source IANA timezone
 * @returns ISO 8601 UTC string
 */
export const convertToUTC = (
  localDateString: string,
  timezone: string,
): string => {
  try {
    // Parse the local date string (assuming it's in the format from datetime-local input)
    const localDate = new Date(localDateString);
    // Convert from the local timezone to UTC
    const utcDate = fromZonedTime(localDate, timezone);
    return utcDate.toISOString();
  } catch (error) {
    console.error("Error converting to UTC:", error);
    throw new Error("Invalid date or timezone");
  }
};

/**
 * Format an event date/time for display in a specific timezone
 * @param utcDateString - ISO 8601 UTC date string
 * @param timezone - Display timezone
 * @param formatString - date-fns format string (optional, uses app config if not provided)
 * @returns Formatted date string
 */
export const formatEventDateTime = (
  utcDateString: string,
  timezone: string,
  formatString?: string,
): string => {
  try {
    // If no format string provided, use app configuration
    const format =
      formatString ||
      (() => {
        const { getDateTimeFormat } = require("@/config/dateFormat");
        return getDateTimeFormat() as string;
      })();
    return formatInTimeZone(parseISO(utcDateString), timezone, format);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Format date for datetime-local input
 * Converts UTC date to local timezone and formats for input value
 * @param utcDateString - ISO 8601 UTC date string
 * @param timezone - User's timezone
 * @returns String in format "YYYY-MM-DDTHH:mm" (datetime-local input format)
 */
export const formatForDateTimeInput = (
  utcDateString: string,
  timezone: string,
): string => {
  try {
    const localDate = convertUTCToTimezone(utcDateString, timezone);
    // datetime-local input always requires yyyy-MM-dd'T'HH:mm format
    return format(localDate, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.error("Error formatting for input:", error);
    return "";
  }
};

/**
 * Format date for display (uses app config format)
 * @param utcDateString - ISO 8601 UTC date string
 * @param timezone - Display timezone
 * @returns Formatted date string
 */
export const formatDateOnly = (
  utcDateString: string,
  timezone: string,
): string => {
  try {
    const { getDateFormat } = require("@/config/dateFormat");
    const formatString = getDateFormat();
    return formatInTimeZone(parseISO(utcDateString), timezone, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Format time for display (uses app config format)
 * @param utcDateString - ISO 8601 UTC date string
 * @param timezone - Display timezone
 * @returns Formatted time string
 */
export const formatTimeOnly = (
  utcDateString: string,
  timezone: string,
): string => {
  try {
    const { getTimeFormat } = require("@/config/dateFormat");
    const formatString = getTimeFormat();
    return formatInTimeZone(parseISO(utcDateString), timezone, formatString);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Time";
  }
};

/**
 * Validate if a string is a valid IANA timezone
 * @param timezone - Timezone string to validate
 * @returns boolean indicating validity
 */
export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

/**
 * Get timezone abbreviation (e.g., "PST", "EST", "IST")
 * @param timezone - IANA timezone string
 * @param date - Optional date to check (for DST)
 * @returns Timezone abbreviation
 */
export const getTimezoneAbbreviation = (
  timezone: string,
  date: Date = new Date(),
): string => {
  try {
    const formatted = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    }).format(date);

    // Extract the timezone abbreviation from the formatted string
    const parts = formatted.split(" ");
    return parts[parts.length - 1];
  } catch {
    return "";
  }
};

/**
 * Get the offset of a timezone in hours
 * @param timezone - IANA timezone string
 * @param date - Optional date to check (for DST)
 * @returns Offset in hours (e.g., -5, 5.5)
 */
export const getTimezoneOffset = (
  timezone: string,
  date: Date = new Date(),
): number => {
  try {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(
      date.toLocaleString("en-US", { timeZone: timezone }),
    );
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  } catch {
    return 0;
  }
};

/**
 * Format timezone offset for display (e.g., "UTC+5:30", "UTC-8")
 * @param timezone - IANA timezone string
 * @param date - Optional date to check (for DST)
 * @returns Formatted offset string
 */
export const formatTimezoneOffset = (
  timezone: string,
  date: Date = new Date(),
): string => {
  const offset = getTimezoneOffset(timezone, date);
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }
  return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
};
