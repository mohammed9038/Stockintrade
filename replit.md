# Stock In Trade - Inventory Management System

## Overview

This is a client-side inventory management application built with vanilla HTML, CSS, and JavaScript. The system enables users to manage stock inventory by selecting weeks, channels, salesmen, and customers, then recording product quantities. The application integrates with Google Sheets as a data source and provides a step-by-step form interface with real-time validation and auto-save functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Pure Client-Side Application**: Built with vanilla HTML, CSS, and JavaScript without any backend framework
- **Single Page Application (SPA)**: Uses dynamic DOM manipulation to create a multi-step form experience
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox layouts
- **Component-Based Structure**: Modular JavaScript functions handling different UI components

### Data Integration
- **Google Sheets Integration**: Uses Google Sheets as a data source via CSV export URLs
- **Real-time Data Fetching**: Fetches dropdown data and product information from published Google Sheets
- **CSV Parsing**: Utilizes Papa Parse library for processing CSV data from Google Sheets

### State Management
- **Centralized State**: Uses a global `appState` object to manage application state
- **Local Storage**: Implements auto-save functionality using browser's localStorage
- **Form Validation**: Real-time validation with visual feedback

## Key Components

### 1. Form Management System
- **Multi-step Form**: Progressive form with steps for week selection, channel/salesman/customer selection, and product quantity input
- **Dependent Dropdowns**: Cascading dropdowns where selections filter subsequent options
- **Auto-save**: Automatic saving of form data with debounced input handling

### 2. Product Display System
- **Dynamic Product Grid**: Renders products grouped by supplier with images and quantity inputs
- **Image Fallback**: Handles missing product images with placeholder URLs
- **Quantity Validation**: Real-time validation for product quantities with visual feedback

### 3. UI/UX Components
- **Loading States**: Loading overlay and progress indicators
- **Toast Notifications**: Success/error message system
- **Modal System**: Confirmation and preview modals
- **Progress Tracking**: Visual progress bar showing form completion status

### 4. Data Processing
- **CSV Data Parsing**: Processes Google Sheets CSV exports into usable JavaScript objects
- **Data Filtering**: Filters data based on user selections for dependent dropdowns
- **Form Submission**: Handles form data collection and submission

## Data Flow

1. **Application Initialization**
   - Load Google Sheets data for channels, salesmen, and customers
   - Initialize form state and UI components
   - Set up event listeners and auto-save functionality

2. **User Interaction Flow**
   - User selects week → enables channel dropdown
   - User selects channel → populates salesman dropdown
   - User selects salesman → populates customer dropdown
   - User selects customer → loads and displays products
   - User enters quantities → auto-saves data locally

3. **Data Validation and Submission**
   - Real-time validation of form inputs
   - Preview functionality before submission
   - Form submission with confirmation modal

## External Dependencies

### Third-Party Libraries
- **Papa Parse (v5.4.1)**: CSV parsing library for processing Google Sheets data
- **Google Fonts**: Inter font family for typography
- **Font Awesome (v6.4.0)**: Icon library for UI elements

### External Services
- **Google Sheets**: Primary data source for:
  - Channel, salesman, and customer data
  - Product catalog with images and categories
  - Form submission endpoint (likely Google Apps Script)

### CDN Resources
- All external libraries loaded via CDN for faster loading
- Font resources loaded from Google Fonts CDN
- Icons loaded from cdnjs.cloudflare.com

## Deployment Strategy

### Static Hosting
- **Client-Side Only**: Application can be deployed to any static hosting service
- **No Backend Required**: All functionality runs in the browser
- **CDN Dependencies**: Relies on external CDNs for libraries and fonts

### Browser Compatibility
- **Modern Browser Support**: Uses modern JavaScript features (ES6+)
- **Local Storage**: Requires browsers with localStorage support
- **Responsive Design**: Works across desktop and mobile devices

### Performance Considerations
- **Lazy Loading**: Products loaded only after customer selection
- **Debounced Inputs**: Reduces API calls and improves performance
- **Caching**: Browser caching for static assets and Google Sheets data
- **Image Optimization**: Placeholder images for missing product photos

### Security Considerations
- **Client-Side Only**: No server-side security concerns
- **Public Google Sheets**: Data sources are publicly accessible
- **No Authentication**: Currently no user authentication system
- **Data Validation**: Client-side validation only (should be complemented with server-side validation for production)