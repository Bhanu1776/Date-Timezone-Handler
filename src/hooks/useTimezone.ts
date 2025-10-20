"use client";

/**
 * useTimezone Hook
 * Custom hook for detecting and managing user timezone
 * Reusable across projects
 */

import { useState, useEffect } from "react";
import { getUserTimezone, isValidTimezone } from "@/utils/timezone";

export interface UseTimezoneReturn {
	timezone: string;
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to detect and return the user's timezone
 * Auto-detects from browser on mount
 * @returns Object containing timezone, loading state, and error
 */
export const useTimezone = (): UseTimezoneReturn => {
	const [timezone, setTimezone] = useState<string>("UTC");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			const detectedTimezone = getUserTimezone();

			if (!isValidTimezone(detectedTimezone)) {
				throw new Error("Invalid timezone detected");
			}

			setTimezone(detectedTimezone);
			setError(null);
		} catch (err) {
			console.error("Error detecting timezone:", err);
			setError("Failed to detect timezone. Using UTC as default.");
			setTimezone("UTC");
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { timezone, isLoading, error };
};

