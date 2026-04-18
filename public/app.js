const C = {
  caesar: {
    id: "caesar",
    name: "Caesar Cipher",
    cfg: true,
    color: "#d8b36a",
    desc: "Shift each letter by a configurable amount.",
    def: { shift: 3 },
    fields: [{ k: "shift", lbl: "Shift Amount", type: "range", min: -25, max: 25, step: 1 }],
    enc(t, c) {
      const n = ((c.shift % 26) + 26) % 26;
      return t.split("").map((ch) => {
        if (ch >= "A" && ch <= "Z") return String.fromCharCode((ch.charCodeAt(0) - 65 + n) % 26 + 65);
        if (ch >= "a" && ch <= "z") return String.fromCharCode((ch.charCodeAt(0) - 97 + n) % 26 + 97);
        return ch;
      }).join("");
    },
    dec(t, c) {
      return C.caesar.enc(t, { shift: -c.shift });
    }
  },
  xor: {
    id: "xor",
    name: "XOR Cipher",
    cfg: true,
    color: "#8ab3c7",
    desc: "Apply a repeating key across the byte stream.",
    def: { key: "secret" },
    fields: [{ k: "key", lbl: "Key String", type: "text", ph: "Enter key..." }],
    enc(t, c) {
      const k = c.key || "k";
      return Array.from(t).map((ch, i) => (`0${(ch.charCodeAt(0) ^ k.charCodeAt(i % k.length)).toString(16)}`).slice(-2)).join("");
    },
    dec(t, c) {
      const k = c.key || "k";
      return (t.match(/.{1,2}/g) || []).map((h, i) => String.fromCharCode(parseInt(h, 16) ^ k.charCodeAt(i % k.length))).join("");
    }
  },
  vigenere: {
    id: "vigenere",
    name: "Vigenere",
    cfg: true,
    color: "#c8826f",
    desc: "Layer in a keyword-driven polyalphabetic shift.",
    def: { key: "cipher" },
    fields: [{ k: "key", lbl: "Keyword", type: "text", ph: "Enter keyword..." }],
    enc(t, c) {
      const k = (c.key || "a").toLowerCase().replace(/[^a-z]/g, "") || "a";
      let i = 0;
      return t.split("").map((ch) => {
        if (ch >= "A" && ch <= "Z") {
          const s = k.charCodeAt(i++ % k.length) - 97;
          return String.fromCharCode((ch.charCodeAt(0) - 65 + s) % 26 + 65);
        }
        if (ch >= "a" && ch <= "z") {
          const s = k.charCodeAt(i++ % k.length) - 97;
          return String.fromCharCode((ch.charCodeAt(0) - 97 + s) % 26 + 97);
        }
        return ch;
      }).join("");
    },
    dec(t, c) {
      const k = (c.key || "a").toLowerCase().replace(/[^a-z]/g, "") || "a";
      let i = 0;
      return t.split("").map((ch) => {
        if (ch >= "A" && ch <= "Z") {
          const s = k.charCodeAt(i++ % k.length) - 97;
          return String.fromCharCode(((ch.charCodeAt(0) - 65 - s) + 26) % 26 + 65);
        }
        if (ch >= "a" && ch <= "z") {
          const s = k.charCodeAt(i++ % k.length) - 97;
          return String.fromCharCode(((ch.charCodeAt(0) - 97 - s) + 26) % 26 + 97);
        }
        return ch;
      }).join("");
    }
  },
  railfence: {
    id: "railfence",
    name: "Rail Fence",
    cfg: true,
    color: "#83a58c",
    desc: "Write text through a zigzag rail pattern.",
    def: { rails: 3 },
    fields: [{ k: "rails", lbl: "Number of Rails", type: "range", min: 2, max: 8, step: 1 }],
    enc(t, c) {
      const n = Math.max(2, c.rails);
      if (n >= t.length) return t;
      const r = Array.from({ length: n }, () => []);
      let ri = 0;
      let d = 1;
      for (const ch of t) {
        r[ri].push(ch);
        if (ri === n - 1) d = -1;
        else if (ri === 0) d = 1;
        ri += d;
      }
      return r.flat().join("");
    },
    dec(t, c) {
      const n = Math.max(2, c.rails);
      const len = t.length;
      if (n >= len) return t;
      const pat = [];
      let ri = 0;
      let d = 1;
      for (let i = 0; i < len; i += 1) {
        pat.push(ri);
        if (ri === n - 1) d = -1;
        else if (ri === 0) d = 1;
        ri += d;
      }
      const rl = Array(n).fill(0);
      pat.forEach((x) => { rl[x] += 1; });
      const ra = [];
      let p = 0;
      for (let i = 0; i < n; i += 1) {
        ra.push(t.slice(p, p + rl[i]).split(""));
        p += rl[i];
      }
      const idx = Array(n).fill(0);
      return pat.map((x) => ra[x][idx[x]++]).join("");
    }
  },
  columnar: {
    id: "columnar",
    name: "Columnar Transposition",
    cfg: true,
    color: "#d16d65",
    desc: "Rearrange letters by ordered columns and a keyword.",
    def: { key: "CIPHER" },
    fields: [{ k: "key", lbl: "Column Keyword", type: "text", ph: "e.g. CIPHER" }],
    enc(t, c) {
      const k = (c.key || "KEY").toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
      const cols = k.length;
      const rows = Math.ceil(t.length / cols);
      const pad = t.padEnd(rows * cols, "_");
      const ord = [...k].map((ch, i) => ({ ch, i })).sort((a, b) => a.ch.localeCompare(b.ch)).map((x) => x.i);
      return ord.map((col) => {
        let s = "";
        for (let r = 0; r < rows; r += 1) s += pad[r * cols + col];
        return s;
      }).join("");
    },
    dec(t, c) {
      const k = (c.key || "KEY").toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
      const cols = k.length;
      const rows = Math.ceil(t.length / cols);
      const ord = [...k].map((ch, i) => ({ ch, i })).sort((a, b) => a.ch.localeCompare(b.ch)).map((x) => x.i);
      const grid = Array(cols).fill("");
      let p = 0;
      ord.forEach((col) => {
        grid[col] = t.slice(p, p + rows);
        p += rows;
      });
      let res = "";
      for (let r = 0; r < rows; r += 1) {
        for (let col = 0; col < cols; col += 1) {
          res += grid[col][r] || "";
        }
      }
      return res.replace(/_+$/, "");
    }
  },
  atbash: {
    id: "atbash",
    name: "Atbash",
    cfg: false,
    color: "#9db693",
    desc: "Mirror letters across the alphabet.",
    def: {},
    fields: [],
    enc(t) {
      return t.split("").map((ch) => {
        if (ch >= "A" && ch <= "Z") return String.fromCharCode(90 - (ch.charCodeAt(0) - 65));
        if (ch >= "a" && ch <= "z") return String.fromCharCode(122 - (ch.charCodeAt(0) - 97));
        return ch;
      }).join("");
    },
    dec(t) {
      return C.atbash.enc(t);
    }
  },
  base64: {
    id: "base64",
    name: "Base64",
    cfg: false,
    color: "#b2a1dc",
    desc: "Encode data into a printable ASCII representation.",
    def: {},
    fields: [],
    enc(t) {
      try {
        return btoa(unescape(encodeURIComponent(t)));
      } catch (e) {
        return btoa(t);
      }
    },
    dec(t) {
      try {
        return decodeURIComponent(escape(atob(t)));
      } catch (e) {
        return t;
      }
    }
  },
  reverse: {
    id: "reverse",
    name: "Reverse String",
    cfg: false,
    color: "#d1aee4",
    desc: "Reverse the full string order.",
    def: {},
    fields: [],
    enc(t) {
      return t.split("").reverse().join("");
    },
    dec(t) {
      return t.split("").reverse().join("");
    }
  },
  substitution: {
    id: "substitution",
    name: "Substitution",
    cfg: true,
    color: "#f0c56a",
    desc: "Swap in a custom 26-character alphabet mapping.",
    def: { alphabet: "QWERTYUIOPASDFGHJKLZXCVBNM" },
    fields: [{ k: "alphabet", lbl: "Substitution Alphabet (26 chars)", type: "text", ph: "QWERTYUIOPASDFGHJKLZXCVBNM" }],
    enc(t, c) {
      const a = ((c.alphabet || "QWERTYUIOPASDFGHJKLZXCVBNM").toUpperCase() + "ABCDEFGHIJKLMNOPQRSTUVWXYZ").slice(0, 26);
      return t.split("").map((ch) => {
        if (ch >= "A" && ch <= "Z") return a[ch.charCodeAt(0) - 65] || ch;
        if (ch >= "a" && ch <= "z") return (a[ch.charCodeAt(0) - 97] || ch).toLowerCase();
        return ch;
      }).join("");
    },
    dec(t, c) {
      const std = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const a = ((c.alphabet || "QWERTYUIOPASDFGHJKLZXCVBNM").toUpperCase() + "ABCDEFGHIJKLMNOPQRSTUVWXYZ").slice(0, 26);
      return t.split("").map((ch) => {
        if (ch >= "A" && ch <= "Z") {
          const i = a.indexOf(ch);
          return i >= 0 ? std[i] : ch;
        }
        if (ch >= "a" && ch <= "z") {
          const i = a.indexOf(ch.toUpperCase());
          return i >= 0 ? std[i].toLowerCase() : ch;
        }
        return ch;
      }).join("");
    }
  }
};

