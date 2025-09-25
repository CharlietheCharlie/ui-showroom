import { test, expect } from "@playwright/test";

test.describe("Main User Flow", () => {
  test("should open and close the feature dialog correctly", async ({
    page,
  }) => {
    // 1. Navigate to the homepage
    await page.goto("/");

    // Diagnostic step: Check if the page loaded correctly by verifying its title
    await expect(page).toHaveTitle("Charlie's UI Showroom");

    // 2. Find and click the button for "Feature 2"
    const featureButton = page.getByText("Drag and Drop");
    await expect(featureButton).toBeVisible();
    await featureButton.click();

    // 3. Verify the dialog appears with the correct title
    // The dialog role is a good selector for the modal
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Check for the title within the dialog
    const dialogTitle = dialog.getByRole("heading", { name: "Drag and Drop" });
    await expect(dialogTitle).toBeVisible();

    // Check for the feature content
    await expect(
      dialog.getByText(
        "This is where the complex component for feature two would be rendered."
      )
    ).toBeVisible();

    // 4. Find and click the close button
    const closeButton = dialog.getByText("close");
    await closeButton.click();

    // 5. Verify the dialog is no longer visible
    await expect(dialog).not.toBeVisible();
  });
});



test.describe("Target Cursor - Desktop", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("should show target cursor", async ({ page }) => {
    await page.goto("/");
    await page.mouse.move(100, 100); // Move mouse to trigger cursor
    const targetCursor = page.locator("[data-testid='target-cursor']");
    await expect(targetCursor).toHaveCount(1);
  });
});

test.describe("Target Cursor - Mobile", () => {
  test.use({ viewport: { width: 768, height: 667 } });  // limit is 768px

  test("should NOT show target cursor", async ({ page }) => {
    await page.goto("/");
    await page.mouse.move(100, 100); // Move mouse to trigger cursor
    const targetCursor = page.locator("[data-testid='target-cursor']");
    await expect(targetCursor).toHaveCount(0);
  });
});