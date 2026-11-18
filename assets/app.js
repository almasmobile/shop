(function () {
  'use strict';

  const SHOP_PHONE = '+989106623373';
  const MARGIN_PERCENT = 25;

  const faNum = (n) => Number(n).toLocaleString('fa-IR');
  const formatToman = (n) => faNum(n) + ' تومان';
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const buildSmsUri = (body) => `sms:${SHOP_PHONE}${isIOS() ? '&' : '?'}body=${encodeURIComponent(body)}`;

  // --- سیستم Toast ---
  function showToast(msg, isError) {
    let toast = document.getElementById('toast');
    if (!toast) { toast = document.createElement('div'); toast.id = 'toast'; document.body.appendChild(toast); }
    toast.textContent = msg; toast.className = isError ? 'show error' : 'show';
    setTimeout(() => toast.className = '', 3000);
  }

  // --- اعتبارسنجی شماره ---
  function setupPhoneValidation(input) {
    if (!input) return;
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^\d+]/g, '');
      if (val.startsWith('98')) val = '+' + val;
      else if (val.startsWith('9') && val.length === 10) val = '0' + val;
      e.target.value = val;
      if (/^09\d{9}$/.test(val)) {
        input.classList.add('valid-phone'); input.classList.remove('input-error');
      } else {
        input.classList.remove('valid-phone');
      }
    });
  }

  // --- ذخیره‌سازی محلی ---
  function setupLocalStorage(form) {
    const inputs = form.querySelectorAll('input[type="text"], input[type="tel"]');
    inputs.forEach(input => {
      const name = input.name || input.id;
      if (!name) return;
      const saved = localStorage.getItem('almas_' + name);
      if (saved && input.type !== 'password') input.value = saved;
      
      input.addEventListener('input', () => {
        if (input.type !== 'password') localStorage.setItem('almas_' + name, input.value);
      });
    });
  }

  // --- افکت ریپل ---
  function initRipple() {
    document.addEventListener('click', function(e) {
      const target = e.target.closest('.btn, .option, .chip');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter/2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter/2}px`;
      circle.classList.add('ripple');
      const ripple = target.getElementsByClassName('ripple')[0];
      if (ripple) ripple.remove();
      target.appendChild(circle);
    });
  }

  // --- پارالاکس لوگو ---
  function initParallax() {
    const logos = document.querySelectorAll('.brand img');
    if(!logos.length) return;
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      logos.forEach(logo => {
        logo.style.transform = `translateY(${scroll * 0.2}px) scale(${1 - scroll * 0.001})`;
        logo.style.opacity = 1 - scroll * 0.005;
      });
    });
  }

  // --- انتقال نرم بین صفحات ---
  function initPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('page-fade-out');
        setTimeout(() => { window.location.href = link.href; }, 300);
      });
    });
  }

  function initScrollEffects() {
    let lastScrollY = window.scrollY;
    const dock = document.querySelector('.social-dock');
    const progress = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (progress) { progress.style.width = `${(currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`; }
      if (dock) { if (currentScrollY > lastScrollY && currentScrollY > 100) dock.classList.add('hidden-dock'); else dock.classList.remove('hidden-dock'); }
      lastScrollY = currentScrollY;
    });
  }

  // --- انیمیشن اسکرول (Scroll Reveal) ---
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.service-card, .section, .page-title');
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(el => observer.observe(el));
  }

  function injectFAB() {
    if (document.querySelector('.social-dock')) return;
    const dock = document.createElement('div'); dock.className = 'social-dock';
    dock.innerHTML = `
      <a href="tel:${SHOP_PHONE}" class="dock-btn call"><svg viewBox="0 0 24 24"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.4-.5-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/></svg></a>
      <a href="https://wa.me/989106623373" target="_blank" rel="noopener" class="dock-btn whatsapp"><svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z"/></svg></a>
      <a href="https://instagram.com/almasmobile.marzdaran" target="_blank" rel="noopener" class="dock-btn instagram"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
    `;
    document.body.appendChild(dock);
  }

  function initSelectable() {
    document.querySelectorAll('.option input, .chip input').forEach(input => {
      if (input.type === 'radio') {
        input.addEventListener('change', () => {
          document.querySelectorAll(`input[name="${input.name}"]`).forEach(r => {
            const lbl = r.closest('.option, .chip'); if (lbl) lbl.classList.toggle('selected', r.checked);
          });
        });
      } else {
        input.addEventListener('change', () => {
          const lbl = input.closest('.option, .chip'); if (lbl) lbl.classList.toggle('selected', input.checked);
        });
      }
      if (input.checked) { const lbl = input.closest('.option, .chip'); if (lbl) lbl.classList.add('selected'); }
    });
  }

  function showConfirmModal(body, previewEl, btn) {
    let modal = document.getElementById('confirmModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'confirmModal'; modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content">
          <h3>تایید سفارش</h3>
          <p>آیا از ثبت این درخواست اطمینان دارید؟ پس از تایید، اپلیکیشن پیامک باز خواهد شد.</p>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-secondary" id="cancelModal">انصراف</button>
            <button class="btn" id="confirmModalBtn">تایید و ارسال</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.classList.add('show');
    document.getElementById('cancelModal').onclick = () => modal.classList.remove('show');
    document.getElementById('confirmModalBtn').onclick = () => {
      modal.classList.remove('show');
      openSms(body, previewEl, btn);
    };
  }

  function openSms(body, previewEl, btn) {
    if (previewEl) { previewEl.textContent = body; previewEl.classList.add('visible'); }
    const origText = btn.textContent;
    btn.innerHTML = '<span class="spinner"></span> در حال آماده‌سازی...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = origText; btn.disabled = false;
      try { window.location.href = buildSmsUri(body); } catch (e) {}
      showToast('✅ پیامک آماده شد. لطفاً ارسال را تأیید کنید.');
    }, 1000);
  }

  function copyText(text, btn) {
    const done = () => { const orig = btn.textContent; btn.textContent = '✓ کپی شد'; showToast('کپی شد'); setTimeout(() => { btn.textContent = orig; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done).catch(() => {}); }
    else { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); done(); document.body.removeChild(ta); }
  }

  function setError(input, msg) {
    input.classList.add('input-error'); input.parentElement.classList.add('shake');
    setTimeout(() => input.parentElement.classList.remove('shake'), 500);
    showToast(msg, true);
  }

  function initPatternPad(padEl, onChange) {
    if (!padEl) return null;
    const lineLayer = padEl.querySelector('.pattern-line');
    lineLayer.innerHTML = '<svg viewBox="0 0 260 260" preserveAspectRatio="none"><polyline id="pattern-polyline" points="" /></svg>';
    const polyline = lineLayer.querySelector('#pattern-polyline');
    const dots = Array.from(padEl.querySelectorAll('.pattern-dot'));
    function getCenter(dot) {
      const padRect = padEl.getBoundingClientRect();
      const r = dot.getBoundingClientRect();
      return { x: r.left - padRect.left + r.width / 2, y: r.top - padRect.top + r.height / 2 };
    }
    let sequence = [];
    let drawing = false;
    let activePointerId = null;
    function reset() {
      sequence = [];
      dots.forEach(d => { d.classList.remove('active', 'done'); });
      polyline.setAttribute('points', '');
      if (onChange) onChange(sequence.slice());
    }
    function updateLine() {
      if (sequence.length === 0) { polyline.setAttribute('points', ''); return; }
      const pts = sequence.map(idx => {
        const c = getCenter(dots[idx - 1]);
        return `${c.x},${c.y}`;
      }).join(' ');
      polyline.setAttribute('points', pts);
    }
    function addPoint(idx) {
      if (sequence.includes(idx)) return;
      sequence.push(idx);
      const dot = dots[idx - 1];
      dot.classList.add('active', 'done');
      updateLine();
      if (onChange) onChange(sequence.slice());
    }
    function hitTest(clientX, clientY) {
      const padRect = padEl.getBoundingClientRect();
      const x = clientX - padRect.left;
      const y = clientY - padRect.top;
      for (let i = 0; i < dots.length; i++) {
        const c = getCenter(dots[i]);
        const dx = x - c.x, dy = y - c.y;
        if (dx * dx + dy * dy <= 30 * 30) return i + 1;
      }
      return 0;
    }
    function start(e) {
      if (drawing) return;
      const idx = hitTest(e.clientX, e.clientY);
      if (!idx) return;
      drawing = true;
      activePointerId = e.pointerId;
      try { padEl.setPointerCapture(e.pointerId); } catch (err) {}
      reset();
      addPoint(idx);
      e.preventDefault();
    }
    function move(e) {
      if (!drawing || e.pointerId !== activePointerId) return;
      const idx = hitTest(e.clientX, e.clientY);
      if (idx) addPoint(idx);
      e.preventDefault();
    }
    function end(e) {
      if (!drawing || e.pointerId !== activePointerId) return;
      drawing = false;
      activePointerId = null;
      dots.forEach(d => d.classList.remove('active'));
      if (onChange) onChange(sequence.slice());
    }
    padEl.addEventListener('pointerdown', start);
    padEl.addEventListener('pointermove', move);
    padEl.addEventListener('pointerup', end);
    padEl.addEventListener('pointercancel', end);
    padEl.addEventListener('pointerleave', end);
    return { reset, getSequence: () => sequence.slice() };
  }

  function initApple() {
    const form = document.getElementById('apple-form'); if (!form) return;
    setupLocalStorage(form); setupPhoneValidation(form.phone);
    const priceEl = document.getElementById('selected-price'), previewEl = document.getElementById('sms-preview'), copyBtn = document.getElementById('copy-btn'), submitBtn = form.querySelector('button[type="submit"]');
    form.querySelectorAll('input[name="type"]').forEach(r => r.addEventListener('change', () => {
      const sel = form.querySelector('input[name="type"]:checked');
      priceEl.textContent = sel ? formatToman(sel.dataset.price) : '—';
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sel = form.querySelector('input[name="type"]:checked');
      if (!sel) return showToast('نوع اپل آیدی را انتخاب کنید', true);
      const fn = form.firstName, ln = form.lastName, ph = form.phone;
      if (!fn.value.trim()) return setError(fn, 'نام الزامی است');
      if (!ln.value.trim()) return setError(ln, 'نام خانوادگی الزامی است');
      if (!/^09\d{9}$/.test(ph.value)) return setError(ph, 'شماره موبایل معتبر نیست');
      const body = `سلام، برای خرید اپل آیدی درخواست دارم.\nنوع: ${sel.dataset.label}\nنام: ${fn.value} ${ln.value}\nشماره تماس: ${ph.value}\nقیمت: ${faNum(sel.dataset.price)} تومان`;
      showConfirmModal(body, previewEl, submitBtn);
      if (copyBtn) { copyBtn.classList.remove('hidden'); copyBtn.onclick = () => copyText(body, copyBtn); }
    });
  }

  function initTransfer() {
    const form = document.getElementById('transfer-form'); if (!form) return;
    setupLocalStorage(form); setupPhoneValidation(form.phone);
    const gbInput = document.getElementById('gb'), priceEl = document.getElementById('calc-price'), estimateEl = document.getElementById('time-estimate'), previewEl = document.getElementById('sms-preview'), copyBtn = document.getElementById('copy-btn'), submitBtn = form.querySelector('button[type="submit"]');
    if (isIOS()) {
      const iosRadio = form.querySelector('input[name="source"][value="ios"]');
      if(iosRadio) { iosRadio.checked = true; iosRadio.dispatchEvent(new Event('change')); }
    } else {
      const androidRadio = form.querySelector('input[name="source"][value="android"]');
      if(androidRadio) { androidRadio.checked = true; androidRadio.dispatchEvent(new Event('change')); }
    }
    function calc() {
      const gb = parseFloat(gbInput.value) || 0;
      priceEl.textContent = formatToman(Math.max(1000000, gb * 15000));
      if (estimateEl) {
        if (gb > 0) { estimateEl.textContent = `⏱ زمان تقریبی: ${faNum(Math.ceil(gb / 50))} ساعت`; estimateEl.style.display = 'block'; } 
        else estimateEl.style.display = 'none';
      }
    }
    gbInput.addEventListener('input', calc);

    const lockSection = document.getElementById('lock-section');
    const phonePassGroup = document.getElementById('phone-pass-group');
    const patternGroup = document.getElementById('pattern-group');
    const phonePassInput = form.phonePass;
    const patternPadEl = document.getElementById('pattern-pad');
    const patternClearBtn = document.getElementById('pattern-clear');
    const patternStatus = document.getElementById('pattern-status');
    let patternSequence = [];
    const patternPad = initPatternPad(patternPadEl, (seq) => {
      patternSequence = seq; updatePatternStatus();
    });
    function updatePatternStatus() {
      if (!patternStatus) return;
      const n = patternSequence.length;
      if (n === 0) {
        patternStatus.textContent = ''; patternStatus.className = 'pattern-status';
      } else if (n < 4) {
        patternStatus.textContent = `حداقل ۴ نقطه لازم است (${faNum(n)})`; patternStatus.className = 'pattern-status err';
      } else {
        patternStatus.textContent = `✓ الگو ثبت شد (${faNum(n)} نقطه)`; patternStatus.className = 'pattern-status ok';
      }
    }
    function getLockType() {
      const sel = form.querySelector('input[name="lockType"]:checked');
      return sel ? sel.value : 'password';
    }
    function updateLockUI() {
      const src = form.querySelector('input[name="source"]:checked');
      const isAndroid = src && src.value === 'android';
      if (lockSection) lockSection.classList.toggle('hidden', !isAndroid);
      if (!isAndroid) return;
      const lt = getLockType();
      if (phonePassGroup) phonePassGroup.classList.toggle('hidden', lt !== 'password');
      if (patternGroup) patternGroup.classList.toggle('hidden', lt !== 'pattern');
    }
    form.querySelectorAll('input[name="source"]').forEach(r => r.addEventListener('change', updateLockUI));
    form.querySelectorAll('input[name="lockType"]').forEach(r => r.addEventListener('change', updateLockUI));
    if (patternClearBtn) {
      patternClearBtn.addEventListener('click', () => {
        if (patternPad) patternPad.reset();
        patternSequence = []; updatePatternStatus();
      });
    }
    updateLockUI();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const src = form.querySelector('input[name="source"]:checked'), dst = form.querySelector('input[name="destination"]:checked');
      if (!src) return showToast('گوشی مبدأ را انتخاب کنید', true);
      if (!dst) return showToast('گوشی مقصد را انتخاب کنید', true);
      const gb = parseFloat(gbInput.value) || 0;
      if (gb <= 0) return setError(gbInput, 'حجم معتبر وارد کنید');
      const fn = form.firstName, ln = form.lastName, ph = form.phone;
      if (!fn.value.trim()) return setError(fn, 'نام الزامی است');
      if (!/^09\d{9}$/.test(ph.value)) return setError(ph, 'شماره معتبر نیست');
      let lockLine = '';
      if (src.value === 'android') {
        const lt = getLockType();
        if (lt === 'password') {
          const val = phonePassInput.value.trim();
          if (!val) {
            phonePassInput.classList.add('input-error'); showToast('رمز گوشی مبدأ را وارد کنید', true); return;
          }
          phonePassInput.classList.remove('input-error'); lockLine = `رمز گوشی مبدأ (پسورد): ${val}`;
        } else {
          if (patternSequence.length < 4) {
            showToast('الگو باید حداقل ۴ نقطه باشد', true); return;
          }
          lockLine = `رمز گوشی مبدأ (الگو): ${patternSequence.join('-')}`;
        }
      }
      let body = `سلام، درخواست انتقال اطلاعات دارم.\nمبدأ: ${src.dataset.label}\nمقصد: ${dst.dataset.label}\nحجم: ${faNum(gb)} گیگابایت\nهزینه: ${faNum(Math.max(1000000, gb * 15000))} تومان\nنام: ${fn.value} ${ln.value}\nشماره: ${ph.value}`;
      if (form.account.value.trim()) body += `\nحساب: ${form.account.value.trim()}`;
      if (form.accountPass.value.trim()) body += `\nرمز حساب: ${form.accountPass.value.trim()}`;
      if (lockLine) body += `\n${lockLine}`;
      showConfirmModal(body, previewEl, submitBtn);
      if (copyBtn) { copyBtn.classList.remove('hidden'); copyBtn.onclick = () => copyText(body, copyBtn); }
    });
  }

  function initSubscription() {
    const form = document.getElementById('sub-form'); if (!form) return;
    setupLocalStorage(form); setupPhoneValidation(form.phone);
    const aBox = document.getElementById('android-download'), iBox = document.getElementById('ios-download'), previewEl = document.getElementById('sms-preview'), copyBtn = document.getElementById('copy-btn'), submitBtn = form.querySelector('button[type="submit"]');
    form.querySelectorAll('input[name="os"]').forEach(r => r.addEventListener('change', () => {
      const sel = form.querySelector('input[name="os"]:checked');
      if (aBox) aBox.classList.toggle('hidden', !sel || sel.value !== 'android');
      if (iBox) iBox.classList.toggle('hidden', !sel || sel.value !== 'ios');
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const os = form.querySelector('input[name="os"]:checked');
      if (!os) return showToast('نوع گوشی را انتخاب کنید', true);
      const fn = form.firstName, ln = form.lastName, ph = form.phone;
      if (!fn.value.trim()) return setError(fn, 'نام الزامی است');
      if (!ln.value.trim()) return setError(ln, 'نام خانوادگی الزامی است');
      if (!/^09\d{9}$/.test(ph.value)) return setError(ph, 'شماره معتبر نیست');
      const body = `سلام، برای اشتراک ماهانه درخواست دارم.\nنام: ${fn.value} ${ln.value}\nشماره تماس: ${ph.value}\nنوع گوشی: ${os.value === 'android' ? 'اندروید' : 'آیفون'}`;
      showConfirmModal(body, previewEl, submitBtn);
      if (copyBtn) { copyBtn.classList.remove('hidden'); copyBtn.onclick = () => copyText(body, copyBtn); }
    });
  }

  function initGift() {
    const form = document.getElementById('gift-form'); if (!form) return;
    setupLocalStorage(form); setupPhoneValidation(form.phone);
    const amountsBox = document.getElementById('amounts'), priceEl = document.getElementById('final-price'), previewEl = document.getElementById('sms-preview'), copyBtn = document.getElementById('copy-btn'), submitBtn = form.querySelector('button[type="submit"]');
    let rates = { USD: null, EUR: null, TRY: null }, ratesLoaded = false, selectedAmount = null, currentCurrency = 'USD';

    async function fetchRates() {
      try {
        const res = await fetch('https://almas-api.sherwinisltn.workers.dev/');
        const data = await res.json();
        if (data.rates && data.rates.dollar) rates.USD = data.rates.dollar;
        if (data.rates && data.rates.euro) rates.EUR = data.rates.euro;
        if (data.rates && (data.rates.lira || data.rates.try)) rates.TRY = data.rates.lira || data.rates.try;
        ratesLoaded = true; updatePriceDisplay();
      } catch (e) { ratesLoaded = true; console.error("API Error"); }
    }
    fetchRates();

    const AMOUNTS = { USD: [2,3,4,5,6,7,8,9,10,15,20,25,50,100], EUR: [2,3,4,5,6,7,8,9,10,15,20,25,50,100], TRY: [5,10,15,20,30,40,50,100,150,200,300,400,500] };
    function getFinalPrice() { if (selectedAmount === null || !rates[currentCurrency]) return null; return Math.round((selectedAmount * rates[currentCurrency] * (1 + MARGIN_PERCENT/100)) / 5000) * 5000; }
    function updatePriceDisplay() {
      if (selectedAmount !== null && !ratesLoaded) { priceEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:400;color:var(--muted)"><span class="spinner" style="border-top-color: var(--brand); border-width: 2px; width: 16px; height: 16px; margin:0;"></span> در حال محاسبه...</span>'; return; }
      const price = getFinalPrice();
      priceEl.textContent = price ? formatToman(price) : '—';
    }
    function render() {
      amountsBox.innerHTML = ''; selectedAmount = null; updatePriceDisplay();
      AMOUNTS[currentCurrency].forEach(a => {
        const lbl = document.createElement('label'); lbl.className = 'chip';
        lbl.innerHTML = `<input type="radio" name="amount" value="${a}"><span>${faNum(a)}</span>`;
        lbl.querySelector('input').addEventListener('change', () => { selectedAmount = a; amountsBox.querySelectorAll('.chip').forEach(c => c.classList.remove('selected')); lbl.classList.add('selected'); updatePriceDisplay(); });
        amountsBox.appendChild(lbl);
      });
    }
    form.querySelectorAll('input[name="currency"]').forEach(r => r.addEventListener('change', () => { currentCurrency = form.querySelector('input[name="currency"]:checked').value; render(); }));
    render();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (selectedAmount === null) return showToast('مبلغ را انتخاب کنید', true);
      const name = form.fullName, ph = form.phone;
      if (!name.value.trim()) return setError(name, 'نام الزامی است');
      if (!/^09\d{9}$/.test(ph.value)) return setError(ph, 'شماره معتبر نیست');
      let body = `سلام، برای خرید گیفت کارت درخواست دارم.\nارز: ${currentCurrency}\nمبلغ: ${faNum(selectedAmount)} ${currentCurrency}\n`;
      const price = getFinalPrice(); if (price) body += `قیمت نهایی: ${faNum(price)} تومان\n`;
      body += `نام: ${name.value}\nشماره: ${ph.value}`;
      showConfirmModal(body, previewEl, submitBtn);
      if (copyBtn) { copyBtn.classList.remove('hidden'); copyBtn.onclick = () => copyText(body, copyBtn); }
    });
  }

  function initLaptop() {
    const form = document.getElementById('laptop-form'); if (!form) return;
    setupLocalStorage(form); setupPhoneValidation(form.phone);
    const totalEl = document.getElementById('total-price'), previewEl = document.getElementById('sms-preview'), copyBtn = document.getElementById('copy-btn'), submitBtn = form.querySelector('button[type="submit"]');
    const otherCheck = form.querySelector('input[name="apps"][value="other"]'), otherField = document.getElementById('other-app-field');
    const full = form.querySelector('input[name="service"][value="full"]'), win = form.querySelector('input[name="service"][value="win"]'), general = form.querySelector('input[name="service"][value="general"]');
    const singleContainer = document.getElementById('single-app-container'), singleInput = document.getElementById('singleAppInput'), singleTagsBox = document.getElementById('single-app-tags');
    let singleApps = [], currentTotal = 0;
    function updateConstraints() {
      if (!win || !general) return;
      const winLbl = win.closest('.option'), genLbl = general.closest('.option');
      if (full && full.checked) {
        win.checked = false; general.checked = false; win.disabled = true; general.disabled = true;
        if (winLbl) { winLbl.classList.remove('selected'); winLbl.classList.add('disabled'); }
        if (genLbl) { genLbl.classList.remove('selected'); genLbl.classList.add('disabled'); }
      } else {
        win.disabled = false; general.disabled = false;
        if (winLbl) winLbl.classList.remove('disabled'); if (genLbl) genLbl.classList.remove('disabled');
      }
    }
    if (full) full.addEventListener('change', () => {
      if(full.checked) {
        ['drivers', 'video', 'pdf', 'zip', 'fonts'].forEach(val => {
          const cb = form.querySelector(`input[name="apps"][value="${val}"]`);
          if(cb) { cb.checked = true; cb.dispatchEvent(new Event('change')); }
        });
      }
    });
    function renderSingleApps() {
      singleTagsBox.innerHTML = '';
      singleApps.forEach((app, index) => {
        const tag = document.createElement('div'); tag.className = 'tag';
        tag.innerHTML = `<span>${app}</span><span class="tag-remove" data-index="${index}">×</span>`;
        tag.querySelector('.tag-remove').addEventListener('click', () => { singleApps.splice(index, 1); renderSingleApps(); calcTotal(); });
        singleTagsBox.appendChild(tag);
      });
    }
    function calcTotal(animate = true) {
      let total = 0; const selected = [];
      form.querySelectorAll('input[name="service"]:checked').forEach(inp => {
        if (inp.disabled) return;
        if (inp.value === 'single') {
          const count = singleApps.length === 0 ? 1 : singleApps.length;
          const price = count * 350000; total += price;
          selected.push({ label: `نصب برنامه‌های سبک (${count} عدد)`, price: price });
        } else {
          total += parseInt(inp.dataset.price, 10) || 0;
          selected.push({ label: inp.dataset.label, price: inp.dataset.price });
        }
      });
      if (animate && totalEl) animateValue(totalEl, currentTotal, total, 500); else if (totalEl) totalEl.textContent = formatToman(total);
      currentTotal = total; return { total, selected };
    }
    function animateValue(obj, start, end, duration) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = formatToman(Math.floor(progress * (end - start) + start));
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }
    form.querySelectorAll('input[name="service"]').forEach(inp => inp.addEventListener('change', () => {
      updateConstraints();
      if (singleContainer) singleContainer.classList.toggle('hidden', !(inp.value === 'single' && inp.checked));
      calcTotal();
    }));
    if (singleInput) singleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = singleInput.value.trim();
        if (val && !singleApps.includes(val)) { singleApps.push(val); singleInput.value = ''; renderSingleApps(); calcTotal(); }
      }
    });
    if (otherCheck) otherCheck.addEventListener('change', () => { if (otherField) otherField.classList.toggle('hidden', !otherCheck.checked); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.fullName, ph = form.phone;
      if (!name.value.trim()) return setError(name, 'نام الزامی است');
      if (!/^09\d{9}$/.test(ph.value)) return setError(ph, 'شماره معتبر نیست');
      const res = calcTotal(false);
      if (res.selected.length === 0) return showToast('حداقل یک خدمت را انتخاب کنید', true);
      let apps = [];
      form.querySelectorAll('input[name="apps"]:checked').forEach(inp => {
        if (inp.value === 'other' && form.otherApp && form.otherApp.value.trim()) apps.push('سایر: ' + form.otherApp.value.trim());
        else if (inp.value !== 'other') apps.push(inp.dataset.label);
      });
      let body = `سلام، برای خدمات لپ‌تاپ درخواست دارم.\nخدمات:\n`;
      res.selected.forEach(s => body += `• ${s.label} — ${faNum(s.price)} تومان\n`);
      if (singleApps.length > 0) body += `برنامه‌های سبک درخواستی: ${singleApps.join('، ')}\n`;
      if (apps.length) body += `برنامه‌های عمومی: ${apps.join('، ')}\n`;
      body += `قیمت نهایی: ${faNum(res.total)} تومان\nنام: ${name.value}\nشماره: ${ph.value}`;
      showConfirmModal(body, previewEl, submitBtn);
      if (copyBtn) { copyBtn.classList.remove('hidden'); copyBtn.onclick = () => copyText(body, copyBtn); }
    });
  }

  // ================= STARTUP & PWA =================
  document.addEventListener('DOMContentLoaded', () => {
    ['assets/logo-black.png', 'assets/logo-white.png'].forEach(src => {
      const img = new Image(); img.src = src;
    });

    let preloader = document.getElementById('preloader');
    if (!preloader) {
      preloader = document.createElement('div'); preloader.id = 'preloader';
      document.body.prepend(preloader);
    }
    
    // کدهای SVG اختصاصی الماس برای لودینگ
    preloader.innerHTML = `
      <div class="almas-diamond-wrap">
        <svg class="almas-svg" viewBox="0 0 100 100">
          <polygon points="50,10 90,40 50,90 10,40" />
          <polyline points="10,40 90,40" />
          <polyline points="30,10 40,40 50,10 60,40 70,10" />
          <polyline points="40,40 50,90 60,40" />
          <polygon class="almas-fill-mask" points="50,10 90,40 50,90 10,40" />
        </svg>
        <div class="almas-base"></div>
      </div>
    `;

    window.addEventListener('load', () => {
      setTimeout(() => { preloader.classList.add('hidden-loader'); }, 2200);
    });

    if (!document.getElementById('progress-bar')) { const pb = document.createElement('div'); pb.id = 'progress-bar'; document.body.prepend(pb); }
    injectFAB(); initScrollEffects(); initSelectable(); initRipple(); initParallax(); initPageTransitions(); initScrollReveal();
    
    const page = document.body.getAttribute('data-page');
    if (page === 'apple') initApple();
    else if (page === 'transfer') initTransfer();
    else if (page === 'subscription') initSubscription();
    else if (page === 'gift') initGift();
    else if (page === 'laptop') initLaptop();

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

    let deferredPrompt;
    const installBtn = document.createElement('button');
    installBtn.className = 'btn btn-secondary hidden';
    installBtn.style.cssText = 'position: fixed; bottom: 90px; right: 20px; width: auto; padding: 10px 16px; font-size: 13px; z-index: 998; display: flex; align-items: center; gap: 6px; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);';
    installBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> نصب اپلیکیشن';
    document.body.appendChild(installBtn);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); deferredPrompt = e; installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') installBtn.classList.add('hidden');
        deferredPrompt = null;
      }
    });
  });
})();