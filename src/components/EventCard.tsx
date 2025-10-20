"use client";

/**
 * EventCard Component
 * Displays a single event with formatted date/time
 */

import type { Event } from "@/types/event";
import { formatEventDateTime } from "@/utils/timezone";

interface EventCardProps {
  event: Event;
  userTimezone: string;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export default function EventCard({
  event,
  userTimezone,
  onEdit,
  onDelete,
}: EventCardProps) {
  // Uses app config format automatically (no format string needed)
  const formattedStart = formatEventDateTime(event.startDateTime, userTimezone);
  const formattedEnd = formatEventDateTime(event.endDateTime, userTimezone);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">Start:</span>
              <span className="text-gray-700">{formattedStart}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">End:</span>
              <span className="text-gray-700">{formattedEnd}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Created by {event.createdBy}</span>
            <span>Original TZ: {event.timezone.split("/").pop()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onEdit(event)}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(event.id)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
