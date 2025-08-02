// Application State
const appState = {
  formData: {
    week: '',
    channel: '',
    salesman: '',
    customer: ''
  },
  products: {},
  productQuantities: {},
  isLoading: false,
  currentStep: 1,
  autoSaveTimer: null
};

// DOM Elements
const elements = {
  loadingOverlay: document.getElementById('loadingOverlay'),
  progressFill: document.getElementById('progressFill'),
  weekSelect: document.getElementById('week'),
  channelSelect: document.getElementById('channel'),
  salesmanSelect: document.getElementById('salesman'),
  customerSelect: document.getElementById('customer'),
  productsContainer: document.getElementById('products'),
  summarySection: document.getElementById('summarySection'),
  submitBtn: document.getElementById('submitBtn'),
  previewBtn: document.getElementById('previewBtn'),
  toastContainer: document.getElementById('toastContainer'),
  confirmationModal: document.getElementById('confirmationModal'),
  previewModal: document.getElementById('previewModal')
};

// Utility Functions
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      func(...args);
      lastCall = now;
    }
  };
};

// Toast Notifications
function showToast(message, type = 'success', title = '') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  toast.innerHTML = `
    <i class="toast-icon ${iconMap[type]}"></i>
    <div class="toast-content">
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="closeToast(this)">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      closeToast(toast.querySelector('.toast-close'));
    }
  }, 5000);
}

function closeToast(button) {
  const toast = button.closest('.toast');
  toast.style.animation = 'slideOut 0.3s ease-in forwards';
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, 300);
}

// Progress Management
function updateProgress() {
  const steps = ['week', 'channel', 'salesman', 'customer'];
  let completedSteps = 0;
  
  steps.forEach((step, index) => {
    const stepElement = document.querySelector(`[data-step="${index + 1}"]`);
    const value = elements[step + 'Select'].value;
    
    if (value) {
      completedSteps++;
      stepElement.classList.add('completed');
      stepElement.classList.remove('active');
    } else {
      stepElement.classList.remove('completed');
      if (index === completedSteps) {
        stepElement.classList.add('active');
      } else {
        stepElement.classList.remove('active');
      }
    }
  });
  
  // Check if products have quantities (either qty or sellout)
  const hasProducts = Object.values(appState.productQuantities).some(product => 
    (product && product.qty && product.qty > 0) || (product && product.sellout && product.sellout > 0)
  );
  const productStep = document.querySelector('[data-step="5"]');
  
  if (hasProducts) {
    productStep.classList.add('completed');
    completedSteps++;
  } else {
    productStep.classList.remove('completed');
    if (completedSteps === 4) {
      productStep.classList.add('active');
    } else {
      productStep.classList.remove('active');
    }
  }
  
  // Update progress bar
  const progressPercentage = (completedSteps / 5) * 100;
  elements.progressFill.style.width = `${progressPercentage}%`;
  
  // Update submit button state
  const canSubmit = completedSteps === 5;
  console.log('Progress Update:', { completedSteps, hasProducts, canSubmit });
  elements.submitBtn.disabled = !canSubmit;
  elements.previewBtn.disabled = !canSubmit;
  
  // Show/hide summary section
  if (hasProducts) {
    elements.summarySection.style.display = 'block';
    updateSummary();
  } else {
    elements.summarySection.style.display = 'none';
  }
}

// Form Validation
function validateField(fieldName, value) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  
  if (!value) {
    errorElement.textContent = `Please select a ${fieldName}`;
    return false;
  }
  
  errorElement.textContent = '';
  return true;
}

function validateForm() {
  const fields = ['week', 'channel', 'salesman', 'customer'];
  let isValid = true;
  
  fields.forEach(field => {
    const value = elements[field + 'Select'].value;
    if (!validateField(field, value)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Auto-save functionality
function autoSave() {
  const formData = {
    week: elements.weekSelect.value,
    channel: elements.channelSelect.value,
    salesman: elements.salesmanSelect.value,
    customer: elements.customerSelect.value,
    products: appState.productQuantities,
    timestamp: Date.now()
  };
  
  localStorage.setItem('stockInTradeFormData', JSON.stringify(formData));
}

function loadSavedData() {
  try {
    const savedData = localStorage.getItem('stockInTradeFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      
      // Check if data is recent (within 24 hours)
      const hoursAgo = (Date.now() - data.timestamp) / (1000 * 60 * 60);
      if (hoursAgo < 24) {
        if (confirm('Found saved form data. Would you like to restore it?')) {
          elements.weekSelect.value = data.week || '';
          elements.channelSelect.value = data.channel || '';
          elements.salesmanSelect.value = data.salesman || '';
          elements.customerSelect.value = data.customer || '';
          appState.productQuantities = data.products || {};
          
          // Update UI
          updateProgress();
          showToast('Form data restored successfully', 'success');
        }
      }
    }
  } catch (error) {
    console.error('Error loading saved data:', error);
  }
}

// Loading States
function showLoadingIndicator(selectId) {
  const wrapper = document.querySelector(`#${selectId}`).closest('.select-wrapper');
  const indicator = wrapper.querySelector('.loading-indicator');
  const icon = wrapper.querySelector('.select-icon');
  
  if (indicator) {
    indicator.classList.add('visible');
    icon.style.display = 'none';
  }
}

