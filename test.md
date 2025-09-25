📄 Testing Specification Document
🎯 Objectives

Ensure core features remain correct during development and deployment.

Quickly detect issues in UI, state management, and API integration.

Provide a maintainable testing foundation to prevent regressions.

📌 Scope & Responsibilities
1. Unit Tests → Vitest

Goal: Verify pure logic, fast and precise.

State Management

Zustand store: correctness of openModal, closeModal, updateFeature.

Pure Functions

Data processing, algorithms, utility functions.

Component Logic (non-UI)

Props are passed correctly.

Event handlers trigger the expected updates.

✅ Focus: No DOM, no UI, no browser. Only logic.

2. Component Tests → Vitest + React Testing Library (RTL)

Goal: Verify UI structure and interaction.

UI Rendering

Components render the correct text, elements, and styles.

Interactions

Clicking a button opens the Dialog.

Closing the Dialog resets state.

Conditional Rendering

No active feature → Dialog should not be visible.

Switching featureId updates content correctly.

Accessibility

Elements have correct role, aria-label, aria-modal, etc.

✅ Focus: Simulated user interaction with DOM. No navigation or browser-level behavior.

3. End-to-End Tests (E2E) → Playwright

Goal: Verify complete user flows in a real browser environment.

User Flows

Navigate to homepage → click a feature button → modal opens.

Close modal → state resets.

UI & Usability

Dialog closes via overlay click, close button, or ESC key.

Styles and overlay behavior are correct (z-index, scroll locking).

Accessibility

Focus trap, keyboard navigation, ARIA attributes validated.

Cross-feature Behavior

Multiple feature buttons open the correct modal content.

Only one modal can be open at a time.

✅ Focus: Realistic user actions, routing, full app state validation.

⚙️ Tooling

Vitest → Unit tests (logic)

RTL (with Vitest) → Component tests (UI + interactions)

Playwright → End-to-end tests (full user flows)

📂 Directory Structure
tests/
  unit/         # Zustand, utils, hooks
  components/   # React components with RTL
  e2e/          # Playwright specs

📝 Guidelines

Naming

Test files end with .test.ts(x) or .spec.ts(x).

Test descriptions (describe/it) must be clear and descriptive.

Coverage

Unit test coverage for core logic ≥ 80%.

E2E tests must cover main user flows.

📊 Testing Pyramid
        ▲
        |   End-to-End (Playwright)
        |   Few, critical user flows
        |
        |   Component (RTL)
        |   Moderate, DOM-level checks
        |
        |   Unit (Vitest)
        |   Most tests, logic validation
        ▼