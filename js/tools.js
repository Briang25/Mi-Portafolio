// --- LÓGICA DEL TOOLKIT (solo tools.html) ---

// 1. IP Classifier (con validación de octetos)
document.getElementById('ip-class-input').oninput = function() {
  const ip = this.value.trim();
  const resClass = document.getElementById('ip-class-res');
  const resType = document.getElementById('ip-type-res');

  if (!ip) { resClass.innerText = "---"; resType.innerText = "---"; this.classList.remove('tool-error'); return; }

  const parts = ip.split('.');
  const validFormat = parts.length === 4 && parts.every(p => /^\d{1,3}$/.test(p) && parseInt(p) <= 255);

  if (!validFormat) {
    resClass.innerText = "Inválida";
    resType.innerText = "---";
    this.classList.add('tool-error');
    return;
  }
  this.classList.remove('tool-error');

  const first = parseInt(parts[0]);
  const second = parseInt(parts[1]);
  let cls = "Inválida", type = "---";

  if (first >= 1 && first <= 126) cls = "Clase A";
  else if (first >= 128 && first <= 191) cls = "Clase B";
  else if (first >= 192 && first <= 223) cls = "Clase C";
  else if (first >= 224 && first <= 239) cls = "Clase D (Multicast)";
  else if (first >= 240) cls = "Clase E (Reservada)";
  else if (first === 127) cls = "Loopback";

  if (first === 10) type = "Privada";
  else if (first === 172 && second >= 16 && second <= 31) type = "Privada";
  else if (first === 192 && second === 168) type = "Privada";
  else if (first === 127) type = "Loopback";
  else if (cls === "Clase A" || cls === "Clase B" || cls === "Clase C") type = "Pública";

  resClass.innerText = cls;
  resType.innerText = type;
};

// 2. MAC Lookup
document.getElementById('mac-input').oninput = function() {
  const val = this.value.toUpperCase().replace(/[:.-]/g, "").substring(0, 6);
  const db = { "00000C": "Cisco", "000C29": "VMware", "080027": "VirtualBox", "28CFDA": "Apple", "0016EA": "Intel" };
  document.getElementById('mac-res').innerText = val ? (db[val] || "No encontrado en la BD local") : "---";
};

// 3. Subnetting
document.getElementById('cidr-input').oninput = function() {
  let cidr = parseInt(this.value);
  if (isNaN(cidr) || cidr < 0) { document.getElementById('mask-out').innerText = "---"; document.getElementById('hosts-out').innerText = "---"; return; }
  if (cidr > 32) cidr = 32;
  let mask = []; let temp = cidr;
  for (let i = 0; i < 4; i++) { let n = Math.min(temp, 8); mask.push(256 - Math.pow(2, 8 - n)); temp -= n; }
  document.getElementById('mask-out').innerText = mask.join('.');
  document.getElementById('hosts-out').innerText = cidr >= 31 ? 0 : (Math.pow(2, 32 - cidr) - 2).toLocaleString();
};

// 4. Conversores Duales (con validación, sin NaN visible)
function setupDual(id1, id2, f1, f2) {
  const e1 = document.getElementById(id1), e2 = document.getElementById(id2);
  e1.oninput = () => {
    if (!e1.value) { e2.value = ""; return; }
    const out = f1(e1.value);
    e2.value = (out === null || Number.isNaN(out)) ? "" : out;
  };
  e2.oninput = () => {
    if (!e2.value) { e1.value = ""; return; }
    const out = f2(e2.value);
    e1.value = (out === null || Number.isNaN(out)) ? "" : out;
  };
}
setupDual('d-b', 'b-d',
  v => { const n = parseInt(v, 10); return Number.isNaN(n) ? null : n.toString(2); },
  v => { const n = parseInt(v, 2); return Number.isNaN(n) ? null : n; }
);
setupDual('d-h', 'h-d',
  v => { const n = parseInt(v, 10); return Number.isNaN(n) ? null : n.toString(16).toUpperCase(); },
  v => { const n = parseInt(v, 16); return Number.isNaN(n) ? null : n; }
);
setupDual('t-b', 'b-t',
  v => v.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
  v => v.trim().split(/\s+/).map(b => { const n = parseInt(b, 2); return Number.isNaN(n) ? '' : String.fromCharCode(n); }).join('')
);

// 5. Crypto & Pass
document.getElementById('hash-in').oninput = async function() {
  if (!this.value) { document.getElementById('hash-out').innerText = "---"; return; }
  const b = new TextEncoder().encode(this.value);
  const h = await crypto.subtle.digest('SHA-256', b);
  document.getElementById('hash-out').innerText = Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
};

function genP() {
  const l = document.getElementById('pass-len').value;
  const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let r = ""; for (let i = 0; i < l; i++) r += c.charAt(Math.floor(Math.random() * c.length));
  document.getElementById('pass-res').value = r;
}
document.getElementById('pass-len').oninput = function() { document.getElementById('pass-len-val').innerText = this.value; };