function hideLoadingIndicator(selectId) {
  const wrapper = document.querySelector(`#${selectId}`).closest('.select-wrapper');
  const indicator = wrapper.querySelector('.loading-indicator');
  const icon = wrapper.querySelector('.select-icon');
  
  if (indicator) {
    indicator.classList.remove('visible');
    icon.style.display = 'block';
  }
}

// Data Loading Functions
async function loadDropdowns() {
  try {
    showLoadingIndicator('channel');
    
    console.log('Loading dropdown data from Google Sheets...');
    const startTime = performance.now();
    
    const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vREXfVVJ4zYuYx40MkvrBI8aH2OYr81ZlF2b_owlbT1o_RhXC44_egEmLCOiLrD5iVPo-CAuYRrVqIC/pub?gid=1284241246&single=true&output=csv", {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csv = await response.text();
    const endTime = performance.now();
    console.log(`Dropdown data fetched in ${endTime - startTime}ms`);
    
    const { data } = Papa.parse(csv, { header: true });
    
    // Cache the dropdown data for future use
    localStorage.setItem('stockInTradeDropdownData', JSON.stringify(data));
    
    // Load channels
    const channels = [...new Set(data.map(r => r.Channel))].filter(Boolean);
    elements.channelSelect.innerHTML = '<option value="">-- Select Channel --</option>' + 
      channels.map(c => `<option value="${c}">${c}</option>`).join("");
    
    hideLoadingIndicator('channel');
    
    // Channel change handler
    elements.channelSelect.addEventListener("change", async () => {
      const selectedChannel = elements.channelSelect.value;
      
      if (selectedChannel) {
        showLoadingIndicator('salesman');
        
        const salesmen = data.filter(r => r.Channel === selectedChannel).map(r => r["Salesman Name"]);
        const uniqueSalesmen = [...new Set(salesmen)].filter(Boolean);
        
        elements.salesmanSelect.innerHTML = '<option value="">-- Select Salesman --</option>' + 
          uniqueSalesmen.map(s => `<option value="${s}">${s}</option>`).join("");
        elements.customerSelect.innerHTML = '<option value="">-- Select Customer --</option>';
        
        hideLoadingIndicator('salesman');
        validateField('channel', selectedChannel);
      } else {
        elements.salesmanSelect.innerHTML = '<option value="">-- Select Salesman --</option>';
        elements.customerSelect.innerHTML = '<option value="">-- Select Customer --</option>';
      }
      
      updateProgress();
      autoSave();
    });
    
    // Salesman change handler
    elements.salesmanSelect.addEventListener("change", async () => {
      const selectedSalesman = elements.salesmanSelect.value;
      
      if (selectedSalesman) {
        showLoadingIndicator('customer');
        
        const customers = data.filter(r => r["Salesman Name"] === selectedSalesman).map(r => r["Customer Name"]);
        const uniqueCustomers = [...new Set(customers)].filter(Boolean);
        
        elements.customerSelect.innerHTML = '<option value="">-- Select Customer --</option>' + 
          uniqueCustomers.map(c => `<option value="${c}">${c}</option>`).join("");
        
        hideLoadingIndicator('customer');
        validateField('salesman', selectedSalesman);
      } else {
        elements.customerSelect.innerHTML = '<option value="">-- Select Customer --</option>';
      }
      
      updateProgress();
      autoSave();
    });
    
    // Customer change handler
    elements.customerSelect.addEventListener("change", async () => {
      const selectedCustomer = elements.customerSelect.value;
      validateField('customer', selectedCustomer);
      
      // Load products when customer is selected
      if (selectedCustomer) {
        await loadProducts();
        // Render products after loading
        if (Object.keys(appState.products).length > 0) {
          elements.productsContainer.innerHTML = '';
          Object.entries(appState.products).forEach(([group, items]) => {
            createProductSection(group, items);
          });
        }
      }
      
      updateProgress();
      autoSave();
    });
    
    // Week change handler
    elements.weekSelect.addEventListener("change", () => {
      const selectedWeek = elements.weekSelect.value;
      validateField('week', selectedWeek);
      updateProgress();
      autoSave();
    });
    
  } catch (error) {
    console.error('Error loading dropdowns:', error);
    showToast('Google Sheets loading slowly. Using cached data if available.', 'warning', 'Loading Warning');
    hideLoadingIndicator('channel');
    
    // Try to use cached data from localStorage
    const cachedData = localStorage.getItem('stockInTradeDropdownData');
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        const channels = [...new Set(data.map(r => r.Channel))].filter(Boolean);
        elements.channelSelect.innerHTML = '<option value="">-- Select Channel --</option>' + 
          channels.map(c => `<option value="${c}">${c}</option>`).join("");
        showToast('Using cached data', 'info');
      } catch (e) {
        console.error('Error parsing cached data:', e);
      }
    }
  }
}

