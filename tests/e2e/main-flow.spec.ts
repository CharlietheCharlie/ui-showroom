import { test, expect } from '@playwright/test';

test.describe('Main User Flow', () => {
  test('should open and close the feature dialog correctly', async ({ page }) => {
    // 1. Navigate to the homepage
    await page.goto('/');

    // Wait for the initial animations to settle if necessary
    await page.waitForTimeout(1000); // Adjust as needed

    // 2. Find and click the button for "Feature 2"
    const featureButton = page.getByText('Feature 2');
    await expect(featureButton).toBeVisible();
    await featureButton.click();

    // 3. Verify the dialog appears with the correct title
    // The dialog role is a good selector for the modal
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Check for the title within the dialog
    const dialogTitle = dialog.getByRole('heading', { name: 'Feature 2' });
    await expect(dialogTitle).toBeVisible();

    // Check for the feature content
    await expect(dialog.getByText('This is where the complex component for feature two would be rendered.')).toBeVisible();

    // 4. Find and click the close button
    const closeButton = dialog.getByText('close');
    await closeButton.click();

    // 5. Verify the dialog is no longer visible
    await expect(dialog).not.toBeVisible();
  });
});
