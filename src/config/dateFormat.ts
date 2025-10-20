/**
 * Date Format Configuration
 * Central configuration for date formatting across the application
 * Change DATE_FORMAT to update the format application-wide
 */

/**
 * Available date format presets
 */
export const DATE_FORMAT_PRESETS = {
	US: "MM/dd/yyyy", // US Standard: 10/19/2025
	EU: "dd/MM/yyyy", // European: 19/10/2025
	ISO: "yyyy-MM-dd", // ISO Standard: 2025-10-19
	LONG_US: "MMMM d, yyyy", // Long US: October 19, 2025
	LONG_EU: "d MMMM yyyy", // Long EU: 19 October 2025
	SHORT_US: "M/d/yy", // Short US: 10/19/25
	SHORT_EU: "d/M/yy", // Short EU: 19/10/25
} as const;

/**
 * Available time format presets
 */
export const TIME_FORMAT_PRESETS = {
	"12H": "h:mm a", // 12-hour: 3:30 PM
	"24H": "HH:mm", // 24-hour: 15:30
	"12H_SECONDS": "h:mm:ss a", // 12-hour with seconds: 3:30:45 PM
	"24H_SECONDS": "HH:mm:ss", // 24-hour with seconds: 15:30:45
} as const;

/**
 * Available datetime format presets
 */
export const DATETIME_FORMAT_PRESETS = {
	US_12H: "MM/dd/yyyy h:mm a", // US 12-hour: 10/19/2025 3:30 PM
	US_24H: "MM/dd/yyyy HH:mm", // US 24-hour: 10/19/2025 15:30
	EU_12H: "dd/MM/yyyy h:mm a", // EU 12-hour: 19/10/2025 3:30 PM
	EU_24H: "dd/MM/yyyy HH:mm", // EU 24-hour: 19/10/2025 15:30
	ISO_12H: "yyyy-MM-dd h:mm a", // ISO 12-hour: 2025-10-19 3:30 PM
	ISO_24H: "yyyy-MM-dd HH:mm", // ISO 24-hour: 2025-10-19 15:30
	LONG_US_12H: "MMMM d, yyyy 'at' h:mm a", // October 19, 2025 at 3:30 PM
	LONG_EU_24H: "d MMMM yyyy 'at' HH:mm", // 19 October 2025 at 15:30
} as const;

/**
 * FEATURE FLAG: Change these values to update format application-wide
 */
export const APP_DATE_FORMAT_CONFIG = {
	// Primary date format used throughout the app
	DATE_FORMAT: DATE_FORMAT_PRESETS.US, // Change to US, EU, ISO, etc.

	// Primary time format
	TIME_FORMAT: TIME_FORMAT_PRESETS["12H"], // Change to 12H or 24H

	// Primary datetime format (used for event display)
	DATETIME_FORMAT: DATETIME_FORMAT_PRESETS.US_12H, // Change to any preset

	// Long datetime format (used for detailed views)
	DATETIME_LONG_FORMAT: DATETIME_FORMAT_PRESETS.LONG_US_12H,

	// Date format for forms and inputs
	INPUT_DATE_FORMAT: DATE_FORMAT_PRESETS.US,
} as const;

/**
 * Get the current date format
 */
export const getDateFormat = (): string => {
	return APP_DATE_FORMAT_CONFIG.DATE_FORMAT;
};

/**
 * Get the current time format
 */
export const getTimeFormat = (): string => {
	return APP_DATE_FORMAT_CONFIG.TIME_FORMAT;
};

/**
 * Get the current datetime format
 */
export const getDateTimeFormat = (): string => {
	return APP_DATE_FORMAT_CONFIG.DATETIME_FORMAT;
};

/**
 * Get the long datetime format
 */
export const getDateTimeLongFormat = (): string => {
	return APP_DATE_FORMAT_CONFIG.DATETIME_LONG_FORMAT;
};

/**
 * Get the input date format
 */
export const getInputDateFormat = (): string => {
	return APP_DATE_FORMAT_CONFIG.INPUT_DATE_FORMAT;
};

/**
 * Custom format builder
 * Use this if you need a one-off custom format
 */
export const buildCustomFormat = (
	dateFormat: string,
	timeFormat: string,
	separator = " ",
): string => {
	return `${dateFormat}${separator}${timeFormat}`;
};

