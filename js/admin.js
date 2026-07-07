/* Merlin Marina — Product Admin
 *
 * Login: credentials are checked against AUTH_HASH = SHA-256("username:password").
 * To change credentials, run in a browser console:
 *   crypto.subtle.digest('SHA-256', new TextEncoder().encode('newuser:newpass'))
 *     .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
 * and paste the result into AUTH_HASH below.
 *
 * Note: this login only gates the UI on a static site. Actual write access to the
 * live data is protected by the GitHub token (Publish Settings), which is the real
 * credential — never commit the token to the repo.
 */
(function () {
  'use strict';

  var AUTH_HASH = '1826550dd9b865ba2febd8677dc5f78128e66e303c2118642d735536c5d6f185';
  var REPO_OWNER = 'merlinmarina';
  var REPO_NAME = 'merlinmarina.github.io';
  var DATA_PATH = 'data/products.json';
  var PAGE_SIZE = 100;

  var state = {
    products: [],
    updated: null,
    dirty: false,
    filtered: [],
    shown: PAGE_SIZE,
    editingId: null,
    pendingUploads: {} // productId -> { file, dataUrl, ext }
  };

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- helpers ---------- */

  function sha256Hex(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  function b64EncodeUtf8(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var toastTimer;
  function toast(msg, type) {
    var el = $('toast');
    el.textContent = msg;
    el.className = 'toast' + (type ? ' ' + type : '');
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 4000);
  }

  function setDirty(d) {
    state.dirty = d;
    $('dirtyBadge').hidden = !d;
    $('saveBtn').disabled = !d;
  }

  function slugify(name) {
    var slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'product';
    var id = slug, k = 2;
    var ids = {};
    state.products.forEach(function (p) { ids[p.id] = 1; });
    while (ids[id]) id = slug + '-' + (k++);
    return id;
  }

  function getToken() {
    return localStorage.getItem('mm_gh_token') || sessionStorage.getItem('mm_gh_token') || '';
  }
  function getBranch() {
    return localStorage.getItem('mm_gh_branch') || 'main';
  }

  /* ---------- auth ---------- */

  function showApp() {
    $('loginScreen').hidden = true;
    $('adminApp').hidden = false;
    loadProducts();
  }

  if (sessionStorage.getItem('mm_admin_auth') === AUTH_HASH) {
    showApp();
  }

  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var user = $('loginUser').value.trim();
    var pass = $('loginPass').value;
    sha256Hex(user + ':' + pass).then(function (hash) {
      if (hash === AUTH_HASH) {
        sessionStorage.setItem('mm_admin_auth', hash);
        $('loginError').hidden = true;
        showApp();
      } else {
        $('loginError').hidden = false;
      }
    });
  });

  $('logoutBtn').addEventListener('click', function () {
    if (state.dirty && !confirm('You have unpublished changes. Log out anyway?')) return;
    sessionStorage.removeItem('mm_admin_auth');
    location.reload();
  });

  window.addEventListener('beforeunload', function (e) {
    if (state.dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- data ---------- */

  function loadProducts() {
    fetch(DATA_PATH + '?v=' + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        state.products = data.products || [];
        state.updated = data.updated;
        buildCategoryOptions();
        applyFilters();
      })
      .catch(function (err) {
        toast('Could not load ' + DATA_PATH + ' — ' + err.message, 'error');
      });
  }

  function buildCategoryOptions() {
    var cats = [];
    state.products.forEach(function (p) {
      if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category);
    });
    cats.sort();
    var sel = $('categoryFilter');
    sel.length = 1;
    var dl = $('categoryList');
    dl.innerHTML = '';
    cats.forEach(function (c) {
      sel.add(new Option(c, c));
      var o = document.createElement('option');
      o.value = c;
      dl.appendChild(o);
    });
  }

  /* ---------- rendering ---------- */

  function applyFilters() {
    var q = $('searchInput').value.trim().toLowerCase();
    var cat = $('categoryFilter').value;
    var st = $('statusFilter').value;
    state.filtered = state.products.filter(function (p) {
      if (cat && p.category !== cat) return false;
      if (st === 'active' && !p.active) return false;
      if (st === 'inactive' && p.active) return false;
      if (st === 'in' && p.stock !== 'in') return false;
      if (st === 'out' && p.stock !== 'out') return false;
      if (q && (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    state.shown = PAGE_SIZE;
    renderStats();
    renderTable();
  }

  function renderStats() {
    var total = state.products.length;
    var active = 0, out = 0, priced = 0;
    state.products.forEach(function (p) {
      if (p.active) active++;
      if (p.stock === 'out') out++;
      if (p.price != null) priced++;
    });
    $('stats').innerHTML =
      '<div class="stat-card"><div class="stat-num">' + total + '</div><div class="stat-label">Total products</div></div>' +
      '<div class="stat-card good"><div class="stat-num">' + active + '</div><div class="stat-label">Active</div></div>' +
      '<div class="stat-card warn"><div class="stat-num">' + (total - active) + '</div><div class="stat-label">Hidden</div></div>' +
      '<div class="stat-card bad"><div class="stat-num">' + out + '</div><div class="stat-label">Out of stock</div></div>';
  }

  function priceLabel(p) {
    return p.price != null ? '₹' + p.price : '—';
  }

  function renderTable() {
    var rows = state.filtered.slice(0, state.shown);
    var html = rows.map(function (p) {
      var img = '<img class="thumb" loading="lazy" src="' + escapeHtml(p.image || 'assets/placeholder.svg') + '" alt="" onerror="this.onerror=null;this.src=\'assets/placeholder.svg\'" />';
      return '<tr class="' + (p.active ? '' : 'row-inactive') + '" data-id="' + escapeHtml(p.id) + '">' +
        '<td>' + img + '</td>' +
        '<td class="pname">' + escapeHtml(p.name) +
          (p.description ? '<small>' + escapeHtml(p.description.slice(0, 70)) + (p.description.length > 70 ? '…' : '') + '</small>' : '') +
        '</td>' +
        '<td><span class="cat-pill">' + escapeHtml(p.category) + '</span></td>' +
        '<td class="num">' + priceLabel(p) + '</td>' +
        '<td class="num">' + (p.originalPrice != null ? '₹' + p.originalPrice : '—') + '</td>' +
        '<td class="num"><input type="number" class="qty-input" data-act="qty" min="0" value="' + (p.quantity != null ? p.quantity : 0) + '" /></td>' +
        '<td><label class="switch stock"><input type="checkbox" data-act="stock" ' + (p.stock === 'in' ? 'checked' : '') + ' /><span class="slider"></span></label></td>' +
        '<td><label class="switch"><input type="checkbox" data-act="active" ' + (p.active ? 'checked' : '') + ' /><span class="slider"></span></label></td>' +
        '<td><button class="icon-btn" data-act="edit" title="Edit"><i class="fas fa-pen"></i></button></td>' +
        '</tr>';
    }).join('');
    $('tbody').innerHTML = html;
    $('countLabel').textContent = 'Showing ' + Math.min(state.shown, state.filtered.length) + ' of ' + state.filtered.length + ' products';
    $('moreBtn').hidden = state.filtered.length <= state.shown;
  }

  $('moreBtn').addEventListener('click', function () {
    state.shown += PAGE_SIZE;
    renderTable();
  });

  $('searchInput').addEventListener('input', applyFilters);
  $('categoryFilter').addEventListener('change', applyFilters);
  $('statusFilter').addEventListener('change', applyFilters);

  function findProduct(id) {
    for (var i = 0; i < state.products.length; i++) {
      if (state.products[i].id === id) return state.products[i];
    }
    return null;
  }

  $('tbody').addEventListener('change', function (e) {
    var act = e.target.getAttribute('data-act');
    if (!act) return;
    var tr = e.target.closest('tr');
    var p = findProduct(tr.getAttribute('data-id'));
    if (!p) return;
    if (act === 'active') { p.active = e.target.checked; tr.className = p.active ? '' : 'row-inactive'; }
    if (act === 'stock') p.stock = e.target.checked ? 'in' : 'out';
    if (act === 'qty') p.quantity = Math.max(0, parseInt(e.target.value, 10) || 0);
    setDirty(true);
    renderStats();
  });

  $('tbody').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act="edit"]');
    if (!btn) return;
    openEditor(btn.closest('tr').getAttribute('data-id'));
  });

  /* ---------- edit modal ---------- */

  function openEditor(id) {
    var p = id ? findProduct(id) : null;
    state.editingId = id || null;
    $('modalTitle').textContent = p ? 'Edit Product' : 'Add Product';
    $('deleteBtn').hidden = !p;
    $('fName').value = p ? p.name : '';
    $('fCategory').value = p ? p.category : '';
    $('fPrice').value = p && p.price != null ? p.price : '';
    $('fOriginal').value = p && p.originalPrice != null ? p.originalPrice : '';
    $('fDescription').value = p ? (p.description || '') : '';
    $('fQuantity').value = p && p.quantity != null ? p.quantity : 0;
    $('fStock').value = p ? p.stock : 'in';
    $('fActive').checked = p ? !!p.active : true;
    $('fImage').value = p ? (p.image || '') : '';
    $('fImageFile').value = '';
    setPreview(p ? p.image : '');
    $('editModal').hidden = false;
  }

  function setPreview(src) {
    var img = $('fImagePreview');
    if (src) {
      img.src = src;
      img.hidden = false;
      $('imgPlaceholder').hidden = true;
    } else {
      img.hidden = true;
      $('imgPlaceholder').hidden = false;
    }
  }

  $('fImage').addEventListener('input', function () { setPreview(this.value.trim()); });

  $('fImageFile').addEventListener('change', function () {
    var file = this.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast('Image too large — keep it under 2 MB.', 'error');
      this.value = '';
      return;
    }
    var reader = new FileReader();
    reader.onload = function () { setPreview(reader.result); };
    reader.readAsDataURL(file);
  });

  $('addBtn').addEventListener('click', function () { openEditor(null); });

  $('editForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var p = state.editingId ? findProduct(state.editingId) : null;
    if (!p) {
      p = { id: slugify($('fName').value), currency: 'INR' };
      state.products.unshift(p);
    }
    p.name = $('fName').value.trim();
    p.category = $('fCategory').value.trim();
    p.price = parseFloat($('fPrice').value);
    p.originalPrice = $('fOriginal').value === '' ? null : parseFloat($('fOriginal').value);
    p.description = $('fDescription').value.trim();
    p.quantity = Math.max(0, parseInt($('fQuantity').value, 10) || 0);
    p.stock = $('fStock').value;
    p.active = $('fActive').checked;

    var file = $('fImageFile').files[0];
    if (file) {
      var ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      var path = 'assets/products/' + p.id + '-' + Date.now() + '.' + ext;
      var reader = new FileReader();
      reader.onload = function () {
        state.pendingUploads[p.id] = { path: path, dataUrl: reader.result };
        p.image = path;
        finishEdit();
      };
      reader.readAsDataURL(file);
    } else {
      p.image = $('fImage').value.trim();
      delete state.pendingUploads[p.id];
      finishEdit();
    }
  });

  function finishEdit() {
    $('editModal').hidden = true;
    setDirty(true);
    buildCategoryOptions();
    applyFilters();
  }

  $('deleteBtn').addEventListener('click', function () {
    var p = state.editingId && findProduct(state.editingId);
    if (!p) return;
    if (!confirm('Delete "' + p.name + '"? This is removed when you publish.')) return;
    state.products = state.products.filter(function (x) { return x.id !== p.id; });
    delete state.pendingUploads[p.id];
    finishEdit();
  });

  /* ---------- settings ---------- */

  $('settingsBtn').addEventListener('click', function () {
    $('sToken').value = getToken();
    $('sBranch').value = getBranch();
    $('sRemember').checked = !!localStorage.getItem('mm_gh_token');
    $('settingsModal').hidden = false;
  });

  $('settingsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var token = $('sToken').value.trim();
    var branch = $('sBranch').value.trim() || 'main';
    localStorage.removeItem('mm_gh_token');
    sessionStorage.removeItem('mm_gh_token');
    if (token) {
      ($('sRemember').checked ? localStorage : sessionStorage).setItem('mm_gh_token', token);
    }
    localStorage.setItem('mm_gh_branch', branch);
    $('settingsModal').hidden = true;
    toast('Settings saved.', 'success');
  });

  /* ---------- modal close ---------- */

  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.closest('.modal-backdrop').hidden = true;
    });
  });
  document.querySelectorAll('.modal-backdrop').forEach(function (bd) {
    bd.addEventListener('mousedown', function (e) {
      if (e.target === bd) bd.hidden = true;
    });
  });

  /* ---------- download backup ---------- */

  $('downloadBtn').addEventListener('click', function () {
    var blob = new Blob(
      [JSON.stringify({ updated: new Date().toISOString(), products: state.products }, null, 1)],
      { type: 'application/json' }
    );
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'products.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* ---------- publish to GitHub ---------- */

  function ghRequest(method, path, body) {
    return fetch('https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path +
      (method === 'GET' ? '?ref=' + encodeURIComponent(getBranch()) + '&t=' + Date.now() : ''), {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + getToken(),
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (r.status === 404 && method === 'GET') return null;
      if (!r.ok) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          throw new Error('GitHub ' + r.status + (j.message ? ': ' + j.message : ''));
        });
      }
      return r.json();
    });
  }

  function commitFile(path, base64Content, message) {
    return ghRequest('GET', path).then(function (existing) {
      var body = { message: message, content: base64Content, branch: getBranch() };
      if (existing && existing.sha) body.sha = existing.sha;
      return ghRequest('PUT', path, body);
    });
  }

  $('saveBtn').addEventListener('click', function () {
    if (!getToken()) {
      toast('Set your GitHub token first (gear icon).', 'error');
      $('settingsBtn').click();
      return;
    }
    var btn = $('saveBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing…';

    var uploads = Object.keys(state.pendingUploads);
    var chain = Promise.resolve();
    uploads.forEach(function (id) {
      var u = state.pendingUploads[id];
      chain = chain.then(function () {
        return commitFile(u.path, u.dataUrl.split(',')[1], 'admin: upload image for ' + id);
      });
    });

    chain.then(function () {
      var json = JSON.stringify({ updated: new Date().toISOString(), products: state.products }, null, 1);
      return commitFile(DATA_PATH, b64EncodeUtf8(json), 'admin: update products (' + state.products.length + ' items)');
    }).then(function () {
      state.pendingUploads = {};
      setDirty(false);
      toast('Published! The live site updates in a minute or two.', 'success');
    }).catch(function (err) {
      toast('Publish failed — ' + err.message, 'error');
      btn.disabled = false;
    }).finally(function () {
      btn.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> Publish Changes';
      if (!state.dirty) btn.disabled = true; else btn.disabled = false;
    });
  });

})();
