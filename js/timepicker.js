/**
 * Ethiopian Time Picker Component
 * A standalone, beautiful time picker that supports the native Ethiopian 12-hour time system.
 */

class EthiopianTimePicker {
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

        // Default options
        this.options = {
            twelveHour: true,
            useEthiopianTime: true, // Native Ethiopian 6-hour offset
            darkMode: false,
            onChange: null,
            onOpen: null,
            onClose: null,
            locale: 'am', // 'am' or 'en'
            ...options
        };

        // State
        this.isOpen = false;
        this.hours = 12;
        this.minutes = 0;
        this.period = this.options.useEthiopianTime ? 'ቀን' : 'AM';

        // Initialize
        this.init();
    }

    init() {
        this.createPicker();
        this.attachEventListeners();
        this.parseInputValue();
    }

    createPicker() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'ethio-timepicker';
        if (this.options.darkMode) {
            this.container.classList.add('dark-mode');
        }

        const period1 = this.options.useEthiopianTime ? 'ቀን' : 'AM';
        const period2 = this.options.useEthiopianTime ? 'ማታ' : 'PM';

        // Create Clock UI
        this.container.innerHTML = `
            <div class="ethio-timepicker-header">
                <span class="ethio-time-display">
                    <span class="ethio-time-unit hour active" tabIndex="0">12</span>:<span class="ethio-time-unit minute" tabIndex="0">00</span>
                    <span class="ethio-time-period">${this.options.twelveHour ? period1 : ''}</span>
                </span>
            </div>
            <div class="ethio-timepicker-body">
                <div class="ethio-clock-face">
                    <div class="ethio-clock-hand"></div>
                    <div class="ethio-clock-center"></div>
                    <div class="ethio-clock-numbers"></div>
                </div>
            </div>
            <div class="ethio-timepicker-footer">
                <button class="ethio-period-btn p1 active">${period1}</button>
                <button class="ethio-period-btn p2">${period2}</button>
                <div class="ethio-filler"></div>
                <button class="ethio-time-ok">OK</button>
            </div>
        `;

        this.display = this.container.querySelector('.ethio-time-display');
        this.hourDisplay = this.container.querySelector('.hour');
        this.minuteDisplay = this.container.querySelector('.minute');
        this.periodDisplay = this.container.querySelector('.ethio-time-period');
        this.clockFace = this.container.querySelector('.ethio-clock-numbers');
        this.clockHand = this.container.querySelector('.ethio-clock-hand');
        this.okBtn = this.container.querySelector('.ethio-time-ok');
        this.p1Btn = this.container.querySelector('.p1');
        this.p2Btn = this.container.querySelector('.p2');

        if (!this.options.twelveHour) {
            this.p1Btn.style.display = 'none';
            this.p2Btn.style.display = 'none';
        }

        this.renderHours();

        // Position and add to DOM
        this.positionPicker();
        document.body.appendChild(this.container);
        this.container.style.display = 'none';
    }

    renderHours() {
        this.clockFace.innerHTML = '';
        const total = 12; // Native Ethiopian time is always 12h-based in cycles
        const radius = 90; // px

        for (let i = 1; i <= total; i++) {
            const num = document.createElement('div');
            num.className = 'ethio-clock-number';
            num.textContent = i;

            const angle = (i * 30) - 90;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;

            num.style.transform = `translate(${x}px, ${y}px)`;
            num.addEventListener('click', () => this.setHour(i));
            this.clockFace.appendChild(num);
        }
        this.updateHand(this.hours, 12);
    }

    renderMinutes() {
        this.clockFace.innerHTML = '';
        const radius = 90;

        for (let i = 0; i < 60; i += 5) {
            const num = document.createElement('div');
            num.className = 'ethio-clock-number';
            num.textContent = i === 0 ? '00' : i;

            const angle = (i * 6) - 90;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;

            num.style.transform = `translate(${x}px, ${y}px)`;
            num.addEventListener('click', () => this.setMinute(i));
            this.clockFace.appendChild(num);
        }
        this.updateHand(this.minutes, 60);
    }

    updateHand(value, max) {
        const angle = (value * (360 / max));
        this.clockHand.style.transform = `rotate(${angle}deg)`;
    }

    setHour(h) {
        this.hours = h;
        this.hourDisplay.textContent = h.toString().padStart(2, '0');
        this.updateHand(h, 12);

        // Auto-switch to minutes
        setTimeout(() => {
            this.hourDisplay.classList.remove('active');
            this.minuteDisplay.classList.add('active');
            this.renderMinutes();
        }, 300);
    }

    setMinute(m) {
        this.minutes = m;
        this.minuteDisplay.textContent = m.toString().padStart(2, '0');
        this.updateHand(m, 60);
    }

    setPeriod(p) {
        this.period = p;
        const period1 = this.options.useEthiopianTime ? 'ቀን' : 'AM';
        if (p === period1) {
            this.p1Btn.classList.add('active');
            this.p2Btn.classList.remove('active');
        } else {
            this.p2Btn.classList.add('active');
            this.p1Btn.classList.remove('active');
        }
        this.periodDisplay.textContent = p;
    }

    positionPicker() {
        const rect = this.input.getBoundingClientRect();
        this.container.style.position = 'absolute';
        this.container.style.top = `${rect.bottom + window.scrollY + 5}px`;
        this.container.style.left = `${rect.left + window.scrollX}px`;
        this.container.style.zIndex = '10001';
    }

    attachEventListeners() {
        this.input.addEventListener('click', () => this.open());
        this.hourDisplay.addEventListener('click', () => {
            this.hourDisplay.classList.add('active');
            this.minuteDisplay.classList.remove('active');
            this.renderHours();
        });
        this.minuteDisplay.addEventListener('click', () => {
            this.minuteDisplay.classList.add('active');
            this.hourDisplay.classList.remove('active');
            this.renderMinutes();
        });
        this.p1Btn.addEventListener('click', () => this.setPeriod(this.options.useEthiopianTime ? 'ቀን' : 'AM'));
        this.p2Btn.addEventListener('click', () => this.setPeriod(this.options.useEthiopianTime ? 'ማታ' : 'PM'));
        this.okBtn.addEventListener('click', () => this.confirm());

        document.addEventListener('mousedown', (e) => {
            if (this.isOpen && !this.container.contains(e.target) && e.target !== this.input) {
                this.close();
            }
        });

        window.addEventListener('resize', () => {
            if (this.isOpen) this.positionPicker();
        });
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.positionPicker();
        this.container.style.display = 'block';

        // Reset to hour view on open
        this.hourDisplay.classList.add('active');
        this.minuteDisplay.classList.remove('active');
        this.renderHours();

        if (this.options.onOpen) this.options.onOpen();
    }

    close() {
        if (!this.isOpen) return;
        this.container.style.display = 'none';
        this.isOpen = false;
        if (this.options.onClose) this.options.onClose();
    }

    confirm() {
        const timeStr = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')} ${this.options.twelveHour ? this.period : ''}`;
        this.input.value = timeStr;

        if (this.options.onChange) {
            // Calculate Gregorian equivalent if needed
            let gregHours = this.hours;
            if (this.options.useEthiopianTime) {
                // Ethiopian to Gregorian
                // 12 ቀን = 6 AM
                // 6 ቀን = 12 PM
                // 12 ማታ = 6 PM
                // 6 ማታ = 12 AM
                const isNight = this.period === 'ማታ';
                gregHours = (this.hours % 12) + 6;
                if (isNight) gregHours += 12;
                gregHours = (gregHours) % 24;
            } else if (this.options.twelveHour) {
                if (this.period === 'PM' && this.hours < 12) gregHours += 12;
                if (this.period === 'AM' && this.hours === 12) gregHours = 0;
            }

            this.options.onChange({
                ethiopian: {
                    hours: this.hours,
                    minutes: this.minutes,
                    period: this.period
                },
                gregorian: {
                    hours: gregHours,
                    minutes: this.minutes
                },
                formatted: timeStr
            });
        }
        this.close();
    }

    parseInputValue() {
        if (!this.input.value) {
            // Default to current Ethiopian time
            const now = new Date();
            const gHour = now.getHours();
            const gMin = now.getMinutes();

            if (this.options.useEthiopianTime) {
                this.hours = (gHour - 6 + 24) % 12;
                if (this.hours === 0) this.hours = 12;
                this.minutes = Math.floor(gMin / 5) * 5; // Round to nearest 5
                this.setPeriod((gHour >= 6 && gHour < 18) ? 'ቀን' : 'ማታ');
            } else {
                this.hours = gHour % 12 || 12;
                this.minutes = gMin;
                this.setPeriod(gHour >= 12 ? 'PM' : 'AM');
            }

            this.hourDisplay.textContent = this.hours.toString().padStart(2, '0');
            this.minuteDisplay.textContent = this.minutes.toString().padStart(2, '0');
            return;
        }

        // Simple parser for HH:MM Period
        const match = this.input.value.match(/(\d+):(\d+)\s*(ቀን|ማታ|AM|PM)?/i);
        if (match) {
            this.hours = parseInt(match[1]);
            this.minutes = parseInt(match[2]);
            if (match[3]) this.setPeriod(match[3]);
            this.hourDisplay.textContent = this.hours.toString().padStart(2, '0');
            this.minuteDisplay.textContent = this.minutes.toString().padStart(2, '0');
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EthiopianTimePicker;
}
