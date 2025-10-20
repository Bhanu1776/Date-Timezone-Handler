"use client";

/**
 * EventForm Component
 * Form for creating and editing events with native datetime-local inputs
 */

import { useState, useEffect } from "react";
import type { Event, EventFormData } from "@/types/event";
import { validateEventFormData } from "@/utils/dateValidation";
import { formatForDateTimeInput } from "@/utils/timezone";

interface EventFormProps {
  timezone: string;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Event;
  isEdit?: boolean;
}

export default function EventForm({
  timezone,
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    createdBy: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with initial data for editing
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        startDateTime: formatForDateTimeInput(
          initialData.startDateTime,
          timezone,
        ),
        endDateTime: formatForDateTimeInput(initialData.endDateTime, timezone),
        createdBy: initialData.createdBy,
      });
    }
  }, [initialData, isEdit, timezone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validation = validateEventFormData(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(formData);

      // Reset form if not editing
      if (!isEdit) {
        setFormData({
          title: "",
          description: "",
          startDateTime: "",
          endDateTime: "",
          createdBy: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        general: "Failed to save event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      createdBy: "",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.title
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
          placeholder="Enter event title"
          maxLength={200}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
            errors.description
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
          placeholder="Enter event description"
          maxLength={1000}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startDateTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            id="startDateTime"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.startDateTime
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
          />
          {errors.startDateTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startDateTime}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="endDateTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            id="endDateTime"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.endDateTime
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
          />
          {errors.endDateTime && (
            <p className="mt-1 text-sm text-red-600">{errors.endDateTime}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="createdBy"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Name
        </label>
        <input
          type="text"
          id="createdBy"
          name="createdBy"
          value={formData.createdBy}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter your name (optional)"
          maxLength={100}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update Event"
              : "Create Event"}
        </button>

        {!isEdit && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        )}

        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
