/**
 * Live lead forms: submit in place, then show the success state.
 * ---------------------------------------------------------------------------
 * Applies only to forms marked `data-live` (src/lib/forms.ts decides which).
 * Without JavaScript the same form still posts to /api/lead, which answers a
 * plain page with the same message, so nothing depends on this file.
 *
 * The forms carry `novalidate` so the browser does not interrupt a half-filled
 * stepper; validity is checked here, on submit, with the browser's own
 * messages. The server validates again regardless.
 */
const live = document.querySelectorAll<HTMLFormElement>('form[data-lead-form][data-live]');

for (const form of live) {
  if (form.dataset.leadReady) continue;
  form.dataset.leadReady = '1';

  const status = form.querySelector<HTMLElement>('[data-lead-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = button?.querySelector<HTMLElement>('.btn__label');
  const idle = label?.textContent ?? '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (button) button.disabled = true;
    if (label) label.textContent = 'Sending…';
    if (status) status.textContent = '';

    let ok = false;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { accept: 'application/json' },
      });
      const data = await response.json().catch(() => ({}));
      ok = response.ok && data.ok === true;
    } catch {
      ok = false;
    }

    if (ok) {
      const done = document.createElement('p');
      done.className = 'form__done';
      done.setAttribute('role', 'status');
      done.tabIndex = -1;
      done.textContent = form.dataset.successText ?? '';
      form.replaceChildren(done);
      done.focus({ preventScroll: false });
      return;
    }

    if (status) status.textContent = form.dataset.errorText ?? '';
    if (button) button.disabled = false;
    if (label) label.textContent = idle;
  });
}
