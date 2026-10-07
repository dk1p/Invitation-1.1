# What changed

| File | Change |
|---|---|
| `index.html` | Two new sections (Find the Venue, Send Your Wishes) between Ceremonies and the closing note, plus a toast and a spark layer before the music button |
| `css/style.css` | New styles appended at the bottom |
| `js/app.js` | New code appended at the bottom. The countdown date was also corrected (see below) |
| `apps-script/Code.gs` | Optional backend that saves wishes to a Google Sheet |

Copy `index.html`, `css/style.css` and `js/app.js` over your project. Your `assets/` folder is untouched.

## Make wishes visible to every guest (5 minutes, free)

Without this step, a wish only appears on the device that sent it.

1. Create a new Google Sheet. Open **Extensions > Apps Script**.
2. Delete the sample code and paste in everything from `apps-script/Code.gs`. Save.
3. Click **Deploy > New deployment > Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorise when asked, then copy the **Web app URL** (it ends in `/exec`).
5. In `js/app.js`, paste it into `const WISHES_ENDPOINT = '';`.
6. Test by sending a wish. A row should appear in the **Wishes** tab.

To hide a wish from the website, type `no` in its **approved** column.
If you change `Code.gs` later, use **Deploy > Manage deployments > Edit > New version**.

## Edit the venue

At the top of the new block in `js/app.js` is a `VENUE` object (name, address, search text, short link). The "Get Directions" and "Open in Maps" buttons are in `index.html` inside `#venue`.
