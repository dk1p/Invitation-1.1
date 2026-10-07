/**
 * Wedding wishes collector (Google Apps Script)
 * Bound to a Google Sheet. Each wish becomes one row.
 * To hide a wish from the website, type "no" in its "approved" column.
 */

const SHEET_NAME = 'Wishes';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'timestamp', 'name', 'relation', 'message', 'approved']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean_(value, max) {
  let text = String(value || '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
  // A leading space stops Sheets from treating the text as a formula
  if (/^[=+\-@]/.test(text)) text = ' ' + text;
  return text;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const name = clean_(data.name, 40);
    const relation = clean_(data.relation, 20);
    const message = clean_(data.message, 300);

    if (!name || message.length < 3) return json_({ ok: false });

    getSheet_().appendRow([
      String(data.id || Utilities.getUuid()).slice(0, 64),
      Date.now(),
      name,
      relation,
      message,
      'yes'
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const rows = getSheet_().getDataRange().getValues().slice(1);

  const wishes = rows
    .filter(r => String(r[5]).toLowerCase() !== 'no')
    .map(r => ({
      id: String(r[0]),
      ts: Number(r[1]),
      name: String(r[2]).trim(),
      relation: String(r[3]).trim(),
      message: String(r[4]).trim()
    }))
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 200);

  return json_({ wishes: wishes });
}
