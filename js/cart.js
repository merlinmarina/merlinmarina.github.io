/* Merlin Marina cart — stored locally; checkout is completed over WhatsApp. */
(function () {
  'use strict';
  var KEY = 'merlin-marina-cart';
  var WHATSAPP = '917338963335';
  var items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { items = []; }

  function money(value) { return '₹' + Number(value || 0).toLocaleString('en-IN'); }
  function save() { localStorage.setItem(KEY, JSON.stringify(items)); render(); }
  function total() { return items.reduce(function (sum, item) { return sum + Number(item.price || 0) * item.quantity; }, 0); }
  function count() { return items.reduce(function (sum, item) { return sum + item.quantity; }, 0); }
  function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }
  function render() {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = count(); });
    document.querySelectorAll('[data-cart-total]').forEach(function (el) { el.textContent = money(total()); });
    document.querySelectorAll('[data-cart-items]').forEach(function (container) {
      if (!items.length) { container.innerHTML = '<div class="cart-empty"><i class="fas fa-fish"></i><strong>Your bag is empty</strong><p>Add products from our collection to begin.</p></div>'; return; }
      container.innerHTML = items.map(function (item) {
        return '<article class="cart-item"><img src="' + escapeHtml(item.image || 'assets/placeholder.svg') + '" alt=""><div class="cart-item-info"><h3>' + escapeHtml(item.name) + '</h3><span>' + money(item.price) + '</span><div class="cart-quantity"><button type="button" data-cart-change="-1" data-cart-id="' + escapeHtml(item.id) + '" aria-label="Remove one">−</button><b>' + item.quantity + '</b><button type="button" data-cart-change="1" data-cart-id="' + escapeHtml(item.id) + '" aria-label="Add one">+</button><button type="button" data-cart-remove data-cart-id="' + escapeHtml(item.id) + '">Remove</button></div></div><strong class="cart-line-total">' + money(item.price * item.quantity) + '</strong></article>';
      }).join('');
    });
  }
  function open() { document.body.classList.add('cart-open'); document.querySelectorAll('.cart-drawer').forEach(function (el) { el.setAttribute('aria-hidden', 'false'); }); }
  function close() { document.body.classList.remove('cart-open'); document.querySelectorAll('.cart-drawer').forEach(function (el) { el.setAttribute('aria-hidden', 'true'); }); }
  function add(product) {
    var existing = items.find(function (item) { return String(item.id) === String(product.id); });
    if (existing) existing.quantity += 1;
    else items.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    save(); open();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) open();
    if (e.target.closest('[data-cart-close]')) close();
    var change = e.target.closest('[data-cart-change]');
    if (change) { var item = items.find(function (x) { return String(x.id) === String(change.dataset.cartId); }); if (item) { item.quantity += Number(change.dataset.cartChange); if (item.quantity < 1) items = items.filter(function (x) { return x !== item; }); save(); } }
    var remove = e.target.closest('[data-cart-remove]');
    if (remove) { items = items.filter(function (x) { return String(x.id) !== String(remove.dataset.cartId); }); save(); }
    if (e.target.closest('[data-cart-checkout]')) {
      if (!items.length) return;
      var lines = items.map(function (item) { return '• ' + item.name + ' × ' + item.quantity + ' — ' + money(item.price * item.quantity); });
      var message = 'Hi Merlin Marina! I would like to place this order:%0A%0A' + encodeURIComponent(lines.join('\n')) + '%0A%0ASubtotal: ' + encodeURIComponent(money(total())) + '%0A%0APlease confirm availability and delivery details.';
      window.open('https://wa.me/' + WHATSAPP + '?text=' + message, '_blank', 'noopener');
    }
  });
  window.MerlinCart = { add: add, open: open };
  render();
})();
