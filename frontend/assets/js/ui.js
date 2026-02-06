function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed; bottom:30px; right:30px;
    background:#111827; color:white;
    padding:14px 18px; border-radius:12px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
