/**
 * Date Validation Utility Functions
 * Reusable functions for validating and sanitizing date inputs
 * Can be used in any project without modifications
 */

import { isValid, parseISO, isBefore, isAfter } from "date-fns";

/**
 * Validate if a date range is valid (start date is before end date)
 * @param startDate - Start date (ISO string or Date object)
 * @param endDate - End date (ISO string or Date object)
 * @returns boolean indicating if range is valid
 */
export const isValidDateRange = (
	startDate: string | Date,
	endDate: string | Date,
): boolean => {
	try {
		const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
		const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

		if (!isValid(start) || !isValid(end)) {
			return false;
		}

		return isBefore(start, end) || start.getTime() === end.getTime();
	} catch (error) {
		console.error("Error validating date range:", error);
		return false;
	}
};

/**
 * Validate if a string is a valid ISO 8601 date string
 * @param dateString - Date string to validate
 * @returns boolean indicating validity
 */
export const isValidISOString = (dateString: string): boolean => {
	try {
		const date = parseISO(dateString);
		return isValid(date);
	} catch {
		return false;
	}
};

/**
 * Sanitize and validate date input from user
 * @param input - Raw input string
 * @returns Sanitized date string or null if invalid
 */
export const sanitizeDateInput = (input: string): string | null => {
	try {
		// Remove extra whitespace
		const trimmed = input.trim();

		if (!trimmed) {
			return null;
		}

		// Try to parse the date
		const date = new Date(trimmed);

		if (!isValid(date)) {
			return null;
		}

		return date.toISOString();
	} catch (error) {
		console.error("Error sanitizing date input:", error);
		return null;
	}
};

/**
 * Check if a date is in the past
 * @param date - Date to check (ISO string or Date object)
 * @returns boolean indicating if date is in the past
 */
export const isDateInPast = (date: string | Date): boolean => {
	try {
		const dateToCheck = typeof date === "string" ? parseISO(date) : date;
		return isBefore(dateToCheck, new Date());
	} catch {
		return false;
	}
};

/**
 * Check if a date is in the future
 * @param date - Date to check (ISO string or Date object)
 * @returns boolean indicating if date is in the future
 */
export const isDateInFuture = (date: string | Date): boolean => {
	try {
		const dateToCheck = typeof date === "string" ? parseISO(date) : date;
		return isAfter(dateToCheck, new Date());
	} catch {
		return false;
	}
};

/**
 * Validate datetime-local input format
 * @param input - Input value from datetime-local field
 * @returns boolean indicating if format is valid
 */
export const isValidDateTimeLocalFormat = (input: string): boolean => {
	// datetime-local format: YYYY-MM-DDTHH:mm
	const dateTimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
	return dateTimeLocalRegex.test(input);
};

/**
 * Validate event form data
 * @param data - Form data to validate
 * @returns Object with validation result and error messages
 */
export interface ValidationResult {
	isValid: boolean;
	errors: {
		title?: string;
		description?: string;
		startDateTime?: string;
		endDateTime?: string;
		general?: string;
	};
}

export const validateEventFormData = (data: {
	title: string;
	description: string;
	startDateTime: string;
	endDateTime: string;
}): ValidationResult => {
	const errors: ValidationResult["errors"] = {};

	// Validate title
	if (!data.title || data.title.trim().length === 0) {
		errors.title = "Title is required";
	} else if (data.title.length > 200) {
		errors.title = "Title must be less than 200 characters";
	}

	// Validate description
	if (!data.description || data.description.trim().length === 0) {
		errors.description = "Description is required";
	} else if (data.description.length > 1000) {
		errors.description = "Description must be less than 1000 characters";
	}

	// Validate start date
	if (!data.startDateTime) {
		errors.startDateTime = "Start date and time is required";
	} else if (!isValidDateTimeLocalFormat(data.startDateTime)) {
		errors.startDateTime = "Invalid start date format";
	}

	// Validate end date
	if (!data.endDateTime) {
		errors.endDateTime = "End date and time is required";
	} else if (!isValidDateTimeLocalFormat(data.endDateTime)) {
		errors.endDateTime = "Invalid end date format";
	}

	// Validate date range
	if (data.startDateTime && data.endDateTime && !errors.startDateTime && !errors.endDateTime) {
		if (!isValidDateRange(data.startDateTime, data.endDateTime)) {
			errors.endDateTime = "End date must be after start date";
		}
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

