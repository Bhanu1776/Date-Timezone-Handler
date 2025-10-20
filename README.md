# Timezone Event Manager

A production-grade Next.js application demonstrating how to properly handle dates, times, and timezones in a web application. This project serves as a learning resource and implementation reference for timezone-aware event management.

## 🎯 Purpose

This project was created to solve common timezone-related issues in web applications:

- Events created in one timezone displaying correctly in another
- Proper date conversion without data loss
- Handling Daylight Saving Time (DST) automatically
- Understanding frontend vs backend responsibilities for timezone handling

## ✨ Features

- **Create Events**: Add events with native date/time inputs
- **Edit Events**: Update existing events while maintaining timezone accuracy
- **Delete Events**: Remove events with confirmation
- **Automatic Timezone Detection**: Detects user's browser timezone
- **UTC Storage**: All dates stored in UTC in the backend
- **Local Display**: Events displayed in user's local timezone
- **Real-time Clock**: Shows current time in user's timezone
- **Responsive Design**: Works on desktop and mobile devices
- **Production-Grade**: Includes validation, error handling, and optimistic updates

## 🏗️ Architecture

### Core Principle: Store UTC, Display Local

```
User Input (Local) → Convert to UTC → Store in Database
Database (UTC) → Fetch → Convert to User's Local → Display
```

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Date Library**: date-fns + date-fns-tz
- **Styling**: Tailwind CSS
- **Database**: JSON file (for simplicity)
- **Linting**: Biome

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/events/          # API routes for CRUD operations
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main application page
│   └── globals.css          # Global styles
├── components/
│   ├── EventCard.tsx        # Individual event display
│   ├── EventForm.tsx        # Create/Edit form
│   ├── EventList.tsx        # List of all events
│   └── TimezoneDisplay.tsx  # Timezone indicator
├── hooks/
│   ├── useTimezone.ts       # Timezone detection hook
│   ├── useDateTimeConverter.ts  # Date conversion hook
│   └── useEvents.ts         # Event CRUD operations
├── utils/
│   ├── timezone.ts          # Timezone utility functions
│   └── dateValidation.ts    # Validation utilities
├── types/
│   └── event.ts             # TypeScript type definitions
└── data/
    └── events.json          # JSON database
```

## 🔧 Reusable Components

All utilities and hooks are designed to be **portable** and can be used in other projects:

### Hooks

```typescript
// Detect user's timezone
import { useTimezone } from "@/hooks/useTimezone";
const { timezone, isLoading } = useTimezone();

// Convert dates between timezones
import { useDateTimeConverter } from "@/hooks/useDateTimeConverter";
const { convertUTCToLocal, formatDateTime } = useDateTimeConverter();
```

### Utilities

```typescript
// Timezone functions
import {
  getUserTimezone,
  convertToUTC,
  convertUTCToTimezone,
  formatEventDateTime
} from "@/utils/timezone";

// Validation functions
import {
  isValidDateRange,
  validateEventFormData
} from "@/utils/dateValidation";
```

## 📚 Documentation

See [IMPLEMENTATION_GUIDE.mdx](./docs/1.IMPLEMENTATION_GUIDE.md) for comprehensive documentation including:

- **Architecture Decisions**: Why UTC storage and local display
- **Frontend Responsibilities**: What the frontend must handle
- **Backend Responsibilities**: What the backend must handle
- **Common Pitfalls**: Known issues and how to avoid them
- **Reusable Patterns**: How to use components in other projects
- **Testing Strategies**: How to test timezone functionality
- **Production Checklist**: What to verify before deployment

## 🧪 Testing Across Timezones

### Chrome DevTools

1. Open DevTools → Settings (⚙️)
2. More Tools → Sensors
3. Location → Select timezone
4. Reload page

### Firefox

1. Type `about:config` in address bar
2. Search `intl.tz.override`
3. Set to IANA timezone (e.g., `America/New_York`)
4. Reload page

### Test Scenarios

- Create event in one timezone, view in another
- Edit events and verify time consistency
- Test around DST transitions (March/November)
- Test midnight events
- Test multi-day events

## 🎓 Learning Outcomes

After studying this project, you'll understand:

1. **Why store dates in UTC**: Single source of truth
2. **How to use native datetime inputs**: Proper form handling
3. **Frontend timezone detection**: Using Intl API
4. **Date conversion patterns**: UTC ↔ Local conversions
5. **Common pitfalls**: DST, midnight edge cases, etc.
6. **Production considerations**: Validation, error handling, UX

## 🚀 Key Takeaways

### ✅ DO

- Store all dates in UTC (ISO 8601 format)
- Use IANA timezone identifiers (e.g., `America/Los_Angeles`)
- Convert UTC to local timezone for display
- Validate dates on both frontend and backend
- Preserve original timezone for reference

### ❌ DON'T

- Store dates in local time without timezone
- Use timezone abbreviations (PST, EST, IST)
- Trust client's system clock for server timestamps
- Use fixed UTC offsets (doesn't handle DST)
- Compare dates without normalizing to UTC

## 📝 API Endpoints

### GET `/api/events`
Fetch all events (returns UTC datetimes)

### POST `/api/events`
Create a new event
```json
{
  "title": "Meeting",
  "description": "Team sync",
  "startDateTime": "2025-01-15T10:00",
  "endDateTime": "2025-01-15T11:00",
  "timezone": "Asia/Kolkata",
  "createdBy": "John"
}
```

### PUT `/api/events/[id]`
Update an event (partial updates supported)

### DELETE `/api/events/[id]`
Delete an event

## 🔍 Edge Cases Handled

- **Midnight events**: Correctly handles day boundaries
- **DST transitions**: Automatic adjustment for daylight saving
- **Cross-day events**: Events spanning multiple days
- **Invalid timezones**: Validation and fallback to UTC
- **Past events**: Allows historical event creation
- **Future events**: No restrictions on future dates

## 📖 Further Reading

- [IANA Time Zone Database](https://www.iana.org/time-zones)
- [ISO 8601 Standard](https://en.wikipedia.org/wiki/ISO_8601)
- [date-fns Documentation](https://date-fns.org/)
- [date-fns-tz Documentation](https://github.com/marnusw/date-fns-tz)
- [MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

## 💡 Tips for Your Own Projects

1. **Start with UTC**: Always store dates in UTC
2. **Use date-fns-tz**: Reliable timezone conversion
3. **Validate everywhere**: Both frontend and backend
4. **Test thoroughly**: Especially around DST transitions
5. **Keep utilities separate**: Makes them reusable
6. **Document well**: Future you will thank you!

---

Built with ❤️ to demonstrate proper timezone handling in web applications.
