/**
 * Ethiopian Calendar Utilities
 * Handles conversion between Gregorian and Ethiopian calendars
 * with comprehensive validation and error handling
 */

class EthiopianCalendar {
    constructor() {
        // Ethiopian month names in Amharic and English
        this.monthNames = {
            am: ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
                'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'],
            en: ['Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
                'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume']
        };

        // Day names
        this.dayNames = {
            am: ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        };

        // Ethiopian holidays (month, day)
        this.holidays = [
            { month: 1, day: 1, name: { am: 'እንቁጣጣሽ', en: 'Enkutatash (New Year)' } },
            { month: 1, day: 17, name: { am: 'መስቀል', en: 'Meskel (Finding of True Cross)' } },
            { month: 4, day: 29, name: { am: 'ገና', en: 'Genna (Christmas)' } },
            { month: 5, day: 11, name: { am: 'ጥምቀት', en: 'Timkat (Epiphany)' } },
            { month: 9, day: 23, name: { am: 'ስቅለት', en: 'Siklet (Good Friday)' } },
            { month: 9, day: 25, name: { am: 'ፋሲካ', en: 'Fasika (Easter)' } }
        ];
    }

    /**
     * Check if a Gregorian year is a leap year
     */
    isGregorianLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Check if an Ethiopian year is a leap year
     */
    isEthiopianLeapYear(year) {
        return (year % 4 === 3);
    }

    /**
     * Get the number of days in an Ethiopian month
     */
    getDaysInEthiopianMonth(month, year) {
        if (month < 1 || month > 13) {
            throw new Error(`Invalid Ethiopian month: ${month}. Must be between 1 and 13.`);
        }

        if (month === 13) {
            return this.isEthiopianLeapYear(year) ? 6 : 5;
        }
        return 30;
    }

    /**
     * Convert Gregorian date to Ethiopian date
     * Algorithm based on the 7-8 year difference and day offset
     */
    gregorianToEthiopian(gregorianDate) {
        if (!(gregorianDate instanceof Date) || isNaN(gregorianDate.getTime())) {
            throw new Error('Invalid date provided. Please provide a valid Date object.');
        }

        const year = gregorianDate.getFullYear();
        const month = gregorianDate.getMonth() + 1;
        const day = gregorianDate.getDate();

        // Ethiopian new year (Meskerem 1) corresponds to September 11 or 12
        const ethiopianNewYear = this.isGregorianLeapYear(year) ? 12 : 11;

        let ethYear, ethMonth, ethDay;

        // Determine Ethiopian year
        if (month < 9 || (month === 9 && day < ethiopianNewYear)) {
            ethYear = year - 8;
        } else {
            ethYear = year - 7;
        }

        // Create reference date for Ethiopian new year
        const newYearDate = new Date(year, 8, ethiopianNewYear); // month 8 = September
        newYearDate.setHours(0, 0, 0, 0);

        // Create current date reference
        const currentDate = new Date(year, month - 1, day);
        currentDate.setHours(0, 0, 0, 0);

        // Calculate days since Ethiopian new year
        let daysSinceNewYear;

        if (currentDate < newYearDate) {
            // Before Ethiopian new year, use previous year's new year
            const prevNewYearDate = new Date(year - 1, 8, this.isGregorianLeapYear(year - 1) ? 12 : 11);
            prevNewYearDate.setHours(0, 0, 0, 0);
            daysSinceNewYear = Math.floor((currentDate.getTime() - prevNewYearDate.getTime()) / (1000 * 60 * 60 * 24));
        } else {
            // After or on Ethiopian new year
            daysSinceNewYear = Math.floor((currentDate.getTime() - newYearDate.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Convert to Ethiopian month and day (30 days per month)
        ethMonth = Math.floor(daysSinceNewYear / 30) + 1;
        ethDay = (daysSinceNewYear % 30) + 1;

        // Handle Pagume (13th month)
        if (ethMonth > 13) {
            ethMonth = 13;
            ethDay = daysSinceNewYear - 360 + 1;
        }

        return {
            year: ethYear,
            month: ethMonth,
            day: ethDay,
            weekDay: gregorianDate.getDay()
        };
    }

    /**
     * Convert Ethiopian date to Gregorian date
     */
    ethiopianToGregorian(ethYear, ethMonth, ethDay) {
        // Validate input
        if (ethMonth < 1 || ethMonth > 13) {
            throw new Error(`Invalid Ethiopian month: ${ethMonth}. Must be between 1 and 13.`);
        }

        const maxDay = this.getDaysInEthiopianMonth(ethMonth, ethYear);
        if (ethDay < 1 || ethDay > maxDay) {
            throw new Error(`Invalid day: ${ethDay}. Month ${ethMonth} has ${maxDay} days.`);
        }

        // Calculate Ethiopian day of year
        let ethDayOfYear = (ethMonth - 1) * 30 + ethDay;

        // Gregorian year (approximate)
        const gregYear = ethYear + 7;

        // Ethiopian new year in Gregorian calendar
        const ethiopianNewYear = this.isGregorianLeapYear(gregYear) ? 12 : 11;

        // Calculate Gregorian day of year
        let gregDayOfYear = ethDayOfYear + (ethiopianNewYear === 12 ? 256 : 257);

        // Handle year overflow
        let actualGregYear = gregYear;
        const daysInGregYear = this.isGregorianLeapYear(gregYear) ? 366 : 365;

        if (gregDayOfYear > daysInGregYear) {
            gregDayOfYear -= daysInGregYear;
            actualGregYear++;
        }

        // Convert day of year to date
        const gregDate = new Date(actualGregYear, 0, 1);
        gregDate.setDate(gregDayOfYear);

        return gregDate;
    }

    /**
     * Validate Ethiopian date
     */
    validateEthiopianDate(year, month, day) {
        if (typeof year !== 'number' || year < 1) {
            return { valid: false, error: 'Invalid year. Year must be a positive number.' };
        }

        if (typeof month !== 'number' || month < 1 || month > 13) {
            return { valid: false, error: 'Invalid month. Month must be between 1 and 13.' };
        }

        const maxDay = this.getDaysInEthiopianMonth(month, year);
        if (typeof day !== 'number' || day < 1 || day > maxDay) {
            return { valid: false, error: `Invalid day. Month ${month} has ${maxDay} days.` };
        }

        return { valid: true };
    }

    /**
     * Get month name in specified locale
     */
    getMonthName(month, locale = 'am') {
        if (month < 1 || month > 13) {
            throw new Error(`Invalid month: ${month}`);
        }
        return this.monthNames[locale][month - 1];
    }

    /**
     * Get day name in specified locale
     */
    getDayName(dayIndex, locale = 'am') {
        if (dayIndex < 0 || dayIndex > 6) {
            throw new Error(`Invalid day index: ${dayIndex}`);
        }
        return this.dayNames[locale][dayIndex];
    }

    /**
     * Check if a date is an Ethiopian holiday
     */
    isHoliday(month, day) {
        return this.holidays.find(h => h.month === month && h.day === day);
    }

    /**
     * Get all days in an Ethiopian month
     */
    getMonthDays(year, month) {
        const daysInMonth = this.getDaysInEthiopianMonth(month, year);
        const firstDay = this.ethiopianToGregorian(year, month, 1);
        const firstWeekDay = firstDay.getDay();

        const days = [];

        // Previous month padding
        for (let i = 0; i < firstWeekDay; i++) {
            days.push(null);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const gregDate = this.ethiopianToGregorian(year, month, day);
            const holiday = this.isHoliday(month, day);

            days.push({
                day,
                weekDay: gregDate.getDay(),
                gregorianDate: gregDate,
                isHoliday: !!holiday,
                holidayName: holiday ? holiday.name : null
            });
        }

        return days;
    }

    /**
     * Format Ethiopian date
     */
    formatDate(year, month, day, locale = 'am', includeWeekDay = false) {
        const monthName = this.getMonthName(month, locale);
        const gregDate = this.ethiopianToGregorian(year, month, day);

        if (includeWeekDay) {
            const dayName = this.getDayName(gregDate.getDay(), locale);
            if (locale === 'am') {
                return `${dayName}፣ ${day} ${monthName} ${year}`;
            } else {
                return `${dayName}, ${monthName} ${day}, ${year}`;
            }
        }

        if (locale === 'am') {
            return `${day} ${monthName} ${year}`;
        } else {
            return `${monthName} ${day}, ${year}`;
        }
    }

    /**
     * Get today's Ethiopian date
     */
    today() {
        return this.gregorianToEthiopian(new Date());
    }
}

// End of Calendar
