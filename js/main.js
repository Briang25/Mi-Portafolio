// --- TERMINAL DEL RETO CTF ---
// Sistema de archivos simulado, mapeado 1:1 con las secciones del portafolio.
// Preparado para que más adelante se pueda colocar un archivo oculto (ej. .flag.txt)
// en cualquier directorio sin tocar la lógica de navegación.

const FS = {
  type: 'dir',
  children: {
    'sobre_mi.txt': {
      type: 'file',
      content: 'Técnico en Administración de Sistemas Informáticos en Red (ASIR),\ncon formación especializada en ciberseguridad. Gestión de\ninfraestructuras críticas, protección de datos y análisis de\nincidentes. Entornos Windows y Linux.'
    },
    '.hint.txt': {
      type: 'file',
      content: 'No todo lo que compone este sitio es solo código y texto.\nAlgunos archivos guardan más información de la que muestran\na simple vista, en propiedades ocultas dentro de sí mismos.\n\nMira más allá de lo evidente.'
    },
    'habilidades': {
      type: 'dir',
      children: {
        'redes-y-seguridad.txt': {
          type: 'file',
          content: 'Administración de sistemas y redes\nMonitorización de eventos y análisis de logs\nGestión de incidentes de seguridad\nSIEM y correlación de eventos'
        },
        'analisis-pentesting.txt': {
          type: 'file',
          content: 'Análisis de vulnerabilidades (Nmap, Nessus)\nPruebas de penetración básicas (Metasploit)\nHerramientas de enumeración (Gobuster, Wireshark)'
        },
        'sistemas-asir.txt': {
          type: 'file',
          content: 'Windows Server & Linux (Ubuntu)\nVirtualización (VirtualBox, VMware)\nProtocolos: HTTP, DNS, SSH, FTP\nBackups y recuperación de desastres'
        }
      }
    },
    'proyectos': {
      type: 'dir',
      children: {
        'maquina-vulnerable.txt': {
          type: 'file',
          content: 'Máquina Virtual Vulnerable (2025)\nProyecto CTF educativo basado en Ubuntu Server para entrenamiento\nen defensa y explotación. Stack: Ubuntu Server, Nmap, Docker.'
        }
      }
    },
    'writeups': {
      type: 'dir',
      children: {
        'blue.txt': {
          type: 'file',
          content: 'Blue (TryHackMe)\nAnálisis de la vulnerabilidad MS17-010 y explotación EternalBlue.\nEscrito completo: tryhackme.com/p/BryanG'
        },
        'lame.txt': {
          type: 'file',
          content: 'Lame (Hack The Box)\nExplotación de servicio Samba y escalada de privilegios.'
        }
      }
    },
    'formacion': {
      type: 'dir',
      children: {
        'tecnico-sistemas.txt': { type: 'file', content: 'Técnico en Sistemas Informáticos — Completado.\nPrimera formación reglada en informática.' },
        'ifct0109.txt': { type: 'file', content: 'IFCT0109 — Seguridad Informática — Completado.\nCertificado de profesionalidad oficial.' },
        'asir.txt': { type: 'file', content: 'Grado Superior ASIR — En curso (online, iFP).\nServidor, dominio, GPOs y políticas de sistema.' },
        'certificaciones-planeadas.txt': { type: 'file', content: 'Planeadas: Jira SM Fundamentals, SC-900, AZ-900,\nITIL 4 Foundation, MD-102.' }
      }
    },
    'contacto.txt': {
      type: 'file',
      content: 'Email: briangarcia5558@gmail.com\nLinkedIn: linkedin.com/in/brian-garcia-sec\nGitHub: github.com/BrianG25\nTryHackMe: tryhackme.com/p/BryanG'
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const ti = document.getElementById('terminal-input');
  const tb = document.getElementById('terminal-body');
  const tp = document.getElementById('terminal-prompt');
  const terminalBox = document.getElementById('terminal');
  if (!ti || !tb) return;

  let cwd = []; // ruta actual como array de segmentos, [] = raíz (~)

  function resolveDir(path) {
    let node = FS;
    for (const seg of path) {
      if (!node.children || !node.children[seg] || node.children[seg].type !== 'dir') return null;
      node = node.children[seg];
    }
    return node;
  }

  function promptPath() {
    return cwd.length === 0 ? '~' : '~/' + cwd.join('/');
  }

  function renderPrompt() {
    tp.innerHTML = `<span class="term-prompt-user">brian@portfolio</span><span class="term-muted">:</span><span class="term-prompt-path">${promptPath()}</span><span class="term-muted">$</span>`;
  }

  function printLine(html) {
    const l = document.createElement('div');
    l.className = 'term-line';
    l.innerHTML = html;
    tb.appendChild(l);
  }

  function printEcho(cmd) {
    printLine(`<span class="term-prompt-user">brian@portfolio</span><span class="term-muted">:</span><span class="term-prompt-path">${promptPath()}</span><span class="term-muted">$</span> ${escapeHtml(cmd)}`);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  // Resuelve una ruta escrita por el usuario (relativa o absoluta) a un array de segmentos,
  // o null si es inválida (sale de la raíz).
  function resolvePathInput(input) {
    let segs = input.startsWith('/') || input === '~' || input.startsWith('~/')
      ? []
      : [...cwd];
    let rest = input.replace(/^~\/?/, '').replace(/^\/+/, '');
    if (rest === '') return segs;
    for (const part of rest.split('/')) {
      if (part === '' || part === '.') continue;
      if (part === '..') { if (segs.length) segs.pop(); continue; }
      segs.push(part);
    }
    return segs;
  }

  function cmdPwd() {
    printLine(`<span class="term-file">/home/brian${cwd.length ? '/' + cwd.join('/') : ''}</span>`);
  }

  function cmdLs(args) {
    const target = args.find(a => !a.startsWith('-'));
    const showHidden = args.some(a => a.startsWith('-') && a.slice(1).includes('a'));
    const path = target ? resolvePathInput(target) : cwd;
    const dir = resolveDir(path);
    if (!dir) { printLine(`<span class="term-error">ls: no se puede acceder a '${escapeHtml(target)}': No existe el archivo o el directorio</span>`); return; }
    let entries = Object.entries(dir.children || {});
    if (!showHidden) entries = entries.filter(([name]) => !name.startsWith('.'));
    if (entries.length === 0) { printLine(`<span class="term-muted">(directorio vacío)</span>`); return; }
    const html = entries.map(([name, node]) =>
      node.type === 'dir' ? `<span class="term-dir">${name}/</span>` : `<span class="term-file">${name}</span>`
    ).join('  ');
    printLine(html);
  }

  function cmdCd(args) {
    const target = args[0];
    if (!target || target === '~') { cwd = []; renderPrompt(); return; }
    const newPath = resolvePathInput(target);
    const dir = resolveDir(newPath);
    if (!dir) { printLine(`<span class="term-error">bash: cd: ${escapeHtml(target)}: No existe el archivo o el directorio</span>`); return; }
    cwd = newPath;
    renderPrompt();
  }

  function cmdCat(args) {
    const target = args[0];
    if (!target) { printLine(`<span class="term-error">cat: falta un operando</span>`); return; }
    const segs = resolvePathInput(target);
    const fileName = segs[segs.length - 1];
    const dirPath = segs.slice(0, -1);
    const dir = resolveDir(dirPath);
    const node = dir && dir.children ? dir.children[fileName] : null;
    if (!node) { printLine(`<span class="term-error">cat: ${escapeHtml(target)}: No existe el archivo o el directorio</span>`); return; }
    if (node.type === 'dir') { printLine(`<span class="term-error">cat: ${escapeHtml(target)}: Es un directorio</span>`); return; }
    printLine(`<span class="term-file">${escapeHtml(node.content)}</span>`);
  }

  const HELP_TEXT = [
    'Comandos disponibles:',
    '  ls [-a]        lista el contenido (usa -a para ver ocultos)',
    '  cd &lt;dir&gt;       cambia de directorio (cd .. / cd ~ / cd /)',
    '  cat &lt;archivo&gt;  muestra el contenido de un archivo',
    '  pwd            muestra la ruta actual',
    '  whoami         info del usuario',
    '  tools          abre el toolkit de ciberseguridad',
    '  clear          limpia la pantalla',
    '  help           muestra esta ayuda'
  ].join('\n');

  function runCommand(raw) {
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case undefined: break;
      case 'help': printLine(`<span class="term-muted">${HELP_TEXT.replace(/\n/g, '<br>')}</span>`); break;
      case 'pwd': cmdPwd(); break;
      case 'ls': cmdLs(args); break;
      case 'cd': cmdCd(args); break;
      case 'cat': cmdCat(args); break;
      case 'whoami': printLine(`<span class="term-muted">brian — Técnico ASIR & Ciberseguridad</span>`); break;
      case 'clear': tb.innerHTML = ''; break;
      case 'tools': window.location.href = 'tools.html'; break;
      default: printLine(`<span class="term-error">bash: ${escapeHtml(cmd)}: comando no encontrado</span>`);
    }
  }

  renderPrompt();
  printLine(`<span class="term-muted">Bienvenido. Escribe 'help' para ver los comandos disponibles.</span>`);

  if (terminalBox) terminalBox.addEventListener('click', () => ti.focus());

  ti.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const v = ti.value;
    printEcho(v);
    runCommand(v);
    ti.value = '';
    tb.scrollTop = tb.scrollHeight;
  });
});
