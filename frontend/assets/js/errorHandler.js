// ======================= GLOBAL ERROR HANDLER =======================

/**
 * Handles API errors gracefully
 */
async function handleApiError(error, context = "") {
  console.error(`Error [${context}]:`, error);

  let message = "An error occurred";
  let type = "error";

  if (error instanceof Response) {
    const status = error.status;
    if (status === 401 || status === 403) {
      message = "Authentication failed. Please login again.";
      // Clear auth and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setTimeout(() => (window.location.href = "/index.html"), 2000);
    } else if (status === 404) {
      message = "Resource not found";
    } else if (status === 500) {
      message = "Server error. Please try again later.";
    } else {
      try {
        const data = await error.json();
        message = data.message || `Request failed with status ${status}`;
      } catch {
        message = `Request failed with status ${status}`;
      }
    }
  } else if (error.message) {
    message = error.message;
  }

  showToast(message, type);
  return { success: false, message, error };
}

/**
 * Safe API request wrapper with error handling
 */
async function safeApiRequest(
  endpoint,
  method = "GET",
  body = null,
  context = "",
) {
  try {
    showLoader(`${context || "Processing"}...`);
    const response = await apiRequest(endpoint, method, body);
    hideLoader();

    if (!response.success) {
      showToast(response.message || "Request failed", "error");
      return response;
    }

    return response;
  } catch (error) {
    hideLoader();
    return await handleApiError(error, context);
  }
}

/**
 * Wraps data loading with loading state
 */
async function loadDataWithFeedback(fetchFunction, loadingMessage) {
  try {
    showLoader(loadingMessage);
    const result = await fetchFunction();
    hideLoader();
    return result;
  } catch (error) {
    hideLoader();
    return await handleApiError(error, loadingMessage);
  }
}

/**
 * Validates required fields before API call
 */
function validateRequired(fields, fieldNames) {
  const missing = [];

  fields.forEach((field, index) => {
    if (!field || (typeof field === "string" && !field.trim())) {
      missing.push(fieldNames[index]);
    }
  });

  if (missing.length > 0) {
    showToast(`Required fields missing: ${missing.join(", ")}`, "warning");
    return false;
  }

  return true;
}

/**
 * Handles form submission with error handling
 */
async function handleFormSubmit(event, submitFunction) {
  event.preventDefault();

  try {
    await submitFunction();
  } catch (error) {
    console.error("Form submission error:", error);
    showToast(error.message || "Form submission failed", "error");
  }
}

/**
 * Retry logic for failed requests
 */
async function retryRequest(requestFn, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${i + 1} failed, retrying...`);
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ======================= NOTIFICATION HELPERS =======================

function notifySuccess(message, duration = 3000) {
  showToast(message, "success", duration);
}

function notifyError(message, duration = 4000) {
  showToast(message, "error", duration);
}

function notifyWarning(message, duration = 3500) {
  showToast(message, "warning", duration);
}

function notifyInfo(message, duration = 3000) {
  showToast(message, "info", duration);
}

// ======================= LOGGING =======================

function logAction(action, details = {}) {
  const log = {
    timestamp: new Date().toISOString(),
    action,
    details,
    userAgent: navigator.userAgent,
  };
  console.log("[ACTION]", log);
  // Could send to backend for audit trail
  return log;
}
