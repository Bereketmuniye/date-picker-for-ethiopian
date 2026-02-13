# 🇪🇹 Ethiopian Date & Time Picker

A professional Ethiopian calendar date and time picker with accurate Gregorian ↔ Ethiopian conversion. Pure JavaScript, zero dependencies.

## Features

✅ Accurate date & time conversion • 🌍 Bilingual (Amharic/English) • 🌅 Native Ethiopian Time (6h offset) • 🌙 Dark mode • 🎉 Holiday highlighting • ⌨️ Keyboard navigation • ♿ Accessible • 📱 Responsive

## Installation

**NPM**:
```bash
npm install ethiopian-datepicker
```

**CDN**:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ethiopian-datepicker@1.0.0/dist/ethiopian-datepicker.css">
<script src="https://cdn.jsdelivr.net/npm/ethiopian-datepicker@1.0.0/dist/ethiopian-datepicker.js"></script>
```

## Quick Start

```html
<!-- Input element -->
<input type="text" id="datepicker" placeholder="ቀን ይምረጡ..." readonly>
<input type="text" id="timepicker" placeholder="ሰዓት ይምረጡ..." readonly>

<script>
  // Initialize Date Picker
  new EthiopianDatePicker('#datepicker', {
    locale: 'am',              // 'am' or 'en'
    darkMode: false
  });

  // Initialize Time Picker
  new EthiopianTimePicker('#timepicker', {
    useEthiopianTime: true,   // Native 6-hour offset
    darkMode: false
  });
</script>
```

## Configuration

```javascript
new EthiopianDatePicker('#input', {
  locale: 'am',                    // Language
  darkMode: false,                 // Theme
  highlightHolidays: true,         // Holidays
  minDate: new Date(),             // Min date
  maxDate: new Date('2025-12-31'), // Max date
  onChange: (date) => console.log(date.formatted)
});
```

### Time Picker

```javascript
new EthiopianTimePicker('#input', {
  useEthiopianTime: true, // Native 6-hour offset (Sunrise = 12:00)
  twelveHour: true,       // 12-hour cycle with Day/Night labels
  darkMode: false,        // Theme
  onChange: (time) => {
    console.log('Ethiopian:', time.ethiopian.formatted);
    console.log('Gregorian Hours:', time.gregorian.hours);
  }
});
```

## API

```javascript
picker.getSelectedDate()        // Get selected date
picker.setDate(2017, 1, 1)      // Set date
picker.open()                   // Open picker
picker.close()                  // Close picker
```

## Ethiopian Calendar Utilities

```javascript
const calendar = new EthiopianCalendar();

// Convert dates
const ethDate = calendar.gregorianToEthiopian(new Date());
const gregDate = calendar.ethiopianToGregorian(2017, 5, 4);

// Format dates
const formatted = calendar.formatDate(2017, 1, 1, 'am');
// Returns: "1 መስከረም 2017"

// Check holidays
const holiday = calendar.isHoliday(1, 1);
// Returns: { month: 1, day: 1, name: { am: 'እንቁጣጣሽ', en: 'Enkutatash' } }
```

## Ethiopian Holidays

- **እንቁጣጣሽ** (Enkutatash) - New Year - Meskerem 1
- **መስቀል** (Meskel) - Meskerem 17
- **ገና** (Genna) - Christmas - Tahsas 29
- **ጥምቀት** (Timkat) - Epiphany - Tir 11
- **ፋሲካ** (Fasika) - Easter - Megabit 25

## Demo

Open `index.html` in your browser to see live examples.

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

## License

MIT © Bereket

---

**Built with ❤️ for the Ethiopian community**
