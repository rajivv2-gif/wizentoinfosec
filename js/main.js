/**
 * WIZENTO — Master Interactive Engine (Vanilla JavaScript)
 * Zero external library dependencies. 100% portable on any static server or cPanel.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initHashScroll();
  initScrollToTop();
  initWhatsAppWidget();
  initConsultationModal();
  initShareSectionButtons();
  initPostureChecklist();
  initScopeEstimator();
  initAuditScorecard();
  initTechRadar();
  initProcurementFAQ();
});

/* ==========================================================================
   1. STICKY HEADER & ACTIVE NAV
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. HASH-AWARE DEEP-LINK SCROLLING
   ========================================================================== */
function initHashScroll() {
  const scrollToHash = () => {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const headerOffset = 84;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Scroll on load if hash exists
  if (window.location.hash) {
    setTimeout(scrollToHash, 180);
  }

  // Intercept all in-page anchor links for smooth scrolling with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (hash && hash !== '#') {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          const headerOffset = 84;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          history.pushState(null, '', hash);
        }
      }
    });
  });
}

/* ==========================================================================
   4. TOAST NOTIFICATIONS & SECTION SHARING SYSTEM
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('wizento-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'wizento-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #091527;
      color: #FFFFFF;
      padding: 0.75rem 1.25rem;
      border-radius: 999px;
      border: 1px solid #22D3EE;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(34,211,238,0.2);
      font-size: 0.84375rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 10000;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
  }, 2600);
}

function copySectionLink(sectionId, sectionTitle) {
  const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast(`Link to "${sectionTitle}" copied to clipboard!`);
    }).catch(() => {
      fallbackCopy(url, sectionTitle);
    });
  } else {
    fallbackCopy(url, sectionTitle);
  }

  if (window.history.replaceState) {
    window.history.replaceState(null, '', `#${sectionId}`);
  }
}

function shareSectionOnWhatsApp(sectionId, sectionTitle) {
  const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
  const text = encodeURIComponent(`Review this specific section on Wizento: "${sectionTitle}"\n${url}`);
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
}

function fallbackCopy(text, title) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(`Link to "${title}" copied!`);
}

function initShareSectionButtons() {
  document.querySelectorAll('[data-share-section]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = btn.getAttribute('data-share-section');
      const sectionTitle = btn.getAttribute('data-share-title') || 'Wizento Advisory Section';
      copySectionLink(sectionId, sectionTitle);
    });
  });
}

/* ==========================================================================
   5. SCROLL TO TOP & SCROLL PROGRESS
   ========================================================================== */
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
      btn.style.transform = 'translateY(10px)';
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   6. WHATSAPP FLOATING WIDGET
   ========================================================================== */
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('whatsapp-toggle-btn');
  const popup = document.getElementById('whatsapp-popup');
  const closeBtn = document.getElementById('whatsapp-popup-close');

  if (!toggleBtn || !popup) return;

  toggleBtn.addEventListener('click', () => {
    const isVisible = popup.style.display === 'block';
    popup.style.display = isVisible ? 'none' : 'block';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }
}

/* ==========================================================================
   7. CONSULTATION & INTAKE MODAL
   ========================================================================== */
function initConsultationModal() {
  const modal = document.getElementById('consultation-modal');
  if (!modal) return;

  window.openConsultationModal = function(pillar = 'integrated', prefilledTopic = '') {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const pillarSelect = modal.querySelector('select[name="areaOfInterest"]');
    if (pillarSelect) pillarSelect.value = pillar;

    if (prefilledTopic) {
      const scopeArea = modal.querySelector('textarea[name="projectScope"]');
      if (scopeArea) scopeArea.value = prefilledTopic;
    }
  };

  window.closeConsultationModal = function() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeConsultationModal();
  });

  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', window.closeConsultationModal);

  const form = modal.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Logging Request...</span>';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        showToast('Consultation request logged! A Wizento partner will contact you within 24 hours.');
        window.closeConsultationModal();
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span>Request Partner Consultation</span>';
          submitBtn.disabled = false;
        }
      }, 700);
    });
  }
}

/* ==========================================================================
   8. 60-SECOND POSTURE CHECKLIST (INTERACTIVE DIAGNOSTIC)
   ========================================================================== */
