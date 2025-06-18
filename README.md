# BBC iPlayer Automation Tests

Playwright and TypeScript automation tests for the BBC iPlayer homepage.

## Prerequisites

* Node.js v16+ and npm
* Playwright installed via npm

## Setup

1. Clone this repo:

   ```
   git clone <repo-url>
   cd <repo-folder>
   ```
2. Install dependencies:

   ```
   npm install
   ```
3. Install browsers:

   ```
   npx playwright install
   ```

## Running Tests

Run all tests:

```
npx playwright test
```

Run a specific file:

```
npx playwright test tests/iplayer.pom.spec.ts
```

## Tests Covered

* Homepage title
* Navigation menu
* Carousel count and items
* Carousel scrolling
* Episode playback navigation

