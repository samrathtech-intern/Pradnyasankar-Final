# Build fix

This package is the corrected, self-contained project.

1. Extract it into a new empty folder. Do not merge it over an older Pradnyasanskar project.
2. Run `npm ci`.
3. Run `npm run validate`.
4. Run `npm run build`.

The TypeScript alias is configured with both `baseUrl` and `paths`. Compatibility modules are also included for `AnnouncementBar` and `BrandTicker` so stale imports from earlier revisions do not fail immediately.
