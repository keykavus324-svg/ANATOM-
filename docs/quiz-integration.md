# Free Anatomy Quiz integration

- Entry: `#/quizler`; stable detail route: `#/quizler/<catalog-id>`.
- Catalog: `src/quizCatalog.js`. 159 links across seven categories. Turkish labels are navigation metadata; quizzes remain in English.
- Link source pages: generalterminology.html, skeletalsystem.html, muscularsystem.html, internalorgans.html, surfaceanatomy.html, senses.html, brain.html, reproductivemain.html. Checked with the page retrieval tool on 2026-10-15. This is a curated index, not a claim to reproduce all 200+ quizzes, therapy resources or every physiology series.
- No source question bank, images, answer keys or scripts are copied or proxied. No claim of publisher permission, partnership or open licensing is made.
- The embedded page is only requested after the visitor presses **Quizi burada başlat**. Before that there are no publisher requests or remotely loaded thumbnails.
- Native embedding does not bypass frame protection. Publisher CSP/frame policies, connectivity or browser settings can block it. An always-visible direct link opens the identical source quiz in a separate tab.
- Browser cross-origin protections prevent reading answers, scores and the iframe's current URL. A load event is not evidence of a usable quiz. The UI never claims automatic results sync or quiz completion. “Çalıştım” is a self-reported local study mark. Resume only reopens the source URL, not a saved question.
- Local preferences use dedicated keys, validate IDs and tolerate unavailable storage. No changes to existing practice bank, saved lesson notes or exam scoring.
- `sandbox` restricts top navigation while permitting source scripts, origin, forms and user-opened windows. The source may serve its own cookies, ads or other third-party content once loaded; this is disclosed before start.

## Validation

- Unit tests verify link origins/case, unique IDs, lesson mappings, route round trips, filters and preference validation.
- Browser tests cover consent-gated iframe insertion, direct-link fallback, reload, browser back, favorites, self-reported study marks, empty states, mobile overflow, invalid routes, unavailable storage and the original practice entry.
- External frames are mocked in automated UI tests. Live third-party iframe compatibility is **not verified** in this sandbox, whose browser network access is restricted. No claim that all publisher quiz pages successfully embed is made.
