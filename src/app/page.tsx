"use client";

/**
 * Main Page - Event Management Application
 * Demonstrates timezone-aware event handling
 */

import { useState } from "react";
import { useTimezone } from "@/hooks/useTimezone";
import { useEvents } from "@/hooks/useEvents";
import TimezoneDisplay from "@/components/TimezoneDisplay";
import EventList from "@/components/EventList";
import EventForm from "@/components/EventForm";
import type { Event, EventFormData } from "@/types/event";

export default function Home() {
  const { timezone, isLoading: timezoneLoading } = useTimezone();
  const {
    events,
    isLoading: eventsLoading,
    error: eventsError,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle create event
  const handleCreateEvent = async (formData: EventFormData) => {
    const result = await createEvent({
      ...formData,
      timezone,
    });

    if (result) {
      showToast("Event created successfully!", "success");
      setShowForm(false);
    } else {
      showToast("Failed to create event. Please try again.", "error");
    }
  };

  // Handle update event
  const handleUpdateEvent = async (formData: EventFormData) => {
    if (!editingEvent) return;

    const result = await updateEvent(editingEvent.id, {
      ...formData,
      timezone,
    });

    if (result) {
      showToast("Event updated successfully!", "success");
      setEditingEvent(null);
    } else {
      showToast("Failed to update event. Please try again.", "error");
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    const result = await deleteEvent(eventId);

    if (result) {
      showToast("Event deleted successfully!", "success");
    } else {
      showToast("Failed to delete event. Please try again.", "error");
    }
  };

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  if (timezoneLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🌍</div>
          <p className="text-gray-600">Detecting your timezone...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Timezone Event Manager
          </h1>
          <p className="text-gray-600">
            Create and manage events across different timezones seamlessly
          </p>
        </div>

        {/* Timezone Display */}
        <div className="mb-8">
          <TimezoneDisplay timezone={timezone} showCurrentTime />
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } animate-fade-in`}
          >
            {toast.message}
          </div>
        )}

        {/* Error Display */}
        {eventsError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {eventsError}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEvent ? "Edit Event" : "Create Event"}
                </h2>
                {!editingEvent && (
                  <button
                    type="button"
                    onClick={() => setShowForm(!showForm)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showForm ? "Hide" : "Show"}
                  </button>
                )}
              </div>

              {(showForm || editingEvent) && (
                <EventForm
                  timezone={timezone}
                  onSubmit={
                    editingEvent ? handleUpdateEvent : handleCreateEvent
                  }
                  onCancel={editingEvent ? handleCancelEdit : undefined}
                  initialData={editingEvent || undefined}
                  isEdit={!!editingEvent}
                />
              )}

              {!showForm && !editingEvent && (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  + New Event
                </button>
              )}
            </div>
          </div>

          {/* Event List Section */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                All Events ({events.length})
              </h2>
              <span className="text-sm text-gray-500">
                Displayed in your local timezone
              </span>
            </div>

            <EventList
              events={events}
              userTimezone={timezone}
              isLoading={eventsLoading}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            All events are stored in UTC and automatically converted to your
            local timezone.
          </p>
          <p className="mt-1">
            Create events from anywhere in the world and they'll display
            correctly for everyone!
          </p>
        </div>
      </div>
    </div>
  );
}
