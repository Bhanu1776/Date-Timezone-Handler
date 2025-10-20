/**
 * Event Type Definitions
 * These types define the structure of events throughout the application
 */

export interface Event {
	id: string;
	title: string;
	description: string;
	startDateTime: string; // ISO 8601 UTC string
	endDateTime: string; // ISO 8601 UTC string
	createdBy: string;
	createdAt: string; // ISO 8601 UTC string
	timezone: string; // Original timezone in IANA format (e.g., "America/Los_Angeles")
}

export interface EventFormData {
	title: string;
	description: string;
	startDateTime: string; // Local datetime string from input
	endDateTime: string; // Local datetime string from input
	createdBy: string;
}

export interface CreateEventPayload extends EventFormData {
	timezone: string; // User's timezone
}

export interface UpdateEventPayload extends Partial<EventFormData> {
	timezone?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface EventsResponse extends ApiResponse<Event[]> {
	data: Event[];
}

export interface EventResponse extends ApiResponse<Event> {
	data: Event;
}

export interface DeleteResponse extends ApiResponse<null> {
	message: string;
}

