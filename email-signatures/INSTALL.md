# Quarry Email Signature — Install Guide

Per-client setup for the HTML signatures in [staff/](staff/). Pick your client below and follow the steps. The HTML files reference images hosted on `assets.wearequarry.com`, so no image files need to be installed locally.

> **Mobile reality check:** mobile mail apps (iOS Mail, Outlook iOS/Android, Gmail Android) generally don't support HTML signatures — they fall back to plain text. The setups below cover the desktop/web clients where HTML signatures actually render. On mobile, set a short plain-text signature in the app instead.

---

## Outlook (Windows desktop)

The most reliable method — drop the HTML file into Outlook's Signatures folder.

1. Find your signature file in [staff/](staff/), e.g. `signature_mark_chambers.html`.
2. Press `Win + R`, paste this and hit Enter:
   ```
   %APPDATA%\Microsoft\Signatures
   ```
3. Copy the HTML file into that folder. **Rename the extension from `.html` to `.htm`** (Outlook only recognises `.htm`).
4. Open Outlook → **File** → **Options** → **Mail** → **Signatures...**
5. Your signature should appear in the list. Set it as default for **New messages** and **Replies/forwards** as desired.
6. Click **OK** and send a test email to yourself to verify.

**If images don't appear:** Outlook may block external images by default. Click **"Click here to download pictures"** in the test email, or in Outlook → **File** → **Options** → **Trust Center** → **Trust Center Settings** → **Automatic Download** → uncheck *"Don't download pictures automatically..."*

---

## Outlook (Mac desktop)

1. Open Outlook → **Outlook** menu → **Settings** → **Signatures**.
2. Click **+** to add a new signature, give it a name (e.g. "Quarry").
3. Open your `signature_*.html` file in a web browser (Safari/Chrome).
4. Select the entire rendered signature (`Cmd + A`) and copy (`Cmd + C`).
5. Click into the Outlook signature editor and paste (`Cmd + V`). The formatted version should appear.
6. Close the dialog, then under **Choose default signature**, set it for new messages/replies.
7. Send a test email to verify.

> **Note:** Outlook for Mac sometimes mangles spacing on paste. If something looks off, try pasting via `Edit` → `Paste and Match Style` first, then paste again normally — bizarre but it sometimes resets the editor state.

---

## Outlook on the Web (Outlook 365 / OWA)

1. Open the HTML file in a web browser.
2. Select the rendered signature (`Cmd/Ctrl + A`) and copy.
3. In Outlook web → click the gear icon → **View all Outlook settings** → **Mail** → **Compose and reply**.
4. Paste into the **Email signature** box.
5. Tick **"Automatically include my signature on new messages I compose"** (and replies, if desired).
6. Click **Save**.

---

## Apple Mail (macOS)

Apple Mail is the trickiest because the GUI strips HTML on paste. The reliable method swaps in the HTML at the file level:

1. Open Mail → **Mail** menu → **Settings** → **Signatures**.
2. Select the account on the left, click **+** to create a new signature, give it any name (e.g. "Quarry"), type any placeholder text, and close Settings.
3. **Quit Mail completely** (`Cmd + Q`).
4. In Finder, press `Cmd + Shift + G` and paste:
   ```
   ~/Library/Mail/V10/MailData/Signatures/
   ```
   *(If `V10` doesn't exist, look for the highest `V` number — V8, V9, V10, etc.)*
5. You'll see a `.mailsignature` file with a UUID name (the most recently created one is yours). Open it in a text editor (TextEdit in plain-text mode, or VS Code).
6. Keep the top header lines (`Content-Transfer-Encoding`, `Content-Type`, `Mime-Version`, blank line). **Replace everything below** the blank line with the **entire contents** of your `signature_*.html` file.
7. Save.
8. **Lock the file** so Mail doesn't overwrite it: select the `.mailsignature` file in Finder → `Cmd + I` → tick **Locked**.
9. Reopen Mail. The signature should now render with HTML when composing.

---

## Gmail (web)

Gmail's signature settings strip `<style>` blocks but preserve inline styles. The signature will render correctly but **media queries (responsive mobile resizing) won't work**.

1. Open your `signature_*.html` file in a web browser.
2. Select the rendered signature (`Cmd/Ctrl + A`) and copy.
3. In Gmail → click the gear icon → **See all settings** → **General** tab.
4. Scroll to **Signature** → **+ Create new** → name it.
5. Paste into the editor.
6. Under **Signature defaults**, set it for new emails / replies.
7. Scroll to the bottom and click **Save Changes**.

> **Tip:** Gmail's signature editor has a max length. Our signatures are well under the limit, but if you ever hit it, the `<style>` block can be safely removed (it's already stripped on save anyway).

---

## Mobile (iOS Mail, Outlook mobile, Gmail mobile)

Mobile mail apps don't reliably render HTML signatures — they typically strip everything and show plain text. Recommended approach:

- **Set a plain-text signature in your mobile mail app**, e.g.:
  ```
  Mark Chambers
  Senior Associate
  Quarry Architects
  01483 301661 | 07957 202999
  mark@quarryarchitects.com
  wearequarry.com
  ```
- The HTML signature will appear correctly when recipients view your emails on desktop, regardless of the device you sent from (as long as you composed from a desktop client). When you send from mobile, the recipient sees your plain-text mobile signature.

---

## Verification checklist

After installing, send a test email to yourself and check:

- [ ] Logo, Q mark, and angle icon all load (no broken-image placeholders)
- [ ] The dark banner is `#2D2D27` (charcoal), not inverted to white/grey by dark mode
- [ ] Tagline reads "Buildings that blend / purpose and place." with the second line dimmed
- [ ] Office and (if applicable) mobile numbers are clickable
- [ ] Email address is a `mailto:` link
- [ ] Banner clicks through to https://wearequarry.com
- [ ] On a phone (open the test email in your phone's mail app), the layout doesn't overflow horizontally

---

## Regenerating signatures

If staff details change (new joiner, role change, mobile added), edit [staff.csv](staff.csv) and run:

```bash
cd email-signatures
node generate.js
```

This rewrites all files in [staff/](staff/) from [signature_template.html](signature_template.html). The template is the source of truth — never edit individual `staff/signature_*.html` files directly, as changes will be overwritten on the next run.
