/**
 * Individual Event API Route
 * Handles PUT (update) and DELETE operations for specific events
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Event, UpdateEventPayload } from "@/types/event";
import { convertToUTC } from "@/utils/timezone";
import { isValidDateRange } from "@/utils/dateValidation";

const DB_PATH = join(process.cwd(), "src", "data", "events.json");

interface Database {
	events: Event[];
}

/**
 * Read events from JSON database
 */
async function readEvents(): Promise<Event[]> {
	try {
		const data = await readFile(DB_PATH, "utf-8");
		const db: Database = JSON.parse(data);
		return db.events || [];
	} catch (error) {
		console.error("Error reading events:", error);
		return [];
	}
}

/**
 * Write events to JSON database
 */
async function writeEvents(events: Event[]): Promise<void> {
	try {
		const db: Database = { events };
		await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
	} catch (error) {
		console.error("Error writing events:", error);
		throw new Error("Failed to save events");
	}
}

/**
 * PUT /api/events/[id]
 * Update an existing event
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body: UpdateEventPayload = await request.json();

		// Read existing events
		const events = await readEvents();

		// Find event to update
		const eventIndex = events.findIndex((event) => event.id === id);

		if (eventIndex === -1) {
			return NextResponse.json(
				{
					success: false,
					error: "Event not found",
				},
				{ status: 404 },
			);
		}

		const existingEvent = events[eventIndex];

		// Validate title if provided
		if (body.title !== undefined) {
			if (body.title.trim().length === 0 || body.title.length > 200) {
				return NextResponse.json(
					{
						success: false,
						error: "Title must be between 1 and 200 characters",
					},
					{ status: 400 },
				);
			}
		}

		// Validate description if provided
		if (body.description !== undefined) {
			if (
				body.description.trim().length === 0 ||
				body.description.length > 1000
			) {
				return NextResponse.json(
					{
						success: false,
						error: "Description must be between 1 and 1000 characters",
					},
					{ status: 400 },
				);
			}
		}

		// Handle date updates
		let startDateTimeUTC = existingEvent.startDateTime;
		let endDateTimeUTC = existingEvent.endDateTime;
		const timezone = body.timezone || existingEvent.timezone;

		if (body.startDateTime) {
			try {
				startDateTimeUTC = convertToUTC(body.startDateTime, timezone);
			} catch (error) {
				console.error("Date conversion error:", error);
				return NextResponse.json(
					{
						success: false,
						error: "Invalid start date or timezone",
					},
					{ status: 400 },
				);
			}
		}

		if (body.endDateTime) {
			try {
				endDateTimeUTC = convertToUTC(body.endDateTime, timezone);
			} catch (error) {
				console.error("Date conversion error:", error);
				return NextResponse.json(
					{
						success: false,
						error: "Invalid end date or timezone",
					},
					{ status: 400 },
				);
			}
		}

		// Validate date range
		if (!isValidDateRange(startDateTimeUTC, endDateTimeUTC)) {
			return NextResponse.json(
				{
					success: false,
					error: "End date must be after start date",
				},
				{ status: 400 },
			);
		}

		// Update event
		const updatedEvent: Event = {
			...existingEvent,
			title: body.title !== undefined ? body.title.trim() : existingEvent.title,
			description:
				body.description !== undefined
					? body.description.trim()
					: existingEvent.description,
			startDateTime: startDateTimeUTC,
			endDateTime: endDateTimeUTC,
			timezone,
		};

		events[eventIndex] = updatedEvent;

		// Write back to database
		await writeEvents(events);

		return NextResponse.json(
			{
				success: true,
				data: updatedEvent,
				message: "Event updated successfully",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("PUT /api/events/[id] error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to update event",
			},
			{ status: 500 },
		);
	}
}

/**
 * DELETE /api/events/[id]
 * Delete an event
 */
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		// Read existing events
		const events = await readEvents();

		// Find event to delete
		const eventIndex = events.findIndex((event) => event.id === id);

		if (eventIndex === -1) {
			return NextResponse.json(
				{
					success: false,
					error: "Event not found",
				},
				{ status: 404 },
			);
		}

		// Remove event
		events.splice(eventIndex, 1);

		// Write back to database
		await writeEvents(events);

		return NextResponse.json(
			{
				success: true,
				message: "Event deleted successfully",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("DELETE /api/events/[id] error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to delete event",
			},
			{ status: 500 },
		);
	}
}

