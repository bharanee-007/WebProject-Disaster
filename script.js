/* ==========================================================================
   Disaster Management AI - JavaScript File
   Interactions, Mobile Menu, Live Threat Simulator, and Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Navigation Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Hamburger Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // 3. Active Navigation Link Tracker on Scroll (Intersection Observer)
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies mid-viewport
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 4. Scroll Reveal Animations (Fade in elements as user scrolls)
  const animObserverOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters view
    threshold: 0.1
  };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Once animated, we don't need to observe it anymore
        animObserver.unobserve(entry.target);
      }
    });
  }, animObserverOptions);

  const animatedElements = document.querySelectorAll('.scroll-animate');
  animatedElements.forEach(el => animObserver.observe(el));

  // 5. Live Simulation Widget Data & Logic
  const simData = {
    wildfire: {
      severity: 'Critical Threat',
      badgeClass: 'threat-high',
      model: 'DeepConv Wildfire-Net v4.2',
      confidence: '94.7% Confidence',
      action: 'Deploy emergency fire retardant lines in Sector C-4 & alert Zone 2.',
      nodeX: '45%',
      nodeY: '35%',
      nodeClass: 'node-red',
      routePath: 'M 45 35 Q 35 45 25 70 T 10 90',
      successMessage: 'Evacuation Route simulated for Wildfire. Broadcasted geo-targeted emergency alert to Sector C-4 & Zone 2.'
    },
    flood: {
      severity: 'Moderate Alert',
      badgeClass: 'threat-mod',
      model: 'LSTM FlowForecast Res-2',
      confidence: '91.2% Confidence',
      action: 'Open secondary bypass flood gates & deploy sandbags at river embankment.',
      nodeX: '65%',
      nodeY: '55%',
      nodeClass: 'node-orange',
      routePath: 'M 65 55 Q 75 45 80 30 T 95 10',
      successMessage: 'Evacuation Route simulated for Flood. Spillway bypass gates activated & sandbag routing dispatched.'
    },
    earthquake: {
      severity: 'Background Safe',
      badgeClass: 'threat-low',
      model: 'Conv3D SeismicNet',
      confidence: '98.9% Accuracy',
      action: 'Continuous micro-tremor parsing active. Regional structures are reports stable.',
      nodeX: '25%',
      nodeY: '75%',
      nodeClass: 'node-green',
      routePath: 'M 25 75 L 18 68 L 12 72',
      successMessage: 'Seismic stability checkout complete. All local sensor structures reporting operational.'
    }
  };

  const simTabBtns = document.querySelectorAll('.sim-tab-btn');
  const simNode = document.getElementById('sim-node');
  const simRouteLine = document.getElementById('evac-route-line');
  const simThreatLevel = document.getElementById('sim-threat-level');
  const simModelVal = document.getElementById('sim-model-val');
  const simConfidenceVal = document.getElementById('sim-confidence-val');
  const simActionVal = document.getElementById('sim-action-val');
  const simActionBtn = document.getElementById('sim-action-btn');

  let activeDisasterType = 'wildfire';

  const updateSimulationFeed = (type) => {
    activeDisasterType = type;
    const data = simData[type];
    
    // Update active tab buttons
    simTabBtns.forEach(btn => {
      if (btn.getAttribute('data-type') === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Telemetry Panel Texts
    simThreatLevel.innerHTML = `<span class="threat-badge ${data.badgeClass}">${data.severity}</span>`;
    simModelVal.textContent = data.model;
    simConfidenceVal.textContent = data.confidence;
    simActionVal.textContent = data.action;

    // Reset Route animation
    simRouteLine.style.strokeDashoffset = '100';
    simRouteLine.setAttribute('d', '');

    // Move Node point
    simNode.style.left = data.nodeX;
    simNode.style.top = data.nodeY;
    
    // Clear node classes and set active one
    simNode.className = 'sim-alert-node';
    simNode.classList.add(data.nodeClass);

    // Update simulation action button text
    if (type === 'earthquake') {
      simActionBtn.textContent = 'Simulate Seismic Stability Check';
    } else {
      simActionBtn.textContent = 'Simulate Evacuation Routing';
    }
  };

  // Click handler for tab changes
  simTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.target.getAttribute('data-type');
      updateSimulationFeed(type);
    });
  });

  // Action Button Evacuation Simulation Trigger
  simActionBtn.addEventListener('click', () => {
    const data = simData[activeDisasterType];
    
    // Apply SVG path and animate route
    simRouteLine.setAttribute('d', data.routePath);
    // Force reflow
    simRouteLine.getBoundingClientRect();
    // Trigger stroke-dashoffset transition to 0 to simulate routing progress
    simRouteLine.style.strokeDashoffset = '0';

    // Show simulation alert after a short lag representing AI computing time
    setTimeout(() => {
      showToast(data.successMessage, 'success');
    }, 600);
  });

  // Initialize with wildfire
  updateSimulationFeed('wildfire');

  // 6. Contact Form Processing
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameVal = document.getElementById('name').value;
    const emailVal = document.getElementById('email').value;
    const subjectVal = document.getElementById('subject').value;
    
    // Construct mock API sending message
    showToast(`Inquiry regarding "${subjectVal}" sent successfully. Thank you, ${nameVal}!`, 'success');
    
    // Reset inputs
    contactForm.reset();
  });

  // 7. Toast Notification Controller
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set appropriate SVG icons depending on notification type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span style="font-size: 0.85rem; font-weight: 500;">${message}</span>
    `;

    toastContainer.appendChild(toast);
    
    // Force transition repaint
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Fade and slide out after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      // Wait for exit transition to conclude before removing DOM node
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4500);
  };
});

// 8. Learn More Toggler inside Feature Cards
function toggleDetails(featureId) {
  const details = document.getElementById(`details-${featureId}`);
  const trigger = details.nextElementSibling; // The learn-more anchor span
  const textSpan = trigger.querySelector('span');
  const arrowSvg = trigger.querySelector('svg');
  
  if (details.classList.contains('expanded')) {
    details.classList.remove('expanded');
    textSpan.textContent = 'Learn More';
    arrowSvg.style.transform = 'rotate(0deg)';
  } else {
    details.classList.add('expanded');
    textSpan.textContent = 'Show Less';
    arrowSvg.style.transform = 'rotate(90deg)';
  }
}
