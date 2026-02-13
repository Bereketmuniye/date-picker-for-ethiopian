# 🇪🇹 Ethiopian Date & Time Picker

A professional Ethiopian calendar date and time picker with accurate Gregorian ↔ Ethiopian conversion. Pure JavaScript, zero dependencies.

## Features

✅ **Tiered Navigation** (Year → Month → Day) • ✅ **Age Calculation** • ✅ Accurate conversion • 🌍 Bilingual (Amharic/English) • 🌅 Native Ethiopian Time (6h offset) • 🌙 Dark mode • 🎉 Holiday highlighting • ⌨️ Keyboard navigation • ♿ Accessible • 📱 Responsive

## Installation

**NPM**:
```bash
npm install @bekim_2121/ethiopian-datepicker
```

**CDN**:
```html
<!-- Replace VERSION with the latest version (e.g., 1.1.5) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bekim_2121/ethiopian-datepicker@VERSION/dist/ethiopian-datepicker.css">
<script src="https://cdn.jsdelivr.net/npm/@bekim_2121/ethiopian-datepicker@VERSION/dist/ethiopian-datepicker.js"></script>
```

## Quick Start

```html
<!-- Input element -->
<input type="text" id="datepicker" placeholder="ቀን ይምረጡ..." readonly>

<script>
  // Initialize Date Picker
  new EthiopianDatePicker('#datepicker', {
    locale: 'am',              // 'am' or 'en'
    darkMode: false
  });
</script>
```

## Special Features

### 📅 Tiered Navigation (New!)
Skip the "tired" month-by-month clicking.
- Click the **Year** to select from a grid.
- Click the **Month** to jump to any Ethiopian month.
- Selecting a year automatically prompts for the month.

### 🎂 Age Calculation
Accurately calculate age in Ethiopian years, months, and days, correctly handling **Pagume** (the 13th month).

```javascript
const calendar = new EthiopianCalendar();
const age = calendar.calculateAge(2010, 5, 4); 
// Returns: { years: 7, months: 6, days: 10 }
```

## Configuration

```javascript
new EthiopianDatePicker('#input', {
  locale: 'am',                    // Language ('am' or 'en')
  darkMode: false,                 // Dark mode theme
  highlightHolidays: true,         // Highlight Ethiopian holidays
  minDate: new Date(),             // Disable previous dates
  maxDate: new Date('2030-12-31'), // Max selectable date
  onChange: (date) => {
    console.log('Ethiopian:', date.ethiopian);
    console.log('Gregorian:', date.gregorian);
    console.log('Formatted:', date.formatted);
  }
});
```

### Time Picker

```javascript
new EthiopianTimePicker('#input', {
  useEthiopianTime: true, // Native 12h cycle (Sunrise = 12:00)
  twelveHour: true,       // Day/Night labels (ረፋድ, ማታ, etc.)
  darkMode: false,
  onChange: (time) => console.log(time.ethiopian.formatted)
});
```

## API

| Method | Description |
| --- | --- |
| `getSelectedDate()` | Returns the currently selected date object. |
| `setDate(y, m, d)` | Sets the date programmatically. |
| `open()` / `close()` | Manually control picker visibility. |

## Ethiopian Calendar Utilities

```javascript
const calendar = new EthiopianCalendar();

// Convert dates
const ethDate = calendar.gregorianToEthiopian(new Date());
const gregDate = calendar.ethiopianToGregorian(2017, 5, 4);

// Format dates
const formatted = calendar.formatDate(2017, 1, 1, 'am'); // "1 መስከረም 2017"
```

## Ethiopian Holidays

The picker automatically highlights and labels major Ethiopian holidays:
- **እንቁጣጣሽ** (New Year)
- **መስቀል** (Finding of the True Cross)
- **ገና** (Christmas)
- **ጥምቀት** (Epiphany)
- **አድዋ** (Victory of Adwa)
- **ፋሲካ** (Easter)
- And more...

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions).

## License

MIT © Bereket

---

**Built with ❤️ for the Ethiopian community**
