# QA Wolf – Playwright (Hacker News)

Automated end-to-end tests for **Hacker News** using **Playwright** and the **Page Object Model (POM)**.  
This framework validates authentication and ensures data integrity for community submissions—specifically verifying that the **first 100 “newest” posts** are sorted **newest → oldest**.

---

## Tech Stack

- Node.js
- Playwright (`@playwright/test`)
- `dotenv-flow` (loads `.env.local`)

---

## Environment Setup

### 1) Install Node.js

Playwright requires Node.js. Install the **LTS** version for your operating system from **nodejs.org**.

Verify installation:

```bash
node -v   # Expected: v18.x.x or higher
npm -v
```

### 2) Install project dependencies

From the project root directory:

```bash
npm install
```

### 3) Install Playwright browsers

Install browser binaries (Chromium, Firefox, WebKit) and required OS dependencies:

```bash
npx playwright install --with-deps
```

---

## Configuration

Credentials are stored in a local environment file and loaded via `dotenv-flow`.

1. Create a file named **`.env.local`** in the project root.
2. Add your Hacker News credentials exactly as follows:

```env
HN_USERNAME=your_username_here
HN_PASSWORD=your_password_here
```

> **Note:** `.gitignore` should already prevent `.env.local` and `authentication-cache/` from being committed.

---

## Running Tests

### Execute all tests

Runs all tests in headless mode (no browser window visible):

```bash
npx playwright test
```

### Run specific test suites

**Login validation**

```bash
npx playwright test tests/authentication/login.spec.js
```

**Newest links sorting**

```bash
npx playwright test tests/hackerNews/newLinks.spec.js
```

### Debugging with UI mode

Open the interactive runner with a live browser and time-travel debugging:

```bash
npx playwright test --ui
```

---

## Project Architecture

### Pages (`/pages`)

Contains Page Objects (POM) that encapsulate selectors and actions to keep tests readable and maintainable:

- **LoginPage** (`pages/login.page.js`): authentication flow and session checks
- **NewLinksPage** (`pages/newLinks.page.js`): navigate `/newest`, collect timestamps, validate sort order
- **BasePage** (`pages/basePage.page.js`): shared helpers (e.g., locator factory via `get()`)

### Tests (`/tests`)

- `tests/authentication/login.spec.js`: validates authentication from a clean state
- `tests/hackerNews/newLinks.spec.js`: validates newest page sorting (first 100 posts)

### Fixtures (`fixture.js`)

Extends Playwright’s base test to provide Page Object injection (e.g., `loginPage`, `newLinksPage`) and optional convenience aliases (e.g., `authPage`).

### Session caching

Successfully authenticated sessions can be saved to `authentication-cache/hn.json` so that subsequent tests can run as a logged-in user without re-logging in on every run.

If you suspect the cached session is expired or invalid, delete the cache directory and re-run the login test:

```bash
rm -rf authentication-cache
npx playwright test tests/authentication/login.spec.js
```

---

## Reports

Open the HTML report after a run:

```bash
npx playwright show-report
```

Artifacts are typically stored in:

- `playwright-report/`
- `test-results/`

---

## CI/CD (GitHub Actions)

- This project uses an optimized GitHub Actions workflow located at .github/workflows/playwright.yml.

### CTRF Reporting

- Instead of raw logs, we use CTRF (Common Test Report Format) to provide a professional test dashboard directly on the GitHub Summary page.

- Standardization: CTRF provides a universal JSON schema that works across different frameworks.

- Visibility: It injects a visual results table (Pass/Fail/Duration) into GitHub without requiring you to download .zip artifacts.

- Reliability: Combined with retries, it ensures a stable and transparent CI/CD pipeline.

---

## Troubleshooting

### Not logged in during newLinks test

1. Confirm `.env.local` exists and has valid credentials.
2. Regenerate the session cache (see commands above).
3. Re-run the failing test.

### CAPTCHA / challenge during login

Run the login test in UI mode to complete it manually if needed:

```bash
npx playwright test tests/authentication/login.spec.js --ui
```
