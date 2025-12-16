import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Smart Clinic/);
});

test('admin login flow', async ({ page }) => {
  await page.goto('/login');

  // Fill email and password
  await page.getByLabel('Email').fill('admin@smartclinic.com');
  await page.getByLabel('Password').fill('admin123');

  // Click login button
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Expect to be redirected to dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  
  // Check for a welcome message or dashboard element
  await expect(page.getByText('Dashboard')).toBeVisible();
});
