# Solar Energy Financing Calculator

A web-based calculator for assessing the financial feasibility of solar PV systems with optional battery components.

![Solar Energy Financing Calculator](https://via.placeholder.com/800x400?text=Solar+Energy+Financing+Calculator)

## Overview

The Solar Energy Financing Calculator is a comprehensive tool designed to help investors, project developers, and property owners evaluate the financial viability of solar energy projects. The calculator provides detailed projections of cash flows, returns on investment, and asset buyout values over the entire contract term.

## Features

- **Comprehensive Input Parameters**: Configure all aspects of a solar energy project including system costs, energy generation, financial terms, and fee structures.
- **Detailed Financial Projections**: View monthly and annual cash flows over the entire contract term.
- **Key Financial Metrics**: Calculate XIRR (Extended Internal Rate of Return), payback period, total return, and yield metrics.
- **Asset Buyout Calculations**: Determine residual asset values and buyout prices at different points in time.
- **Visual Data Representation**: Interactive charts for cumulative cash flow, revenue breakdown, and asset buyout values.
- **Data Export**: Export calculation results to CSV for further analysis.
- **Save/Load Functionality**: Save input parameters as JSON and reload them later.

## Technologies Used

- **HTML5**: Semantic structure and form elements
- **CSS3**: Responsive design with modern styling
- **JavaScript (ES6+)**: Core application logic and calculations
- **Chart.js**: Data visualization library for interactive charts
- **Custom XIRR Implementation**: Newton-Raphson method for calculating internal rate of return for irregular cash flows

## Project Structure

```
/
├── index.html              # Main HTML file with the application interface
├── css/
│   ├── styles.css          # Main stylesheet for the application
│   └── normalize.css       # CSS reset for consistent rendering
├── js/
│   ├── main.js             # Application initialization and core functionality
│   ├── calculations.js     # Financial calculation functions
│   ├── xirr.js             # XIRR calculation implementation
│   ├── ui.js               # User interface interaction handlers
│   ├── tables.js           # Table generation functions
│   ├── charts.js           # Chart generation using Chart.js
│   └── utils.js            # Utility functions for formatting and data handling
```

## How to Use

1. **Configure System Information**:
   - Enter solar asset cost, battery cost, system sizes, and contract terms
   - Set the installation date

2. **Set Financial Parameters**:
   - Configure exchange rate, sun hours, and energy generation values
   - Set electricity rates and escalation percentages

3. **Define Revenue Drivers and Fees**:
   - Set electricity purchase rates and escalation
   - Configure battery lease rates
   - Define insurance, maintenance, and other fees

4. **Calculate Results**:
   - Click the "Calculate" button to generate results
   - View summary metrics including XIRR, payback period, and yields

5. **Explore Detailed Results**:
   - Navigate through tabs to view monthly cash flows, annual cash flows, asset buyout values, and charts
   - The annual cash flow tab provides a year-by-year summary of all financial metrics
   - Export data to CSV for further analysis

6. **Save/Load Configurations**:
   - Use the export button to save your input parameters as a JSON file
   - Use the import button to load previously saved configurations

## Key Calculations

The calculator implements several important financial calculations:

### Monthly Cash Flows

- **Solar Revenue** = Energy Generated × Electricity Purchase Rate (with annual escalation)
- **Battery Revenue** = Battery Lease Rate (with optional escalation)
- **Project Fees** = Insurance + Maintenance + Landlord Roof Rental
- **Gross Cash Flow** = Total Revenue - Project Fees
- **EBT (Earnings Before Tax)** = Gross Cash Flow - O&M Fee - Platform Fee

### Financial Metrics

- **XIRR**: Calculated using the Newton-Raphson method for irregular cash flows
- **Payback Period**: Time required to recover the initial investment
- **Annual Yield**: First year gross cash flow divided by capital investment
- **Monthly Yield**: Annual yield divided by 12

### Asset Buyout Values

- **Residual Asset Value** = Initial Investment × (1 - Depreciation Rate)^years
- **Buyout Premium** = Residual Asset Value × Buyout Premium Rate
- **Total Buyout Price** = Residual Asset Value + Buyout Premium

## Implementation Details

### Financial Calculations

The calculator uses a comprehensive financial model that accounts for:

- Solar panel degradation over time (0.7% per annum)
- Annual escalation of electricity purchase rates
- Different contract terms for solar assets and batteries
- Residual asset value calculations based on depreciation rates

### XIRR Implementation

The XIRR calculation uses the Newton-Raphson method to find the internal rate of return for irregular cash flows. This implementation:

- Handles cash flows at irregular intervals
- Provides accurate return calculations for investment analysis
- Converges efficiently using numerical methods

### Responsive Design

The application features a responsive design that works well on various screen sizes:

- On larger screens, inputs and results are displayed side by side
- On smaller screens, the layout adjusts to a vertical arrangement
- Tables include horizontal scrolling for viewing all columns on smaller devices

## Future Enhancements

Potential future improvements include:

- **Scenario Comparison**: Compare multiple scenarios side by side
- **PDF Export**: Generate downloadable PDF reports with calculation results
- **Sensitivity Analysis**: Visualize how changes in key parameters affect outcomes
- **Localization**: Support for multiple currencies and languages
- **Advanced Financial Metrics**: Additional metrics like NPV, IRR, and ROI

## License

[MIT License](LICENSE)

## Acknowledgments

- Chart.js for the visualization library
- Normalize.css for consistent cross-browser styling