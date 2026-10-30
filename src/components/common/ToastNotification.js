export const showNotification = (msg) => {
  const notif = document.createElement('div');
  notif.className = 'fixed top-6 right-6 bg-[#0F1B3F] text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] font-bold text-base';
  notif.textContent = msg;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
};
