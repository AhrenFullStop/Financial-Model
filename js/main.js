/**
 * Solar Energy Financing Calculator
 * Main JavaScript File
 */

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    UI.initialize();
    
    // Add error styles
    UI.addErrorStyles();
    
    // Set default values based on current date
    setDefaultDates();
    
    console.log('Solar Energy Financing Calculator initialized');
});

/**
 * Set default dates in the form
 */
function setDefaultDates() {
    const installationDateInput = document.getElementById('installation-date');
    if (installationDateInput) {
        // Set default to current month
        const now = new Date();
        const yearMonth = Utils.formatYearMonth(now);
        installationDateInput.value = yearMonth;
    }
}

/**
 * Handle window resize events for charts
 */
window.addEventListener('resize', function() {
    // Resize charts if they exist
    if (Charts.chartInstances.cumulativeChart) {
        Charts.chartInstances.cumulativeChart.resize();
    }
    
    if (Charts.chartInstances.revenueChart) {
        Charts.chartInstances.revenueChart.resize();
    }
    
    if (Charts.chartInstances.buyoutChart) {
        Charts.chartInstances.buyoutChart.resize();
    }
});

/**
 * Example function to load a predefined scenario
 * This can be expanded to load different scenarios
 * @param {string} scenarioName - Name of the scenario to load
 */
function loadScenario(scenarioName) {
    // Define scenarios
    const scenarios = {
        'default': {
            'capital-investment': 2138521,
            'pv-size': 87.2,
            'battery-size': 120,
            'energy-consumption': 15098,
            'solar-term': 10,
            'battery-term': 8,
            'exchange-rate': 18.15,
            'sun-hours': 4.9,
            'energy-generated': 12818,
            'energy-generated-p70': 8973,
            'electricity-rate': 1.85,
            'rate-escalation': 10,
            'battery-lease-rate': 20,
            'battery-escalation': 0,
            'insurance-rate': 0.33,
            'maintenance-rate': 2,
            'landlord-discount': 20,
            'om-fee': 3,
            'platform-fee': 0,
            'target-returns': 15,
            'depreciation-rate': 8,
            'buyout-premium': 20
        },
        'small': {
            'capital-investment': 1000000,
            'pv-size': 40,
            'battery-size': 60,
            'energy-consumption': 8000,
            'solar-term': 10,
            'battery-term': 8,
            'exchange-rate': 18.15,
            'sun-hours': 4.9,
            'energy-generated': 6500,
            'energy-generated-p70': 4550,
            'electricity-rate': 1.85,
            'rate-escalation': 10,
            'battery-lease-rate': 20,
            'battery-escalation': 0,
            'insurance-rate': 0.33,
            'maintenance-rate': 2,
            'landlord-discount': 20,
            'om-fee': 3,
            'platform-fee': 0,
            'target-returns': 15,
            'depreciation-rate': 8,
            'buyout-premium': 20
        },
        'large': {
            'capital-investment': 3500000,
            'pv-size': 150,
            'battery-size': 200,
            'energy-consumption': 25000,
            'solar-term': 15,
            'battery-term': 10,
            'exchange-rate': 18.15,
            'sun-hours': 4.9,
            'energy-generated': 21000,
            'energy-generated-p70': 14700,
            'electricity-rate': 1.85,
            'rate-escalation': 10,
            'battery-lease-rate': 20,
            'battery-escalation': 0,
            'insurance-rate': 0.33,
            'maintenance-rate': 2,
            'landlord-discount': 20,
            'om-fee': 3,
            'platform-fee': 0,
            'target-returns': 15,
            'depreciation-rate': 8,
            'buyout-premium': 20
        }
    };
    
    // Get the selected scenario
    const scenario = scenarios[scenarioName] || scenarios.default;
    
    // Set form values
    Utils.setFormValues('calculator-form', scenario);
    
    // Optionally trigger calculation
    // document.getElementById('calculate-btn').click();
}

/**
 * Export results to CSV files
 * @param {Object} results - Results object from calculations
 */
function exportResults(results) {
    if (!results) return;
    
    // Export cash flows
    const cashFlowCSV = Tables.exportCashFlowsToCSV(results.cashFlows);
    downloadCSV(cashFlowCSV, 'solar_cash_flows.csv');
    
    // Export buyout values
    const buyoutCSV = Tables.exportBuyoutToCSV(results.buyoutValues, results.cashFlows[0].date);
    downloadCSV(buyoutCSV, 'solar_buyout_values.csv');
}

/**
 * Download CSV content as a file
 * @param {string} csvContent - CSV content
 * @param {string} filename - File name
 */
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create download link
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Add to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}