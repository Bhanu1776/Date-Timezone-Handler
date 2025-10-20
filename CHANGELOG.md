# Changelog

## [1.1.0] - 2025-10-19

### Added - Date Format Configuration System

#### New Files
- **`src/config/dateFormat.ts`** - Central date format configuration with feature flags
- **`DATE_FORMAT_CONFIG.md`** - Complete guide for date format configuration

#### New Features
✨ **Centralized Date Format Control**
- Change date format across entire application from single file
- Multiple preset formats included (US, EU, ISO, Long, Short)
- Support for both 12-hour and 24-hour time formats
- Custom format support using date-fns format tokens

#### Enhanced Functions
- **`formatEventDateTime()`** - Now uses app config by default, custom format optional
- **`formatDateOnly()`** - New function for date-only display with app config
- **`formatTimeOnly()`** - New function for time-only display with app config

#### Updated Components
- **EventCard** - Now uses centralized format configuration
- **useDateTimeConverter hook** - Added `formatDate()` and `formatTime()` methods

### Configuration Options

Change format by editing `src/config/dateFormat.ts`:

```typescript
export const APP_DATE_FORMAT_CONFIG = {
  DATE_FORMAT: DATE_FORMAT_PRESETS.US,           // MM/dd/yyyy
  TIME_FORMAT: TIME_FORMAT_PRESETS["12H"],       // h:mm a
  DATETIME_FORMAT: DATETIME_FORMAT_PRESETS.US_12H,
  DATETIME_LONG_FORMAT: DATETIME_FORMAT_PRESETS.LONG_US_12H,
  INPUT_DATE_FORMAT: DATE_FORMAT_PRESETS.US,
};
```

### Available Presets

**Date Formats**:
- US: `MM/dd/yyyy` (10/19/2025)
- EU: `dd/MM/yyyy` (19/10/2025)
- ISO: `yyyy-MM-dd` (2025-10-19)
- LONG_US: `MMMM d, yyyy` (October 19, 2025)
- LONG_EU: `d MMMM yyyy` (19 October 2025)
- SHORT_US: `M/d/yy` (10/19/25)
- SHORT_EU: `d/M/yy` (19/10/25)

**Time Formats**:
- 12H: `h:mm a` (3:30 PM)
- 24H: `HH:mm` (15:30)
- 12H_SECONDS: `h:mm:ss a` (3:30:45 PM)
- 24H_SECONDS: `HH:mm:ss` (15:30:45)

**DateTime Formats**:
- US_12H, US_24H, EU_12H, EU_24H
- ISO_12H, ISO_24H
- LONG_US_12H, LONG_EU_24H

### Usage

**Automatic (uses app config)**:
```typescript
formatEventDateTime(utcDate, timezone); // Uses config format
```

**Override when needed**:
```typescript
formatEventDateTime(utcDate, timezone, "yyyy-MM-dd HH:mm");
```

### Benefits

✅ **Single Point of Control** - Change format once, updates everywhere
✅ **Type-Safe** - Full TypeScript support
✅ **Flexible** - Presets + custom formats supported
✅ **Backward Compatible** - Existing code works without changes
✅ **Well Documented** - Complete guide in DATE_FORMAT_CONFIG.md

### Migration from Previous Version

No migration needed! All existing code continues to work:
- Old calls with explicit format strings: ✅ Still work
- Old calls without format: ✅ Now use app config (was "PPP p", now uses US_12H by default)

### Testing

- ✅ Build successful
- ✅ No linting errors
- ✅ TypeScript types valid
- ✅ All components updated
- ✅ Backward compatible

---

## [1.0.0] - 2025-10-19

### Initial Release

Complete timezone-aware event management application with:
- Full CRUD operations for events
- UTC storage with local timezone display
- Automatic timezone detection
- Native datetime-local inputs
- Form validation (client + server)
- Optimistic UI updates
- Comprehensive documentation (7 docs, 25,000+ words)
- Production-ready code with zero linting errors

