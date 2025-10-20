"use client";

/**
 * EventList Component
 * Displays all events in user's local timezone
 */

import type { Event } from "@/types/event";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
  userTimezone: string;
  isLoading: boolean;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export default function EventList({
  events,
  userTimezone,
  isLoading,
  onEdit,
  onDelete,
}: EventListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={`skeleton-${i.toString()}`}
            className="bg-gray-100 rounded-lg h-48 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Events Yet
        </h3>
        <p className="text-gray-500">Create your first event to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          userTimezone={userTimezone}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
