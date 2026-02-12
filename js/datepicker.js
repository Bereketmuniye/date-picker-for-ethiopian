/**
 * Ethiopian Date Picker Component
 * A professional, accessible, and beautiful date picker for Ethiopian calendar
 */

class EthiopianDatePicker {
    constructor(inputElement, options = {}) {
        if (!inputElement) {
            throw new Error('Input element is required');
        }

        this.input = typeof inputElement === 'string'
            ? document.querySelector(inputElement)
            : inputElement;

        if (!this.input) {
            throw new Error('Input element not found');
        }

        // Initialize calendar instance
        this.calendar = new EthiopianCalendar();

        // Default options
        this.options = {
            locale: 'am',
            minDate: null,
            maxDate: null,
            disabledDates: [],
            highlightHolidays: true,
            showTodayButton: true,
            darkMode: false,
            dateFormat: 'DD/MM/YYYY',
            onChange: null,
            onOpen: null,
            onClose: null,
            ...options
        };

        // State
        this.isOpen = false;
        this.selectedDate = null;
        this.currentView = this.calendar.today();

        // Initialize
        this.init();
    }

    /**
     * Initialize the date picker
     */
    init() {
        this.createPicker();
        this.attachEventListeners();
        this.parseInputValue();
    }

    /**
     * Create the date picker DOM structure
     */
    createPicker() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'ethio-datepicker';
        if (this.options.darkMode) {
            this.container.classList.add('dark-mode');
        }

        // Create header
        this.header = this.createHeader();

        // Create calendar grid
        this.calendarGrid = this.createCalendarGrid();

        // Create footer
        this.footer = this.createFooter();

        // Assemble picker
        this.container.appendChild(this.header);
        this.container.appendChild(this.calendarGrid);
        this.container.appendChild(this.footer);

        // Position picker near input
        this.positionPicker();

