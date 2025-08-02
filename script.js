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
  previewModal: document.getElementById('previewModal'),
  languageSwitcher: document.getElementById('languageSwitcher')
};

// Translation resources
const resources = {
  en: {
    translation: {
      title: "Stock In Trade",
      subtitle: "Inventory Management System",
      week: "Week",
      channel: "Channel",
      salesman: "Salesman",
      customer: "Customer",
      products: "Products",
      orderDetails: "Order Details",
      selectWeek: "Select Week",
      selectChannel: "Select Channel",
      selectSalesman: "Select Salesman",
      selectCustomer: "Select Customer",
      weekPlaceholder: "-- Select Week --",
      week1: "Week 1",
      week2: "Week 2",
      week3: "Week 3",
      week4: "Week 4",
      channelPlaceholder: "-- Select Channel --",
      salesmanPlaceholder: "-- Select Salesman --",
      customerPlaceholder: "-- Select Customer --",
      productInventory: "Product Inventory",
      expandAll: "Expand All",
      collapseAll: "Collapse All",
      orderSummary: "Order Summary",
      productsStat: "Products",
      totalQty: "Total Qty",
      selloutQty: "Sellout Qty",
      submitOrder: "Submit Order",
      preview: "Preview",
      reset: "Reset",
      confirmSubmission: "Confirm Submission",
      confirmQuestion: "Are you sure you want to submit this order?",
      cancel: "Cancel",
      confirmSubmit: "Confirm Submit",
      orderPreview: "Order Preview",
      close: "Close",
      appLoaded: "Application loaded successfully",
      validationError: "Please complete all required fields",
      validationTitle: "Validation Error",
      noProducts: "Please enter at least one product quantity or sellout quantity",
      noProductsTitle: "No Products",
      noProductsPreview: "No products selected for preview",
      submitSuccess: "Order submitted successfully!",
      success: "Success",
      submitFailed: "Submission failed",
      submissionError: "Submission Error",
      initError: "Failed to initialize application. Please refresh the page.",
      initErrorTitle: "Initialization Error",
      formReset: "Form reset successfully",
      resetConfirm: "Are you sure you want to reset the form? All data will be lost.",
      submitting: "Submitting...",
      loadingData: "Loading inventory data...",
      orderDetailsHeader: "Order Details",
      weekLabel: "Week:",
      channelLabel: "Channel:",
      salesmanLabel: "Salesman:",
      customerLabel: "Customer:",
      productCol: "Product",
      quantityCol: "Quantity",
      selloutCol: "Sellout",
      dataRestored: "Form data restored successfully",
      restoreConfirm: "Found saved form data. Would you like to restore it?",
      loadingWarning: "Google Sheets loading slowly. Using cached data if available.",
      usingCachedData: "Using cached data",
      loadingWarningTitle: "Loading Warning",
      loadingError: "Failed to load product data. Please refresh the page.",
      loadingErrorTitle: "Loading Error",
      failedProducts: "Failed to load products. Please refresh the page.",
      retry: "Retry"
    }
  },
  ar: {
    translation: {
      title: "المخزون التجاري",
      subtitle: "نظام إدارة المخزون",
      week: "الأسبوع",
      channel: "القناة",
      salesman: "مندوب المبيعات",
      customer: "العميل",
      products: "المنتجات",
      orderDetails: "تفاصيل الطلب",
      selectWeek: "اختر الأسبوع",
      selectChannel: "اختر القناة",
      selectSalesman: "اختر مندوب المبيعات",
      selectCustomer: "اختر العميل",
      weekPlaceholder: "-- اختر الأسبوع --",
      week1: "الأسبوع 1",
      week2: "الأسبوع 2",
      week3: "الأسبوع 3",
      week4: "الأسبوع 4",
      channelPlaceholder: "-- اختر القناة --",
      salesmanPlaceholder: "-- اختر مندوب المبيعات --",
      customerPlaceholder: "-- اختر العميل --",
      productInventory: "جرد المنتجات",
      expandAll: "توسيع الكل",
      collapseAll: "طي الكل",
      orderSummary: "ملخص الطلب",
      productsStat: "المنتجات",
      totalQty: "الكمية الإجمالية",
      selloutQty: "كمية المبيع",
      submitOrder: "إرسال الطلب",
      preview: "معاينة",
      reset: "إعادة تعيين",
      confirmSubmission: "تأكيد الإرسال",
      confirmQuestion: "هل أنت متأكد أنك تريد إرسال هذا الطلب؟",
      cancel: "إلغاء",
      confirmSubmit: "تأكيد الإرسال",
      orderPreview: "معاينة الطلب",
      close: "إغلاق",
      appLoaded: "تم تحميل التطبيق بنجاح",
      validationError: "يرجى إكمال جميع الحقول المطلوبة",
      validationTitle: "خطأ في التحقق",
      noProducts: "يرجى إدخال كمية منتج واحدة على الأقل أو كمية المبيعات",
      noProductsTitle: "لا توجد منتجات",
      noProductsPreview: "لم يتم اختيار منتجات للمعاينة",
      submitSuccess: "تم إرسال الطلب بنجاح!",
      success: "نجاح",
      submitFailed: "فشل الإرسال",
      submissionError: "خطأ في الإرسال",
      initError: "فشل في تهيئة التطبيق. يرجى تحديث الصفحة.",
      initErrorTitle: "خطأ في التهيئة",
      formReset: "تمت إعادة تعيين النموذج بنجاح",
      resetConfirm: "هل أنت متأكد أنك تريد إعادة تعيين النموذج؟ ستفقد جميع البيانات.",
      submitting: "جاري الإرسال...",
      loadingData: "جاري تحميل بيانات المخزون...",
      orderDetailsHeader: "تفاصيل الطلب",
      weekLabel: "الأسبوع:",
      channelLabel: "القناة:",
      salesmanLabel: "مندوب المبيعات:",
      customerLabel: "العميل:",
      productCol: "المنتج",
      quantityCol: "الكمية",
      selloutCol: "المبيعات",
      dataRestored: "تمت استعادة بيانات النموذج بنجاح",
      restoreConfirm: "تم العثور على بيانات محفوظة للنموذج. هل ترغب في استعادتها؟",
      loadingWarning: "يتم تحميل جداول Google ببطء. سيتم استخدام البيانات المخزنة إذا كانت متاحة.",
      usingCachedData: "يتم استخدام البيانات المخزنة مؤقتًا",
      loadingWarningTitle: "تحذير التحميل",
      loadingError: "فشل في تحميل بيانات المنتج. يرجى تحديث الصفحة.",
      loadingErrorTitle: "خطأ في التحميل",
      failedProducts: "فشل تحميل المنتجات. يرجى تحديث الصفحة.",
      retry: "إعادة المحاولة"
    }
  }
};

