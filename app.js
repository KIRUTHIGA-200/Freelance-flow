// Seed Users & Initial Data
const SEED_USERS = [
  {
    id: 'u_1',
    role: 'freelancer',
    name: 'Gayathri T',
    email: 'gayathri@example.com',
    headline: 'Java Developer | Spring Boot & React',
    skills: ['Java', 'Spring Boot', 'React.js', 'MySQL'],
    rate: 500,
    location: 'Villupuram, TN',
    bio: 'B.Tech IT student proficient in Java backend services.'
  },
  {
    id: 'u_2',
    role: 'freelancer',
    name: 'Arun Kumar',
    email: 'arun@example.com',
    headline: 'UI/UX Designer & Frontend Dev',
    skills: ['Figma', 'HTML/CSS', 'JavaScript'],
    rate: 400,
    location: 'Chennai, TN',
    bio: 'Designing slick user interfaces and modern websites.'
  },
  {
    id: 'org_1',
    role: 'organization',
    name: 'Mailam Engineering College',
    email: 'itdept@mailam.edu.in',
    headline: 'Higher Education Institution',
    skills: ['Java Workshops', 'Hackathons'],
    rate: 0,
    location: 'Villupuram, TN',
    bio: 'Academic institution offering freelance tech contracts.'
  },
  {
    id: 'org_2',
    role: 'organization',
    name: 'Abc solutions',
    email: 'contact@abcsolutions.com',
    headline: 'Software Solutions Enterprise',
    skills: ['Full Stack Development', 'Cloud Consulting'],
    rate: 0,
    location: 'Chennai, TN',
    bio: 'Enterprise software solution providers.'
  }
];

const SEED_POSTS = [
  { id: 'p_1', authorId: 'org_1', content: '📢 Looking for freelance instructors to host a Spring Boot workshop!', timestamp: '2 hours ago' },
  { id: 'p_2', authorId: 'u_1', content: '🚀 Completed building a full-stack civic issue tracker project using Node.js & MongoDB!', timestamp: '5 hours ago' },
  { id: 'p_3', authorId: 'u_2', content: '🎨 Designing new UI components in Figma. Available for freelance design projects!', timestamp: '1 day ago' }
];

let state = JSON.parse(localStorage.getItem('freelanceFlowData_v8')) || {
  currentUser: null,
  users: SEED_USERS,
  gigs: [
    { id: 'g_1', orgId: 'org_1', title: 'Spring Boot Contract Module', description: 'Develop REST endpoints and API security.', budget: 15000 }
  ],
  applications: [],
  posts: SEED_POSTS,
  messages: [],
  activeChatUserId: null,
  timeLogs: []
};

function saveState() {
  localStorage.setItem('freelanceFlowData_v8', JSON.stringify(state));
  if (state.currentUser) renderAll();
}

