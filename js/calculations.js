/**
 * Solar Energy Financing Calculator
 * Core Financial Calculations
 */

const Calculations = {
    /**
     * Calculate monthly cash flows for the entire contract term
     * @param {Object} inputs - Input parameters from the form
     * @returns {Object} Object containing cash flows and summary metrics
     */
    calculateCashFlows: function(inputs) {
        // Extract input parameters
        const solarCost = inputs['solar-cost'];
        const batteryCost = inputs['battery-cost'];
        const capitalInvestment = solarCost + batteryCost;
        const solarTerm = parseInt(inputs['solar-term']);
        const batteryTerm = parseInt(inputs['battery-term']);
        const installationDate = Utils.parseYearMonth(inputs['installation-date']);
        const electricityRate = inputs['electricity-rate'];
        const rateEscalation = inputs['rate-escalation'] / 100;
        const batteryLeaseRate = inputs['battery-lease-rate'] / 100;
        const batteryEscalation = inputs['battery-escalation'] / 100;
        const insuranceRate = inputs['insurance-rate'] / 100;
        const landlordDiscount = inputs['landlord-discount'] / 100;
        const omFee = inputs['om-fee'] / 100;
        const platformFee = inputs['platform-fee'] / 100;
        const energyGenerated = inputs['energy-generated-p70']; // Using P70 value for conservative estimate
        
        // Determine the contract term (maximum of solar and battery terms)
        const contractTerm = Math.max(solarTerm, batteryTerm) * 12; // in months
        
        // Initialize arrays to store monthly values
        const cashFlows = [];
        
        // Calculate monthly battery lease amount
        const monthlyBatteryLease = (batteryCost * batteryLeaseRate) / 12;
        
        // Calculate monthly insurance costs
        const monthlyInsurance = (capitalInvestment * insuranceRate) / 12;
        
        // Calculate the monthly battery capital recovery
        // If battery lease rate is 20% annually, we recover 1.67% of the battery cost per month
        const monthlyBatteryCapitalRecovery = (batteryCost / (batteryTerm * 12));
        
        // Initialize cumulative values
        let cumulativeReturn = -capitalInvestment; // Initial investment is negative cash flow
        let cumulativeBatteryCapitalRecovered = 0; // Track how much battery capital has been recovered
        
        // Calculate cash flows for each month
        for (let month = 0; month < contractTerm; month++) {
            // Calculate date for this month
            const date = Utils.addMonths(installationDate, month);
            
            // Calculate year for escalation (starting from 0)
            const year = Math.floor(month / 12);
            
            // Apply annual escalation to electricity rate
            const escalatedElectricityRate = electricityRate * Math.pow(1 + rateEscalation, year);
            
            // Apply annual escalation to battery lease (if applicable)
            const escalatedBatteryLease = month < batteryTerm * 12
                ? monthlyBatteryLease * Math.pow(1 + batteryEscalation, year)
                : 0;
            
            // Split battery lease into capital recovery and return on investment
            // Only apply during battery term
            const batteryCapitalRecovery = month < batteryTerm * 12 ? monthlyBatteryCapitalRecovery : 0;
            const batteryReturnOnInvestment = escalatedBatteryLease - batteryCapitalRecovery;
            
            // Update cumulative battery capital recovered
            cumulativeBatteryCapitalRecovered += batteryCapitalRecovery;
            // Cap the recovery at the battery cost
            cumulativeBatteryCapitalRecovered = Math.min(cumulativeBatteryCapitalRecovered, batteryCost);
            
            // Calculate solar revenue (accounting for panel degradation)
            // Assume 0.7% annual degradation rate
            const degradationFactor = Math.pow(1 - 0.007, year);
            const adjustedEnergyGenerated = energyGenerated * degradationFactor;
            const solarRevenue = month < solarTerm * 12
                ? adjustedEnergyGenerated * escalatedElectricityRate
                : 0;
            
            // Calculate total revenue (excluding capital recovery portion)
            const totalRevenue = solarRevenue + batteryReturnOnInvestment;
            
            // Calculate landlord roof rental
            const landlordRoofRental = totalRevenue * landlordDiscount;
            
            // Calculate total fees
            const totalFees = monthlyInsurance + landlordRoofRental;
            
            // Calculate gross cash flow
            const grossCashFlow = totalRevenue - totalFees;
            
            // Calculate O&M and platform fees
            const omAssetManagementFee = totalRevenue * omFee;
            const momintPlatformFee = totalRevenue * platformFee;
            
            // Calculate EBT (Earnings Before Tax)
            const ebt = grossCashFlow - omAssetManagementFee - momintPlatformFee;
            
            // Calculate adjusted EBT including capital recovery
            const adjustedEbt = ebt + batteryCapitalRecovery;
            
            // Update cumulative return (using adjusted EBT)
            cumulativeReturn += adjustedEbt;
            
            // Store the cash flow for this month
            cashFlows.push({
                month: month + 1,
                date: date,
                solarRevenue: solarRevenue,
                batteryRevenue: escalatedBatteryLease,
                batteryCapitalRecovery: batteryCapitalRecovery,
                batteryReturnOnInvestment: batteryReturnOnInvestment,
                totalRevenue: totalRevenue + batteryCapitalRecovery, // Include capital recovery for display
                insurance: monthlyInsurance,
                landlordRoofRental: landlordRoofRental,
                totalFees: totalFees,
                grossCashFlow: grossCashFlow + batteryCapitalRecovery, // Include capital recovery
                omFee: omAssetManagementFee,
                platformFee: momintPlatformFee,
                ebt: ebt,
                adjustedEbt: adjustedEbt,
                cumulativeReturn: cumulativeReturn,
                cumulativeBatteryCapitalRecovered: cumulativeBatteryCapitalRecovered
            });
        }
        
        // Calculate effective investment (total investment minus recovered battery capital)
        const effectiveInvestment = capitalInvestment - cumulativeBatteryCapitalRecovered;
        
        // Calculate summary metrics
        const xirr = this.calculateXIRR(cashFlows, effectiveInvestment);
        const paybackPeriod = this.calculatePaybackPeriod(cashFlows, effectiveInvestment);
        const totalReturn = cashFlows[cashFlows.length - 1].cumulativeReturn + effectiveInvestment;
        
        // Calculate annual and monthly yields
        const firstYearGrossCashFlow = cashFlows.slice(0, 12).reduce((sum, cf) => sum + cf.grossCashFlow, 0);
        const annualYield = firstYearGrossCashFlow / capitalInvestment;
        const monthlyYield = annualYield / 12;
        
        // Calculate asset buyout values
        const buyoutValues = this.calculateBuyoutValues(
            inputs['depreciation-rate'] / 100,
            inputs['buyout-premium'] / 100,
            capitalInvestment,
            solarTerm
        );
        
        return {
            cashFlows: cashFlows,
            summary: {
                xirr: xirr,
                paybackPeriod: paybackPeriod,
                totalReturn: totalReturn,
                annualYield: annualYield,
                monthlyYield: monthlyYield,
                capitalInvestment: capitalInvestment,
                effectiveInvestment: effectiveInvestment,
                capitalRecovered: cumulativeBatteryCapitalRecovered,
                returnOnInvestment: totalReturn - cumulativeBatteryCapitalRecovered
            },
            buyoutValues: buyoutValues
        };
    },
    
    /**
     * Calculate XIRR (Extended Internal Rate of Return)
     * @param {Array} cashFlows - Array of cash flow objects
     * @param {number} effectiveInvestment - Effective investment amount (adjusted for capital recovery)
     * @returns {number} XIRR value
     */
    calculateXIRR: function(cashFlows, effectiveInvestment) {
        // Create array of cash flows for XIRR calculation
        const xirrCashFlows = [
            {
                amount: -effectiveInvestment,
                date: cashFlows[0].date
            }
        ];
        
        // Add monthly cash flows using adjusted EBT (which includes capital recovery)
        cashFlows.forEach(cf => {
            xirrCashFlows.push({
                amount: cf.adjustedEbt,
                date: cf.date
            });
        });
        
        // Calculate XIRR
        return XIRR.calculate(xirrCashFlows);
    },
    
    /**
     * Calculate payback period
     * @param {Array} cashFlows - Array of cash flow objects
     * @param {number} effectiveInvestment - Effective investment amount (adjusted for capital recovery)
     * @returns {number} Payback period in months
     */
    calculatePaybackPeriod: function(cashFlows, effectiveInvestment) {
        // Find the month where cumulative return becomes positive
        for (let i = 0; i < cashFlows.length; i++) {
            if (cashFlows[i].cumulativeReturn >= 0) {
                // If it's the first month, return 1
                if (i === 0) return 1;
                
                // Otherwise, interpolate between this month and the previous month
                const prevMonth = cashFlows[i - 1];
                const thisMonth = cashFlows[i];
                
                // Linear interpolation to find the exact point
                const fraction = Utils.linearInterpolate(
                    prevMonth.cumulativeReturn, i,
                    thisMonth.cumulativeReturn, i + 1,
                    0
                );
                
                return fraction;
            }
        }
        
        // If payback is not achieved within the contract term, return the total term
        return cashFlows.length;
    },
    
    /**
     * Calculate asset buyout values for each year
     * @param {number} depreciationRate - Annual depreciation rate
     * @param {number} buyoutPremium - Buyout premium percentage
     * @param {number} initialInvestment - Initial investment amount
     * @param {number} term - Contract term in years
     * @returns {Array} Array of buyout value objects
     */
    calculateBuyoutValues: function(depreciationRate, buyoutPremium, initialInvestment, term) {
        const buyoutValues = [];
        
        for (let year = 0; year <= term; year++) {
            // Calculate residual asset value
            const residualValue = initialInvestment * Math.pow(1 - depreciationRate, year);
            
            // Calculate buyout premium amount
            const premiumAmount = residualValue * buyoutPremium;
            
            // Calculate total buyout price
            const totalBuyout = residualValue + premiumAmount;
            
            buyoutValues.push({
                year: year,
                residualValue: residualValue,
                premiumAmount: premiumAmount,
                totalBuyout: totalBuyout
            });
        }
        
        return buyoutValues;
    },
    
    /**
     * Validate input parameters
     * @param {Object} inputs - Input parameters from the form
     * @returns {Object} Object with isValid flag and errors array
     */
    validateInputs: function(inputs) {
        const errors = [];
        
        // Check for required fields
        const requiredFields = [
            'solar-cost',
            'battery-cost',
            'solar-term',
            'battery-term',
            'installation-date',
            'electricity-rate',
            'rate-escalation',
            'battery-lease-rate',
            'battery-escalation',
            'insurance-rate',
            'landlord-discount',
            'om-fee',
            'platform-fee',
            'energy-generated-p70',
            'depreciation-rate',
            'buyout-premium'
        ];
        
        for (const field of requiredFields) {
            if (inputs[field] === undefined || inputs[field] === null || inputs[field] === '') {
                errors.push(`${field} is required`);
            }
        }
        
        // Check for positive values
        const positiveFields = [
            'solar-cost',
            'battery-cost',
            'electricity-rate',
            'energy-generated-p70'
        ];
        
        for (const field of positiveFields) {
            if (inputs[field] !== undefined && inputs[field] <= 0) {
                errors.push(`${field} must be greater than zero`);
            }
        }
        
        // Check for non-negative values
        const nonNegativeFields = [
            'rate-escalation',
            'battery-lease-rate',
            'battery-escalation',
            'insurance-rate',
            'landlord-discount',
            'om-fee',
            'platform-fee',
            'depreciation-rate',
            'buyout-premium'
        ];
        
        for (const field of nonNegativeFields) {
            if (inputs[field] !== undefined && inputs[field] < 0) {
                errors.push(`${field} cannot be negative`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
};