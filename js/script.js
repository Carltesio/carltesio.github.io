async function loadComponent(selector, file) {
  const slot = document.querySelector(selector);
  const response = await fetch(file);
  const html = await response.text();
  slot.innerHTML = html;
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(el => obs.observe(el));
}

function initConnectForm() {
  const toggle = document.getElementById('connectToggle');
  const panel = document.getElementById('connectPanel');
  const form = document.getElementById('connectForm');
  const emailInput = document.getElementById('connectEmail');
  const sendButton = document.getElementById('connectSend');
  const messageInput = document.getElementById('connectMessage');
  const topicInputs = Array.from(document.querySelectorAll('input[name="topic"]'));

  if (!toggle || !panel || !form || !emailInput || !sendButton || !messageInput) return;

  toggle.addEventListener('click', () => {
    const isHidden = panel.hasAttribute('hidden');

    if (isHidden) {
      panel.removeAttribute('hidden');
      emailInput.focus();
    } else {
      panel.setAttribute('hidden', '');
    }
  });

  function getSelectedTopic() {
    const selected = topicInputs.find(input => input.checked);
    return selected ? selected.value : '';
  }

  function isValidEmail(value) {
    return emailInput.checkValidity() && value.trim() !== '';
  }

  function updateFormState() {
    const email = emailInput.value.trim();
    const topic = getSelectedTopic();
    const enabled = isValidEmail(email) && topic !== '';

    sendButton.disabled = !enabled;

    if (enabled) {
      messageInput.value = `${email} wants to connect with you regarding: ${topic}`;
    } else {
      messageInput.value = '';
    }
  }

  emailInput.addEventListener('input', updateFormState);
  topicInputs.forEach(input => input.addEventListener('change', updateFormState));

  form.addEventListener('submit', () => {
    const email = emailInput.value.trim();
    const topic = getSelectedTopic();
    messageInput.value = `${email} wants to connect with you regarding: ${topic}`;
  });

  updateFormState();
}

async function initPage() {
  await Promise.all([
    loadComponent('#hero-slot', 'components/hero.html'),
    loadComponent('#about-slot', 'components/about.html'),
    loadComponent('#gait-slot', 'components/gait.html'),
    loadComponent('#footer-slot', 'components/footer.html')
  ]);

  initRevealAnimations();
  initConnectForm();
}

initPage();