        // Add to DOM but keep hidden
        document.body.appendChild(this.container);
        this.container.style.display = 'none';
    }

    /**
     * Create header with navigation
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'ethio-datepicker-header';

        // Previous month button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'ethio-nav-btn prev';
        prevBtn.innerHTML = '‹';
        prevBtn.setAttribute('aria-label', 'Previous month');
        prevBtn.addEventListener('click', () => this.previousMonth());

        // Month/Year display
        const monthYearDisplay = document.createElement('div');
        monthYearDisplay.className = 'ethio-month-year';
        this.monthYearDisplay = monthYearDisplay;

        // Next month button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'ethio-nav-btn next';
        nextBtn.innerHTML = '›';
        nextBtn.setAttribute('aria-label', 'Next month');
        nextBtn.addEventListener('click', () => this.nextMonth());

        // Language toggle
        const langToggle = document.createElement('button');
        langToggle.className = 'ethio-lang-toggle';
        langToggle.textContent = this.options.locale === 'am' ? 'EN' : 'አማ';
        langToggle.setAttribute('aria-label', 'Toggle language');
        langToggle.addEventListener('click', () => this.toggleLanguage());

        header.appendChild(prevBtn);
        header.appendChild(monthYearDisplay);
        header.appendChild(langToggle);
        header.appendChild(nextBtn);

        return header;
    }

    /**
     * Create calendar grid
     */
    createCalendarGrid() {
        const grid = document.createElement('div');
        grid.className = 'ethio-calendar-grid';

        // Day headers
        const dayHeaders = document.createElement('div');
        dayHeaders.className = 'ethio-day-headers';

        for (let i = 0; i < 7; i++) {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'ethio-day-header';
            dayHeader.textContent = this.calendar.getDayName(i, this.options.locale).substring(0, 2);
            dayHeaders.appendChild(dayHeader);
        }

        grid.appendChild(dayHeaders);

        // Days container
        this.daysContainer = document.createElement('div');
        this.daysContainer.className = 'ethio-days';
        grid.appendChild(this.daysContainer);

        return grid;
    }

    /**
     * Create footer with actions
     */
    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'ethio-datepicker-footer';

        if (this.options.showTodayButton) {
            const todayBtn = document.createElement('button');
            todayBtn.className = 'ethio-today-btn';
            todayBtn.textContent = this.options.locale === 'am' ? 'ዛሬ' : 'Today';
            todayBtn.addEventListener('click', () => this.selectToday());
            footer.appendChild(todayBtn);
        }

        const closeBtn = document.createElement('button');
        closeBtn.className = 'ethio-close-btn';
        closeBtn.textContent = this.options.locale === 'am' ? 'ዝጋ' : 'Close';
        closeBtn.addEventListener('click', () => this.close());
        footer.appendChild(closeBtn);

        return footer;
    }

    /**
     * Render calendar days
     */
    renderDays() {
        const days = this.calendar.getMonthDays(this.currentView.year, this.currentView.month);
        this.daysContainer.innerHTML = '';

        days.forEach((dayData, index) => {
            const dayElement = document.createElement('button');
            dayElement.className = 'ethio-day';

            if (dayData === null) {
                // Empty cell for padding
                dayElement.classList.add('empty');
                dayElement.disabled = true;
            } else {
                dayElement.textContent = dayData.day;
                dayElement.setAttribute('data-day', dayData.day);
                dayElement.setAttribute('aria-label',
                    this.calendar.formatDate(this.currentView.year, this.currentView.month, dayData.day, this.options.locale, true));

                // Highlight today
                const today = this.calendar.today();
                if (today.year === this.currentView.year &&
                    today.month === this.currentView.month &&
                    today.day === dayData.day) {
                    dayElement.classList.add('today');
                }

                // Highlight selected
                if (this.selectedDate &&
                    this.selectedDate.year === this.currentView.year &&
                    this.selectedDate.month === this.currentView.month &&
                    this.selectedDate.day === dayData.day) {
                    dayElement.classList.add('selected');
                }

                // Highlight holidays
                if (this.options.highlightHolidays && dayData.isHoliday) {
                    dayElement.classList.add('holiday');
                    dayElement.title = dayData.holidayName[this.options.locale];
                }

                // Check if disabled
                if (this.isDateDisabled(this.currentView.year, this.currentView.month, dayData.day)) {
                    dayElement.classList.add('disabled');
                    dayElement.disabled = true;
                } else {
                    dayElement.addEventListener('click', () =>
                        this.selectDate(this.currentView.year, this.currentView.month, dayData.day));
                }
            }

            this.daysContainer.appendChild(dayElement);
        });

        // Update month/year display
        this.updateMonthYearDisplay();
    }

    /**
     * Update month/year display
     */
    updateMonthYearDisplay() {
        const monthName = this.calendar.getMonthName(this.currentView.month, this.options.locale);
        this.monthYearDisplay.textContent = `${monthName} ${this.currentView.year}`;
    }

    /**
     * Check if a date is disabled
     */
    isDateDisabled(year, month, day) {
        const gregDate = this.calendar.ethiopianToGregorian(year, month, day);

        // Check min date
        if (this.options.minDate && gregDate < this.options.minDate) {
            return true;
        }

        // Check max date
        if (this.options.maxDate && gregDate > this.options.maxDate) {
            return true;
        }

        // Check disabled dates
        if (this.options.disabledDates.length > 0) {
            return this.options.disabledDates.some(disabledDate =>
                gregDate.toDateString() === disabledDate.toDateString());
        }

        return false;
    }

    /**
     * Navigate to previous month
     */
    previousMonth() {
        if (this.currentView.month === 1) {
            this.currentView.month = 13;
            this.currentView.year--;
        } else {
            this.currentView.month--;
        }
        this.renderDays();
    }

    /**
     * Navigate to next month
     */
    nextMonth() {
        if (this.currentView.month === 13) {
            this.currentView.month = 1;
            this.currentView.year++;
        } else {
            this.currentView.month++;
        }
        this.renderDays();
    }

    /**
     * Select a date
     */
    selectDate(year, month, day) {
        this.selectedDate = { year, month, day };
        this.updateInputValue();
        this.renderDays();

        // Trigger onChange callback
        if (typeof this.options.onChange === 'function') {
            const gregDate = this.calendar.ethiopianToGregorian(year, month, day);
            this.options.onChange({
                ethiopian: { year, month, day },
                gregorian: gregDate,
                formatted: this.calendar.formatDate(year, month, day, this.options.locale)
            });
        }

        // Close after selection (optional)
        setTimeout(() => this.close(), 200);
    }

    /**
     * Select today's date
     */
    selectToday() {
        const today = this.calendar.today();
        this.currentView = { ...today };
        this.selectDate(today.year, today.month, today.day);
    }

    /**
     * Toggle language
     */
    toggleLanguage() {
        this.options.locale = this.options.locale === 'am' ? 'en' : 'am';

        // Update UI
        const langToggle = this.header.querySelector('.ethio-lang-toggle');
        langToggle.textContent = this.options.locale === 'am' ? 'EN' : 'አማ';

        if (this.options.showTodayButton) {
            const todayBtn = this.footer.querySelector('.ethio-today-btn');
            todayBtn.textContent = this.options.locale === 'am' ? 'ዛሬ' : 'Today';
        }

        const closeBtn = this.footer.querySelector('.ethio-close-btn');
        closeBtn.textContent = this.options.locale === 'am' ? 'ዝጋ' : 'Close';

        this.renderDays();
    }

    /**
     * Update input value with selected date
     */
    updateInputValue() {
        if (!this.selectedDate) return;

        const formatted = this.calendar.formatDate(
            this.selectedDate.year,
            this.selectedDate.month,
            this.selectedDate.day,
            this.options.locale
        );

        this.input.value = formatted;
    }

    /**
     * Parse input value
     */
    parseInputValue() {
        // For now, start with today's date if input is empty
        if (!this.input.value) {
            return;
        }
        // TODO: Add date parsing logic
    }

    /**
     * Position picker relative to input
     */
    positionPicker() {
        const rect = this.input.getBoundingClientRect();
        this.container.style.position = 'absolute';
        this.container.style.top = `${rect.bottom + window.scrollY + 5}px`;
        this.container.style.left = `${rect.left + window.scrollX}px`;
        this.container.style.zIndex = '10000';
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Input click opens picker
        this.input.addEventListener('click', () => this.open());

        // Input focus opens picker
        this.input.addEventListener('focus', () => this.open());

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.container.contains(e.target) &&
                e.target !== this.input) {
                this.close();
            }
        });

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Reposition on scroll/resize
        window.addEventListener('scroll', () => {
            if (this.isOpen) this.positionPicker();
        });
        window.addEventListener('resize', () => {
            if (this.isOpen) this.positionPicker();
        });
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboard(e) {
        const focusedDay = this.daysContainer.querySelector('.ethio-day:focus');

        if (!focusedDay || focusedDay.classList.contains('empty')) return;

        const currentDay = parseInt(focusedDay.getAttribute('data-day'));

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.focusDay(currentDay - 1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.focusDay(currentDay + 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.focusDay(currentDay - 7);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.focusDay(currentDay + 7);
                break;
            case 'Enter':
                e.preventDefault();
                if (!focusedDay.disabled) {
                    focusedDay.click();
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
        }
    }

    /**
     * Focus a specific day
     */
    focusDay(day) {
        const dayElement = this.daysContainer.querySelector(`[data-day="${day}"]`);
        if (dayElement && !dayElement.disabled) {
            dayElement.focus();
        }
    }

    /**
     * Open the picker
     */
    open() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.positionPicker();
        this.renderDays();
        this.container.style.display = 'block';

        // Animate in
        setTimeout(() => {
            this.container.classList.add('open');
        }, 10);

        // Trigger onOpen callback
        if (typeof this.options.onOpen === 'function') {
            this.options.onOpen();
        }
    }

    /**
     * Close the picker
     */
    close() {
        if (!this.isOpen) return;

        this.container.classList.remove('open');

        setTimeout(() => {
            this.container.style.display = 'none';
            this.isOpen = false;

            // Trigger onClose callback
            if (typeof this.options.onClose === 'function') {
                this.options.onClose();
            }
        }, 200);
    }

    /**
     * Destroy the picker
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.isOpen = false;
    }

    /**
     * Get selected date
     */
    getSelectedDate() {
        return this.selectedDate;
    }

    /**
     * Set date programmatically
     */
    setDate(year, month, day) {
        const validation = this.calendar.validateEthiopianDate(year, month, day);
        if (!validation.valid) {
            console.error(validation.error);
            return;
        }

        this.selectedDate = { year, month, day };
        this.currentView = { year, month, day };
        this.updateInputValue();
        if (this.isOpen) {
            this.renderDays();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopianDatePicker;
}
