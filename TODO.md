# B2B Enquiry Backend Integration

## Steps
- [x] 1. Understand the task and read relevant files (b2b/page.tsx, b2bApi.ts, faqApi.ts, configs)
- [x] 2. Update `src/lib/b2bApi.ts` — set API base default to `http://localhost:8080`
- [x] 3. Update `src/app/b2b/page.tsx` — add required `enquiryType` to submit payload & fix `trackEnquirySubmission` call
- [x] 4. Verify with `npm run build` (build passes)
- [x] 5. Fix "Submit not clicking" — add missing consent checkbox to B2B form (validate() required it but it was never rendered)
- [x] 6. Restart dev server & verify `/b2b` loads (HTTP 200)
- [x] 7. Fix "Failed to fetch" (CORS) — backend on :8080 rejects cross-origin browser requests (preflight 403)
  - Created `src/app/api/b2b-enquiries/route.ts` same-origin proxy that forwards server-to-server to backend
  - Updated `b2bApi.ts` to POST to the same-origin proxy instead of direct backend URL
  - Verified proxy: `POST http://localhost:3000/api/b2b-enquiries` → HTTP 201 (enquiryId 16)
  - `npm run build` passes with 32 routes
