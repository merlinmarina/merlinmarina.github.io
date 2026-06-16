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

  const productButtons = document.querySelectorAll('.btn-product');
  productButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'product-details.html';
    });
  });
});