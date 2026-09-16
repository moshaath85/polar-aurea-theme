#!/usr/bin/env node
/**
 * Twilight schema validator for the Aurea theme.
 *
 * Salla's importer validates `twilight.json` against the Twilight schema and
 * fails with "Error in theme JSON format" when a key/type/format is not allowed.
 * Valid JSON is NOT enough.
 *
 * This script compares ./twilight.json against the official starter theme
 * (SallaApp/theme-raed) which is guaranteed to pass the importer, and reports
 * every structural deviation.
 *
 * Usage:  node scripts/validate-twilight.mjs
 *         npm run validate
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REF_URL = 'https://raw.githubusercontent.com/SallaApp/theme-raed/master/twilight.json';
const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const errors = [];
const warns = [];
const ok = (m) => console.log(`\u2705 ${m}`);
const bad = (m) => { errors.push(m); console.log(`\u274c ${m}`); };
const warn = (m) => { warns.push(m); console.log(`\u26a0\ufe0f  ${m}`); };

function pairSet(components) {
  const set = new Set();
  const walk = (fields) => {
    for (const f of fields || []) {
      set.add(`${f.type}/${f.format}`);
      if (f.fields) walk(f.fields);
    }
  };
  for (const c of components || []) walk(c.fields);
  return set;
}

const theme = JSON.parse(await readFile(path.join(ROOT, 'twilight.json'), 'utf8'));

let ref;
try {
  const res = await fetch(REF_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  ref = await res.json();
  ok(`reference schema loaded (theme-raed)`);
} catch (e) {
  warn(`could not load reference (${e.message}) — running offline checks only`);
}

// 1. required root keys (only if reference available)
if (ref) {
  const refKeys = new Set(Object.keys(ref));
  const myKeys = new Set(Object.keys(theme));
  const extra = [...myKeys].filter((k) => !refKeys.has(k));
  const missing = [...refKeys].filter((k) => !myKeys.has(k));
  extra.length ? bad(`root keys not in schema: ${extra.join(', ')}`) : ok('root keys ⊆ schema');
  missing.length ? bad(`missing root keys: ${missing.join(', ')}`) : ok('no missing root keys');

  const refSettingsTypes = new Set(ref.settings.map((s) => s.type));
  const mySettingsTypes = [...new Set(theme.settings.map((s) => s.type))];
  const badTypes = mySettingsTypes.filter((t) => !refSettingsTypes.has(t));
  badTypes.length
    ? bad(`settings types not allowed: ${badTypes.join(', ')} (allowed: ${[...refSettingsTypes].join(', ')})`)
    : ok(`settings types valid: ${mySettingsTypes.join(', ')}`);

  const refFeatures = new Set(ref.features);
  const badFeatures = theme.features.filter((f) => !refFeatures.has(f));
  badFeatures.length ? bad(`unknown feature flags: ${badFeatures.join(', ')}`) : ok('feature flags valid');

  const refPairs = pairSet(ref.components);
  const badPairs = [...pairSet(theme.components)].filter((p) => !refPairs.has(p));
  badPairs.length
    ? bad(`field type/format not allowed: ${badPairs.join(', ')}`)
    : ok('all component field type/format pairs are allowed');

  const refComponentKeys = new Set(ref.components.flatMap((c) => Object.keys(c)));
  const badComponentKeys = new Set();
  for (const c of theme.components) {
    for (const k of Object.keys(c)) if (!refComponentKeys.has(k)) badComponentKeys.add(k);
  }
  badComponentKeys.size
    ? bad(`component keys not in schema: ${[...badComponentKeys].join(', ')}`)
    : ok('component object keys valid');
}

// 2. always-on structural checks
theme.components.forEach((c) => {
  if (!UUID_RE.test(String(c.key || ''))) bad(`component "${c.path}" has a non-UUID key: ${c.key}`);
  if (!c.image) bad(`component "${c.path}" is missing the required "image" field`);
  if (!c.path) bad(`component is missing "path"`);
  if (!c.title || typeof c.title !== 'object') bad(`component "${c.path}" title must be an object {ar,en}`);
});

if (!theme.settings?.length) bad('no settings defined');
if (!theme.components?.length) bad('no components defined');
if (theme.repository && !/^https:\/\/github\.com\//.test(theme.repository)) warn('repository should be a GitHub URL');

// 3. size guard (Salla limits: 1MB public / 2MB private)
const bytes = Buffer.byteLength(JSON.stringify(theme));
bytes > 350_000 ? warn(`twilight.json is large: ${(bytes / 1024).toFixed(0)}KB`) : ok(`twilight.json size ${(bytes / 1024).toFixed(0)}KB`);

console.log('');
if (errors.length) {
  console.log(`\u274c FAILED — ${errors.length} schema error(s). Fix them before importing into Salla.`);
  process.exit(1);
}
console.log(`\u2705 PASSED — twilight.json matches the Twilight schema${warns.length ? ` (${warns.length} warning(s))` : ''}.`);