// USER DROPDOWN TOGGLE & SWITCHING
window.toggleUserMenu = function() {
  const dropdown = document.getElementById('user-menu-dropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
};

document.addEventListener('click', (e) => {
  const container = document.querySelector('.user-badge-container');
  const dropdown = document.getElementById('user-menu-dropdown');
  if (container && dropdown && !container.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

window.switchUserAccount = function(userId) {
  const targetUser = state.users.find(u => u.id === userId);
  if (targetUser) {
    state.currentUser = targetUser;
    state.activeChatUserId = null;
    const dropdown = document.getElementById('user-menu-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
    saveState();
  }
};

// AUTHENTICATION TAB SWITCHING
window.switchAuthTab = function(type) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

  if (type === 'login') {
    document.getElementById('tab-login-btn').classList.add('active');
    document.getElementById('login-form').classList.add('active');
  } else {
    document.getElementById('tab-register-btn').classList.add('active');
    document.getElementById('register-form').classList.add('active');
    applyRegisterPlaceholders();
  }
};

function applyRegisterPlaceholders() {
  const roleSelect = document.getElementById('reg-role');
  if (!roleSelect) return;
  const role = roleSelect.value;
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const headlineInput = document.getElementById('reg-headline');
  const rateInput = document.getElementById('reg-rate');

  if (role === 'freelancer') {
    nameInput.placeholder = "Full Name (e.g., Gayathri T)";
    emailInput.placeholder = "Email Address";
    headlineInput.placeholder = "Headline (e.g., Java Developer)";
    rateInput.placeholder = "Hourly Rate in ₹ (e.g., 500)";
  } else {
    nameInput.placeholder = "Entity Title (e.g., Abc solutions)";
    emailInput.placeholder = "Official Email Address";
    headlineInput.placeholder = "Industry (e.g., Enterprise Tech)";
    rateInput.placeholder = "Average Hourly Budget in ₹";
  }
}

// FIXED LOGIN FORM HANDLER
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const inputElem = document.getElementById('login-email');
  const email = inputElem.value.trim().toLowerCase();

  if (!email) {
    alert('Please enter an email address.');
    return;
  }

  // Case-insensitive user lookup
  const user = state.users.find(u => u.email.trim().toLowerCase() === email);

  if (user) {
    state.currentUser = user;
    saveState();
    showWorkspace();
  } else {
    alert(`No account found for "${email}". Please check the spelling or register below.`);
    switchAuthTab('register');
    document.getElementById('reg-email').value = email;
  }
});

// REGISTER FORM HANDLER
document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const role = document.getElementById('reg-role').value;
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const headline = document.getElementById('reg-headline').value.trim();
  const rate = Math.round(parseFloat(document.getElementById('reg-rate').value) || 0);

  if (!name || !email) {
    return alert('Please enter both Name and Email.');
  }

  if (state.users.some(u => u.email.trim().toLowerCase() === email)) {
    alert('This email is already registered! Redirecting to login...');
    switchAuthTab('login');
    document.getElementById('login-email').value = email;
    return;
  }

  const newUser = {
    id: 'u_' + Date.now(),
    role,
    name,
    email,
    headline,
    skills: [],
    rate,
    location: '',
    bio: ''
  };

  state.users.push(newUser);
  state.currentUser = newUser;
  saveState();
  showWorkspace();
});

document.getElementById('btn-logout-menu').addEventListener('click', () => {
  state.currentUser = null;
  localStorage.setItem('freelanceFlowData_v8', JSON.stringify(state));
  const dropdown = document.getElementById('user-menu-dropdown');
  if (dropdown) dropdown.classList.add('hidden');
  document.getElementById('app-workspace').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('login-email').value = '';
});

function showWorkspace() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-workspace').classList.remove('hidden');
  renderAll();
}

// PROFILE EDITING
document.getElementById('profile-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const u = state.currentUser;
  u.role = document.getElementById('prof-role').value;
  u.name = document.getElementById('prof-name').value.trim();
  u.headline = document.getElementById('prof-headline').value.trim();
  u.skills = document.getElementById('prof-skills').value.split(',').map(s => s.trim()).filter(Boolean);
  u.rate = Math.round(parseFloat(document.getElementById('prof-rate').value) || 0);
  u.location = document.getElementById('prof-location').value.trim();
  u.bio = document.getElementById('prof-bio').value.trim();

  saveState();
  alert('Profile updated successfully!');
});

// WORK LOGGER
const startDateInput = document.getElementById('log-start-date');
const startTimeInput = document.getElementById('log-start-time');
const endDateInput = document.getElementById('log-end-date');
const endTimeInput = document.getElementById('log-end-time');
const durationPreview = document.getElementById('duration-preview');

function calculateDuration() {
  if (startDateInput && startTimeInput && endDateInput && endTimeInput && startDateInput.value && startTimeInput.value && endDateInput.value && endTimeInput.value) {
    const start = new Date(`${startDateInput.value}T${startTimeInput.value}`);
    const end = new Date(`${endDateInput.value}T${endTimeInput.value}`);

    if (end > start) {
      const diffHours = Math.round((end - start) / (1000 * 60 * 60));
      durationPreview.innerHTML = `Total Calculated Duration: <strong>${diffHours} Hours</strong>`;
      return diffHours;
    }
  }
  if (durationPreview) durationPreview.innerHTML = `Total Calculated Duration: <strong>0 Hours</strong>`;
  return 0;
}

[startDateInput, startTimeInput, endDateInput, endTimeInput].forEach(elem => {
  if (elem) elem.addEventListener('change', calculateDuration);
});

