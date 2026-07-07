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
    editImages: [],    // repo-relative paths (or URLs) of the product being edited
    pendingUploads: {} // path -> dataUrl of new photos, committed on publish
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
      var nImgs = productImages(p).length;
      var img = '<span class="thumb-wrap">' +
        '<img class="thumb" loading="lazy" src="' + escapeHtml(imageSrc(p.image) || 'assets/placeholder.svg') + '" alt="" onerror="this.onerror=null;this.src=\'assets/placeholder.svg\'" />' +
        (nImgs > 1 ? '<span class="thumb-count">' + nImgs + '</span>' : '') +
        '</span>';
      var meta = '<span class="m-meta"><strong>' + priceLabel(p) + '</strong>' +
        (p.originalPrice != null && p.originalPrice > p.price ? '<s>₹' + p.originalPrice + '</s>' : '') +
        (!p.active ? '<span class="m-badge b-hide">Hidden</span>' : '') +
        (p.stock === 'out' ? '<span class="m-badge b-out">Out of stock</span>' : '') +
        (p.quantity > 0 ? '<span class="m-badge b-qty">Qty ' + p.quantity + '</span>' : '') +
        '</span>';
      return '<tr class="' + (p.active ? '' : 'row-inactive') + '" data-id="' + escapeHtml(p.id) + '">' +
        '<td class="c-img">' + img + '</td>' +
        '<td class="pname c-name">' + escapeHtml(p.name) +
          (p.description ? '<small>' + escapeHtml(p.description.slice(0, 70)) + (p.description.length > 70 ? '…' : '') + '</small>' : '') +
          meta +
        '</td>' +
        '<td class="c-cat"><span class="cat-pill">' + escapeHtml(p.category) + '</span></td>' +
        '<td class="num c-price">' + priceLabel(p) + '</td>' +
        '<td class="num c-mrp">' + (p.originalPrice != null ? '<s>₹' + p.originalPrice + '</s>' : '') + '</td>' +
        '<td class="num c-qty"><input type="number" class="qty-input" data-act="qty" min="0" value="' + (p.quantity != null ? p.quantity : 0) + '" /></td>' +
        '<td class="c-stock"><label class="switch stock"><input type="checkbox" data-act="stock" ' + (p.stock === 'in' ? 'checked' : '') + ' /><span class="slider"></span></label></td>' +
        '<td class="c-active"><label class="switch"><input type="checkbox" data-act="active" ' + (p.active ? 'checked' : '') + ' /><span class="slider"></span></label></td>' +
        '<td class="c-edit"><button class="icon-btn" data-act="edit" title="Edit"><i class="fas fa-pen"></i></button></td>' +
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
    var tr = e.target.closest('tr');
    if (!tr) return;
    // open the editor on row tap, unless an inline control was the target
    if (e.target.closest('[data-act="edit"]') || !e.target.closest('input, label, button, select')) {
      openEditor(tr.getAttribute('data-id'));
    }
  });

  /* ---------- edit modal ---------- */

  function productImages(p) {
    if (Array.isArray(p.images)) return p.images.slice();
    return p.image ? [p.image] : [];
  }

  function imageSrc(pathOrUrl) {
    return state.pendingUploads[pathOrUrl] || pathOrUrl;
  }

  function openEditor(id) {
    var p = id ? findProduct(id) : null;
    state.editingId = id || null;
    state.editImages = p ? productImages(p) : [];
    $('modalTitle').textContent = p ? 'Edit Product' : 'Add Product';
    $('deleteBtn').hidden = !p;
    $('fName').value = p ? p.name : '';
    $('fCategory').value = p ? p.category : '';
    $('fPrice').value = p && p.price != null ? p.price : '';
    $('fOriginal').value = p && p.originalPrice != null ? p.originalPrice : '';
    $('fDescription').value = p ? (p.description || '') : '';
    $('fShipping').value = p ? (p.shippingNote || '') : '';
    $('fQuantity').value = p && p.quantity != null ? p.quantity : 0;
    $('fStock').value = p ? p.stock : 'in';
    $('fActive').checked = p ? !!p.active : true;
    $('fImageFile').value = '';
    $('fImageUrl').value = '';
    renderGallery();
    $('editModal').hidden = false;
  }

  function renderGallery() {
    var imgs = state.editImages;
    var main = $('fImagePreview');
    if (imgs.length) {
      main.src = imageSrc(imgs[0]);
      main.hidden = false;
      $('imgPlaceholder').hidden = true;
    } else {
      main.hidden = true;
      $('imgPlaceholder').hidden = false;
    }
    $('imgGallery').innerHTML = imgs.map(function (im, i) {
      return '<div class="g-item' + (i === 0 ? ' g-main' : '') + '" data-i="' + i + '" title="' +
        (i === 0 ? 'Main photo' : 'Click to make main') + '">' +
        '<img src="' + escapeHtml(imageSrc(im)) + '" alt="" />' +
        (i === 0 ? '<span class="g-badge">Main</span>' : '') +
        '<button type="button" class="g-remove" data-remove="' + i + '" title="Remove">&times;</button>' +
        '</div>';
    }).join('');
  }

  $('imgGallery').addEventListener('click', function (e) {
    var rm = e.target.closest('[data-remove]');
    if (rm) {
      var removed = state.editImages.splice(parseInt(rm.getAttribute('data-remove'), 10), 1)[0];
      if (removed && state.pendingUploads[removed]) delete state.pendingUploads[removed];
      renderGallery();
      return;
    }
    var item = e.target.closest('.g-item');
    if (item) {
      var i = parseInt(item.getAttribute('data-i'), 10);
      if (i > 0) {
        var im = state.editImages.splice(i, 1)[0];
        state.editImages.unshift(im);
        renderGallery();
      }
    }
  });

  // Downscale any image source to a <=900px JPEG data URL
  function toJpegDataUrl(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, 900 / Math.max(img.naturalWidth, img.naturalHeight));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  var photoSeq = 0;
  function addPendingPhoto(dataUrl) {
    var base = state.editingId || slugify($('fName').value.trim() || 'product');
    var path = 'assets/products/' + base + '-' + Date.now() + '-' + (++photoSeq) + '.jpg';
    state.pendingUploads[path] = dataUrl;
    state.editImages.push(path);
    renderGallery();
  }

  $('fImageFile').addEventListener('change', function () {
    var files = Array.prototype.slice.call(this.files);
    this.value = '';
    files.reduce(function (chain, file) {
      return chain.then(function () {
        return new Promise(function (resolve) {
          var reader = new FileReader();
          reader.onload = function () {
            toJpegDataUrl(reader.result).then(function (jpeg) {
              addPendingPhoto(jpeg);
              resolve();
            }).catch(function () {
              toast('Could not read ' + file.name, 'error');
              resolve();
            });
          };
          reader.readAsDataURL(file);
        });
      });
    }, Promise.resolve());
  });

  $('addUrlBtn').addEventListener('click', function () {
    var url = $('fImageUrl').value.trim();
    if (!url) return;
    state.editImages.push(url);
    $('fImageUrl').value = '';
    renderGallery();
  });

  /* ---------- camera capture ---------- */

  var cameraStream = null;
  var cameraFacing = 'environment';

  function startCamera() {
    stopCamera();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast('Camera not available in this browser.', 'error');
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacing, width: { ideal: 1280 } }, audio: false })
      .then(function (stream) {
        cameraStream = stream;
        $('cameraVideo').srcObject = stream;
        $('cameraModal').hidden = false;
      })
      .catch(function (err) {
        toast('Could not open camera — ' + err.message, 'error');
      });
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(function (t) { t.stop(); });
      cameraStream = null;
    }
    $('cameraVideo').srcObject = null;
  }

  $('cameraBtn').addEventListener('click', startCamera);

  $('switchCamBtn').addEventListener('click', function () {
    cameraFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    startCamera();
  });

  $('captureBtn').addEventListener('click', function () {
    var video = $('cameraVideo');
    if (!cameraStream || !video.videoWidth) return;
    var scale = Math.min(1, 900 / Math.max(video.videoWidth, video.videoHeight));
    var canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    addPendingPhoto(canvas.toDataURL('image/jpeg', 0.82));
    toast('Photo added (' + state.editImages.length + ' total). Capture more or close the camera.', 'success');
  });

  /* ---------- apply / delete ---------- */

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
    p.shippingNote = $('fShipping').value.trim();
    p.quantity = Math.max(0, parseInt($('fQuantity').value, 10) || 0);
    p.stock = $('fStock').value;
    p.active = $('fActive').checked;
    p.images = state.editImages.slice();
    p.image = p.images[0] || '';
    finishEdit();
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
    productImages(p).forEach(function (im) { delete state.pendingUploads[im]; });
    state.products = state.products.filter(function (x) { return x.id !== p.id; });
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

  function closeBackdrop(bd) {
    bd.hidden = true;
    if (bd.id === 'cameraModal') stopCamera();
  }
  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeBackdrop(btn.closest('.modal-backdrop'));
    });
  });
  document.querySelectorAll('.modal-backdrop').forEach(function (bd) {
    bd.addEventListener('mousedown', function (e) {
      if (e.target === bd) closeBackdrop(bd);
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

  var API_BASE = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME;

  function ghFetch(url, options) {
    options = options || {};
    options.headers = {
      'Authorization': 'Bearer ' + getToken(),
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    return fetch(url, options).then(function (r) {
      if (!r.ok) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          throw new Error('GitHub ' + r.status + (j.message ? ': ' + j.message : ''));
        });
      }
      return r.json();
    });
  }

  // The contents API can't read files over 1 MB (products.json is close),
  // so blob shas are resolved from the full repo tree instead.
  function getShaMap() {
    return ghFetch(API_BASE + '/git/trees/' + encodeURIComponent(getBranch()) + '?recursive=1&t=' + Date.now())
      .then(function (tree) {
        var map = {};
        (tree.tree || []).forEach(function (e) {
          if (e.type === 'blob') map[e.path] = e.sha;
        });
        return map;
      });
  }

  function commitFile(path, base64Content, message, shaMap) {
    var body = { message: message, content: base64Content, branch: getBranch() };
    if (shaMap[path]) body.sha = shaMap[path];
    return ghFetch(API_BASE + '/contents/' + path, { method: 'PUT', body: JSON.stringify(body) });
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

    // only upload photos still referenced by a product
    var referenced = {};
    state.products.forEach(function (p) {
      productImages(p).forEach(function (im) { referenced[im] = true; });
    });
    var uploads = Object.keys(state.pendingUploads).filter(function (path) { return referenced[path]; });

    getShaMap().then(function (shaMap) {
      var chain = Promise.resolve();
      uploads.forEach(function (path) {
        chain = chain.then(function () {
          return commitFile(path, state.pendingUploads[path].split(',')[1], 'admin: upload ' + path, shaMap);
        });
      });
      return chain.then(function () {
        var json = JSON.stringify({ updated: new Date().toISOString(), products: state.products }, null, 1);
        return commitFile(DATA_PATH, b64EncodeUtf8(json), 'admin: update products (' + state.products.length + ' items)', shaMap);
      });
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
