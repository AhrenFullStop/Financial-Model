/**
 * Solar Energy Financing Calculator
 * Chart Generation Functions
 */

const Charts = {
    // Store chart instances for later reference
    chartInstances: {
        cumulativeChart: null,
        revenueChart: null,
        buyoutChart: null
    },
    
    /**
     * Initialize all charts
     * @param {Object} results - Results object from calculations
     */
    initializeCharts: function(results) {
        this.createCumulativeChart(results.cashFlows);
        this.createRevenueChart(results.cashFlows);
        this.createBuyoutChart(results.buyoutValues, results.cashFlows[0].date);
    },
    
    /**
     * Create the cumulative cash flow chart
     * @param {Array} cashFlows - Array of cash flow objects
     */
    createCumulativeChart: function(cashFlows) {
        const ctx = document.getElementById('cumulative-chart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (this.chartInstances.cumulativeChart) {
            this.chartInstances.cumulativeChart.destroy();
        }
        
        // Prepare data
        const labels = cashFlows.map(cf => Utils.formatMonthYear(cf.date));
        const cumulativeData = cashFlows.map(cf => cf.cumulativeReturn);
        const ebtData = cashFlows.map(cf => cf.ebt);
        
        // Create chart
        this.chartInstances.cumulativeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Cumulative Return',
                        data: cumulativeData,
                        borderColor: '#2c7da0',
                        backgroundColor: 'rgba(44, 125, 160, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: 'Monthly EBT',
                        data: ebtData,
                        borderColor: '#61a5c2',
                        backgroundColor: 'rgba(97, 165, 194, 0.5)',
                        borderWidth: 1,
                        type: 'bar'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 90,
                            minRotation: 45,
                            callback: function(value, index, values) {
                                // Show only every 12th label (yearly)
                                return index % 12 === 0 ? labels[index] : '';
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount (R)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value, false);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + Utils.formatCurrency(context.raw);
                            }
                        }
                    },
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Cumulative Cash Flow Over Time'
                    }
                }
            }
        });
    },
    
    /**
     * Create the revenue breakdown chart
     * @param {Array} cashFlows - Array of cash flow objects
     */
    createRevenueChart: function(cashFlows) {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (this.chartInstances.revenueChart) {
            this.chartInstances.revenueChart.destroy();
        }
        
        // Prepare data
        const labels = cashFlows.map(cf => Utils.formatMonthYear(cf.date));
        const solarData = cashFlows.map(cf => cf.solarRevenue);
        const batteryData = cashFlows.map(cf => cf.batteryRevenue);
        const feesData = cashFlows.map(cf => cf.totalFees);
        
        // Create chart
        this.chartInstances.revenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Solar Revenue',
                        data: solarData,
                        backgroundColor: 'rgba(42, 157, 143, 0.7)',
                        stack: 'revenue'
                    },
                    {
                        label: 'Battery Revenue',
                        data: batteryData,
                        backgroundColor: 'rgba(233, 196, 106, 0.7)',
                        stack: 'revenue'
                    },
                    {
                        label: 'Total Fees',
                        data: feesData,
                        backgroundColor: 'rgba(231, 111, 81, 0.7)',
                        stack: 'fees'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 90,
                            minRotation: 45,
                            callback: function(value, index, values) {
                                // Show only every 12th label (yearly)
                                return index % 12 === 0 ? labels[index] : '';
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount (R)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value, false);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + Utils.formatCurrency(context.raw);
                            }
                        }
                    },
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Monthly Revenue Breakdown'
                    }
                }
            }
        });
    },
    
    /**
     * Create the asset buyout chart
     * @param {Array} buyoutValues - Array of buyout value objects
     * @param {Date} installationDate - Installation date
     */
    createBuyoutChart: function(buyoutValues, installationDate) {
        const ctx = document.getElementById('buyout-chart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (this.chartInstances.buyoutChart) {
            this.chartInstances.buyoutChart.destroy();
        }
        
        // Prepare data
        const labels = buyoutValues.map(bv => {
            const date = Utils.addMonths(installationDate, bv.year * 12);
            return Utils.formatMonthYear(date);
        });
        
        const residualData = buyoutValues.map(bv => bv.residualValue);
        const premiumData = buyoutValues.map(bv => bv.premiumAmount);
        
        // Create chart
        this.chartInstances.buyoutChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Residual Asset Value',
                        data: residualData,
                        backgroundColor: 'rgba(44, 125, 160, 0.7)',
                        stack: 'buyout'
                    },
                    {
                        label: 'Buyout Premium',
                        data: premiumData,
                        backgroundColor: 'rgba(231, 111, 81, 0.7)',
                        stack: 'buyout'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount (R)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value, false);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + Utils.formatCurrency(context.raw);
                            },
                            footer: function(tooltipItems) {
                                const index = tooltipItems[0].dataIndex;
                                const total = buyoutValues[index].totalBuyout;
                                return 'Total Buyout: ' + Utils.formatCurrency(total);
                            }
                        }
                    },
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Asset Buyout Value Over Time'
                    }
                }
            }
        });
    }
};