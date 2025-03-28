/**
 * Solar Energy Financing Calculator
 * Utility Functions
 */

const Utils = {
    /**
     * Format a number as currency (ZAR)
     * @param {number} value - The value to format
     * @param {boolean} showCents - Whether to show cents (default: true)
     * @returns {string} Formatted currency string
     */
    formatCurrency: function(value, showCents = true) {
        if (value === null || value === undefined || isNaN(value)) {
            return 'R0.00';
        }
        
        const formatter = new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: showCents ? 2 : 0,
            maximumFractionDigits: showCents ? 2 : 0
        });
        
        return formatter.format(value).replace('ZAR', 'R');
    },
    
    /**
     * Format a number as a percentage
     * @param {number} value - The value to format (e.g., 0.15 for 15%)
     * @param {number} decimals - Number of decimal places (default: 2)
     * @returns {string} Formatted percentage string
     */
    formatPercentage: function(value, decimals = 2) {
        if (value === null || value === undefined || isNaN(value)) {
            return '0.00%';
        }
        
        return (value * 100).toFixed(decimals) + '%';
    },
    
    /**
     * Format a date as YYYY-MM
     * @param {Date} date - The date to format
     * @returns {string} Formatted date string
     */
    formatYearMonth: function(date) {
        return date.toISOString().substring(0, 7);
    },
    
    /**
     * Format a date as Month YYYY (e.g., January 2024)
     * @param {Date} date - The date to format
     * @returns {string} Formatted date string
     */
    formatMonthYear: function(date) {
        return date.toLocaleDateString('en-ZA', {
            month: 'long',
            year: 'numeric'
        });
    },
    
    /**
     * Add months to a date
     * @param {Date} date - The starting date
     * @param {number} months - Number of months to add
     * @returns {Date} New date with added months
     */
    addMonths: function(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    },
    
    /**
     * Calculate the number of months between two dates
     * @param {Date} startDate - The start date
     * @param {Date} endDate - The end date
     * @returns {number} Number of months between dates
     */
    monthsBetween: function(startDate, endDate) {
        const years = endDate.getFullYear() - startDate.getFullYear();
        const months = endDate.getMonth() - startDate.getMonth();
        return years * 12 + months;
    },
    
    /**
     * Convert a year-month string to a Date object
     * @param {string} yearMonth - Year-month string (YYYY-MM)
     * @returns {Date} Date object set to the first day of the month
     */
    parseYearMonth: function(yearMonth) {
        const [year, month] = yearMonth.split('-').map(Number);
        return new Date(year, month - 1, 1);
    },
    
    /**
     * Format a number with thousand separators
     * @param {number} value - The value to format
     * @param {number} decimals - Number of decimal places (default: 2)
     * @returns {string} Formatted number string
     */
    formatNumber: function(value, decimals = 2) {
        if (value === null || value === undefined || isNaN(value)) {
            return '0';
        }
        
        return new Intl.NumberFormat('en-ZA', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    },
    
    /**
     * Format a duration in years and months
     * @param {number} months - Total number of months
     * @returns {string} Formatted duration string (e.g., "4 years 3 months")
     */
    formatDuration: function(months) {
        if (months === null || months === undefined || isNaN(months) || months < 0) {
            return '0 years 0 months';
        }
        
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        let result = '';
        
        if (years > 0) {
            result += `${years} year${years !== 1 ? 's' : ''}`;
        }
        
        if (remainingMonths > 0 || years === 0) {
            if (years > 0) result += ' ';
            result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
        }
        
        return result;
    },
    
    /**
     * Get all form input values as an object
     * @param {string} formId - The ID of the form element
     * @returns {Object} Object containing all form input values
     */
    getFormValues: function(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};
        
        const formData = new FormData(form);
        const values = {};
        
        for (const [key, value] of formData.entries()) {
            // Convert numeric values to numbers
            if (!isNaN(value) && value !== '') {
                values[key] = parseFloat(value);
            } else {
                values[key] = value;
            }
        }
        
        return values;
    },
    
    /**
     * Set form input values from an object
     * @param {string} formId - The ID of the form element
     * @param {Object} values - Object containing values to set
     */
    setFormValues: function(formId, values) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        for (const [key, value] of Object.entries(values)) {
            const element = form.elements[key];
            if (element) {
                element.value = value;
            }
        }
    },
    
    /**
     * Find the first month where a value crosses a threshold
     * @param {Array} cashFlows - Array of cash flow objects
     * @param {string} property - Property name to check
     * @param {number} threshold - Threshold value
     * @returns {number|null} Index of the first month that crosses the threshold, or null if not found
     */
    findCrossingPoint: function(cashFlows, property, threshold) {
        for (let i = 0; i < cashFlows.length; i++) {
            if (cashFlows[i][property] >= threshold) {
                return i;
            }
        }
        return null;
    },
    
    /**
     * Linear interpolation between two points
     * @param {number} x0 - First x value
     * @param {number} y0 - First y value
     * @param {number} x1 - Second x value
     * @param {number} y1 - Second y value
     * @param {number} x - X value to interpolate at
     * @returns {number} Interpolated y value
     */
    linearInterpolate: function(x0, y0, x1, y1, x) {
        if (x1 === x0) return y0;
        return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
    }
};