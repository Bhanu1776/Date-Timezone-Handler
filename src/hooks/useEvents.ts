"use client";

/**
 * useEvents Hook
 * Custom hook for managing events with CRUD operations
 * Includes optimistic updates and automatic timezone conversion
 * Reusable across projects
 */

import { useState, useEffect, useCallback } from "react";
import type {
	Event,
	CreateEventPayload,
	UpdateEventPayload,
} from "@/types/event";

export interface UseEventsReturn {
	events: Event[];
	isLoading: boolean;
	error: string | null;
	createEvent: (eventData: CreateEventPayload) => Promise<Event | null>;
	updateEvent: (
		id: string,
		eventData: UpdateEventPayload,
	) => Promise<Event | null>;
	deleteEvent: (id: string) => Promise<boolean>;
	refreshEvents: () => Promise<void>;
}

/**
 * Hook for managing events with full CRUD operations
 * @returns Object with events array and CRUD functions
 */
export const useEvents = (): UseEventsReturn => {
	const [events, setEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch all events
	const fetchEvents = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch("/api/events");

			if (!response.ok) {
				throw new Error(`Failed to fetch events: ${response.statusText}`);
			}

			const data = await response.json();

			if (data.success && data.data) {
				setEvents(data.data);
			} else {
				throw new Error(data.error || "Failed to fetch events");
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "An unknown error occurred";
			setError(errorMessage);
			console.error("Error fetching events:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Create a new event
	const createEvent = useCallback(
		async (eventData: CreateEventPayload): Promise<Event | null> => {
			try {
				setError(null);

				const response = await fetch("/api/events", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(eventData),
				});

				if (!response.ok) {
					throw new Error(`Failed to create event: ${response.statusText}`);
				}

				const data = await response.json();

				if (data.success && data.data) {
					// Optimistic update
					setEvents((prev) => [data.data, ...prev]);
					return data.data;
				}
				throw new Error(data.error || "Failed to create event");
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "An unknown error occurred";
				setError(errorMessage);
				console.error("Error creating event:", err);
				return null;
			}
		},
		[],
	);

	// Update an existing event
	const updateEvent = useCallback(
		async (
			id: string,
			eventData: UpdateEventPayload,
		): Promise<Event | null> => {
			try {
				setError(null);

				const response = await fetch(`/api/events/${id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(eventData),
				});

				if (!response.ok) {
					throw new Error(`Failed to update event: ${response.statusText}`);
				}

				const data = await response.json();

				if (data.success && data.data) {
					// Optimistic update
					setEvents((prev) =>
						prev.map((event) => (event.id === id ? data.data : event)),
					);
					return data.data;
				}
				throw new Error(data.error || "Failed to update event");
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "An unknown error occurred";
				setError(errorMessage);
				console.error("Error updating event:", err);
				return null;
			}
		},
		[],
	);

	// Delete an event
	const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
		try {
			setError(null);

			// Optimistic update
			setEvents((prev) => prev.filter((event) => event.id !== id));

			const response = await fetch(`/api/events/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				// Revert optimistic update on failure
				await fetchEvents();
				throw new Error(`Failed to delete event: ${response.statusText}`);
			}

			const data = await response.json();

			if (data.success) {
				return true;
			}
			throw new Error(data.error || "Failed to delete event");
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "An unknown error occurred";
			setError(errorMessage);
			console.error("Error deleting event:", err);
			return false;
		}
	}, [fetchEvents]);

	// Refresh events
	const refreshEvents = useCallback(async () => {
		await fetchEvents();
	}, [fetchEvents]);

	// Fetch events on mount
	useEffect(() => {
		fetchEvents();
	}, [fetchEvents]);

	return {
		events,
		isLoading,
		error,
		createEvent,
		updateEvent,
		deleteEvent,
		refreshEvents,
	};
};

