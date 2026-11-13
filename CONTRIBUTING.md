# Contributing to GolangForAll

Thanks for your interest in helping make Go more accessible. Contributions of
all sizes are welcome, including documentation fixes, community articles,
frontend improvements, bug reports, and Go API changes.

## Find a place to help

- Browse the existing GitHub issues before starting work so efforts do not
  overlap.
- For a new bug, use the bug report template and include steps to reproduce,
  expected and actual behavior, and relevant environment details.
- For a larger feature or a change to public API behavior, open an issue first
  to discuss the approach.
- Documentation and accessibility improvements are valuable contributions too.

## Set up the project

The frontend requires Node.js 24 or later. Go 1.24 is required for API changes.

```bash
git clone https://github.com/DhawalShankar/golang4all.git
cd golang4all
npm ci
npm run start
```

The Docusaurus site is available at `http://localhost:3000`.

The Go handlers in `api/` are Vercel functions; `npm run start` does not run
them. Blog data, navbar blog search results, and image uploads need a
Vercel-compatible runtime or a deployed API. Configure backend variables using
the names in `.env.example`. Never commit `.env.local`, credentials, tokens, or
production data.

## Run checks

Run the frontend production build for frontend or documentation changes:

```bash
npm run build
```

Run Go checks for API or database changes:

```bash
go test ./...
```

The Go packages may report that they have no test files; the command still
checks that they compile. If a change affects both parts, run both checks.

## Make a change

1. Create a focused branch, for example `fix/navbar-search` or
   `docs/contribution-guide`.
2. Keep the change scoped to one problem and follow the existing patterns and
   formatting.
3. Add or update documentation when behavior or setup changes.
4. For UI changes, check keyboard access, responsive layouts, and both light and
   dark themes where applicable.
5. Do not include generated output, unrelated formatting changes, secrets, or
   personal data.

For articles, images, and other content, contribute work you created or have
permission to share. Credit external material and follow its license.

By submitting a contribution, you agree that it may be distributed under this
repository's [MIT License](LICENSE). Identify any part of your contribution
that is not yours to license.

## Open a pull request

- Use the pull request template and explain the problem and the solution.
- Link the related issue when there is one.
- List the checks you ran and their results. If a check could not be run, say
  why.
- Include screenshots or a short recording for visible UI changes.
- Keep the pull request focused and be open to review feedback.

## Community expectations

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report potential
security vulnerabilities through [SECURITY.md](SECURITY.md), not a public issue.