document.getElementById('log-work-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const contractId = document.getElementById('log-contract-select').value;
  const hours = calculateDuration();

  if (!contractId) return alert('Select an accepted contract!');
  if (hours <= 0) return alert('End Date & Time must be after Start Date & Time!');

  state.timeLogs.push({
    id: 't_' + Date.now(),
    contractId,
    userId: state.currentUser.id,
    start: `${startDateInput.value} ${startTimeInput.value}`,
    end: `${endDateInput.value} ${endTimeInput.value}`,
    hours
  });

  startDateInput.value = ''; startTimeInput.value = '';
  endDateInput.value = ''; endTimeInput.value = '';
  calculateDuration();
  saveState();
  alert('Work hours logged!');
});

// GIG CREATION BY ORGANIZATIONS
document.getElementById('btn-post-gig').addEventListener('click', () => {
  const title = document.getElementById('gig-title-input').value.trim();
  const description = document.getElementById('gig-desc-input').value.trim();
  const budget = parseFloat(document.getElementById('gig-budget-input').value) || 0;

  if (!title || !description || budget <= 0) return alert('Fill out all gig details properly.');

  state.gigs.unshift({
    id: 'g_' + Date.now(),
    orgId: state.currentUser.id,
    title,
    description,
    budget
  });

  document.getElementById('gig-title-input').value = '';
  document.getElementById('gig-desc-input').value = '';
  document.getElementById('gig-budget-input').value = '';
  saveState();
  alert('New Gig posted!');
});

// NAVIGATION & CHAT INTERACTION
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

document.getElementById('btn-submit-post').addEventListener('click', () => {
  const content = document.getElementById('feed-post-input').value.trim();
  if (!content) return;
  state.posts.unshift({
    id: 'p_' + Date.now(),
    authorId: state.currentUser.id,
    content,
    timestamp: 'Just now'
  });
  document.getElementById('feed-post-input').value = '';
  saveState();
});

window.startChatWith = function(userId) {
  state.activeChatUserId = userId;
  document.querySelector('[data-tab="messages-tab"]').click();
  renderChat();
};

