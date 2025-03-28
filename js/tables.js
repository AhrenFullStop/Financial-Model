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
        // Get table header and body
        const tableHead = document.querySelector('#cash-flow-table thead tr');
        const tableBody = document.getElementById('cash-flow-body');
        
        if (!tableHead || !tableBody) return;
        
        // Clear existing content
        // Keep the first header cell (Return Type)
        while (tableHead.children.length > 1) {
            tableHead.removeChild(tableHead.lastChild);
        }
        tableBody.innerHTML = '';
        
        // Add date headers
        cashFlows.forEach(cf => {
            const th = document.createElement('th');
            th.textContent = Utils.formatMonthYear(cf.date);
            tableHead.appendChild(th);
        });
        
        // Define the metrics we want to display as rows
        const metrics = [
            { id: 'solarRevenue', label: 'Solar Revenue (R)' },
            { id: 'batteryRevenue', label: 'Battery Revenue (R)' },
            { id: 'totalRevenue', label: 'Total Revenue (R)', highlight: true },
            { id: 'insurance', label: 'Insurance (R)' },
            { id: 'landlordRoofRental', label: 'Landlord Roof Rental (R)' },
            { id: 'totalFees', label: 'Total Fees (R)' },
            { id: 'grossCashFlow', label: 'Gross Cash Flow (R)', highlight: true },
            { id: 'omFee', label: 'O&M Fee (R)' },
            { id: 'platformFee', label: 'Platform Fee (R)' },
            { id: 'ebt', label: 'EBT (R)' },
            { id: 'adjustedEbt', label: 'Adjusted EBT (R)'},
            { id: 'cumulativeReturn', label: 'Cumulative Return (R)', highlight: true },
        ];
        
        // Generate a row for each metric
        metrics.forEach(metric => {
            const row = document.createElement('tr');
            
            // Add highlight class if this is a row that should be highlighted
            if (metric.highlight) {
                row.classList.add('highlight-row');
            }
            
            // Add the metric label as the first cell
            const labelCell = document.createElement('td');
            labelCell.textContent = metric.label;
            row.appendChild(labelCell);
            
            // Add a cell for each month's value
            cashFlows.forEach(cf => {
                const cell = document.createElement('td');
                cell.textContent = Utils.formatCurrency(cf[metric.id]);
                row.appendChild(cell);
            });
            
            // Add the row to the table
            tableBody.appendChild(row);
        });
    },
    
    /**
     * Generate the annual cash flow table
     * @param {Array} cashFlows - Array of cash flow objects
     */
    generateAnnualCashFlowTable: function(cashFlows) {
        // Get table header and body
        const tableHead = document.querySelector('#annual-cash-flow-table thead tr');
        const tableBody = document.getElementById('annual-cash-flow-body');
        
        if (!tableHead || !tableBody) return;
        
        // Clear existing content
        // Keep the first header cell (Return Type)
        while (tableHead.children.length > 1) {
            tableHead.removeChild(tableHead.lastChild);
        }
        tableBody.innerHTML = '';
        
        // Group cash flows by year
        const yearlyData = {};
        const yearLabels = [];
        
        cashFlows.forEach(cf => {
            const year = cf.date.getFullYear();
            const yearKey = year.toString();
            
            if (!yearlyData[yearKey]) {
                // Ensure we're initializing with proper zeros
                yearlyData[yearKey] = {
                    year: year,
                    solarRevenue: 0.0,
                    batteryRevenue: 0.0,
                    totalRevenue: 0.0,
                    insurance: 0.0,
                    landlordRoofRental: 0.0,
                    totalFees: 0.0,
                    grossCashFlow: 0.0,
                    omFee: 0.0,
                    platformFee: 0.0,
                    ebt: 0.0,
                    adjustedEbt: 0.0,
                    // Use the last month's cumulative return for the year
                    cumulativeReturn: parseFloat(cf.cumulativeReturn)
                };
                yearLabels.push(yearKey);
            }
            
            // Ensure we're working with proper numeric values by explicitly parsing them
            // This prevents any string concatenation issues when aggregating
            yearlyData[yearKey].solarRevenue += parseFloat(cf.solarRevenue);
            yearlyData[yearKey].batteryRevenue += parseFloat(cf.batteryRevenue);
            yearlyData[yearKey].totalRevenue += parseFloat(cf.totalRevenue);
            yearlyData[yearKey].insurance += parseFloat(cf.insurance);
            yearlyData[yearKey].landlordRoofRental += parseFloat(cf.landlordRoofRental);
            yearlyData[yearKey].totalFees += parseFloat(cf.totalFees);
            yearlyData[yearKey].grossCashFlow += parseFloat(cf.grossCashFlow);
            yearlyData[yearKey].omFee += parseFloat(cf.omFee);
            yearlyData[yearKey].platformFee += parseFloat(cf.platformFee);
            yearlyData[yearKey].ebt += parseFloat(cf.ebt);
            yearlyData[yearKey].adjustedEbt += parseFloat(cf.adjustedEbt);
            // Update cumulative return to the latest value for the year
            yearlyData[yearKey].cumulativeReturn = cf.cumulativeReturn;
        });
        
        // Sort years chronologically
        yearLabels.sort();
        
        // Add year headers
        yearLabels.forEach(yearKey => {
            const th = document.createElement('th');
            th.textContent = yearKey;
            tableHead.appendChild(th);
        });
        
        // Define the metrics we want to display as rows (same as monthly table)
        const metrics = [
            { id: 'solarRevenue', label: 'Solar Revenue (R)' },
            { id: 'batteryRevenue', label: 'Battery Revenue (R)' },
            { id: 'totalRevenue', label: 'Total Revenue (R)', highlight: true },
            { id: 'insurance', label: 'Insurance (R)' },
            { id: 'landlordRoofRental', label: 'Landlord Roof Rental (R)' },
            { id: 'totalFees', label: 'Total Fees (R)' },
            { id: 'grossCashFlow', label: 'Gross Cash Flow (R)', highlight: true },
            { id: 'omFee', label: 'O&M Fee (R)' },
            { id: 'platformFee', label: 'Platform Fee (R)' },
            { id: 'ebt', label: 'EBT (R)' },
            { id: 'adjustedEbt', label: 'Adjusted EBT (R)'},
            { id: 'cumulativeReturn', label: 'Cumulative Return (R)', highlight: true },
        ];
        
        // Generate a row for each metric
        metrics.forEach(metric => {
            const row = document.createElement('tr');
            
            // Add highlight class if this is a row that should be highlighted
            if (metric.highlight) {
                row.classList.add('highlight-row');
            }
            
            // Add the metric label as the first cell
            const labelCell = document.createElement('td');
            labelCell.textContent = metric.label;
            row.appendChild(labelCell);
            
            // Add a cell for each year's value
            yearLabels.forEach(yearKey => {
                const cell = document.createElement('td');
                cell.textContent = Utils.formatCurrency(yearlyData[yearKey][metric.id]);
                row.appendChild(cell);
            });
            
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
        // Define the metrics we want to include - match the display metrics
        const metrics = [
            { id: 'solarRevenue', label: 'Solar Revenue (R)' },
            { id: 'batteryRevenue', label: 'Battery Revenue (R)' },
            { id: 'totalRevenue', label: 'Total Revenue (R)', highlight: true },
            { id: 'insurance', label: 'Insurance (R)' },
            { id: 'landlordRoofRental', label: 'Landlord Roof Rental (R)' },
            { id: 'totalFees', label: 'Total Fees (R)' },
            { id: 'grossCashFlow', label: 'Gross Cash Flow (R)', highlight: true },
            { id: 'omFee', label: 'O&M Fee (R)' },
            { id: 'platformFee', label: 'Platform Fee (R)' },
            { id: 'ebt', label: 'EBT (R)' },
            { id: 'adjustedEbt', label: 'Adjusted EBT (R)' },
            { id: 'cumulativeReturn', label: 'Cumulative Return (R)', highlight: true },
        ];
        
        // Create headers row with dates
        let headers = ['Return Type'];
        cashFlows.forEach(cf => {
            headers.push(Utils.formatMonthYear(cf.date));
        });
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n';
        
        // Add a row for each metric
        metrics.forEach(metric => {
            let row = [metric.label];
            
            // Add values for each month
            cashFlows.forEach(cf => {
                row.push(cf[metric.id]);
            });
            
            csvContent += row.join(',') + '\n';
        });
        
        return csvContent;
    },
    
    /**
     * Export annual cash flow table to CSV
     * @param {Array} cashFlows - Array of cash flow objects
     * @returns {string} CSV content
     */
    exportAnnualCashFlowsToCSV: function(cashFlows) {
        // Define the metrics we want to include - match the display metrics
        const metrics = [
            { id: 'solarRevenue', label: 'Solar Revenue (R)' },
            { id: 'batteryRevenue', label: 'Battery Revenue (R)' },
            { id: 'totalRevenue', label: 'Total Revenue (R)', highlight: true },
            { id: 'insurance', label: 'Insurance (R)' },
            { id: 'landlordRoofRental', label: 'Landlord Roof Rental (R)' },
            { id: 'totalFees', label: 'Total Fees (R)' },
            { id: 'grossCashFlow', label: 'Gross Cash Flow (R)', highlight: true },
            { id: 'omFee', label: 'O&M Fee (R)' },
            { id: 'platformFee', label: 'Platform Fee (R)' },
            { id: 'ebt', label: 'EBT (R)' },
            { id: 'adjustedEbt', label: 'Adjusted EBT (R)' },
            { id: 'cumulativeReturn', label: 'Cumulative Return (R)', highlight: true },
        ];
        
        // Group cash flows by year
        const yearlyData = {};
        const yearLabels = [];
        
        cashFlows.forEach(cf => {
            const year = cf.date.getFullYear();
            const yearKey = year.toString();
            
            if (!yearlyData[yearKey]) {
                // Ensure we're initializing with proper zeros
                yearlyData[yearKey] = {
                    year: year,
                    solarRevenue: 0.0,
                    batteryRevenue: 0.0,
                    totalRevenue: 0.0,
                    insurance: 0.0,
                    landlordRoofRental: 0.0,
                    totalFees: 0.0,
                    grossCashFlow: 0.0,
                    omFee: 0.0,
                    platformFee: 0.0,
                    ebt: 0.0,
                    adjustedEbt: 0.0,
                    // Use the last month's cumulative return for the year
                    cumulativeReturn: parseFloat(cf.cumulativeReturn)
                };
                yearLabels.push(yearKey);
            }
            
            // Ensure we're working with proper numeric values by explicitly parsing them
            // This prevents any string concatenation issues when aggregating
            yearlyData[yearKey].solarRevenue += parseFloat(cf.solarRevenue);
            yearlyData[yearKey].batteryRevenue += parseFloat(cf.batteryRevenue);
            yearlyData[yearKey].totalRevenue += parseFloat(cf.totalRevenue);
            yearlyData[yearKey].insurance += parseFloat(cf.insurance);
            yearlyData[yearKey].landlordRoofRental += parseFloat(cf.landlordRoofRental);
            yearlyData[yearKey].totalFees += parseFloat(cf.totalFees);
            yearlyData[yearKey].grossCashFlow += parseFloat(cf.grossCashFlow);
            yearlyData[yearKey].omFee += parseFloat(cf.omFee);
            yearlyData[yearKey].platformFee += parseFloat(cf.platformFee);
            yearlyData[yearKey].ebt += parseFloat(cf.ebt);
            yearlyData[yearKey].adjustedEbt += parseFloat(cf.adjustedEbt);
            // Update cumulative return to the latest value for the year
            yearlyData[yearKey].cumulativeReturn = cf.cumulativeReturn;
        });
        
        // Sort years chronologically
        yearLabels.sort();
        
        // Create headers row with years
        let headers = ['Return Type'];
        yearLabels.forEach(yearKey => {
            headers.push(yearKey);
        });
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n';
        
        // Add a row for each metric
        metrics.forEach(metric => {
            let row = [metric.label];
            
            // Add values for each year
            yearLabels.forEach(yearKey => {
                row.push(yearlyData[yearKey][metric.id]);
            });
            
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