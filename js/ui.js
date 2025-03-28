/**
 * Solar Energy Financing Calculator
 * UI Interaction Functions
 */

const UI = {
    // Current fieldset index
    currentFieldset: 0,
    // Total number of fieldsets
    totalFieldsets: 0,
    
    /**
     * Initialize UI event listeners
     */
    initialize: function() {
        console.log('Initializing UI...');
        
        // Form submission
        const form = document.getElementById('calculator-form');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
            console.log('Form submit event listener attached');
            
            // Initialize form pagination
            this.initializeFormPagination();
        } else {
            console.error('Calculator form not found!');
        }
        
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', this.handleTabClick.bind(this));
        });
        
        // Import/Export buttons
        const importBtn = document.getElementById('import-btn');
        const exportBtn = document.getElementById('export-btn');
        const importFile = document.getElementById('import-file');
        
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                importFile.click();
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', this.handleExportInputs.bind(this));
        }
        
        if (importFile) {
            importFile.addEventListener('change', this.handleImportInputs.bind(this));
        }
        
        // Auto-calculate total capital investment
        const solarCostInput = document.getElementById('solar-cost');
        const batteryCostInput = document.getElementById('battery-cost');
        const capitalInvestmentInput = document.getElementById('capital-investment');
        
        const updateTotalCapital = () => {
            const solarCost = parseFloat(solarCostInput.value) || 0;
            const batteryCost = parseFloat(batteryCostInput.value) || 0;
            capitalInvestmentInput.value = solarCost + batteryCost;
        };
        
        if (solarCostInput && batteryCostInput) {
            solarCostInput.addEventListener('input', updateTotalCapital);
            batteryCostInput.addEventListener('input', updateTotalCapital);
            // Initialize total
            updateTotalCapital();
        }
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
     * Initialize form pagination
     */
    initializeFormPagination: function() {
        console.log('Initializing form pagination...');
        
        // Get all fieldsets
        const fieldsets = document.querySelectorAll('#calculator-form fieldset');
        this.totalFieldsets = fieldsets.length;
        console.log(`Found ${this.totalFieldsets} fieldsets`);
        
        if (this.totalFieldsets === 0) {
            console.error('No fieldsets found in the form!');
            return;
        }
        
        // Create progress indicators
        this.createProgressIndicators();
        
        // Get navigation buttons
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const calculateBtn = document.getElementById('calculate-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        // Remove any existing event listeners (just in case)
        if (nextBtn) {
            nextBtn.replaceWith(nextBtn.cloneNode(true));
        }
        
        if (prevBtn) {
            prevBtn.replaceWith(prevBtn.cloneNode(true));
        }
        
        // Get fresh references after replacing
        const newNextBtn = document.getElementById('next-btn');
        const newPrevBtn = document.getElementById('prev-btn');
        
        // Add event listeners
        if (newNextBtn) {
            newNextBtn.onclick = () => {
                console.log('Next button clicked');
                this.nextFieldset();
            };
        } else {
            console.error('Next button not found!');
        }
        
        if (newPrevBtn) {
            newPrevBtn.onclick = () => {
                console.log('Previous button clicked');
                this.prevFieldset();
            };
        } else {
            console.error('Previous button not found!');
        }
        
        // Show first fieldset and update buttons
        this.showFieldset(0);
    },
    
    /**
     * Create progress indicator dots
     */
    createProgressIndicators: function() {
        const progressContainer = document.getElementById('form-progress');
        if (!progressContainer) return;
        
        // Clear existing indicators
        progressContainer.innerHTML = '';
        
        // Create a dot for each fieldset
        for (let i = 0; i < this.totalFieldsets; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-step';
            if (i === 0) dot.classList.add('active');
            progressContainer.appendChild(dot);
        }
    },
    
    /**
     * Show the specified fieldset
     * @param {number} index - Index of the fieldset to show
     */
    showFieldset: function(index) {
        console.log(`Showing fieldset ${index}`);
        
        // Get all fieldsets
        const fieldsets = document.querySelectorAll('#calculator-form fieldset');
        console.log(`Total fieldsets: ${fieldsets.length}`);
        
        // Validate index
        if (index < 0 || index >= fieldsets.length) {
            console.log(`Invalid fieldset index: ${index}`);
            return;
        }
        
        // Update current index
        this.currentFieldset = index;
        
        // Hide all fieldsets
        fieldsets.forEach((fieldset, i) => {
            fieldset.style.display = 'none';
            console.log(`Hiding fieldset ${i}: ${fieldset.querySelector('legend').textContent}`);
        });
        
        // Show the current fieldset
        fieldsets[index].style.display = 'block';
        console.log(`Showing fieldset ${index}: ${fieldsets[index].querySelector('legend').textContent}`);
        
        // Update progress indicators
        const progressSteps = document.querySelectorAll('.progress-step');
        console.log(`Progress steps: ${progressSteps.length}`);
        progressSteps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
        
        // Update button visibility
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const calculateBtn = document.getElementById('calculate-btn');
        
        if (prevBtn) {
            prevBtn.style.display = index > 0 ? 'block' : 'none';
            console.log(`Previous button visibility: ${index > 0 ? 'visible' : 'hidden'}`);
        }
        
        if (nextBtn && calculateBtn) {
            // Show "Next" on all but the last fieldset
            nextBtn.style.display = index < fieldsets.length - 1 ? 'block' : 'none';
            console.log(`Next button visibility: ${index < fieldsets.length - 1 ? 'visible' : 'hidden'}`);
        }
    },
    
    /**
     * Move to the next fieldset
     */
    nextFieldset: function() {
        console.log(`Moving from fieldset ${this.currentFieldset} to ${this.currentFieldset + 1}`);
        if (this.currentFieldset < this.totalFieldsets - 1) {
            this.showFieldset(this.currentFieldset + 1);
        } else {
            console.log('Already at the last fieldset');
        }
    },
    
    /**
     * Move to the previous fieldset
     */
    prevFieldset: function() {
        console.log(`Moving from fieldset ${this.currentFieldset} to ${this.currentFieldset - 1}`);
        if (this.currentFieldset > 0) {
            this.showFieldset(this.currentFieldset - 1);
        } else {
            console.log('Already at the first fieldset');
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
    },
    
    /**
     * Handle exporting inputs to JSON
     */
    handleExportInputs: function() {
        // Get form values as JSON
        const jsonData = Utils.exportInputsToJSON('calculator-form');
        
        // Create a blob and download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'solar_calculator_inputs.json';
        link.style.display = 'none';
        
        // Add to document, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * Handle importing inputs from JSON
     * @param {Event} event - File input change event
     */
    handleImportInputs: function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                // Parse JSON data
                const data = JSON.parse(e.target.result);
                
                // Validate imported data
                const validation = Utils.validateImportedJSON(data);
                
                if (!validation.isValid) {
                    this.showValidationErrors(validation.errors);
                    return;
                }
                
                // Clear any previous validation errors
                this.clearValidationErrors();
                
                // Set form values
                Utils.setFormValues('calculator-form', data);
                
                // Update total capital investment
                const solarCostInput = document.getElementById('solar-cost');
                const batteryCostInput = document.getElementById('battery-cost');
                const capitalInvestmentInput = document.getElementById('capital-investment');
                
                if (solarCostInput && batteryCostInput && capitalInvestmentInput) {
                    const solarCost = parseFloat(solarCostInput.value) || 0;
                    const batteryCost = parseFloat(batteryCostInput.value) || 0;
                    capitalInvestmentInput.value = solarCost + batteryCost;
                }
                
            } catch (error) {
                this.showValidationErrors(['Invalid JSON file format: ' + error.message]);
            }
        };
        
        reader.readAsText(file);
        
        // Reset the file input so the same file can be selected again
        event.target.value = '';
    }
};