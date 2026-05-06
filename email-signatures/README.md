# Quarry Email Signatures

Source for Quarry Architects' HTML email signatures. One signature per staff member, generated from a CSV + a single HTML template.

End-user install steps (Outlook, Apple Mail, Gmail, etc.) live in [INSTALL.md](INSTALL.md). This README is for whoever is editing the template, the staff list, or regenerating the files.

## How it works

- [staff.csv](staff.csv) — one row per person (`name,title,email,mobile`). `mobile` may be empty.
- [signature_template.html](signature_template.html) — the master HTML, with `{{name}}`, `{{title}}`, `{{email}}`, `{{office_tel}}`, `{{office_display}}`, `{{office_padding}}`, and `{{mobile_block}}` placeholders.
- [generate.js](generate.js) — renders the template once per CSV row and writes `staff/signature_<slug>.html`. No dependencies; pure Node.
- [staff/](staff/) — generated output. Committed to the repo because GitHub Pages serves it.
- [img/](img/) — local copies of the images referenced by the template. The deployed signatures load these from `https://assets.wearequarry.com/email-signatures/img/...`, so anything you add here becomes available at that URL once pushed.

The office number (`01483 301661`) is hardcoded in [generate.js](generate.js); change it there if it ever moves. If `mobile` is blank for a staff member, the mobile row is omitted and the office row's bottom padding collapses so the layout stays tight.

## Regenerating signatures

```bash
node generate.js
```

Run from this directory after editing `staff.csv` or `signature_template.html`. It overwrites every file in `staff/`. Commit the regenerated HTML — GitHub Pages serves it directly, there's no build step on deploy.

## Adding or changing a person

1. Edit [staff.csv](staff.csv). Keep the header row; mobile can be left blank.
2. Run `node generate.js`.
3. Commit `staff.csv` and the changed files under `staff/`.
4. Push. The new signature is live at `https://assets.wearequarry.com/email-signatures/staff/signature_<slug>.html` once Pages deploys, and end users follow [INSTALL.md](INSTALL.md) to add it to their mail client.

The slug is derived from the name: lowercase, accents stripped, non-alphanumerics → `_`. So `Lucy Bushell` → `signature_lucy_bushell.html`.

## Editing the design

All styling is inline (and a `<style>` block for media queries) inside [signature_template.html](signature_template.html). Stick to email-safe HTML — table layouts, inline styles, no flex/grid, no external CSS. Gmail strips `<style>`, so any visual that must survive there has to be inline. Apple Mail and Outlook desktop respect the `<style>` block, so use it for hover states and mobile media queries only.

After any template change, run `node generate.js` and spot-check at least one signature in a real mail client before committing — copy the rendered HTML from a browser into a draft and look at it on desktop and the Gmail web composer. Mobile rendering is intentionally not supported (see [INSTALL.md](INSTALL.md)).
