const guestName = document.getElementById('guestName');
const openBtn = document.getElementById('openBtn');
const mainContent = document.getElementById('mainContent');
const bgAudio = document.getElementById('bgAudio');
const commentList = document.getElementById('commentList');
const rsvpForm = document.getElementById('rsvpForm');

function decodeGuestName(value) {
  if (!value) return 'Tamu Undangan';
  return decodeURIComponent(value.replace(/\+/g, ' '));
}

const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get('to');
guestName.textContent = decodeGuestName(guest);

openBtn.addEventListener('click', () => {
  mainContent.classList.remove('hidden');
  mainContent.scrollIntoView({ behavior: 'smooth' });
  if (bgAudio) {
    bgAudio.play().catch(() => {
      // Autoplay mungkin diblokir; tidak apa-apa jika gagal
    });
  }
});

function updateCountdown() {
  const eventDate = new Date('2025-05-04T09:00:00');
  const now = new Date();
  const diff = eventDate - now;

  const countdown = document.getElementById('countdown');
  if (!countdown) return;

  if (diff <= 0) {
    countdown.innerHTML = '<div><span>0</span><small>Hari</small></div><div><span>0</span><small>Jam</small></div><div><span>0</span><small>Menit</small></div><div><span>0</span><small>Detik</small></div>';
    return;
  }

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function createCommentItem(name, attendance, message) {
  const item = document.createElement('div');
  item.className = 'comment-item';
  item.innerHTML = `<strong>${name}</strong> - <em>${attendance}</em><p>${message}</p>`;
  return item;
}

function loadComments() {
  const saved = localStorage.getItem('weddingComments');
  if (!saved) return;

  const comments = JSON.parse(saved);
  commentList.innerHTML = '';
  comments.forEach(({ name, attendance, message }) => {
    commentList.appendChild(createCommentItem(name, attendance, message));
  });
}

function saveComment(name, attendance, message) {
  const saved = localStorage.getItem('weddingComments');
  const comments = saved ? JSON.parse(saved) : [];
  comments.unshift({ name, attendance, message });
  localStorage.setItem('weddingComments', JSON.stringify(comments.slice(0, 20)));
}

rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nameInput = document.getElementById('nameInput');
  const messageInput = document.getElementById('messageInput');
  const attendance = document.querySelector('input[name="attendance"]:checked').value;

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    alert('Mohon isi nama dan doa/ucapan terlebih dahulu.');
    return;
  }

  const item = createCommentItem(name, attendance, message);
  commentList.prepend(item);
  saveComment(name, attendance, message);

  nameInput.value = '';
  messageInput.value = '';
});

updateCountdown();
setInterval(updateCountdown, 1000);
loadComments();