// Google Apps Script endpoint and CORS proxy
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTTKahHaWxeODCJ2SmXMXxpRJfh9zeWHJjuEgLc4ZkMovWk-VZ3xiszTEUBFRlD1RZMg/exec';
const CORS_PROXY = 'https://corsproxy.io/?';
const PROXIED_SCRIPT_URL = `${CORS_PROXY}${encodeURIComponent(GOOGLE_SCRIPT_URL)}`;

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18next.exists(key)) {
      el.textContent = i18next.t(key);
    }
  });
  document.documentElement.dir = i18next.language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = i18next.language;
}

i18next.init({
  lng: 'en',
  resources
}, err => {
  if (err) {
    console.error('i18next init error:', err);
  }
  updateTranslations();
});

elements.languageSwitcher.addEventListener('change', e => {
  i18next.changeLanguage(e.target.value, updateTranslations);
});

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
        if (confirm(i18next.t('restoreConfirm'))) {
          elements.weekSelect.value = data.week || '';
          elements.channelSelect.value = data.channel || '';
          elements.salesmanSelect.value = data.salesman || '';
          elements.customerSelect.value = data.customer || '';
          appState.productQuantities = data.products || {};
          
          // Update UI
          updateProgress();
          showToast(i18next.t('dataRestored'), 'success');
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
    elements.channelSelect.innerHTML = `<option value="" data-i18n="channelPlaceholder">${i18next.t('channelPlaceholder')}</option>` +
      channels.map(c => `<option value="${c}">${c}</option>`).join("");
    updateTranslations();
    
    hideLoadingIndicator('channel');
    
    // Channel change handler
    elements.channelSelect.addEventListener("change", async () => {
      const selectedChannel = elements.channelSelect.value;
      
      if (selectedChannel) {
        showLoadingIndicator('salesman');
        
        const salesmen = data.filter(r => r.Channel === selectedChannel).map(r => r["Salesman Name"]);
        const uniqueSalesmen = [...new Set(salesmen)].filter(Boolean);
        
        elements.salesmanSelect.innerHTML = `<option value="" data-i18n="salesmanPlaceholder">${i18next.t('salesmanPlaceholder')}</option>` +
          uniqueSalesmen.map(s => `<option value="${s}">${s}</option>`).join("");
        elements.customerSelect.innerHTML = `<option value="" data-i18n="customerPlaceholder">${i18next.t('customerPlaceholder')}</option>`;
        updateTranslations();
        
        hideLoadingIndicator('salesman');
        validateField('channel', selectedChannel);
      } else {
        elements.salesmanSelect.innerHTML = `<option value="" data-i18n="salesmanPlaceholder">${i18next.t('salesmanPlaceholder')}</option>`;
        elements.customerSelect.innerHTML = `<option value="" data-i18n="customerPlaceholder">${i18next.t('customerPlaceholder')}</option>`;
        updateTranslations();
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
        
        elements.customerSelect.innerHTML = `<option value="" data-i18n="customerPlaceholder">${i18next.t('customerPlaceholder')}</option>` +
          uniqueCustomers.map(c => `<option value="${c}">${c}</option>`).join("");
        updateTranslations();
        
        hideLoadingIndicator('customer');
        validateField('salesman', selectedSalesman);
      } else {
        elements.customerSelect.innerHTML = `<option value="" data-i18n="customerPlaceholder">${i18next.t('customerPlaceholder')}</option>`;
        updateTranslations();
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
    showToast(i18next.t('loadingWarning'), 'warning', i18next.t('loadingWarningTitle'));
    hideLoadingIndicator('channel');
    
    // Try to use cached data from localStorage
    const cachedData = localStorage.getItem('stockInTradeDropdownData');
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        const channels = [...new Set(data.map(r => r.Channel))].filter(Boolean);
        elements.channelSelect.innerHTML = `<option value="" data-i18n="channelPlaceholder">${i18next.t('channelPlaceholder')}</option>` +
          channels.map(c => `<option value="${c}">${c}</option>`).join("");
        updateTranslations();
        showToast(i18next.t('usingCachedData'), 'info');
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
    showToast(i18next.t('loadingError'), 'error', i18next.t('loadingErrorTitle'));
    elements.productsContainer.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${i18next.t('failedProducts')}</p>
        <button class="btn btn-primary" onclick="loadProducts()">
          <i class="fas fa-refresh"></i>
          ${i18next.t('retry')}
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
    const proceed = confirm(i18next.t('resetConfirm'));
    if (!proceed) {
      return;
    }
  }

  // Reset form fields
  elements.weekSelect.value = '';
  elements.channelSelect.value = '';
  elements.salesmanSelect.innerHTML = `<option value="" data-i18n="salesmanPlaceholder">${i18next.t('salesmanPlaceholder')}</option>`;
  elements.customerSelect.innerHTML = `<option value="" data-i18n="customerPlaceholder">${i18next.t('customerPlaceholder')}</option>`;
  updateTranslations();

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
  showToast(i18next.t('formReset'), 'success');
}

// Preview Functions
function previewOrder() {
  const orderData = collectOrderData();
  
  if (orderData.length === 0) {
    showToast(i18next.t('noProductsPreview'), 'warning');
    return;
  }
  
  const previewContent = document.getElementById('previewContent');
  previewContent.innerHTML = `
    <div class="preview-header">
      <h4>${i18next.t('orderDetailsHeader')}</h4>
      <div class="preview-info">
        <p><strong>${i18next.t('weekLabel')}</strong> ${elements.weekSelect.value}</p>
        <p><strong>${i18next.t('channelLabel')}</strong> ${elements.channelSelect.value}</p>
        <p><strong>${i18next.t('salesmanLabel')}</strong> ${elements.salesmanSelect.value}</p>
        <p><strong>${i18next.t('customerLabel')}</strong> ${elements.customerSelect.value}</p>
      </div>
    </div>

    <div class="preview-products">
      <h4>${i18next.t('products')} (${orderData.length})</h4>
      <div class="preview-table">
        <table>
          <thead>
            <tr>
              <th>${i18next.t('productCol')}</th>
              <th>${i18next.t('quantityCol')}</th>
              <th>${i18next.t('selloutCol')}</th>
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
    showToast(i18next.t('validationError'), 'error', i18next.t('validationTitle'));
    return;
  }
  
  const orderData = collectOrderData();
  
  if (orderData.length === 0) {
    showToast(i18next.t('noProducts'), 'warning', i18next.t('noProductsTitle'));
    return;
  }
  
  // Show confirmation modal
  const modalSummary = document.getElementById('modalSummary');
  modalSummary.innerHTML = `
    <p><strong>${i18next.t('orderSummary')}:</strong></p>
    <ul>
      <li>${i18next.t('week')}: ${elements.weekSelect.value}</li>
      <li>${i18next.t('channel')}: ${elements.channelSelect.value}</li>
      <li>${i18next.t('salesman')}: ${elements.salesmanSelect.value}</li>
      <li>${i18next.t('customer')}: ${elements.customerSelect.value}</li>
      <li>${i18next.t('productsStat')}: ${orderData.length}</li>
      <li>${i18next.t('totalQty')}: ${orderData.reduce((sum, item) => sum + item.qty, 0)}</li>
      <li>${i18next.t('selloutQty')}: ${orderData.reduce((sum, item) => sum + item.sellout, 0)}</li>
    </ul>
  `;
  
  elements.confirmationModal.classList.add('active');
}

async function confirmSubmit() {
  try {
    // Close modal and show loading
    closeModal();
    elements.submitBtn.disabled = true;
    elements.submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${i18next.t('submitting')}`;
    
    const orderData = collectOrderData();

    const response = await fetch(PROXIED_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    let result;
    if (contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      console.error("Unexpected response: ", text);
      throw new Error("Invalid response from server");
    }

    if (result.status !== "success") {
      throw new Error(result.message || "Unknown error");
    }

    showToast(i18next.t('submitSuccess'), 'success', i18next.t('success'));

    // Clear saved data
    localStorage.removeItem('stockInTradeFormData');

    resetForm(false); // Instantly reset the form after success without confirmation
    
  } catch (error) {
    console.error('Submission error:', error);
    showToast(`${i18next.t('submitFailed')}: ${error.message}`, 'error', i18next.t('submissionError'));
    
  } finally {
    elements.submitBtn.disabled = false;
    elements.submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> <span data-i18n="submitOrder">${i18next.t('submitOrder')}</span>`;
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

    // Ensure a fresh form state on initial load so previously selected
    // values aren't persisted by the browser or saved data. This clears
    // any pre-filled values before optionally restoring saved data.
    elements.weekSelect.value = '';
    elements.channelSelect.value = '';
    elements.salesmanSelect.innerHTML = `<option value="" data-i18n="salesmanPlaceholder">${i18next.t('salesmanPlaceholder')}</option>`;
    elements.customerSelect.innerHTML = `<option value="" data-i18n="customerPlaceholder">${i18next.t('customerPlaceholder')}</option>`;
    updateProgress();

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
    
    showToast(i18next.t('appLoaded'), 'success');
    
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
    showToast(i18next.t('initError'), 'error', i18next.t('initErrorTitle'));
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
