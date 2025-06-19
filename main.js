// Loader Page logic with animated bar and percentage
window.addEventListener('DOMContentLoaded', () => {
  const loaderPage = document.getElementById('loader-page');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const mainContent = document.getElementById('main-content');
  const duration = 3400; // ms
  let start = null;

  function animateLoaderBar(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const percent = Math.min(100, Math.round((elapsed / duration) * 100));
    if (loaderBar) loaderBar.style.width = percent + '%';
    if (loaderPercent) loaderPercent.textContent = percent + '%';
    if (elapsed < duration) {
      requestAnimationFrame(animateLoaderBar);
    } else {
      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderPercent) loaderPercent.textContent = '100%';
      setTimeout(() => {
        loaderPage.style.opacity = 0;
        setTimeout(() => {
          loaderPage.style.display = 'none';
          mainContent.style.display = 'block';
        }, 600);
      }, 300);
    }
  }
  if (loaderPage && loaderBar && loaderPercent) {
    requestAnimationFrame(animateLoaderBar);
  } else {
    // fallback: just hide loader after duration
    setTimeout(() => {
      loaderPage.style.opacity = 0;
      setTimeout(() => {
        loaderPage.style.display = 'none';
        mainContent.style.display = 'block';
      }, 600);
    }, duration);
  }
});

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const setTheme = (theme) => {
  document.body.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
};
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else if (prefersDark) {
  setTheme('dark');
}
themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Smooth scroll for nav links (native, fallback for all browsers)
const navLinks = document.querySelectorAll('#navbar a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Back to Top Button (smooth scroll)
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}, { passive: true });
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Throttle scroll-based animations for performance
function throttle(fn, wait) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Throttle stats counter animation trigger
let statsAnimated = false;
window.addEventListener('scroll', throttle(() => {
  const statsSection = document.getElementById('stats');
  if (!statsAnimated && statsSection && statsSection.getBoundingClientRect().top < window.innerHeight - 100) {
    animateCounters();
    statsAnimated = true;
  }
}, 100), { passive: true });

// Animated Counters
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = Math.ceil(target / 60);
      if (count < target) {
        counter.innerText = Math.min(count + increment, target);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
}

// Testimonials Slider
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
let testimonialIndex = 0;
function showTestimonial(idx) {
  testimonials.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}
if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(testimonialIndex);
  });
  nextBtn.addEventListener('click', () => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    showTestimonial(testimonialIndex);
  });
}
showTestimonial(testimonialIndex);

// --- Memory Card Game (Start/Restart logic) ---
const startBtn = document.getElementById('start-game');
const restartBtn = document.getElementById('restart-game');
const memoryGameWrapper = document.getElementById('memory-game-wrapper');
const memoryGameGrid = document.getElementById('memory-game');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const lastScoreContainer = document.getElementById('last-score-container');

const cardFaces = ['🎮','⚡','🏆','👑','⭐','🛡️','🎲','🕹️','🎯','💎']; // 10 pairs, 20 cards
let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameActive = false;
let gameStarted = false;
let lastScore = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showGameControls(start = true) {
  if (startBtn) startBtn.style.display = start ? '' : 'none';
  if (restartBtn) restartBtn.style.display = start ? 'none' : '';
  if (memoryGameWrapper) memoryGameWrapper.style.opacity = start ? 0.5 : 1;
}

function startGame() {
  // Reset
  cards = shuffle([...cardFaces, ...cardFaces]);
  memoryGameGrid.innerHTML = '';
  flipped = [];
  matched = 0;
  moves = 0;
  timer = 0;
  gameActive = false;
  gameStarted = false;
  movesDisplay.textContent = 'Moves: 0';
  timerDisplay.textContent = 'Time: 0s';
  if (timerInterval) clearInterval(timerInterval);
  showLastScore();
  showGameControls(true);
  // Create cards (disabled until start)
  cards.forEach((face, idx) => {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.setAttribute('aria-label', 'Memory card');
    card.setAttribute('tabindex', '0');
    card.disabled = true;
    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-front">${face}</div>
        <div class="memory-card-back">?</div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card, face));
    memoryGameGrid.appendChild(card);
  });
}

function beginGame() {
  gameActive = true;
  gameStarted = true;
  showGameControls(false);
  // Enable cards
  memoryGameGrid.querySelectorAll('.memory-card').forEach(card => { card.disabled = false; });
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (gameActive) {
      timer++;
      timerDisplay.textContent = `Time: ${timer}s`;
    }
  }, 1000);
}

