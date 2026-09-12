# The India Visit editor — one page

The site's content is edited at **`/admin`** on the live site (for example
`https://your-domain/admin/`). Sign in with the account set up for you on
Tina Cloud. Everything you change is saved as a commit to the site's
repository; the site rebuilds itself in about two minutes and publishes.

## The three things you will do most

**1. Edit text.** Open a collection in the left sidebar — *Journeys*,
*Destinations*, *City pages*, *Travel Guide articles*, *Testimonials* or
*Site settings* — pick the entry, change the field, press **Save**. That is a
publish. There is no separate "publish" step and no preview server: the change
is live once the rebuild finishes.

**2. Swap an image.** Every photograph on the site is a field. Click the image
field, choose **Upload** in the media library, pick the file, and Save. Images
land in the site's own media folder and are converted to fast formats
automatically — upload the best-quality JPEG you have (up to about 4000 px on
the long side); the site does the rest.

**3. Change a phone number, email or address.** These live in **Site settings**,
once, and appear everywhere. Change *Phone* **and** *Phone link* together (the
link is `tel:` followed by the digits, no spaces).

## The things that will save you a support call

- **A save that breaks a rule is refused, not published.** If you leave a
  required field empty, put text where a number should go, or set a train
  journey without its cabins, the site's build fails and the **last good
  version stays live**. You will see the failure in the Cloudflare dashboard;
  fix the field and save again. Nothing half-finished ever reaches a visitor.
- **Empty means "don't show".** The founding year, traveller count, rating,
  founder name and portrait are deliberately empty. Leave them empty until
  you have the real value; the site simply omits that line. Never type a
  placeholder.
- **Undo.** Every save is a commit. To undo one: in the Cloudflare Pages
  dashboard, open *Deployments*, find the previous good deployment, and click
  **Rollback**. The site reverts in seconds; the content change is still in
  the repository history and can be re-applied or edited.
- **Testimonials need consent.** A real review needs *Written consent
  recorded* switched on, or it will not publish. A slot with no review yet is
  a *Placeholder* — no name, no quote.
- **Trains never show prices.** There is nowhere to put one. Cabin cards read
  "Enquire for pricing" by design.
- **The homepage video** is two uploads: the **poster** (required — it is
  what loads first) and the clip (MP4, optional, about 15 MB or less, 1080p).
  Upload the clip in the media library, then paste its path
  (`/uploads/yourfile.mp4`) into the *Hero video — MP4* field.
- **New journey or article:** *Journeys* → **Create new**. The filename becomes
  the web address, so make it short and lowercase (the editor suggests one
  from the title). Fill every required field; the *Itinerary at a glance* must
  have exactly one row per day.

## Where the rules live

The site's own rules — what is required, what is locked, why prices are
absent — are described next to each field in the editor. The long version is
`CLAUDE.md` in the repository, which your agency maintains.