function cleanImageUrl(url) {
  return url?.trim() || 'https://via.placeholder.com/80/e2e8f0/64748b?text=No+Image';
}

async function loadProducts() {
  try {
    // Check if products are already cached
    if (Object.keys(appState.products).length > 0) {
      console.log('Using cached products');
      return;
    }
    
    // Show loading state
    elements.productsContainer.innerHTML = `
      <div class="products-loading">
        <div class="skeleton-loader">
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
        </div>
      </div>
    `;
    
    console.log('Loading products from Google Sheets...');
    const startTime = performance.now();
    
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vREXfVVJ4zYuYx40MkvrBI8aH2OYr81ZlF2b_owlbT1o_RhXC44_egEmLCOiLrD5iVPo-CAuYRrVqIC/pub?gid=1032512900&single=true&output=csv', {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csv = await response.text();
    const endTime = performance.now();
    console.log(`Products fetched in ${endTime - startTime}ms`);
    
    const parsed = Papa.parse(csv, { header: true });
    
    // Group products by supplier
    const products = parsed.data.reduce((acc, row) => {
      const group = row["Supplier"]?.trim();
      const name = row["Category"]?.trim();
      const image = cleanImageUrl(row["image"]);
      
      if (group && name) {
        if (!acc[group]) acc[group] = [];
        acc[group].push({ name, image });
      }
      return acc;
    }, {});
    
    appState.products = products;
    
    // Clear loading state
    elements.productsContainer.innerHTML = '';
    
    // Create product sections
    Object.entries(products).forEach(([group, items]) => {
      createProductSection(group, items);
    });
    
    console.log(`Products loaded successfully: ${Object.keys(products).length} categories`);
    
  } catch (error) {
    console.error('Error loading products:', error);
    showToast('Failed to load product data. Please refresh the page.', 'error', 'Loading Error');
    elements.productsContainer.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load products. Please refresh the page.</p>
        <button class="btn btn-primary" onclick="loadProducts()">
          <i class="fas fa-refresh"></i>
          Retry
        </button>
      </div>
    `;
  }
}

function createProductSection(group, items) {
  const sectionContainer = document.createElement('div');
  sectionContainer.className = 'product-section';
  
  // Create collapsible button
  const button = document.createElement('button');
  button.className = 'collapsible';
  button.innerHTML = `
    <span>${group}</span>
    <i class="fas fa-chevron-down collapsible-icon"></i>
  `;
  
  // Create content container
  const contentDiv = document.createElement('div');
  contentDiv.className = 'collapsible-content';
  
  // Create search input
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'search-wrapper';
  searchWrapper.innerHTML = `
    <i class="fas fa-search search-icon"></i>
    <input type="text" class="search-box" placeholder="Search ${group}..." />
  `;
  
  // Create product grid
  const grid = document.createElement('div');
  grid.className = 'product-grid';
  
  const productMap = [];
  
  // Create product cards
  items.forEach(({ name, image }) => {
    const productCard = document.createElement('div');
    productCard.className = 'product';
    productCard.innerHTML = `
      <img loading="lazy" src="${image}" alt="${name}" class="product-image" 
           onerror="this.onerror=null; this.src='https://via.placeholder.com/80/e2e8f0/64748b?text=No+Image';">
      <div class="product-name">${name}</div>
      <div class="product-inputs">
        <input type="number" class="product-input qty" placeholder="Quantity" min="0" 
               data-product="${name}" data-type="qty">
        <input type="number" class="product-input sellout" placeholder="Sellout" min="0" 
               data-product="${name}" data-type="sellout">
      </div>
    `;
    
    grid.appendChild(productCard);
    productMap.push({ name, element: productCard });
  });
  
  // Search functionality with debouncing
  const searchInput = searchWrapper.querySelector('.search-box');
  const debouncedSearch = debounce((term) => {
    const lowerTerm = term.toLowerCase();
    productMap.forEach(({ name, element }) => {
      const isVisible = name.toLowerCase().includes(lowerTerm);
      element.style.display = isVisible ? 'flex' : 'none';
    });
  }, 300);
  
  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });
  
  // Collapsible functionality
  button.addEventListener('click', () => {
    const isActive = button.classList.contains('active');
    
    if (isActive) {
      button.classList.remove('active');
      contentDiv.classList.remove('active');
      contentDiv.style.display = 'none';
    } else {
      button.classList.add('active');
      contentDiv.classList.add('active');
      contentDiv.style.display = 'block';
    }
  });
  
  // Add input event listeners for quantity tracking
  grid.addEventListener('input', (e) => {
    if (e.target.classList.contains('product-input')) {
      const productName = e.target.dataset.product;
      const inputType = e.target.dataset.type;
      const value = parseInt(e.target.value) || 0;
      
      // Update product quantities
      if (!appState.productQuantities[productName]) {
        appState.productQuantities[productName] = { qty: 0, sellout: 0 };
      }
      
      appState.productQuantities[productName][inputType] = value;
      
      console.log('Product quantity updated:', { productName, inputType, value, totalProducts: Object.keys(appState.productQuantities).length });
      
      // Update visual state
      const productCard = e.target.closest('.product');
      const hasQuantity = Object.values(appState.productQuantities[productName]).some(q => q > 0);
      
      if (hasQuantity) {
        productCard.classList.add('has-quantity');
      } else {
        productCard.classList.remove('has-quantity');
      }
      
      // Update progress and summary
      updateProgress();
      autoSave();
    }
  });
  
  // Assemble the section
  contentDiv.appendChild(searchWrapper);
  contentDiv.appendChild(grid);
  sectionContainer.appendChild(button);
  sectionContainer.appendChild(contentDiv);
  
  elements.productsContainer.appendChild(sectionContainer);
}

// Summary Functions
function updateSummary() {
  let totalProducts = 0;
  let totalQuantity = 0;
  let totalSellout = 0;
  
  Object.values(appState.productQuantities).forEach(({ qty, sellout }) => {
    if (qty > 0 || sellout > 0) {
      totalProducts++;
      totalQuantity += qty || 0;
      totalSellout += sellout || 0;
    }
  });
  
  document.getElementById('totalProducts').textContent = totalProducts;
  document.getElementById('totalQuantity').textContent = totalQuantity;
  document.getElementById('totalSellout').textContent = totalSellout;
}

// Form Actions
function expandAll() {
  const collapsibles = document.querySelectorAll('.collapsible');
  collapsibles.forEach(button => {
    button.classList.add('active');
    const content = button.nextElementSibling;
    content.classList.add('active');
    content.style.display = 'block';
  });
}

function collapseAll() {
  const collapsibles = document.querySelectorAll('.collapsible');
  collapsibles.forEach(button => {
    button.classList.remove('active');
    const content = button.nextElementSibling;
    content.classList.remove('active');
    content.style.display = 'none';
  });
}

function resetForm(confirmReset = true) {
  if (confirmReset) {
    const proceed = confirm('Are you sure you want to reset the form? All data will be lost.');
    if (!proceed) {
      return;
    }
  }

  // Reset form fields
  elements.weekSelect.value = '';
  elements.channelSelect.value = '';
  elements.salesmanSelect.innerHTML = '<option value="">-- Select Salesman --</option>';
  elements.customerSelect.innerHTML = '<option value="">-- Select Customer --</option>';

  // Reset product quantities
  appState.productQuantities = {};

  // Reset product inputs
  document.querySelectorAll('.product-input').forEach(input => {
    input.value = '';
  });

  // Remove visual states
  document.querySelectorAll('.product.has-quantity').forEach(product => {
    product.classList.remove('has-quantity');
  });

  // Clear saved data
  localStorage.removeItem('stockInTradeFormData');

  // Update UI
  updateProgress();
  showToast('Form reset successfully', 'success');
}

// Preview Functions
function previewOrder() {
  const orderData = collectOrderData();
  
  if (orderData.length === 0) {
    showToast('No products selected for preview', 'warning');
    return;
  }
  
  const previewContent = document.getElementById('previewContent');
  previewContent.innerHTML = `
    <div class="preview-header">
      <h4>Order Details</h4>
      <div class="preview-info">
        <p><strong>Week:</strong> ${elements.weekSelect.value}</p>
        <p><strong>Channel:</strong> ${elements.channelSelect.value}</p>
        <p><strong>Salesman:</strong> ${elements.salesmanSelect.value}</p>
        <p><strong>Customer:</strong> ${elements.customerSelect.value}</p>
      </div>
    </div>
    
    <div class="preview-products">
      <h4>Products (${orderData.length})</h4>
      <div class="preview-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Sellout</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.map(item => `
              <tr>
                <td>${item.product}</td>
                <td>${item.qty || 0}</td>
                <td>${item.sellout || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  elements.previewModal.classList.add('active');
}

function closePreview() {
  elements.previewModal.classList.remove('active');
}

function submitFromPreview() {
  closePreview();
  submitForm();
}

// Submission Functions
function collectOrderData() {
  const entries = [];

  Object.entries(appState.productQuantities).forEach(([productName, quantities]) => {
    const { qty, sellout } = quantities;

    if (qty > 0 || sellout > 0) {
      // 🔍 Find supplier by checking which group contains the product
      const supplier = Object.entries(appState.products).find(([supplierName, categories]) =>
        categories.some(cat => cat.name === productName)
      )?.[0] || 'Unknown';

      entries.push({
        week: elements.weekSelect.value,
        channel: elements.channelSelect.value,
        salesman: elements.salesmanSelect.value,
        customer: elements.customerSelect.value,
        product: productName,
        qty: qty || 0,
        sellout: sellout || 0,
        supplier: supplier   // ✅ Now correctly assigned
      });
    }
  });

  return entries;
}


function submitForm() {
  if (!validateForm()) {
    showToast('Please complete all required fields', 'error', 'Validation Error');
    return;
  }
  
  const orderData = collectOrderData();
  
  if (orderData.length === 0) {
    showToast('Please enter at least one product quantity or sellout quantity', 'warning', 'No Products');
    return;
  }
  
  // Show confirmation modal
  const modalSummary = document.getElementById('modalSummary');
  modalSummary.innerHTML = `
    <p><strong>Order Summary:</strong></p>
    <ul>
      <li>Week: ${elements.weekSelect.value}</li>
      <li>Channel: ${elements.channelSelect.value}</li>
      <li>Salesman: ${elements.salesmanSelect.value}</li>
      <li>Customer: ${elements.customerSelect.value}</li>
      <li>Products: ${orderData.length} items</li>
      <li>Total Quantity: ${orderData.reduce((sum, item) => sum + item.qty, 0)}</li>
      <li>Total Sellout: ${orderData.reduce((sum, item) => sum + item.sellout, 0)}</li>
    </ul>
  `;
  
  elements.confirmationModal.classList.add('active');
}

async function confirmSubmit() {
  try {
    // Close modal and show loading
    closeModal();
    elements.submitBtn.disabled = true;
    elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    const orderData = collectOrderData();
    const formData = new FormData();
    formData.append("data", JSON.stringify(orderData));
    
    const response = await fetch("https://script.google.com/macros/s/AKfycbwTTKahHaWxeODCJ2SmXMXxpRJfh9zeWHJjuEgLc4ZkMovWk-VZ3xiszTEUBFRlD1RZMg/exec", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      showToast('Order submitted successfully!', 'success', 'Success');

      // Clear saved data
      localStorage.removeItem('stockInTradeFormData');

      resetForm(false); // ✅ Instantly reset the form after success without confirmation

    } else {
      throw new Error(result.message || 'Submission failed');
    }
    
  } catch (error) {
    console.error('Submission error:', error);
    showToast(`Submission failed: ${error.message}`, 'error', 'Submission Error');
    
  } finally {
    elements.submitBtn.disabled = false;
    elements.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Order';
  }
}

// Modal Functions
function closeModal() {
  elements.confirmationModal.classList.remove('active');
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  // Close modals with Escape key
  if (e.key === 'Escape') {
    closeModal();
    closePreview();
  }
  
  // Submit form with Ctrl+Enter
  if (e.ctrlKey && e.key === 'Enter') {
    if (!elements.submitBtn.disabled) {
      submitForm();
    }
  }
});

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Hide loading overlay immediately - let app work without waiting for data
    elements.loadingOverlay.classList.add('hidden');
    
    // Load saved data
    loadSavedData();
    
    // Load dropdown data in background
    loadDropdowns().catch(error => {
      console.warn('Dropdown loading failed:', error);
    });
    
    // Pre-load products in background for faster customer selection
    loadProducts().catch(error => {
      console.warn('Background product loading failed:', error);
    });
    
    // Initialize auto-save
    const autoSaveInterval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    
    // Initialize progress
    updateProgress();
    
    showToast('Application loaded successfully', 'success');
    
    // Add manual test functionality
    window.testFormState = () => {
      console.log('Current form state:', {
        week: elements.weekSelect.value,
        channel: elements.channelSelect.value,
        salesman: elements.salesmanSelect.value,
        customer: elements.customerSelect.value,
        productQuantities: appState.productQuantities,
        submitDisabled: elements.submitBtn.disabled
      });
    };
    
  } catch (error) {
    console.error('Initialization error:', error);
    showToast('Failed to initialize application. Please refresh the page.', 'error', 'Initialization Error');
    elements.loadingOverlay.classList.add('hidden');
  }
});

// Add CSS for preview table
const previewStyles = `
  .preview-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .preview-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .preview-info p {
    margin: 0;
    font-size: 0.875rem;
  }
  
  .preview-table {
    overflow-x: auto;
  }
  
  .preview-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  
  .preview-table th,
  .preview-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  .preview-table th {
    background: var(--background-color);
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .preview-table tr:hover {
    background: var(--background-color);
  }
  
  .error-state {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }
  
  .error-state i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--error-color);
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

// Inject preview styles
const styleSheet = document.createElement('style');
styleSheet.textContent = previewStyles;
document.head.appendChild(styleSheet);

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }, 0);
  });
}