function flipCard(card, face) {
  if (!gameActive || card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length === 2) return;
  card.classList.add('flipped');
  flipped.push({card, face});
  if (flipped.length === 2) {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    if (flipped[0].face === flipped[1].face) {
      flipped[0].card.classList.add('matched');
      flipped[1].card.classList.add('matched');
      matched += 2;
      flipped = [];
      if (matched === cards.length) {
        gameActive = false;
        clearInterval(timerInterval);
        lastScore = {moves, time: timer};
        showLastScore();
        showGameControls(true);
      }
    } else {
      setTimeout(() => {
        flipped[0].card.classList.remove('flipped');
        flipped[1].card.classList.remove('flipped');
        flipped = [];
      }, 900);
    }
  }
}

function showLastScore() {
  if (lastScore) {
    lastScoreContainer.innerHTML = `<span>Last Game: ${lastScore.moves} moves, ${lastScore.time}s</span>`;
  } else {
    lastScoreContainer.innerHTML = '';
  }
}

if (startBtn) startBtn.addEventListener('click', () => {
  beginGame();
});
if (restartBtn) restartBtn.addEventListener('click', () => {
  if (gameActive) clearInterval(timerInterval);
  startGame();
});

// Start game on load (but not active until user clicks Start)
if (memoryGameGrid) startGame();

// Hamburger/Sidebar Navigation (hamburger toggles open/close)
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
let sidebarOverlay = document.querySelector('.sidebar-overlay');
if (!sidebarOverlay) {
  sidebarOverlay = document.createElement('div');
  sidebarOverlay.className = 'sidebar-overlay';
  document.body.appendChild(sidebarOverlay);
}
function openSidebar() {
  sidebar.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close navigation');
  sidebar.focus();
  sidebarOverlay.style.display = 'block';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  sidebarOverlay.style.display = 'none';
}
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}
sidebarOverlay.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    closeSidebar();
  }
});
// Close sidebar on link click
sidebar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeSidebar);
});
// Keyboard accessibility: ESC to close
sidebar.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});
// Trap focus inside sidebar when open
sidebar.addEventListener('keydown', e => {
  if (!sidebar.classList.contains('open')) return;
  const focusable = sidebar.querySelectorAll('a,button');
  const first = focusable[0];
  const last = focusable[focusable.length-1];
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
});

// --- 3D Animated Background Canvas ---
const bgCanvas = document.getElementById('bg-canvas');
if (bgCanvas) {
  let ctx = bgCanvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  let particles = [];
  let theme = () => document.body.classList.contains('dark') ? 'dark' : 'light';
  function resizeCanvas() {
    w = window.innerWidth; h = window.innerHeight;
    bgCanvas.width = w; bgCanvas.height = h;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  function createParticles() {
    particles = [];
    for (let i = 0; i < 32; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1 + 0.5,
        r: Math.random() * 2 + 1.5,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7
      });
    }
  }
  createParticles();
  function drawParticles() {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.z, 0, 2 * Math.PI);
      ctx.fillStyle = theme() === 'dark' ? '#00ffe7' : '#0070f3';
      ctx.shadowColor = theme() === 'dark' ? '#00ffe7' : '#0070f3';
      ctx.shadowBlur = 16 * p.z;
      ctx.fill();
      ctx.restore();
      // Move
      p.x += p.dx * p.z;
      p.y += p.dy * p.z;
      // Wrap
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
  // Recreate on theme change
  const observer = new MutationObserver(createParticles);
  observer.observe(document.body, {attributes: true, attributeFilter: ['class']});
}

// --- Social Dashboard Logic ---
// Sample gamer profiles
const sampleProfiles = [
  { id: 1, name: 'Blaze', tag: '@blaze', fav: 'FPS', icon: '👑' },
  { id: 2, name: 'PixelQueen', tag: '@pixelq', fav: 'RPG', icon: '⚡' },
  { id: 3, name: 'ShadowStrike', tag: '@shadow', fav: 'Battle Royale', icon: '🏆' },
  { id: 4, name: 'Nova', tag: '@nova', fav: 'MOBA', icon: '🎮' },
  { id: 5, name: 'Ace', tag: '@ace', fav: 'Strategy', icon: '🛡️' }
];

