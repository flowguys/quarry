#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, 'signature_template.html');
const CSV = path.join(ROOT, 'staff.csv');
const OUT_DIR = path.join(ROOT, 'staff');

const OFFICE_DISPLAY = '01483 301661';
const OFFICE_TEL = '01483301661';

const MOBILE_ROW = (telDigits, display) => `        <tr>
          <td style="font-family:Calibri,'Helvetica Neue',Arial,Helvetica,sans-serif;font-size:12px;line-height:12px;color:#2D2D27;font-weight:400;letter-spacing:0.02em;padding:0;">
            <a href="tel:${telDigits}" style="color:#2D2D27;text-decoration:none;">${display}</a>
          </td>
        </tr>
`;

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = lines.shift().split(',').map((h) => h.trim());
  return lines.map((line) => {
    const cols = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] ?? '').trim();
    });
    return row;
  });
}

function slug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function digitsOnly(s) {
  return s.replace(/\D/g, '');
}

function render(template, person) {
  const mobileBlock = person.mobile
    ? MOBILE_ROW(digitsOnly(person.mobile), escapeHtml(person.mobile))
    : '';
  return template
    .replace(/\{\{name\}\}/g, escapeHtml(person.name))
    .replace(/\{\{title\}\}/g, escapeHtml(person.title))
    .replace(/\{\{email\}\}/g, escapeHtml(person.email))
    .replace(/\{\{office_tel\}\}/g, OFFICE_TEL)
    .replace(/\{\{office_display\}\}/g, OFFICE_DISPLAY)
    .replace(/\{\{office_padding\}\}/g, person.mobile ? '0 0 6px 0' : '0')
    .replace(/\{\{mobile_block\}\}/g, mobileBlock);
}

function main() {
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const staff = parseCsv(fs.readFileSync(CSV, 'utf8'));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const person of staff) {
    if (!person.name) continue;
    const html = render(template, person);
    const file = path.join(OUT_DIR, `signature_${slug(person.name)}.html`);
    fs.writeFileSync(file, html);
    console.log(`✓ ${path.relative(ROOT, file)}`);
  }
  console.log(`\nGenerated ${staff.length} signature(s) in ${path.relative(ROOT, OUT_DIR)}/`);
}

main();
