# UI Showroom

A Next.js project designed to showcase a collection of modern and interactive UI components, animations, and performance optimizations. This application serves as a demonstration of various front-end techniques and libraries, providing a playground for exploring different UI/UX patterns.

## Features

*   **Dynamic Feature Showcase**: Explore various UI components and features presented dynamically through an interactive dialog.
*   **Interactive Radial Menu**: Navigate through different showcases using a visually engaging radial menu.
*   **Drag and Drop Interface**: Demonstrates a Kanban-style board or similar interactive drag-and-drop functionality.
*   **Virtualized Infinite Scroll**: Showcases efficient rendering of large datasets using virtualization for optimal performance.
*   **Responsive Design**: Adapts to different screen sizes, with specific features optimized for desktop.

## Technologies Used

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Animation**: Framer Motion, GSAP, Three.js, OGL
*   **Drag and Drop**: `@dnd-kit`
*   **State Management**: Zustand
*   **Data Fetching**: `@tanstack/react-query`
*   **UI Components**: Radix UI, custom components
*   **Testing**:
    *   Unit Testing: Vitest, React Testing Library
    *   End-to-End Testing: Playwright

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have Node.js (v18 or higher) and npm/yarn/pnpm/bun installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ui-showroom.git
    cd ui-showroom
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Development Server

To run the development server with Turbopack:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result. The application will hot-reload as you make changes.

### Build

To build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Start Production Server

To start the production server after building:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

## Testing

The project includes both unit and end-to-end tests.

### Run Unit Tests

```bash
npm run test:unit
# or
yarn test:unit
# or
pnpm test:unit
# or
bun test:unit
```

### Run End-to-End Tests

```bash
npm run test:e2e
# or
yarn test:e2e
# or
pnpm test:e2e
# or
bun test:e2e
```

### Run All Tests

```bash
npm run test
# or
yarn test
# or
pnpm test
# or
bun test
```