function initPostureChecklist() {
  const checklist = document.getElementById('posture-checklist-root');
  if (!checklist) return;

  const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
  const scoreDisplay = document.getElementById('posture-score-display');
  const tierBadge = document.getElementById('posture-tier-badge');
  const remedyText = document.getElementById('posture-remedy-text');

  function updatePosture() {
    let checkedCount = 0;
    checkboxes.forEach(cb => { if (cb.checked) checkedCount++; });

    const total = checkboxes.length || 8;
    const scorePct = Math.round((checkedCount / total) * 100);

    if (scoreDisplay) scoreDisplay.textContent = `${scorePct}%`;

    if (tierBadge) {
      if (scorePct >= 80) {
        tierBadge.textContent = 'RESILIENT POSTURE';
        tierBadge.style.color = '#10B981';
        tierBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        tierBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      } else if (scorePct >= 50) {
        tierBadge.textContent = 'MODERATE EXPOSURE';
        tierBadge.style.color = '#F59E0B';
        tierBadge.style.background = 'rgba(245, 158, 11, 0.15)';
        tierBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
      } else {
        tierBadge.textContent = 'CRITICAL GAPS DETECTED';
        tierBadge.style.color = '#EF4444';
        tierBadge.style.background = 'rgba(239, 68, 68, 0.15)';
        tierBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      }
    }

    if (remedyText) {
      if (scorePct >= 80) {
        remedyText.textContent = 'Strong fundamental hygiene. Focus on ongoing continuous compliance automation (SOC 2 continuous monitoring) and quarterly pentest validation.';
      } else if (scorePct >= 50) {
        remedyText.textContent = 'Several foundational controls unverified. An external auditor or prospective enterprise customer will likely flag TPRM or MFA enforcement gaps.';
      } else {
        remedyText.textContent = 'Urgent risk profile. Unverified offboarding, single-region cloud, or missing incident runbooks create significant vulnerability to operational outage.';
      }
    }
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updatePosture));
  updatePosture();
}

/* ==========================================================================
   9. ADVISORY SCOPE & BUDGET ESTIMATOR
   ========================================================================== */
function initScopeEstimator() {
  const root = document.getElementById('scope-estimator-root');
  if (!root) return;

  let currency = 'INR';
  let persona = 'growth'; // startup, growth, enterprise
  let selectedCaps = ['iam', 'cloud', 'soc2', 'incident'];

  const currencyBtns = root.querySelectorAll('.currency-toggle-btn');
  const personaBtns = root.querySelectorAll('.persona-btn');
  const capCheckboxes = root.querySelectorAll('.scope-cap-checkbox');
  const feeDisplay = document.getElementById('estimator-fee-display');
  const hoursDisplay = document.getElementById('estimator-hours-display');
  const durationDisplay = document.getElementById('estimator-duration-display');

  const capHours = {
    iam: 35, cloud: 45, soc2: 60, incident: 30,
    network: 40, finops: 25, bi: 40, tprm: 25
  };

  const personaMultipliers = {
    startup: 0.85,
    growth: 1.0,
    enterprise: 1.4
  };

  function recalculate() {
    let totalHours = 0;
    capCheckboxes.forEach(cb => {
      if (cb.checked) {
        const capId = cb.value;
        totalHours += (capHours[capId] || 30);
      }
    });

    const multiplier = personaMultipliers[persona] || 1.0;
    const finalHours = Math.round(totalHours * multiplier);

    if (hoursDisplay) hoursDisplay.textContent = `${finalHours} Hrs`;
    if (durationDisplay) {
      durationDisplay.textContent = finalHours > 120 ? '8–12 Weeks' : finalHours > 60 ? '4–6 Weeks' : '2–4 Weeks';
    }

    if (feeDisplay) {
      if (currency === 'INR') {
        const rateINR = 6500;
        const totalINR = finalHours * rateINR;
        const lakhs = (totalINR / 100000).toFixed(1);
        feeDisplay.textContent = `₹${lakhs} Lakhs`;
      } else {
        const rateUSD = 95;
        const totalUSD = finalHours * rateUSD;
        feeDisplay.textContent = `$${totalUSD.toLocaleString()}`;
      }
    }
  }

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currency = btn.getAttribute('data-currency') || 'INR';
      recalculate();
    });
  });

  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      personaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      persona = btn.getAttribute('data-persona') || 'growth';
      recalculate();
    });
  });

  capCheckboxes.forEach(cb => cb.addEventListener('change', recalculate));
  recalculate();
}

/* ==========================================================================
   10. ISO 27001 / SOC 2 AUDIT READINESS SCORECARD
   ========================================================================== */