const ORDER = ["caesar", "xor", "vigenere", "railfence", "columnar", "atbash", "base64", "reverse", "substitution"];

let nodes = [
  { id: 1, type: "caesar", config: { shift: 3 }, open: true },
  { id: 2, type: "xor", config: { key: "phantom" }, open: true },
  { id: 3, type: "vigenere", config: { key: "cipher" }, open: true }
];
let mode = "encrypt";
let runLog = [];
let nid = 10;
let dragState = null;
let toastT;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(value, max = 64) {
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function resetOutput() {
  runLog = [];
  document.getElementById("out-area").value = "";
}

function buildLib() {
  document.getElementById("lib").innerHTML = ORDER.map((id) => {
    const d = C[id];
    return `
      <div class="cipher-chip" draggable="true" data-cipher-id="${d.id}" onclick="addNode('${d.id}')">
        <div class="chip-head">
          <div class="chip-dot" style="background:${d.color}; box-shadow:0 0 18px ${d.color}55;"></div>
          <span class="chip-name">${d.name}</span>
          <span class="chip-tag ${d.cfg ? "tag-cfg" : "tag-free"}">${d.cfg ? "Config" : "Ready"}</span>
          <button class="chip-plus" type="button" onclick="event.stopPropagation();addNode('${d.id}')">+</button>
        </div>
        <p class="chip-desc">${d.desc}</p>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".cipher-chip").forEach((chip) => {
    chip.addEventListener("dragstart", (event) => {
      const cipherId = chip.dataset.cipherId;
      dragState = { kind: "library", cipherId };
      chip.classList.add("dragging");
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", cipherId);
    });
    chip.addEventListener("dragend", () => {
      chip.classList.remove("dragging");
      clearDropHighlights();
      dragState = null;
    });
  });
}

function createDropMarker(index) {
  return `
    <div class="drop-marker" data-drop-index="${index}">
      <span class="drop-marker-text">Drop stage here</span>
    </div>
  `;
}

function render() {
  const pipe = document.getElementById("pipe");
  const empty = document.getElementById("empty-state");
  if (nodes.length === 0) {
    pipe.style.display = "none";
    empty.style.display = "flex";
  } else {
    pipe.style.display = "flex";
    empty.style.display = "none";
  }

  let html = createDropMarker(0);

  nodes.forEach((nd, i) => {
    const d = C[nd.type];
    const le = runLog.find((entry) => entry.id === nd.id);
    const open = nd.open !== false;
    const preview = le && le.out ? `<span class="nio-prev" title="${esc(le.out)}">${esc(truncate(le.out, 22))}</span>` : "";
    const fieldsHtml = d.fields.map((f) => {
      const val = nd.config[f.k] ?? "";
      const lbl = f.type === "range" ? `${f.lbl} - ${val}` : f.lbl;
      if (f.type === "range") {
        return `
          <div class="cfg-row">
            <label class="cfg-lbl">${lbl}</label>
            <input class="cfg-in" type="range" min="${f.min}" max="${f.max}" step="${f.step}" value="${val}"
              oninput="cfgNode(${nd.id},'${f.k}',Number(this.value)); this.previousElementSibling.textContent='${f.lbl} - ' + this.value">
          </div>
        `;
      }

      return `
        <div class="cfg-row">
          <label class="cfg-lbl">${lbl}</label>
          <input class="cfg-in" type="text" placeholder="${f.ph || ""}" value="${esc(String(val))}"
            oninput="cfgNode(${nd.id},'${f.k}',this.value)">
        </div>
      `;
    }).join("");

    const bodyHtml = open ? `
      <div class="node-body">
        ${fieldsHtml}
        <div class="io-pane">
          <div class="io-tab first${le?.in ? " lit" : ""}">Input</div>
          <div class="io-tab${le?.out ? " lit" : ""}">Output</div>
          <div class="io-vals">
            <div class="io-val iin${!le?.in ? " dim" : ""}">${le ? esc(le.in) : "-"}</div>
            <div class="io-val iout${!le?.out ? " dim" : ""}">${le ? esc(le.out) : "-"}</div>
          </div>
        </div>
      </div>
    ` : "";

    html += `
      <div class="node-wrap">
        <div class="node-card node-card-highlight" draggable="true" data-node-index="${i}" data-node-id="${nd.id}"
          style="border-color:${open ? `${d.color}40` : "var(--line)"};">
          <div class="node-head" onclick="toggleNode(${nd.id})">
            <div class="nnum" style="background:${d.color}20; border:1px solid ${d.color}40; color:${d.color};">${i + 1}</div>
            <div class="ntitle" style="color:${d.color};">${d.name}</div>
            ${preview}
            <span class="nbadge ${d.cfg ? "tag-cfg" : "tag-free"}">${d.cfg ? "Configurable" : "No config"}</span>
            <div class="nbtns" onclick="event.stopPropagation()">
              <button class="nbtn drag-handle" type="button" title="Drag to reorder">::</button>
              <button class="nbtn" type="button" onclick="moveNode(${i},-1)" ${i === 0 ? "disabled" : ""}>↑</button>
              <button class="nbtn" type="button" onclick="moveNode(${i},1)" ${i === nodes.length - 1 ? "disabled" : ""}>↓</button>
              <button class="nbtn del" type="button" onclick="removeNode(${i})">x</button>
            </div>
            <span class="nchev" style="transform:${open ? "rotate(90deg)" : "rotate(0deg)"}">></span>
          </div>
          ${bodyHtml}
        </div>
        ${i < nodes.length ? createDropMarker(i + 1) : ""}
      </div>
    `;
  });

  pipe.innerHTML = html;
  updateStats();
  updateModeUI();
  bindCanvasDnD();
}

function bindCanvasDnD() {
  const canvas = document.getElementById("canvas-inner");
  const dropTargets = [canvas, ...document.querySelectorAll("[data-drop-index]")];

  const activate = (target) => {
    clearDropHighlights();
    target.classList.add("dropzone-active");
    target.classList.add("active");
  };

  if (!canvas.dataset.dndBound) {
    canvas.addEventListener("dragover", (event) => {
      if (!dragState) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = dragState.kind === "library" ? "copy" : "move";
      activate(canvas);
    });

    canvas.addEventListener("dragleave", () => {
      canvas.classList.remove("dropzone-active");
      canvas.classList.remove("active");
    });

    canvas.addEventListener("drop", (event) => {
      if (!dragState) return;
      event.preventDefault();
      handleDrop(nodes.length);
    });

    canvas.dataset.dndBound = "true";
  }

  dropTargets.filter((target) => target !== canvas).forEach((target) => {
    target.addEventListener("dragover", (event) => {
      if (!dragState) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = dragState.kind === "library" ? "copy" : "move";
      activate(target);
    });

    target.addEventListener("dragleave", () => {
      target.classList.remove("dropzone-active");
      target.classList.remove("active");
    });

    target.addEventListener("drop", (event) => {
      if (!dragState) return;
      event.preventDefault();
      const dropIndex = Number(target.dataset.dropIndex);
      handleDrop(dropIndex);
    });
  });

  document.querySelectorAll(".node-card").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      const index = Number(card.dataset.nodeIndex);
      dragState = { kind: "node", index };
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.dataset.nodeId);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      clearDropHighlights();
      dragState = null;
    });
  });
}

function clearDropHighlights() {
  document.querySelectorAll(".dropzone-active, .active").forEach((el) => {
    el.classList.remove("dropzone-active");
    el.classList.remove("active");
  });
}

function handleDrop(dropIndex) {
  if (!dragState) return;

  if (dragState.kind === "library") {
    insertNode(dragState.cipherId, dropIndex);
  } else if (dragState.kind === "node") {
    reorderNode(dragState.index, dropIndex);
  }

  clearDropHighlights();
  dragState = null;
}

function insertNode(type, index = nodes.length) {
  const next = { id: nid++, type, config: { ...C[type].def }, open: true };
  nodes.splice(index, 0, next);
  resetOutput();
  render();
  renderLog();
}

function reorderNode(fromIndex, dropIndex) {
  if (fromIndex === dropIndex || fromIndex + 1 === dropIndex) {
    render();
    return;
  }

  const [moved] = nodes.splice(fromIndex, 1);
  const insertAt = dropIndex > fromIndex ? dropIndex - 1 : dropIndex;
  nodes.splice(insertAt, 0, moved);
  resetOutput();
  render();
  renderLog();
}

function updateStats() {
  const valid = nodes.length >= 3;
  const cfg = nodes.filter((n) => C[n.type].cfg).length;
  document.getElementById("stat-n").textContent = nodes.length;
  document.getElementById("stat-c").textContent = cfg;
  document.getElementById("stat-v").innerHTML = valid
    ? '<span class="stat-pill-value" style="color:var(--success)">Ready</span><span class="stat-pill-label">Pipeline meets the minimum stage count.</span>'
    : `<span class="stat-pill-value" style="color:var(--danger)">Need ${3 - nodes.length}</span><span class="stat-pill-label">Add ${3 - nodes.length} more stage${3 - nodes.length === 1 ? "" : "s"} to run.</span>`;
}

function updateModeUI() {
  const enc = mode === "encrypt";
  const encBtn = document.getElementById("btn-enc");
  const decBtn = document.getElementById("btn-dec");
  encBtn.className = `mode-btn${enc ? " mode-active" : ""}`;
  decBtn.className = `mode-btn${enc ? "" : " mode-danger-active"}`;

  const rb = document.getElementById("run-btn");
  rb.className = `run-btn ${enc ? "run-btn-enc" : "run-btn-dec"}`;
  rb.textContent = enc ? "Run" : "Undo";
  document.getElementById("run-lbl").textContent = enc ? "Encrypt" : "Decrypt";

  const ia = document.getElementById("inp-area");
  const oa = document.getElementById("out-area");
  ia.className = `io-area${enc ? "" : " in-dec"}`;
  ia.placeholder = enc ? "Enter plaintext to encrypt..." : "Paste ciphertext to decrypt...";
  oa.className = `io-area ${enc ? "out-enc" : "out-dec"}`;

  document.getElementById("inp-lbl").innerHTML = `<span class="io-dot io-dot-live" style="background:${enc ? "var(--success)" : "var(--danger)"}; box-shadow:0 0 0 6px ${enc ? "rgba(142,197,161,0.12)" : "rgba(209,109,101,0.12)"};"></span>${enc ? "Plaintext Input" : "Ciphertext Input"}`;
  document.getElementById("out-lbl").innerHTML = `<span class="io-dot io-dot-live" style="background:${enc ? "var(--success)" : "var(--accent-ink)"}; box-shadow:0 0 0 6px ${enc ? "rgba(142,197,161,0.12)" : "rgba(138,179,199,0.12)"};"></span>${enc ? "Encrypted Output" : "Decrypted Output"}`;
}

function addNode(type) {
  insertNode(type, nodes.length);
}

function removeNode(i) {
  nodes.splice(i, 1);
  resetOutput();
  render();
  renderLog();
}

function moveNode(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= nodes.length) return;
  [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
  resetOutput();
  render();
  renderLog();
}

function toggleNode(id) {
  const n = nodes.find((x) => x.id === id);
  if (n) n.open = !n.open;
  render();
}

function cfgNode(id, key, val) {
  const n = nodes.find((x) => x.id === id);
  if (!n) return;
  n.config[key] = val;
  resetOutput();
}

function setMode(m) {
  mode = m;
  resetOutput();
  document.getElementById("inp-area").value = "";
  render();
  renderLog();
}

function clearPipeline() {
  nodes = [];
  resetOutput();
  render();
  renderLog();
}

function copyOut() {
  const v = document.getElementById("out-area").value;
  if (!v) return;
  try {
    navigator.clipboard.writeText(v);
    toast("Output copied.");
  } catch (e) {
    toast("Clipboard access failed.");
  }
}

function runPipeline() {
  if (nodes.length < 3) {
    toast("Pipeline requires at least 3 stages.");
    return;
  }

  const src = document.getElementById("inp-area").value;
  if (!src.trim()) {
    toast("Input is empty.");
    return;
  }

  try {
    const chain = mode === "encrypt" ? nodes : [...nodes].reverse();
    const entries = [];
    let cur = src;

    for (const nd of chain) {
      const d = C[nd.type];
      const inp = cur;
      cur = mode === "encrypt" ? d.enc(cur, nd.config) : d.dec(cur, nd.config);
      entries.push({ id: nd.id, name: d.name, color: d.color, in: inp, out: cur });
    }

    runLog = entries;
    document.getElementById("out-area").value = cur;
    renderLog();
    render();
  } catch (e) {
    toast(`Error: ${e.message}`);
  }
}

function renderLog() {
  const body = document.getElementById("log-body");
  if (runLog.length === 0) {
    body.innerHTML = `
      <div class="log-empty">
        <div class="log-empty-badge">Awaiting run</div>
        <p class="log-empty-title">Every stage transformation will appear here.</p>
        <p class="log-empty-copy">Run the pipeline to see input/output snapshots for each cipher in the chain.</p>
      </div>
    `;
    return;
  }

  const enc = mode === "encrypt";
  body.innerHTML = `${runLog.map((e, i) => `
    <div class="log-entry">
      <div class="log-head">
        <span class="log-step">Step ${i + 1}</span>
        <span class="log-name" style="color:${e.color}">${e.name}</span>
        <span class="log-arrow">${enc ? "->" : "<-"}</span>
      </div>
      <div class="log-vals">
        <div class="log-v lin">IN: ${esc(truncate(e.in, 120))}</div>
        <div class="log-v lout${enc ? "" : " rdec"}">OUT: ${esc(truncate(e.out, 120))}</div>
      </div>
    </div>
  `).join("")}
  <div class="log-final">
    <div class="log-final-lbl">${enc ? "Final Ciphertext" : "Recovered Plaintext"}</div>
    <div class="log-final-val ${enc ? "lenc" : "ldec"}">${esc(runLog[runLog.length - 1].out)}</div>
  </div>`;
}

function exportPipeline() {
  const blob = new Blob([JSON.stringify({ nodes }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cipherstack.json";
  a.click();
  URL.revokeObjectURL(url);
}

function openImport() {
  const ov = document.createElement("div");
  ov.className = "overlay";
  ov.id = "modal-ov";
  ov.innerHTML = `
    <div class="modal">
      <h3 class="modal-title">Import Pipeline JSON</h3>
      <textarea class="modal-ta" id="modal-ta" placeholder='{"nodes":[{"id":1,"type":"caesar","config":{"shift":3}}]}'></textarea>
      <div class="modal-acts">
        <button class="mbtn sec" type="button" onclick="closeImport()">Cancel</button>
        <button class="mbtn pri" type="button" onclick="doImport()">Import</button>
      </div>
    </div>
  `;
  document.body.appendChild(ov);
}

function closeImport() {
  const ov = document.getElementById("modal-ov");
  if (ov) ov.remove();
}

function doImport() {
  try {
    const parsed = JSON.parse(document.getElementById("modal-ta").value);
    if (!parsed.nodes || !Array.isArray(parsed.nodes)) throw new Error("Missing nodes array");
    nodes = parsed.nodes.map((node) => ({
      id: typeof node.id === "number" ? node.id : nid++,
      type: node.type,
      config: node.config || { ...C[node.type].def },
      open: node.open !== false
    })).filter((node) => C[node.type]);
    nid = Math.max(nid, ...nodes.map((node) => node.id + 1), 10);
    resetOutput();
    closeImport();
    render();
    renderLog();
    toast("Pipeline imported.");
  } catch (e) {
    toast(`Import failed: ${e.message}`);
  }
}

function toast(msg) {
  let el = document.getElementById("toast-el");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast-el";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(toastT);
  toastT = setTimeout(() => {
    el.style.display = "none";
  }, 2600);
}

buildLib();
render();
renderLog();
