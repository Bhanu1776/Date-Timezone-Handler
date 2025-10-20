"use client";

/**
 * useDateTimeConverter Hook
 * Custom hook for converting dates between timezones with memoization
 * Reusable across projects
 */

import { useMemo } from "react";
import {
	convertUTCToTimezone,
	convertToUTC,
	formatEventDateTime,
	formatForDateTimeInput,
	formatDateOnly,
	formatTimeOnly,
} from "@/utils/timezone";

export interface UseDateTimeConverterReturn {
	convertUTCToLocal: (utcDateString: string, timezone: string) => Date;
	convertLocalToUTC: (localDateString: string, timezone: string) => string;
	formatDateTime: (
		utcDateString: string,
		timezone: string,
		formatString?: string,
	) => string;
	formatForInput: (utcDateString: string, timezone: string) => string;
	formatDate: (utcDateString: string, timezone: string) => string;
	formatTime: (utcDateString: string, timezone: string) => string;
}

/**
 * Hook providing memoized date/time conversion functions
 * @returns Object with conversion functions
 */
export const useDateTimeConverter = (): UseDateTimeConverterReturn => {
	const converter = useMemo(() => {
		return {
			convertUTCToLocal: (utcDateString: string, timezone: string): Date => {
				return convertUTCToTimezone(utcDateString, timezone);
			},
			convertLocalToUTC: (
				localDateString: string,
				timezone: string,
			): string => {
				return convertToUTC(localDateString, timezone);
			},
			formatDateTime: (
				utcDateString: string,
				timezone: string,
				formatString?: string,
			): string => {
				return formatEventDateTime(utcDateString, timezone, formatString);
			},
			formatForInput: (utcDateString: string, timezone: string): string => {
				return formatForDateTimeInput(utcDateString, timezone);
			},
			formatDate: (utcDateString: string, timezone: string): string => {
				return formatDateOnly(utcDateString, timezone);
			},
			formatTime: (utcDateString: string, timezone: string): string => {
				return formatTimeOnly(utcDateString, timezone);
			},
		};
	}, []);

	return converter;
};

