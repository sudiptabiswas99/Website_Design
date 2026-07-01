// Single source of truth for the live experiment. Change WHAT is tested HERE —
// nothing else in the A/B code needs to change. Bump `id` to start a fresh data set.
export const experiment = {
  id: 'hero-cta-2026-06',
  goal: 'Booking request submitted (POST /api/book)',
  page: 'index.html', // the light homepage — the only page under test

  cookieVid: 'ab_vid', // sticky visitor id (dedupes views + conversions)
  cookieVariant: 'ab_hero_cta', // sticky variant assignment
  cookieMaxDays: 30,

  variants: {
    A: {
      label: 'Control · "Book a Visit"',
      weight: 1,
      replace: [], // control = the page exactly as authored
    },
    B: {
      label: 'Quote-led · "Get My Free Quote"',
      weight: 1,
      // Surgical: this exact string is unique to the hero primary CTA (index.html:147).
      replace: [
        {
          find: 'class="btn btn--cta btn--lg">Book a Visit</a>',
          with: 'class="btn btn--cta btn--lg">Get My Free Quote</a>',
        },
      ],
    },
  },
};

export const variantKeys = Object.keys(experiment.variants);
