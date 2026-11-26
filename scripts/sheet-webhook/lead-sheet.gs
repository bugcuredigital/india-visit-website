/**
 * India Visit: the lead Sheet webhook (Google Apps Script, bound to the Sheet).
 * ---------------------------------------------------------------------------
 * functions/api/lead.ts posts every lead here as JSON, after the email has been
 * sent, and this appends one row to the "Leads" tab. Setup steps:
 * docs/LAUNCH_DAY.md, "Before launch day", step B.
 *
 * The request carries a shared secret (the Script Property SHARED_SECRET must
 * equal the Cloudflare secret SHEET_WEBHOOK_SECRET); anything without it is
 * refused, so the public /exec URL cannot be used to write rows.
 *
 * Columns are fixed for the fields every form shares; everything else a form
 * sends (the Plan My Trip stepper, the corporate brief) goes into "Details",
 * one "field: value" per line, so adding a field to a form never needs a
 * change here.
 *
 * Paste this whole file into Extensions → Apps Script, replacing what is there.
 * If it is ever edited, deploy again: Deploy → Manage deployments → edit →
 * Version: New version. The /exec URL stays the same.
 */

var SHEET_NAME = 'Leads';

var COLUMNS = [
  ['receivedAt', 'Received'],
  ['leadType', 'Type'],
  ['name', 'Name'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['company', 'Company'],
  ['journeyTitle', 'Journey'],
  ['message', 'Message'],
  ['details', 'Details'],
  ['pageUrl', 'Page'],
  ['utm', 'Campaign (UTM)'],
  ['emailStatus', 'Email sent'],
];

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'unreadable' });
  }

  var secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
  if (!secret || body.secret !== secret) return reply({ ok: false, error: 'unauthorised' });

  var lead = body.lead || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }));
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(COLUMNS.map(function (c) {
      return c[0] === 'receivedAt' ? new Date() : cell(lead[c[0]]);
    }));
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

/**
 * A value as the Sheet should store it. Anything starting with = + - or @ is
 * kept as text, so a visitor cannot put a formula into the Sheet, and a phone
 * number such as +91 98102 41121 is not read as a sum.
 */
function cell(value) {
  if (value === null || value === undefined) return '';
  var text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
}