document.getElementById('btn-send-message').addEventListener('click', () => {
  const input = document.getElementById('chat-message-input');
  const text = input.value.trim();
  if (!text || !state.activeChatUserId) return;

  state.messages.push({
    id: 'm_' + Date.now(),
    senderId: state.currentUser.id,
    receiverId: state.activeChatUserId,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  input.value = '';
  saveState();
});

window.applyForGig = function(gigId) {
  if (state.currentUser.role !== 'freelancer') return alert('Only freelancers can apply for gigs!');
  if (state.applications.some(a => a.gigId === gigId && a.freelancerId === state.currentUser.id)) {
    return alert('Application already submitted!');
  }
  state.applications.push({ id: 'app_' + Date.now(), gigId, freelancerId: state.currentUser.id, status: 'Pending' });
  saveState();
  alert('Application sent to organization!');
};

window.updateApplicationStatus = function(appId, newStatus) {
  const app = state.applications.find(a => a.id === appId);
  if (app) { app.status = newStatus; saveState(); }
};

document.getElementById('btn-generate-invoice').addEventListener('click', () => {
  const appId = document.getElementById('invoice-contract-select').value;
  const app = state.applications.find(a => a.id === appId);
  if (!app) return alert('Select an accepted contract!');

  const gig = state.gigs.find(g => g.id === app.gigId);
  const org = state.users.find(u => u.id === gig.orgId);
  const freelancer = state.users.find(u => u.id === app.freelancerId);
  const logs = state.timeLogs.filter(l => l.contractId === appId);

  document.getElementById('invoice-id').innerText = `#INV-${Date.now().toString().slice(-4)}`;
  document.getElementById('invoice-freelancer-info').innerHTML = `<strong>Freelancer:</strong><br>${freelancer.name}<br>${freelancer.email}<br>Rate: ₹${Math.round(freelancer.rate)}/hr`;
  document.getElementById('invoice-org-info').innerHTML = `<strong>Client Organization:</strong><br>${org.name}<br>${org.email}<br>${org.location}`;

  let total = 0;
  const items = logs.map(l => {
    const cost = Math.round(l.hours * freelancer.rate);
    total += cost;
    return `<tr><td>${gig.title}<br><small>${l.start} to ${l.end}</small></td><td>${l.hours} hrs</td><td>₹${Math.round(freelancer.rate)}</td><td>₹${cost}</td></tr>`;
  }).join('');

  document.getElementById('invoice-items').innerHTML = items || '<tr><td colspan="4">No logged sessions.</td></tr>';
  document.getElementById('invoice-total-amount').innerText = `₹${total}`;
});

// RENDERING
function renderPosts() {
  document.getElementById('posts-container').innerHTML = state.posts.map(p => {
    const author = state.users.find(u => u.id === p.authorId) || { name: 'Community Member', role: 'user' };
    return `<div class="glass-card">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <strong>${author.name} <span class="role-tag">${author.role}</span></strong>
        <small style="color:var(--text-muted);">${p.timestamp}</small>
      </div>
      <p style="font-size:14px; line-height:1.5;">${p.content}</p>
      ${author.id !== state.currentUser.id ? `<button onclick="startChatWith('${author.id}')" class="btn-secondary" style="margin-top:10px; font-size:12px;">💬 Message ${author.name}</button>` : ''}
    </div>`;
  }).join('');
}

function renderFreelancers() {
  document.getElementById('freelancers-grid').innerHTML = state.users.filter(u => u.role === 'freelancer').map(u => `
    <div class="glass-card">
      <h3>${u.name}</h3>
      <p style="color:var(--accent); font-size:12px; margin-bottom:6px;">${u.headline || 'Freelancer'}</p>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:8px;">📍 ${u.location || 'Remote'} • 💵 ₹${Math.round(u.rate)}/hr</p>
      <div style="margin-bottom:10px;">${(u.skills || []).map(s => `<span class="skill-chip">${s}</span>`).join('')}</div>
      <p style="font-size:13px; margin-bottom:12px;">${u.bio || 'No bio provided.'}</p>
      ${u.id !== state.currentUser.id ? `<button onclick="startChatWith('${u.id}')" class="btn-primary" style="width:100%;">💬 Message Freelancer</button>` : ''}
    </div>
  `).join('');
}

function renderGigsAndApps() {
  const createGigBox = document.getElementById('create-gig-box');
  const user = state.currentUser;

  if (user.role === 'organization') {
    createGigBox.classList.remove('hidden');
  } else {
    createGigBox.classList.add('hidden');
  }

  const displayedGigs = user.role === 'organization'
    ? state.gigs.filter(g => g.orgId === user.id)
    : state.gigs;

  const gigsContainer = document.getElementById('gigs-grid');
  if (displayedGigs.length === 0) {
    gigsContainer.innerHTML = `<div class="glass-card"><p style="color:var(--text-muted);">No gigs posted yet.</p></div>`;
  } else {
    gigsContainer.innerHTML = displayedGigs.map(g => {
      const org = state.users.find(u => u.id === g.orgId);
      const orgName = org ? org.name : 'Organization';
      const isMyGig = org && org.id === user.id;

      return `<div class="glass-card">
        <h3>${g.title}</h3>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">Client: <strong>${orgName}</strong></p>
        <p style="font-size:13px; margin-bottom:10px;">${g.description}</p>
        <p style="font-size:14px; color:var(--accent); font-weight:bold; margin-bottom:12px;">Budget: ₹${g.budget}</p>
        ${user.role === 'freelancer' ? `<button onclick="applyForGig('${g.id}')" class="btn-primary" style="width:100%; margin-bottom:6px;">💼 Apply for Gig</button>` : ''}
        ${!isMyGig && org ? `<button onclick="startChatWith('${org.id}')" class="btn-secondary" style="width:100%; font-size:12px;">💬 Message Organization</button>` : ''}
      </div>`;
    }).join('');
  }

  const displayedApps = state.applications.filter(app => {
    const gig = state.gigs.find(g => g.id === app.gigId);
    if (!gig) return false;

    if (user.role === 'organization') {
      return gig.orgId === user.id;
    } else {
      return app.freelancerId === user.id;
    }
  });

  const appsTableBody = document.getElementById('applications-table-body');
  if (displayedApps.length === 0) {
    appsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No applications found.</td></tr>`;
  } else {
    appsTableBody.innerHTML = displayedApps.map(app => {
      const gig = state.gigs.find(g => g.id === app.gigId);
      const freelancer = state.users.find(u => u.id === app.freelancerId);
      const org = gig ? state.users.find(u => u.id === gig.orgId) : null;
      const isOwner = org && org.id === user.id;

      let actions = [];
      if (isOwner && app.status === 'Pending') {
        actions.push(`<button onclick="updateApplicationStatus('${app.id}', 'Accepted')" class="btn-success">Accept</button>`);
        actions.push(`<button onclick="updateApplicationStatus('${app.id}', 'Rejected')" class="btn-danger">Reject</button>`);
      }
      if (freelancer && freelancer.id !== user.id) {
        actions.push(`<button onclick="startChatWith('${freelancer.id}')" class="btn-secondary" style="font-size:11px; padding:4px 8px;">💬 Chat Applicant</button>`);
      }

      return `<tr>
        <td><strong>${gig ? gig.title : 'Gig'}</strong></td>
        <td>${freelancer ? freelancer.name : 'User'}</td>
        <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
        <td>${actions.length ? actions.join(' ') : '-'}</td>
      </tr>`;
    }).join('');
  }
}

function renderChat() {
  const otherUsers = state.users.filter(u => u.id !== state.currentUser.id);
  document.getElementById('chat-users-list').innerHTML = otherUsers.map(u => `
    <div class="chat-user-item ${u.id === state.activeChatUserId ? 'active' : ''}" onclick="startChatWith('${u.id}')">
      <strong>${u.name}</strong><br><small style="color:var(--text-muted);">${u.role}</small>
    </div>
  `).join('');

  const activeUser = state.users.find(u => u.id === state.activeChatUserId);
  document.getElementById('chat-active-header').innerText = activeUser ? `Chatting with ${activeUser.name} (${activeUser.role})` : 'Select a member';

  const chatMsgs = state.messages.filter(m => 
    (m.senderId === state.currentUser.id && m.receiverId === state.activeChatUserId) ||
    (m.senderId === state.activeChatUserId && m.receiverId === state.currentUser.id)
  );

  document.getElementById('chat-messages').innerHTML = chatMsgs.map(m => `
    <div class="chat-bubble ${m.senderId === state.currentUser.id ? 'sent' : 'received'}">
      <div>${m.text}</div>
      <small style="font-size:10px; opacity:0.8;">${m.timestamp}</small>
    </div>
  `).join('');
}

function renderAll() {
  if (!state.currentUser) return;
  const u = state.currentUser;

  document.getElementById('badge-name').innerText = u.name;
  document.getElementById('badge-role').innerText = u.role;
  document.getElementById('badge-avatar').innerText = u.name.charAt(0).toUpperCase();

  document.getElementById('quick-switch-users-list').innerHTML = state.users.map(usr => `
    <div class="switch-user-item ${usr.id === u.id ? 'active' : ''}" onclick="switchUserAccount('${usr.id}')">
      <span>${usr.name}</span>
      <span style="font-size:10px; opacity:0.8;">${usr.role.charAt(0).toUpperCase() + usr.role.slice(1)}</span>
    </div>
  `).join('');

  document.getElementById('prof-role').value = u.role;
  document.getElementById('prof-name').value = u.name || '';
  document.getElementById('prof-email').value = u.email || '';
  document.getElementById('prof-headline').value = u.headline || '';
  document.getElementById('prof-skills').value = (u.skills || []).join(', ');
  document.getElementById('prof-rate').value = Math.round(u.rate || 0);
  document.getElementById('prof-location').value = u.location || '';
  document.getElementById('prof-bio').value = u.bio || '';

  renderPosts();
  renderFreelancers();
  renderGigsAndApps();
  renderChat();

  const userAcceptedApps = state.applications.filter(a => {
    if (a.status !== 'Accepted') return false;
    const gig = state.gigs.find(g => g.id === a.gigId);
    if (!gig) return false;
    return u.role === 'organization' ? gig.orgId === u.id : a.freelancerId === u.id;
  });

  const options = '<option value="">Select Accepted Contract</option>' + userAcceptedApps.map(a => {
    const gig = state.gigs.find(g => g.id === a.gigId);
    return `<option value="${a.id}">${gig ? gig.title : 'Contract'}</option>`;
  }).join('');

  document.getElementById('log-contract-select').innerHTML = options;
  document.getElementById('invoice-contract-select').innerHTML = options;

  const userLogs = state.timeLogs.filter(l => l.userId === u.id);
  const timeLogTable = document.getElementById('time-log-list');

  if (userLogs.length === 0) {
    timeLogTable.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No work sessions logged.</td></tr>`;
  } else {
    timeLogTable.innerHTML = userLogs.map(l => `
      <tr><td>${l.start}</td><td>${l.end}</td><td>Contract Session</td><td><strong>${l.hours} hrs</strong></td></tr>
    `).join('');
  }
}

// Check session on load
if (state.currentUser) {
  showWorkspace();
}