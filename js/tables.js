/**
 * Solar Energy Financing Calculator
 * Table Generation Functions
 */

const Tables = {
    /**
     * Generate the monthly cash flow table
     * @param {Array} cashFlows - Array of cash flow objects
     */
    generateCashFlowTable: function(cashFlows) {
        const tableBody = document.getElementById('cash-flow-body');
        if (!tableBody) return;
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        // Generate rows for each month
        cashFlows.forEach(cf => {
            const row = document.createElement('tr');
            
            // Add cells for each column
            row.innerHTML = `
                <td>${cf.month}</td>
                <td>${Utils.formatMonthYear(cf.date)}</td>
                <td>${Utils.formatCurrency(cf.solarRevenue)}</td>
                <td>${Utils.formatCurrency(cf.batteryRevenue)}</td>
                <td>${Utils.formatCurrency(cf.totalRevenue)}</td>
                <td>${Utils.formatCurrency(cf.insurance)}</td>
                <td>${Utils.formatCurrency(cf.maintenance)}</td>
                <td>${Utils.formatCurrency(cf.landlordRoofRental)}</td>
                <td>${Utils.formatCurrency(cf.totalFees)}</td>
                <td>${Utils.formatCurrency(cf.grossCashFlow)}</td>
                <td>${Utils.formatCurrency(cf.omFee)}</td>
                <td>${Utils.formatCurrency(cf.platformFee)}</td>
                <td>${Utils.formatCurrency(cf.ebt)}</td>
                <td>${Utils.formatCurrency(cf.adjustedEbt)}</td>
                <td>${Utils.formatCurrency(cf.cumulativeReturn)}</td>
            `;
            
            // Add the row to the table
            tableBody.appendChild(row);
        });
    },
    
    /**
     * Generate the asset buyout table
     * @param {Array} buyoutValues - Array of buyout value objects
     * @param {Date} installationDate - Installation date
     */
    generateBuyoutTable: function(buyoutValues, installationDate) {
        const tableBody = document.getElementById('buyout-body');
        if (!tableBody) return;
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        // Generate rows for each year
        buyoutValues.forEach(bv => {
            const row = document.createElement('tr');
            
            // Calculate the date for this year
            const date = Utils.addMonths(installationDate, bv.year * 12);
            
            // Add cells for each column
            row.innerHTML = `
                <td>${bv.year}</td>
                <td>${Utils.formatMonthYear(date)}</td>
                <td>${Utils.formatCurrency(bv.residualValue)}</td>
                <td>${Utils.formatCurrency(bv.premiumAmount)}</td>
                <td>${Utils.formatCurrency(bv.totalBuyout)}</td>
            `;
            
            // Add the row to the table
            tableBody.appendChild(row);
        });
    },
    
    /**
     * Update the summary metrics display
     * @param {Object} summary - Summary metrics object
     */
    updateSummaryMetrics: function(summary) {
        // Update XIRR
        const xirrElement = document.getElementById('xirr-value');
        if (xirrElement) {
            xirrElement.textContent = Utils.formatPercentage(summary.xirr);
        }
        
        // Update payback period
        const paybackElement = document.getElementById('payback-value');
        if (paybackElement) {
            paybackElement.textContent = Utils.formatDuration(summary.paybackPeriod);
        }
        
        // Update total return
        const totalReturnElement = document.getElementById('total-return-value');
        if (totalReturnElement) {
            totalReturnElement.textContent = Utils.formatCurrency(summary.totalReturn);
        }
        
        // Update annual yield
        const annualYieldElement = document.getElementById('annual-yield-value');
        if (annualYieldElement) {
            annualYieldElement.textContent = Utils.formatPercentage(summary.annualYield);
        }
        
        // Update monthly yield
        const monthlyYieldElement = document.getElementById('monthly-yield-value');
        if (monthlyYieldElement) {
            monthlyYieldElement.textContent = Utils.formatPercentage(summary.monthlyYield);
        }
        
        // Update effective investment
        const effectiveInvestmentElement = document.getElementById('effective-investment-value');
        if (effectiveInvestmentElement) {
            effectiveInvestmentElement.textContent = Utils.formatCurrency(summary.effectiveInvestment);
        }
        
        // Update capital recovered
        const capitalRecoveredElement = document.getElementById('capital-recovered-value');
        if (capitalRecoveredElement) {
            capitalRecoveredElement.textContent = Utils.formatCurrency(summary.capitalRecovered);
        }
        
        // Update return on investment
        const roiElement = document.getElementById('roi-value');
        if (roiElement) {
            roiElement.textContent = Utils.formatCurrency(summary.returnOnInvestment);
        }
    },
    
    /**
     * Export cash flow table to CSV
     * @param {Array} cashFlows - Array of cash flow objects
     * @returns {string} CSV content
     */
    exportCashFlowsToCSV: function(cashFlows) {
        // Define headers
        const headers = [
            'Month',
            'Date',
            'Solar Revenue (R)',
            'Battery Revenue (R)',
            'Battery Capital Recovery (R)',
            'Battery Return on Investment (R)',
            'Total Revenue (R)',
            'Insurance (R)',
            'Maintenance (R)',
            'Landlord Roof Rental (R)',
            'Total Fees (R)',
            'Gross Cash Flow (R)',
            'O&M Fee (R)',
            'Platform Fee (R)',
            'EBT (R)',
            'Adjusted EBT (R)',
            'Cumulative Return (R)',
            'Cumulative Battery Capital Recovered (R)'
        ];
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n';
        
        // Add rows
        cashFlows.forEach(cf => {
            const row = [
                cf.month,
                Utils.formatMonthYear(cf.date),
                cf.solarRevenue,
                cf.batteryRevenue,
                cf.totalRevenue,
                cf.insurance,
                cf.maintenance,
                cf.landlordRoofRental,
                cf.totalFees,
                cf.grossCashFlow,
                cf.omFee,
                cf.platformFee,
                cf.ebt,
                cf.adjustedEbt,
                cf.cumulativeReturn,
            ];
            
            csvContent += row.join(',') + '\n';
        });
        
        return csvContent;
    },
    
    /**
     * Export buyout values to CSV
     * @param {Array} buyoutValues - Array of buyout value objects
     * @param {Date} installationDate - Installation date
     * @returns {string} CSV content
     */
    exportBuyoutToCSV: function(buyoutValues, installationDate) {
        // Define headers
        const headers = [
            'Year',
            'Date',
            'Residual Asset Value (R)',
            'Buyout Premium (R)',
            'Total Buyout Price (R)'
        ];
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n';
        
        // Add rows
        buyoutValues.forEach(bv => {
            // Calculate the date for this year
            const date = Utils.addMonths(installationDate, bv.year * 12);
            
            const row = [
                bv.year,
                Utils.formatMonthYear(date),
                bv.residualValue,
                bv.premiumAmount,
                bv.totalBuyout
            ];
            
            csvContent += row.join(',') + '\n';
        });
        
        return csvContent;
    }
};