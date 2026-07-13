/* Merlin Marina — public product catalog (reads data/products.json) */
(function () {
  'use strict';

  var WHATSAPP = '917338963335';
  var PAGE_SIZE = 24;

  var products = [];
  var filtered = [];
  var shown = PAGE_SIZE;
  var activeCategory = '';

  var grid = document.getElementById('productGrid');
  var chipRow = document.getElementById('chipRow');
  var searchInput = document.getElementById('searchInput');
  var moreBtn = document.getElementById('moreBtn');
  var countLabel = document.getElementById('countLabel');

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  fetch('data/products.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      products = (data.products || []).filter(function (p) { return p.active; });
      var params = new URLSearchParams(location.search);
      activeCategory = params.get('cat') || '';
      buildChips();
      applyFilters();
    })
    .catch(function () {
      grid.innerHTML = '<p class="catalog-empty">Products are being updated. Please check back soon.</p>';
    });

  function buildChips() {
    var cats = [];
    products.forEach(function (p) {
      if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category);
    });
    cats.sort();
    var html = '<button class="chip' + (activeCategory === '' ? ' chip-active' : '') + '" data-cat="">All</button>';
    cats.forEach(function (c) {
      html += '<button class="chip' + (activeCategory === c ? ' chip-active' : '') + '" data-cat="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>';
    });
    chipRow.innerHTML = html;
  }

  chipRow.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    activeCategory = chip.getAttribute('data-cat');
    chipRow.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('chip-active'); });
    chip.classList.add('chip-active');
    applyFilters();
  });

  searchInput.addEventListener('input', applyFilters);

  function applyFilters() {
    var q = searchInput.value.trim().toLowerCase();
    filtered = products.filter(function (p) {
      if (activeCategory && p.category !== activeCategory) return false;
      if (q && (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    shown = PAGE_SIZE;
    render();
  }

  function render() {
    var rows = filtered.slice(0, shown);
    if (!rows.length) {
      grid.innerHTML = '<p class="catalog-empty">No products found.</p>';
    } else {
      grid.innerHTML = rows.map(function (p) {
        var out = p.stock === 'out';
        var discount = p.originalPrice && p.originalPrice > p.price
          ? Math.round((1 - p.price / p.originalPrice) * 100)
          : 0;
        return '<div class="product-card' + (out ? ' is-out' : '') + '">' +
          '<div class="product-img">' +
            '<img loading="lazy" src="' + escapeHtml(p.image || 'assets/placeholder.svg') + '" alt="' + escapeHtml(p.name) + '" onerror="this.onerror=null;this.src=\'assets/placeholder.svg\'" />' +
            (out ? '<span class="stock-badge">Out of Stock</span>' : '') +
            (!out && discount ? '<span class="discount-badge">' + discount + '% OFF</span>' : '') +
          '</div>' +
          '<div class="product-body">' +
            '<span class="product-cat">' + escapeHtml(p.category) + '</span>' +
            '<h3 class="product-name">' + escapeHtml(p.name) + '</h3>' +
            (p.description ? '<p class="product-desc">' + escapeHtml(p.description) + '</p>' : '') +
            '<div class="product-price">' +
              '<strong>₹' + p.price + '</strong>' +
              (p.originalPrice && p.originalPrice > p.price ? '<s>₹' + p.originalPrice + '</s>' : '') +
            '</div>' +
            (out
              ? '<span class="btn btn-out" aria-disabled="true">Out of Stock</span>'
              : '<button class="btn btn-order" type="button" data-add-to-cart="' + escapeHtml(p.id) + '"><i class="fas fa-bag-shopping"></i> Add to bag</button>') +
          '</div>' +
        '</div>';
      }).join('');
    }
    countLabel.textContent = 'Showing ' + Math.min(shown, filtered.length) + ' of ' + filtered.length + ' products';
    moreBtn.hidden = filtered.length <= shown;
  }

  moreBtn.addEventListener('click', function () {
    shown += PAGE_SIZE;
    render();
  });

  grid.addEventListener('click', function (e) {
    var button = e.target.closest('[data-add-to-cart]');
    if (!button || !window.MerlinCart) return;
    var id = button.getAttribute('data-add-to-cart');
    var product = products.find(function (p) { return String(p.id) === String(id); });
    if (!product) return;
    window.MerlinCart.add(product);
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    window.setTimeout(function () { button.innerHTML = '<i class="fas fa-bag-shopping"></i> Add to bag'; }, 1300);
  });
})();
