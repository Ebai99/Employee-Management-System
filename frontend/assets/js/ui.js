// ======================= TOAST NOTIFICATIONS =======================

function showToast(message, type = "info", duration = 3000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const colors = {
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FF9800",
    info: "#2196F3",
  };

  toast.style.cssText = `
    background: ${colors[type] || colors.info};
    color: white;
    padding: 14px 18px;
    border-radius: 8px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
    max-width: 400px;
  `;

  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ======================= LOADING OVERLAY =======================

function showLoader(message = "Loading...") {
  let loader = document.getElementById("loader-overlay");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader-overlay";
    loader.innerHTML = `
      <div class="loader-content">
        <div class="spinner"></div>
        <p id="loader-message" style="margin-top: 15px; font-size: 14px; color: #ccc;">${message}</p>
      </div>
    `;
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    document.body.appendChild(loader);
  } else {
    document.getElementById("loader-message").textContent = message;
    loader.style.display = "flex";
  }
}

function hideLoader() {
  const loader = document.getElementById("loader-overlay");
  if (loader) {
    loader.style.display = "none";
  }
}

// ======================= MODAL MANAGEMENT =======================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
    modal.classList.add("show");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
    modal.classList.remove("show");
  });
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeAllModals();
  }
});

// ======================= CONFIRMATION DIALOG =======================

function confirmDialog(message, title = "Confirm Action") {
  return new Promise((resolve) => {
    let confirmModal = document.getElementById("confirm-modal");
    if (!confirmModal) {
      confirmModal = document.createElement("div");
      confirmModal.id = "confirm-modal";
      confirmModal.className = "modal";
      confirmModal.innerHTML = `
        <div class="modal-content confirm-modal-content">
          <h3 id="confirm-title"></h3>
          <p id="confirm-message"></p>
          <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
            <button class="btn-secondary" onclick="confirmCancel()">Cancel</button>
            <button class="btn-danger" onclick="confirmAccept()">Confirm</button>
          </div>
        </div>
      </div>`;
      document.body.appendChild(confirmModal);
    }

    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-message").textContent = message;

    window.confirmAccept = () => {
      closeModal("confirm-modal");
      resolve(true);
    };

    window.confirmCancel = () => {
      closeModal("confirm-modal");
      resolve(false);
    };

    openModal("confirm-modal");
  });
}

// ======================= DATE FORMATTING =======================

function formatDate(date, format = "YYYY-MM-DD") {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const pad = (n) => String(n).padStart(2, "0");

  const formats = {
    "YYYY-MM-DD": () =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    "DD-MM-YYYY": () =>
      `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`,
    "MM/DD/YYYY": () =>
      `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`,
    "HH:MM": () => `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    "DD MMM YYYY": () => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${pad(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
  };

  return formats[format] ? formats[format]() : date.toString();
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours > 0 ? hours + "h " : ""}${minutes}m ${secs}s`;
}

// ======================= FORM VALIDATION =======================

function validateForm(formId, rules) {
  const form = document.getElementById(formId);
  if (!form) return false;

  let isValid = true;
  const errors = {};

  for (const fieldName in rules) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) continue;

    const value = field.value.trim();
    const fieldRules = rules[fieldName];

    // Required
    if (fieldRules.required && !value) {
      errors[fieldName] = `${fieldName} is required`;
      isValid = false;
      continue;
    }

    // Email
    if (fieldRules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[fieldName] = `${fieldName} must be a valid email`;
        isValid = false;
      }
    }

    // Min length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[fieldName] =
        `${fieldName} must be at least ${fieldRules.minLength} characters`;
      isValid = false;
    }

    // Max length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[fieldName] =
        `${fieldName} must not exceed ${fieldRules.maxLength} characters`;
      isValid = false;
    }

    // Pattern
    if (fieldRules.pattern && value) {
      if (!fieldRules.pattern.test(value)) {
        errors[fieldName] =
          fieldRules.message || `${fieldName} format is invalid`;
        isValid = false;
      }
    }
  }

  // Clear previous errors
  form.querySelectorAll(".form-error").forEach((el) => el.remove());

  // Display errors
  if (!isValid) {
    for (const fieldName in errors) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const errorDiv = document.createElement("div");
      errorDiv.className = "form-error";
      errorDiv.textContent = errors[fieldName];
      field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
  }

  return isValid;
}

// ======================= UTILITY HELPERS =======================

function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

function throttle(func, delay = 300) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Format currency
function formatCurrency(amount, currency = "USD") {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });
  return formatter.format(amount);
}

// Format numbers with commas
function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number);
}
