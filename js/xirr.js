/**
 * Solar Energy Financing Calculator
 * XIRR (Extended Internal Rate of Return) Implementation
 * 
 * This implementation calculates the internal rate of return for irregular cash flows
 * using the Newton-Raphson method.
 */

const XIRR = {
    /**
     * Calculate XIRR (Extended Internal Rate of Return)
     * @param {Array} cashflows - Array of objects with amount and date properties
     * @param {number} [guess=0.1] - Initial guess for the rate
     * @param {number} [maxIterations=100] - Maximum number of iterations
     * @param {number} [tolerance=1e-8] - Tolerance for convergence
     * @returns {number} The calculated XIRR value
     */
    calculate: function(cashflows, guess = 0.1, maxIterations = 100, tolerance = 1e-8) {
        // Validate inputs
        if (!cashflows || !Array.isArray(cashflows) || cashflows.length < 2) {
            console.error('XIRR calculation requires at least two cash flows');
            return 0;
        }
        
        // Sort cashflows by date
        cashflows = [...cashflows].sort((a, b) => a.date - b.date);
        
        // Check if there's at least one positive and one negative cash flow
        const hasPositive = cashflows.some(cf => cf.amount > 0);
        const hasNegative = cashflows.some(cf => cf.amount < 0);
        
        if (!hasPositive || !hasNegative) {
            console.error('XIRR calculation requires at least one positive and one negative cash flow');
            return 0;
        }
        
        // Get the first date as the base date
        const baseDate = cashflows[0].date;
        
        // Newton-Raphson method to find the rate
        let rate = guess;
        
        for (let i = 0; i < maxIterations; i++) {
            const { value, derivative } = this.xirrFunction(rate, cashflows, baseDate);
            
            // Check if we've converged
            if (Math.abs(value) < tolerance) {
                return rate;
            }
            
            // Calculate the new rate
            const newRate = rate - value / derivative;
            
            // Check for convergence
            if (Math.abs(newRate - rate) < tolerance) {
                return newRate;
            }
            
            // Update the rate for the next iteration
            rate = newRate;
            
            // Check for invalid rate
            if (isNaN(rate) || !isFinite(rate)) {
                console.error('XIRR calculation failed to converge');
                return 0;
            }
        }
        
        console.warn('XIRR calculation reached maximum iterations without converging');
        return rate;
    },
    
    /**
     * Calculate the XIRR function value and its derivative at a given rate
     * @param {number} rate - The rate to evaluate
     * @param {Array} cashflows - Array of objects with amount and date properties
     * @param {Date} baseDate - The base date for day calculations
     * @returns {Object} Object with value and derivative properties
     */
    xirrFunction: function(rate, cashflows, baseDate) {
        let value = 0;
        let derivative = 0;
        
        for (const cf of cashflows) {
            // Calculate the number of days from the base date
            const days = this.daysBetween(baseDate, cf.date);
            
            // Calculate the number of years
            const years = days / 365;
            
            // Calculate the discount factor
            const factor = Math.pow(1 + rate, years);
            
            // Update the function value
            value += cf.amount / factor;
            
            // Update the derivative
            derivative -= cf.amount * years * Math.pow(1 + rate, years - 1) / (factor * factor);
        }
        
        return { value, derivative };
    },
    
    /**
     * Calculate the number of days between two dates
     * @param {Date} date1 - The first date
     * @param {Date} date2 - The second date
     * @returns {number} The number of days between the dates
     */
    daysBetween: function(date1, date2) {
        // Convert both dates to UTC to avoid timezone issues
        const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        
        // Calculate the difference in milliseconds
        const diff = utc2 - utc1;
        
        // Convert to days
        return diff / (1000 * 60 * 60 * 24);
    },
    
    /**
     * Calculate XIRR from an array of values and dates
     * @param {Array} values - Array of cash flow values
     * @param {Array} dates - Array of corresponding dates
     * @returns {number} The calculated XIRR value
     */
    calculateFromArrays: function(values, dates) {
        if (!values || !dates || values.length !== dates.length || values.length < 2) {
            console.error('XIRR calculation requires equal length arrays with at least two elements');
            return 0;
        }
        
        const cashflows = values.map((amount, index) => ({
            amount,
            date: new Date(dates[index])
        }));
        
        return this.calculate(cashflows);
    }
};