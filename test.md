Testing Specification Document
Objectives

Ensure core features remain correct during development and deployment.

Quickly detect issues in UI, state management, and API integration.

Provide a maintainable testing foundation to prevent regressions.

Scope
1. Unit Tests (Vitest)

State Management

Zustand store: correctness of openModal, closeModal, updateFeature.

Pure Functions

Data processing, algorithms, utility functions.

Component Logic

Props passed correctly.

Event handlers trigger the expected updates.

2. Component Tests (Vitest + React Testing Library)

UI Rendering

Components render the correct text, elements, and styles.

Interactions

Clicking a button opens the Dialog.

Closing the Dialog resets state.

Conditional Rendering

No active feature → Dialog should not be visible.

Switching between different featureId updates content correctly.

3. End-to-End Tests (Playwright)

User Flows

User navigates to the homepage → clicks a feature button → modal opens.

User closes the modal → state resets.

UI & Usability

Dialog closes correctly via overlay click, close button, or ESC key.

Accessibility attributes (roles, aria labels) exist.

Cross-feature Behavior

Multiple feature buttons open the correct modal content.

Only one modal can be open at a time.

Tooling

Vitest → unit and component tests.

React Testing Library → simulate user interactions.

Playwright → end-to-end browser tests.

Guidelines

Directory Structure

tests/
  unit/         # Zustand, utils, hooks
  components/   # React components
  e2e/          # Playwright


Naming

Test files end with .test.ts(x) or .spec.ts(x).

Test descriptions (describe, it, test) must be readable and descriptive.

Coverage

Unit test coverage for core logic > 80%.

E2E tests cover main user flows.