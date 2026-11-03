# Backend authentication deployment

The source closes email-only login, unauthenticated password changes, existing-account registration overwrite and public progress/certificate disclosure.

Production configuration:

- `SESSION_SECRET`: at least 32 characters generated from a cryptographic random source. The server refuses production startup without it. Existing legacy sessions must sign in again.
- `RESEND_API_KEY`: server-side email provider credential, never a `VITE_` variable.
- `OTP_FROM_EMAIL`: a sender on a verified provider domain.
- `MONGODB_URI`: the intended production database.

Deploy this branch through the existing hosting pipeline. Do not substitute browser OTP state for backend verification. Password login and guest access work without an email provider; signup/reset require successful server-side delivery. Missing delivery configuration fails closed with 503.

OTP challenges and grants use a bounded single-process store, five-minute expiry and single use. For multiple backend replicas, replace that store with a shared atomic store or use one replica. A restart expires outstanding challenges; it never turns them into valid proofs.

Tests use isolated `.test` mailboxes. They do not send real email or modify production accounts. Database E2E uses an ephemeral MongoDB service; deployment-readiness checks target the compiled candidate, not the remote production deployment.

`e2e.yml` runs eight suites of 500 named cases. The Excel workbooks state each case's scope and result. UI suites are chapter-route/property matrices; load rows represent measured requests. Unsupported legacy native features are not counted as passing coverage.
