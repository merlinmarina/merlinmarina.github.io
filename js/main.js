document.addEventListener('DOMContentLoaded', function () {
  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach((item, index) => {
    const button = item.querySelector('.accordion-button');
    button.addEventListener('click', () => {
      const openItem = document.querySelector('.accordion-item.open');
      if (openItem && openItem !== item) {
        openItem.classList.remove('open');
      }
      item.classList.toggle('open');
    });
  });
  // Order button handler: opens WhatsApp with a prefilled message
  document.addEventListener('click', function (e) {
    const orderBtn = e.target.closest('.order-btn, .btn-product');
    if (!orderBtn) return;
    e.preventDefault();
    const phone = '919677228515';
    const productName = orderBtn.dataset.productName || orderBtn.closest('.product-card')?.querySelector('h3')?.innerText || document.title;
    const productPrice = orderBtn.dataset.productPrice || '';
    let message = `Hi, I want to order: ${productName}`;
    if (productPrice) message += ` (Price: ${productPrice})`;
    message += `\nPage: ${location.href}`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  });
});