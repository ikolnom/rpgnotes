"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PerhapsPlugin
});
module.exports = __toCommonJS(main_exports);

// node_modules/.pnpm/@scriptwizards+perhaps-engine@https+++codeload.github.com+script-wizards+perhaps+tar.gz_f11e38cd2e7f4b1bec5a149d2a52e055/node_modules/@scriptwizards/perhaps-engine/src/rng.ts
function createRng(seed) {
  let state = (seed ?? Math.floor(Math.random() * 4294967295)) >>> 0;
  return {
    next() {
      state = state + 1831565813 >>> 0;
      let t = state;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  };
}

// node_modules/.pnpm/@scriptwizards+perhaps-engine@https+++codeload.github.com+script-wizards+perhaps+tar.gz_f11e38cd2e7f4b1bec5a149d2a52e055/node_modules/@scriptwizards/perhaps-engine/src/parse.ts
var WEIGHT_PATTERN = /\s*\^(\d*\.?\d+)\s*$/;
var FENCE_PATTERN = /^(```+|~~~+)\s*(perchance|perhaps)\s*$/;
function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}
function stripComment(line) {
  const match = line.match(/(^|\s)\/\//);
  if (match === null || match.index === void 0) return line;
  return line.slice(0, match.index);
}
function parseEntry(text) {
  const match = text.match(WEIGHT_PATTERN);
  if (match?.[1]) {
    return { text: text.slice(0, match.index).trimEnd(), weight: Number(match[1]) };
  }
  return { text, weight: 1 };
}
function parseBlock(content, source) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const sections = [];
  const errors = [];
  let title;
  let current = null;
  let expectingTitle = false;
  for (let i = 0; i < lines.length; i++) {
    const line = stripComment(lines[i] ?? "");
    const trimmed = line.trim();
    if (trimmed === "") continue;
    const indented = /^(\t|\s{2,})/.test(line);
    if (indented) {
      if (expectingTitle) {
        title = trimmed;
        expectingTitle = false;
      } else if (current) {
        current.entries.push(parseEntry(trimmed));
      } else {
        errors.push(`line ${i + 1}: entry "${trimmed}" appears before any section name`);
      }
      continue;
    }
    if (line.startsWith(" ")) {
      errors.push(`line ${i + 1}: ambiguous single-space indent`);
      continue;
    }
    if (current) sections.push(current);
    current = null;
    if (normalizeName(trimmed) === "title") {
      expectingTitle = true;
    } else {
      current = { name: trimmed, entries: [] };
    }
  }
  if (current) sections.push(current);
  if (sections.length === 0 || !sections.some((s) => s.entries.length > 0)) {
    return { table: null, errors: [...errors, "no sections with entries found"] };
  }
  const firstSection = sections[0];
  const resolvedTitle = title ?? firstSection.name;
  const id = `${source?.path ?? "inline"}:${source?.blockIndex ?? 0}:${normalizeName(resolvedTitle)}`;
  return {
    table: { id, title: resolvedTitle, sections, source, errors },
    errors
  };
}
function parseMarkdown(markdown, path) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const tables = [];
  let blockIndex = 0;
  let fence = null;
  let blockLines = [];
  for (const line of lines) {
    if (fence === null) {
      const open = line.match(FENCE_PATTERN);
      if (open?.[1]) {
        fence = open[1];
        blockLines = [];
      }
      continue;
    }
    if (line.trim() === fence) {
      const parsed = parseBlock(blockLines.join("\n"), { path, blockIndex });
      if (parsed.table) tables.push(parsed.table);
      blockIndex++;
      fence = null;
    } else {
      blockLines.push(line);
    }
  }
  return tables;
}

// node_modules/.pnpm/@scriptwizards+perhaps-engine@https+++codeload.github.com+script-wizards+perhaps+tar.gz_f11e38cd2e7f4b1bec5a149d2a52e055/node_modules/@scriptwizards/perhaps-engine/src/roll.ts
var MAX_DEPTH = 10;
var REROLL_ATTEMPTS = 5;
var REF_PATTERN = /^([A-Za-z0-9_-]+(?:\s+[A-Za-z0-9_-]+)*)(?:\.(selectUnique|selectMany)\((\d+)\))?$/;
var DICE_PATTERN = /\b(\d+)[dD](\d+)([+-]\d+)?\b/g;
var RANGE_PATTERN = /^(\d+)\s*-\s*(\d+)$/;
var LIST_SEPARATOR = ", ";
var Roller = class {
  constructor(tables, rng = createRng()) {
    __publicField(this, "rng", rng);
    __publicField(this, "byId", /* @__PURE__ */ new Map());
    __publicField(this, "byName", /* @__PURE__ */ new Map());
    for (const table of tables) {
      this.byId.set(table.id, table);
      const name = normalizeName(table.title);
      if (!this.byName.has(name)) this.byName.set(name, table);
    }
  }
  roll(tableOrId, sectionName) {
    const table = typeof tableOrId === "string" ? this.byId.get(tableOrId) ?? this.byName.get(normalizeName(tableOrId)) : tableOrId;
    if (!table) {
      const wanted = typeof tableOrId === "string" ? tableOrId : "unknown";
      return {
        root: {
          kind: "ref",
          source: `[${wanted}]`,
          text: "",
          parts: [],
          tableId: "",
          detail: {}
        },
        text: "",
        errors: [`unknown table "${wanted}"`]
      };
    }
    const section = sectionName ? findSection(table, sectionName) : findSection(table, "output") ?? table.sections[0];
    const ctx = { table, depth: 0, errors: [] };
    if (!section || section.entries.length === 0) {
      ctx.errors.push(`table "${table.title}" has no rollable section`);
      const root2 = {
        kind: "ref",
        source: `[${sectionName ?? "output"}]`,
        text: "",
        parts: [],
        tableId: table.id,
        detail: {}
      };
      return { root: root2, text: "", errors: ctx.errors };
    }
    const root = this.rollSection(table, section, ctx);
    return { root, text: root.text, errors: ctx.errors };
  }
  reroll(result, path) {
    const before = nodeAt(result.root, path)?.text;
    let errors = [];
    let root = result.root;
    for (let attempt = 0; attempt < REROLL_ATTEMPTS; attempt++) {
      errors = [];
      root = this.rebuildAt(result.root, path, errors);
      if (errors.length > 0 || nodeAt(root, path)?.text !== before) break;
    }
    return { root, text: root.text, errors };
  }
  rebuildAt(node, path, errors) {
    if (path.length === 0) return this.reresolve(node, errors);
    const [index, ...rest] = path;
    const child = index === void 0 ? void 0 : node.parts[index];
    if (!child || child.kind === "text") {
      errors.push(`invalid reroll path at index ${index}`);
      return node;
    }
    const parts = node.parts.slice();
    parts[index] = this.rebuildAt(child, rest, errors);
    return { ...node, parts, text: joinParts(parts) };
  }
  reresolve(node, errors) {
    const table = this.byId.get(node.tableId);
    if (!table) {
      errors.push(`unknown table id "${node.tableId}"`);
      return node;
    }
    const ctx = { table, depth: 0, errors };
    const parts = this.resolveText(node.source, ctx);
    const first = parts.find((part) => part.kind !== "text");
    if (!first) {
      errors.push(`could not reroll "${node.source}"`);
      return node;
    }
    return first;
  }
  rollSection(table, section, ctx) {
    const index = this.pickIndex(section.entries);
    const entry = section.entries[index];
    const inner = { ...ctx, depth: ctx.depth + 1 };
    const parts = this.resolveText(entry.text, inner);
    return {
      kind: "ref",
      source: `[${section.name}]`,
      text: joinParts(parts),
      parts,
      tableId: table.id,
      detail: {
        ref: section.name,
        section: section.name,
        entryIndex: index,
        entryText: entry.text
      }
    };
  }
  resolveText(text, ctx) {
    if (ctx.depth > MAX_DEPTH) {
      ctx.errors.push(`maximum recursion depth reached at "${text}"`);
      return [{ kind: "text", text }];
    }
    const nodes = [];
    let literal = "";
    let i = 0;
    while (i < text.length) {
      const char = text[i];
      if (char === "[") {
        const close = text.indexOf("]", i);
        if (close === -1) {
          literal += text.slice(i);
          break;
        }
        this.flushLiteral(literal, nodes, ctx);
        literal = "";
        nodes.push(this.resolveRef(text.slice(i, close + 1), ctx));
        i = close + 1;
      } else if (char === "{") {
        const close = matchBrace(text, i);
        if (close === -1) {
          literal += text.slice(i);
          break;
        }
        this.flushLiteral(literal, nodes, ctx);
        literal = "";
        nodes.push(this.resolveBraces(text.slice(i, close + 1), ctx));
        i = close + 1;
      } else {
        literal += char;
        i++;
      }
    }
    this.flushLiteral(literal, nodes, ctx);
    return nodes;
  }
  flushLiteral(literal, nodes, ctx) {
    if (literal === "") return;
    let last = 0;
    DICE_PATTERN.lastIndex = 0;
    let match;
    while ((match = DICE_PATTERN.exec(literal)) !== null) {
      if (match.index > last) {
        nodes.push({ kind: "text", text: literal.slice(last, match.index) });
      }
      nodes.push(this.rollDice(match, ctx));
      last = match.index + match[0].length;
    }
    if (last < literal.length) {
      nodes.push({ kind: "text", text: literal.slice(last) });
    }
  }
  rollDice(match, ctx) {
    const count = Number(match[1]);
    const sides = Number(match[2]);
    const modifier = match[3] ? Number(match[3]) : 0;
    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(1 + Math.floor(this.rng.next() * sides));
    }
    const value = rolls.reduce((a, b) => a + b, 0) + modifier;
    return {
      kind: "dice",
      source: match[0],
      text: String(value),
      parts: [{ kind: "text", text: String(value) }],
      tableId: ctx.table.id,
      detail: { rolls, value }
    };
  }
  resolveRef(source, ctx) {
    const expression = source.slice(1, -1).trim();
    const match = expression.match(REF_PATTERN);
    if (!match?.[1]) {
      ctx.errors.push(`unsupported expression "${source}"`);
      return { kind: "text", text: source };
    }
    const [, name, method, countText] = match;
    const target = this.findTarget(ctx.table, name);
    if (!target) {
      ctx.errors.push(`unknown reference "[${name}]"`);
      return { kind: "text", text: source };
    }
    if (!method) {
      const node = this.rollSection(target.table, target.section, {
        ...ctx,
        table: target.table,
        depth: ctx.depth + 1
      });
      return { ...node, source, detail: { ...node.detail, ref: name } };
    }
    const requested = Number(countText);
    const unique = method === "selectUnique";
    const pool = target.section.entries.map((entry, index) => ({ entry, index }));
    const count = unique ? Math.min(requested, pool.length) : requested;
    const parts = [];
    for (let i = 0; i < count; i++) {
      const poolIndex = this.pickIndex(pool.map((p) => p.entry));
      const picked = pool[poolIndex];
      if (unique) pool.splice(poolIndex, 1);
      if (parts.length > 0) parts.push({ kind: "text", text: LIST_SEPARATOR });
      const inner = { ...ctx, table: target.table, depth: ctx.depth + 1 };
      const resolved = this.resolveText(picked.entry.text, inner);
      parts.push({
        kind: "ref",
        source: `[${name}]`,
        text: joinParts(resolved),
        parts: resolved,
        tableId: target.table.id,
        detail: {
          ref: name,
          section: target.section.name,
          entryIndex: picked.index,
          entryText: picked.entry.text
        }
      });
    }
    return {
      kind: "ref",
      source,
      text: joinParts(parts),
      parts,
      tableId: ctx.table.id,
      detail: { ref: name, section: target.section.name }
    };
  }
  resolveBraces(source, ctx) {
    const inner = source.slice(1, -1);
    const branches = splitBranches(inner);
    if (branches.length === 1) {
      const range = branches[0].match(RANGE_PATTERN);
      if (range) {
        const low = Number(range[1]);
        const high = Number(range[2]);
        const value = low + Math.floor(this.rng.next() * (high - low + 1));
        return {
          kind: "range",
          source,
          text: String(value),
          parts: [{ kind: "text", text: String(value) }],
          tableId: ctx.table.id,
          detail: { value }
        };
      }
    }
    const entries = branches.map((branch) => parseBranch(branch));
    const index = this.pickIndex(entries);
    const chosen = entries[index];
    const innerCtx = { ...ctx, depth: ctx.depth + 1 };
    const parts = this.resolveText(chosen.text, innerCtx);
    return {
      kind: "choice",
      source,
      text: joinParts(parts),
      parts,
      tableId: ctx.table.id,
      detail: { entryIndex: index, entryText: chosen.text }
    };
  }
  findTarget(table, name) {
    if (!name) return null;
    const local = findSection(table, name);
    if (local) return { table, section: local };
    const external = this.byName.get(normalizeName(name));
    if (external) {
      const section = findSection(external, "output") ?? external.sections[0] ?? null;
      if (section) return { table: external, section };
    }
    return null;
  }
  pickIndex(entries) {
    const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
    let remaining = this.rng.next() * total;
    for (let i = 0; i < entries.length; i++) {
      remaining -= entries[i].weight;
      if (remaining < 0) return i;
    }
    return entries.length - 1;
  }
};
function nodeAt(root, path) {
  let node = root;
  for (const index of path) {
    if (node.kind === "text") return null;
    const child = node.parts[index];
    if (!child) return null;
    node = child;
  }
  return node;
}
function findSection(table, name) {
  const wanted = normalizeName(name);
  return table.sections.find((s) => normalizeName(s.name) === wanted) ?? null;
}
function joinParts(parts) {
  return parts.map((part) => part.text).join("");
}
function matchBrace(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}
function splitBranches(inner) {
  const branches = [];
  let depth = 0;
  let current = "";
  for (const char of inner) {
    if (char === "{") depth++;
    else if (char === "}") depth--;
    if (char === "|" && depth === 0) {
      branches.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  branches.push(current);
  return branches;
}
function parseBranch(branch) {
  const match = branch.match(/\s*\^(\d*\.?\d+)\s*$/);
  if (match?.[1]) {
    return { text: branch.slice(0, match.index).trimEnd(), weight: Number(match[1]) };
  }
  return { text: branch, weight: 1 };
}

// src/main.ts
var import_obsidian = require("obsidian");
var PerhapsPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "index", /* @__PURE__ */ new Map());
  }
  async onload() {
    this.app.workspace.onLayoutReady(() => void this.buildIndex());
    this.registerEvent(this.app.vault.on("create", (f) => void this.reindex(f)));
    this.registerEvent(this.app.vault.on("modify", (f) => void this.reindex(f)));
    this.registerEvent(this.app.vault.on("delete", (f) => this.index.delete(f.path)));
    this.registerEvent(
      this.app.vault.on("rename", (f, oldPath) => {
        this.index.delete(oldPath);
        void this.reindex(f);
      })
    );
    this.addCommand({
      id: "roll-table",
      name: "Roll a table",
      callback: () => {
        new TablePicker(this, (table) => {
          new RollModal(this, table).open();
        }).open();
      }
    });
    this.addCommand({
      id: "insert-roll",
      name: "Roll a table into the note",
      editorCallback: (editor) => {
        new TablePicker(this, (table) => {
          const result = this.createRoller().roll(table);
          editor.replaceSelection(result.text);
        }).open();
      }
    });
    const renderBlock = (source, el, ctx) => this.renderBlock(source, el, ctx.sourcePath);
    this.registerMarkdownCodeBlockProcessor("perhaps", renderBlock);
    this.registerMarkdownCodeBlockProcessor("perchance", renderBlock);
  }
  allTables() {
    return [...this.index.values()].flat();
  }
  createRoller(extra) {
    const tables = this.allTables();
    if (extra) tables.push(extra);
    return new Roller(tables, createRng());
  }
  async buildIndex() {
    for (const file of this.app.vault.getMarkdownFiles()) {
      await this.indexFile(file);
    }
  }
  async reindex(file) {
    if (file instanceof import_obsidian.TFile && file.extension === "md") {
      await this.indexFile(file);
    }
  }
  async indexFile(file) {
    const content = await this.app.vault.cachedRead(file);
    const tables = parseMarkdown(content, file.path);
    if (tables.length > 0) {
      this.index.set(file.path, tables);
    } else {
      this.index.delete(file.path);
    }
  }
  renderBlock(source, el, sourcePath) {
    const { table, errors } = parseBlock(source, { path: sourcePath });
    const box = el.createDiv({ cls: "perhaps-block" });
    if (!table) {
      box.createDiv({ cls: "perhaps-error", text: `perhaps: ${errors.join("; ")}` });
      return;
    }
    const header = box.createDiv({ cls: "perhaps-header" });
    header.createSpan({ cls: "perhaps-title", text: table.title });
    const rollButton = header.createEl("button", { cls: "perhaps-roll-button", text: "roll" });
    const output = box.createDiv({ cls: "perhaps-output" });
    let roller = this.createRoller(table);
    let result = null;
    const update = (next) => {
      result = next;
      output.empty();
      const line = output.createDiv({ cls: "perhaps-result" });
      renderNodes(line, next.root.parts, [], (path) => update(roller.reroll(result, path)));
      renderErrors(output, next.errors);
      const copy = output.createEl("button", { cls: "perhaps-copy-button", text: "copy" });
      copy.addEventListener("click", () => void copyText(next.text));
    };
    rollButton.addEventListener("click", () => {
      roller = this.createRoller(table);
      update(roller.roll(table));
    });
  }
};
var TablePicker = class extends import_obsidian.FuzzySuggestModal {
  constructor(plugin, onPick) {
    super(plugin.app);
    __publicField(this, "plugin", plugin);
    __publicField(this, "onPick", onPick);
    this.setPlaceholder("Roll a table...");
  }
  getItems() {
    return this.plugin.allTables();
  }
  getItemText(table) {
    return `${table.title} (${table.source?.path ?? ""})`;
  }
  onChooseItem(table) {
    this.onPick(table);
  }
};
var RollModal = class extends import_obsidian.Modal {
  constructor(plugin, table) {
    super(plugin.app);
    __publicField(this, "plugin", plugin);
    __publicField(this, "table", table);
    __publicField(this, "roller");
    __publicField(this, "result");
    this.roller = plugin.createRoller();
    this.result = this.roller.roll(table);
  }
  onOpen() {
    this.render();
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { cls: "perhaps-title", text: this.table.title });
    const line = contentEl.createDiv({ cls: "perhaps-result perhaps-modal-result" });
    renderNodes(line, this.result.root.parts, [], (path) => {
      this.result = this.roller.reroll(this.result, path);
      this.render();
    });
    renderErrors(contentEl, this.result.errors);
    const buttons = contentEl.createDiv({ cls: "perhaps-buttons" });
    const again = buttons.createEl("button", { text: "roll again" });
    again.addEventListener("click", () => {
      this.result = this.roller.roll(this.table);
      this.render();
    });
    const copy = buttons.createEl("button", { text: "copy" });
    copy.addEventListener("click", () => void copyText(this.result.text));
    const hint = contentEl.createDiv({ cls: "perhaps-hint" });
    hint.setText("click any underlined part to reroll just that part");
  }
};
function renderNodes(parent, nodes, path, onReroll) {
  nodes.forEach((node, i) => {
    if (node.kind === "text") {
      parent.appendText(node.text);
      return;
    }
    const span = parent.createSpan({
      cls: `perhaps-node perhaps-${node.kind}`,
      attr: { title: `reroll ${node.source}` }
    });
    span.addEventListener("click", (event) => {
      event.stopPropagation();
      onReroll([...path, i]);
    });
    renderNodes(span, node.parts, [...path, i], onReroll);
  });
}
function renderErrors(parent, errors) {
  if (errors.length === 0) return;
  parent.createDiv({ cls: "perhaps-error", text: errors.join("; ") });
}
async function copyText(text) {
  await navigator.clipboard.writeText(text);
  new import_obsidian.Notice("copied");
}

/* nosourcemap */