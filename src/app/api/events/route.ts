/**
 * Events API Route
 * Handles GET (fetch all) and POST (create) operations
 * All dates are stored in UTC in the database
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { CreateEventPayload, Event } from "@/types/event";
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
 * GET /api/events
 * Fetch all events (returns dates in UTC)
 */
export async function GET() {
	try {
		const events = await readEvents();

		return NextResponse.json(
			{
				success: true,
				data: events,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("GET /api/events error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch events",
			},
			{ status: 500 },
		);
	}
}

/**
 * POST /api/events
 * Create a new event (converts local time to UTC before storing)
 */
export async function POST(request: NextRequest) {
	try {
		const body: CreateEventPayload = await request.json();

		// Validate required fields
		if (!body.title || !body.description || !body.startDateTime || !body.endDateTime || !body.timezone) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing required fields",
				},
				{ status: 400 },
			);
		}

		// Validate title length
		if (body.title.trim().length === 0 || body.title.length > 200) {
			return NextResponse.json(
				{
					success: false,
					error: "Title must be between 1 and 200 characters",
				},
				{ status: 400 },
			);
		}

		// Validate description length
		if (body.description.trim().length === 0 || body.description.length > 1000) {
			return NextResponse.json(
				{
					success: false,
					error: "Description must be between 1 and 1000 characters",
				},
				{ status: 400 },
			);
		}

		// Validate date range
		if (!isValidDateRange(body.startDateTime, body.endDateTime)) {
			return NextResponse.json(
				{
					success: false,
					error: "End date must be after start date",
				},
				{ status: 400 },
			);
		}

		// Convert local dates to UTC
		let startDateTimeUTC: string;
		let endDateTimeUTC: string;

		try {
			startDateTimeUTC = convertToUTC(body.startDateTime, body.timezone);
			endDateTimeUTC = convertToUTC(body.endDateTime, body.timezone);
		} catch (error) {
			console.error("Date conversion error:", error);
			return NextResponse.json(
				{
					success: false,
					error: "Invalid date or timezone",
				},
				{ status: 400 },
			);
		}

		// Create new event
		const newEvent: Event = {
			id: randomUUID(),
			title: body.title.trim(),
			description: body.description.trim(),
			startDateTime: startDateTimeUTC,
			endDateTime: endDateTimeUTC,
			createdBy: body.createdBy || "Anonymous",
			createdAt: new Date().toISOString(),
			timezone: body.timezone,
		};

		// Read existing events
		const events = await readEvents();

		// Add new event
		events.push(newEvent);

		// Write back to database
		await writeEvents(events);

		return NextResponse.json(
			{
				success: true,
				data: newEvent,
				message: "Event created successfully",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("POST /api/events error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to create event",
			},
			{ status: 500 },
		);
	}
}