function initAuditScorecard() {
  const root = document.getElementById('audit-scorecard-root');
  if (!root) return;

  const radioInputs = root.querySelectorAll('input[type="radio"]');
  const scoreValue = document.getElementById('scorecard-gauge-value');
  const scoreCircle = document.getElementById('scorecard-gauge-circle');
  const riskBadge = document.getElementById('scorecard-risk-badge');
  const gapsList = document.getElementById('scorecard-gaps-list');

  function updateScorecard() {
    let totalScore = 0;
    let answeredCount = 0;
    const gaps = [];

    const domains = ['iam', 'cloud', 'tprm', 'incident', 'vuln', 'policy'];
    domains.forEach(d => {
      const selected = root.querySelector(`input[name="domain_${d}"]:checked`);
      if (selected) {
        const score = parseInt(selected.value, 10);
        totalScore += score;
        answeredCount++;

        if (score === 0) {
          gaps.push({ domain: selected.getAttribute('data-domain-title'), note: 'Major Non-Conformity (Critical Gap)' });
        } else if (score === 50) {
          gaps.push({ domain: selected.getAttribute('data-domain-title'), note: 'Partial Evidence / Auditor Exception Risk' });
        }
      }
    });

    const maxScore = domains.length * 100;
    const pct = Math.round((totalScore / maxScore) * 100);

    if (scoreValue) scoreValue.textContent = `${pct}%`;

    if (scoreCircle) {
      // Stroke dashoffset for SVG circle (circumference = 283)
      const circumference = 283;
      const offset = circumference - (pct / 100) * circumference;
      scoreCircle.style.strokeDashoffset = offset;
      scoreCircle.style.stroke = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';
    }

    if (riskBadge) {
      if (pct >= 80) {
        riskBadge.textContent = 'AUDIT READY (PASS PROBABLE)';
        riskBadge.style.color = '#10B981';
        riskBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      } else if (pct >= 50) {
        riskBadge.textContent = 'MODERATE AUDIT RISK';
        riskBadge.style.color = '#F59E0B';
        riskBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      } else {
        riskBadge.textContent = 'HIGH AUDIT FAILURE RISK';
        riskBadge.style.color = '#EF4444';
        riskBadge.style.background = 'rgba(239, 68, 68, 0.15)';
      }
    }

    if (gapsList) {
      if (gaps.length === 0) {
        gapsList.innerHTML = '<li style="color: #10B981;">✓ All controls configured to audit-grade pass standards.</li>';
      } else {
        gapsList.innerHTML = gaps.map(g => `
          <li style="margin-bottom: 0.5rem; color: #CBD5E1; font-size: 0.8125rem;">
            <strong style="color: #EF4444;">${g.domain}:</strong> ${g.note}
          </li>
        `).join('');
      }
    }
  }

  radioInputs.forEach(r => r.addEventListener('change', updateScorecard));
  updateScorecard();
}

/* ==========================================================================
   11. VENDOR-NEUTRAL TECHNOLOGY RADAR
   ========================================================================== */
function initTechRadar() {
  const root = document.getElementById('tech-radar-root');
  if (!root) return;

  const searchInput = document.getElementById('tech-radar-search');
  const catBtns = root.querySelectorAll('.tech-cat-btn');
  const cards = root.querySelectorAll('.tech-platform-card');

  let currentCategory = 'all';
  let currentSearch = '';

  function filterCards() {
    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchesCat = currentCategory === 'all' || cardCat === currentCategory;
      const matchesSearch = !currentSearch || cardText.includes(currentSearch);

      card.style.display = (matchesCat && matchesSearch) ? 'flex' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      filterCards();
    });
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      filterCards();
    });
  });

  // SaaS Redundancy Analyzer Toggle
  const toggleAnalyzerBtn = document.getElementById('toggle-analyzer-btn');
  const analyzerPanel = document.getElementById('analyzer-panel');
  if (toggleAnalyzerBtn && analyzerPanel) {
    toggleAnalyzerBtn.addEventListener('click', () => {
      const isVisible = analyzerPanel.style.display === 'block';
      analyzerPanel.style.display = isVisible ? 'none' : 'block';
      toggleAnalyzerBtn.textContent = isVisible ? 'Check Stack for Costly Redundancy' : 'Close Redundancy Analyzer';
    });
  }
}

/* ==========================================================================
   12. PROCUREMENT & LEGAL FAQ ACCORDION
   ========================================================================== */
function initProcurementFAQ() {
  const root = document.getElementById('procurement-faq-root');
  if (!root) return;

  const items = root.querySelectorAll('.proc-accordion-item');
  const catBtns = root.querySelectorAll('.proc-cat-btn');
  const searchInput = document.getElementById('proc-search-input');

  let currentCat = 'all';
  let currentSearch = '';

  function filterItems() {
    items.forEach(item => {
      const cat = item.getAttribute('data-category');
      const text = item.textContent.toLowerCase();

      const matchesCat = currentCat === 'all' || cat === currentCat;
      const matchesSearch = !currentSearch || text.includes(currentSearch);

      item.style.display = (matchesCat && matchesSearch) ? 'block' : 'none';
    });
  }

  items.forEach(item => {
    const trigger = item.querySelector('.proc-accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.getAttribute('data-category') || 'all';
      filterItems();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      filterItems();
    });
  }
}
