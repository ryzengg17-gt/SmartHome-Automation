// script.js
let pollInterval = null;

async function api(path, method='GET', body=null) {
  const opts = { method, headers: {} };
  if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch('/api' + path, opts);
  return res.json();
}

// login redirect if not auth
async function checkAuth() {
  try {
    const u = await api('/user');
    if (!u.ok) window.location = '/login.html';
  } catch(e) { window.location = '/login.html'; }
}

// On dashboard load
async function initDashboard() {
  await checkAuth();
  // attach logout
  document.getElementById('btnLogout').addEventListener('click', async () => {
    await api('/logout', 'POST');
    window.location = '/login.html';
  });

  // open cred modal
  const credModal = document.getElementById('credModal');
  document.getElementById('btnCred').addEventListener('click', () => credModal.classList.add('show'));
  document.getElementById('credCancel').addEventListener('click', () => credModal.classList.remove('show'));

  document.getElementById('credForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nu = document.getElementById('newU').value.trim();
    const np = document.getElementById('newP').value;
    const resp = await api('/change-credentials', 'POST', { newUsername: nu, newPassword: np });
    if (resp.ok) {
      alert('Credentials updated. New username: ' + resp.user);
      credModal.classList.remove('show');
    } else {
      document.getElementById('credErr').textContent = resp.error || 'Failed';
    }
  });

  // lamp buttons
  document.querySelectorAll('.lamp-toggle').forEach(btn => {
    btn.addEventListener('click', async () => {
      const lamp = btn.dataset.lamp;
      const r = await api('/toggle-lamp', 'POST', { lamp });
      if (r.ok) updateUI(r.data || null);
      // if r includes lamp, update button
      if (r.ok && r.lamp) {
        const el = document.querySelector([data-lamp="${r.lamp}"]);
        if (el) {
          el.textContent = r.state ? 'ON' : 'OFF';
          el.classList.toggle('on', r.state);
          el.classList.toggle('off', !r.state);
        }
      }
    });
  });

  // start polling
  pollAndUpdate();
  pollInterval = setInterval(pollAndUpdate, 2000);
}

async function pollAndUpdate() {
  const res = await api('/status');
  if (!res.ok) return;
  const d = res.data;
  // lamps
  for (const k in d.lamps) {
    const el = document.querySelector([data-lamp="${k}"]);
    if (el) {
      el.textContent = d.lamps[k] ? 'ON' : 'OFF';
      el.classList.toggle('on', d.lamps[k]);
      el.classList.toggle('off', !d.lamps[k]);
    }
  }
  // sensors
  document.getElementById('inTemp').textContent = d.sensors.indoorTemp == null ? '— °C' : d.sensors.indoorTemp + ' °C';
  document.getElementById('inHum').textContent = d.sensors.indoorHum == null ? '— %' : d.sensors.indoorHum + ' %';
  document.getElementById('outTemp').textContent = d.sensors.outdoorTemp == null ? '— °C' : d.sensors.outdoorTemp + ' °C';
  document.getElementById('gas').textContent = d.sensors.gasPpm == null ? '— ppm' : d.sensors.gasPpm + ' ppm';
  document.getElementById('gasState').textContent = (d.sensors.gasPpm != null && d.sensors.gasPpm > 300) ? 'Danger' : 'Normal';
  document.getElementById('timeOfDay').textContent = d.sensors.timeOfDay || '—';
  // weather animation
  const wa = document.getElementById('weatherAnim');
  const w = d.sensors.weather || 'unknown';
  wa.textContent = w.toUpperCase();
  // clock
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}

// if loaded in dashboard
if (location.pathname.endsWith('/index.html') || location.pathname === '/' || location.pathname === '/index.html') {
  document.addEventListener('DOMContentLoaded', initDashboard);
}