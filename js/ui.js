/**
 * Solar Energy Financing Calculator
 * UI Interaction Functions
 */

const UI = {
    /**
     * Initialize UI event listeners
     */
    initialize: function() {
        // Form submission
        const form = document.getElementById('calculator-form');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', this.handleTabClick.bind(this));
        });
    },
    
    /**
     * Handle form submission
     * @param {Event} event - Form submission event
     */
    handleFormSubmit: function(event) {
        event.preventDefault();
        
        // Get form values
        const inputs = Utils.getFormValues('calculator-form');
        
        // Validate inputs
        const validation = Calculations.validateInputs(inputs);
        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }
        
        // Clear any previous validation errors
        this.clearValidationErrors();
        
        // Calculate results
        const results = Calculations.calculateCashFlows(inputs);
        
        // Update UI with results
        this.displayResults(results);
    },
    
    /**
     * Display calculation results
     * @param {Object} results - Results object from calculations
     */
    displayResults: function(results) {
        // Show the output section
        const outputSection = document.getElementById('output-section');
        if (outputSection) {
            outputSection.style.display = 'block';
        }
        
        // Update summary metrics
        Tables.updateSummaryMetrics(results.summary);
        
        // Generate tables
        Tables.generateCashFlowTable(results.cashFlows);
        Tables.generateBuyoutTable(results.buyoutValues, results.cashFlows[0].date);
        
        // Initialize charts
        Charts.initializeCharts(results);
        
        // Scroll to results
        outputSection.scrollIntoView({ behavior: 'smooth' });
    },
    
    /**
     * Handle tab button click
     * @param {Event} event - Click event
     */
    handleTabClick: function(event) {
        const tabId = event.target.getAttribute('data-tab');
        if (!tabId) return;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update active tab pane
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
    },
    
    /**
     * Show validation errors
     * @param {Array} errors - Array of error messages
     */
    showValidationErrors: function(errors) {
        // Create or get error container
        let errorContainer = document.getElementById('error-container');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'error-container';
            errorContainer.className = 'error-container';
            
            const form = document.getElementById('calculator-form');
            form.insertBefore(errorContainer, form.firstChild);
        }
        
        // Clear previous errors
        errorContainer.innerHTML = '';
        
        // Add error heading
        const heading = document.createElement('h3');
        heading.textContent = 'Please correct the following errors:';
        errorContainer.appendChild(heading);
        
        // Add error list
        const list = document.createElement('ul');
        errors.forEach(error => {
            const item = document.createElement('li');
            item.textContent = error;
            list.appendChild(item);
        });
        errorContainer.appendChild(list);
        
        // Scroll to errors
        errorContainer.scrollIntoView({ behavior: 'smooth' });
    },
    
    /**
     * Clear validation errors
     */
    clearValidationErrors: function() {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.remove();
        }
    },
    
    /**
     * Add CSS styles for error container
     */
    addErrorStyles: function() {
        // Create style element if it doesn't exist
        let style = document.getElementById('ui-error-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'ui-error-styles';
            document.head.appendChild(style);
            
            // Add CSS rules
            style.textContent = `
                .error-container {
                    background-color: #ffebee;
                    border-left: 4px solid #e63946;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    border-radius: 0 var(--border-radius) var(--border-radius) 0;
                }
                
                .error-container h3 {
                    color: #e63946;
                    margin-top: 0;
                    margin-bottom: 0.5rem;
                }
                
                .error-container ul {
                    margin-top: 0.5rem;
                    margin-bottom: 0;
                    padding-left: 1.5rem;
                }
                
                .error-container li {
                    color: #c62828;
                    margin-bottom: 0.25rem;
                }
            `;
        }
    }
};