// Community Feed
const feedForm = document.getElementById('feed-form');
const feedInput = document.getElementById('feed-input');
const feedList = document.getElementById('feed-list');
let feedPosts = JSON.parse(localStorage.getItem('arenaFeed') || '[]');
function renderFeed() {
  feedList.innerHTML = feedPosts.map(post => `
    <div class="feed-card">
      ${post.text}
      <div class="feed-meta">${post.time}</div>
    </div>
  `).join('');
}
if (feedForm) {
  feedForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = feedInput.value.trim();
    if (!text) return;
    const post = { text, time: new Date().toLocaleString() };
    feedPosts.push(post);
    localStorage.setItem('arenaFeed', JSON.stringify(feedPosts));
    feedInput.value = '';
    renderFeed();
  });
  renderFeed();
}

// Gamer Profiles
const profilesList = document.getElementById('profiles-list');
const friendsList = document.getElementById('friends-list');
let friends = JSON.parse(localStorage.getItem('arenaFriends') || '[]');
function renderProfiles() {
  profilesList.innerHTML = sampleProfiles.map(profile => {
    const isFriend = friends.some(f => f.id === profile.id);
    return `<div class="profile-card">
      <span class="profile-avatar">${profile.icon}</span>
      <div class="profile-info">
        <span class="profile-name">${profile.name}</span>
        <span class="profile-tag">${profile.tag}</span>
        <span class="profile-fav">Fav: ${profile.fav}</span>
      </div>
      <button class="add-friend" data-id="${profile.id}" ${isFriend ? 'disabled' : ''}>${isFriend ? 'Friend' : 'Add Friend'}</button>
    </div>`;
  }).join('');
  // Add friend listeners
  profilesList.querySelectorAll('.add-friend').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = +btn.getAttribute('data-id');
      const profile = sampleProfiles.find(p => p.id === id);
      if (profile && !friends.some(f => f.id === id)) {
        friends.push(profile);
        localStorage.setItem('arenaFriends', JSON.stringify(friends));
        renderProfiles();
        renderFriends();
      }
    });
  });
}
function renderFriends() {
  friendsList.innerHTML = friends.length === 0 ? '<div>No friends yet.</div>' : friends.map(friend => `
    <div class="friend-card">
      <span class="friend-avatar">${friend.icon}</span>
      <div class="friend-info">
        <span class="friend-name">${friend.name}</span>
        <span class="friend-tag">${friend.tag}</span>
        <span class="friend-fav">Fav: ${friend.fav}</span>
      </div>
      <button class="open-chat" data-id="${friend.id}">Chat</button>
      <button class="remove-friend" data-id="${friend.id}">Remove</button>
    </div>
  `).join('');
  // Remove friend listeners
  friendsList.querySelectorAll('.remove-friend').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = +btn.getAttribute('data-id');
      friends = friends.filter(f => f.id !== id);
      localStorage.setItem('arenaFriends', JSON.stringify(friends));
      renderProfiles();
      renderFriends();
    });
  });
  // Open chat listeners
  friendsList.querySelectorAll('.open-chat').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = +btn.getAttribute('data-id');
      openChatModal(id);
    });
  });
}
if (profilesList && friendsList) {
  renderProfiles();
  renderFriends();
}

// Chat/DM Modal
const chatModal = document.getElementById('chat-modal');
const chatClose = document.getElementById('chat-close');
const chatUser = document.getElementById('chat-user');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
let currentChatId = null;
function openChatModal(id) {
  const friend = friends.find(f => f.id === id);
  if (!friend) return;
  currentChatId = id;
  chatUser.textContent = friend.name;
  chatModal.style.display = 'flex';
  renderChatMessages();
  setTimeout(() => { chatInput && chatInput.focus(); }, 200);
}
function closeChatModal() {
  chatModal.style.display = 'none';
  currentChatId = null;
}
function getChatKey(id) { return `arenaChat_${id}`; }
function renderChatMessages() {
  if (!currentChatId) return;
  const msgs = JSON.parse(localStorage.getItem(getChatKey(currentChatId)) || '[]');
  chatMessages.innerHTML = msgs.map(m => `<div class="chat-message${m.me ? ' me' : ''}">${m.text}</div>`).join('');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
if (chatClose) chatClose.addEventListener('click', closeChatModal);
if (chatForm) {
  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || !currentChatId) return;
    const msgs = JSON.parse(localStorage.getItem(getChatKey(currentChatId)) || '[]');
    msgs.push({ text, me: true });
    localStorage.setItem(getChatKey(currentChatId), JSON.stringify(msgs));
    chatInput.value = '';
    renderChatMessages();
  });
}
// ESC to close chat
if (chatModal) {
  chatModal.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeChatModal();
  });
} 