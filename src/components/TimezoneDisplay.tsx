"use client";

/**
 * TimezoneDisplay Component
 * Shows the user's current timezone with visual indicator
 */

import { useEffect, useState } from "react";
import {
  getTimezoneAbbreviation,
  formatTimezoneOffset,
} from "@/utils/timezone";

interface TimezoneDisplayProps {
  timezone: string;
  showCurrentTime?: boolean;
}

export default function TimezoneDisplay({
  timezone,
  showCurrentTime = true,
}: TimezoneDisplayProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const abbreviation = getTimezoneAbbreviation(timezone);
  const offset = formatTimezoneOffset(timezone);

  useEffect(() => {
    if (!showCurrentTime) return;

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone, showCurrentTime]);

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-200 shadow-sm">
      <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white font-bold text-sm">
        🌍
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-700">Your Timezone</div>
        <div className="text-xs text-gray-600">
          {timezone} ({abbreviation} • {offset})
        </div>
      </div>
      {showCurrentTime && (
        <div className="text-right">
          <div className="text-sm font-mono font-semibold text-blue-600">
            {currentTime}
          </div>
          <div className="text-xs text-gray-500">Local Time</div>
        </div>
      )}
    </div>
  );
}
