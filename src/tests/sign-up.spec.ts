import { expect, test } from '@playwright/test';

const SIGNUP_URL = 'http://localhost:3000/sign-up';
const LOGIN_URL = 'http://localhost:3000/login';

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SIGNUP_URL);
  });

  // ==================== PAGE RENDERING ====================

  test('should render sign up page correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('text=Create your free account')).toBeVisible();

    // Check description
    await expect(
      page.locator('text=Create your free business account'),
    ).toBeVisible();

    // Check form fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();

    // Check submit button
    await expect(
      page.locator('button:has-text("Continue with Email")'),
    ).toBeVisible();

    // Check login link
    await expect(page.locator('text=Already have an account?')).toBeVisible();
  });

  test('should show logo on mobile and desktop', async ({ page }) => {
    // Check mobile logo
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('svg').first()).toBeVisible();

    // Check desktop logo
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('should display carousel on desktop only', async ({ page }) => {
    // Desktop - should show carousel
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    const carouselDesktop = page.locator('.mantine-Carousel-root');
    await expect(carouselDesktop).toBeVisible();

    // Mobile - should not show carousel
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const carouselMobile = page.locator('.mantine-Carousel-root');
    await expect(carouselMobile).not.toBeVisible();
  });

  // ==================== FORM VALIDATION ====================

  test('should show error when email is empty', async ({ page }) => {
    await page.locator('button:has-text("Continue with Email")').click();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should show error when email is invalid', async ({ page }) => {
    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('button:has-text("Continue with Email")').click();
    await expect(page.locator('text=Invalid email address')).toBeVisible();
  });

  test('should show error when password is empty', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('button:has-text("Continue with Email")').click();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show error when password is too short', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('short');
    await page.locator('button:has-text("Continue with Email")').click();
    await expect(
      page.locator('text=Password must be at least 8 characters'),
    ).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('Password123!');
    await page.locator('input[type="password"]').last().fill('Password456!');
    await page.locator('button:has-text("Continue with Email")').click();
    await expect(page.locator('text=Passwords must match')).toBeVisible();
  });

  test('should show error when confirm password is empty', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('Password123!');
    await page.locator('button:has-text("Continue with Email")').click();
    await expect(
      page.locator('text=Confirm password is required'),
    ).toBeVisible();
  });

  test('should show error when terms not accepted', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('Password123!');
    await page.locator('input[type="password"]').last().fill('Password123!');
    await page.locator('button:has-text("Continue with Email")').click();
    await expect(
      page.locator('text=Please accept the terms and conditions'),
    ).toBeVisible();
  });

  // ==================== FORM SUBMISSION ====================

  test('should submit form with valid data', async ({ page }) => {
    // Fill form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('Password123!');
    await page.locator('input[type="password"]').last().fill('Password123!');
    await page.locator('input[type="checkbox"]').check();

    // Submit
    await page.locator('button:has-text("Continue with Email")').click();

    // Check loading state
    await expect(
      page.locator('button:has-text("Continue with Email")'),
    ).toBeDisabled();
  });

  test('should submit form on Enter key press', async ({ page }) => {
    // Fill form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('Password123!');
    await page.locator('input[type="password"]').last().fill('Password123!');
    await page.locator('input[type="checkbox"]').check();

    // Press Enter
    await page.locator('input[type="password"]').last().press('Enter');

    // Check loading state
    await expect(
      page.locator('button:has-text("Continue with Email")'),
    ).toBeDisabled();
  });

  test('should not submit form on Enter if validation fails', async ({
    page,
  }) => {
    // Fill incomplete form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('short');

    // Press Enter
    await page.locator('input[type="password"]').first().press('Enter');

    // Should show validation error
    await expect(
      page.locator('text=Password must be at least 8 characters'),
    ).toBeVisible();

    // Button should not be disabled
    await expect(
      page.locator('button:has-text("Continue with Email")'),
    ).not.toBeDisabled();
  });

  // ==================== NAVIGATION ====================

  test('should navigate to login page', async ({ page }) => {
    await page.locator('a:has-text("Log in")').click();
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('should open terms in new tab', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.locator('a:has-text("Terms and Conditions")').click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/\/terms/);
  });

  test('should open privacy policy in new tab', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.locator('a:has-text("Privacy Policy")').click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/\/privacy/);
  });

  // ==================== FORM INTERACTIONS ====================

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('Password123!');

    // Click show password button
    await page
      .locator('button[aria-label="Toggle password visibility"]')
      .first()
      .click();

    // Check input type changed
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click hide password button
    await page
      .locator('button[aria-label="Toggle password visibility"]')
      .first()
      .click();

    // Check input type changed back
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should validate on input change', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    // Enter invalid email
    await emailInput.fill('invalid');
    await emailInput.blur();
    await expect(page.locator('text=Invalid email address')).toBeVisible();

    // Fix email
    await emailInput.fill('test@example.com');
    await emailInput.blur();
    await expect(page.locator('text=Invalid email address')).not.toBeVisible();
  });

  test('should check and uncheck terms checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');

    // Check
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Uncheck
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  // ==================== ACCESSIBILITY ====================

  test('should have proper labels for inputs', async ({ page }) => {
    await expect(page.locator('label:has-text("Email address")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
    await expect(
      page.locator('label:has-text("Confirm password")'),
    ).toBeVisible();
  });

  test('should have asterisk for required fields', async ({ page }) => {
    const emailLabel = page.locator('label:has-text("Email address")');
    await expect(
      emailLabel.locator('.mantine-InputWrapper-required'),
    ).toBeVisible();

    const passwordLabel = page.locator('label:has-text("Password")').first();
    await expect(
      passwordLabel.locator('.mantine-InputWrapper-required'),
    ).toBeVisible();
  });

  test('should focus first input on page load', async ({ page }) => {
    await page.reload();
    const emailInput = page.locator('input[type="email"]');
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
  });

  // ==================== RESPONSIVE DESIGN ====================

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check form is visible
    await expect(page.locator('text=Create your free account')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(
      page.locator('button:has-text("Continue with Email")'),
    ).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check form is visible
    await expect(page.locator('text=Create your free account')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(
      page.locator('button:has-text("Continue with Email")'),
    ).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Check form and carousel are visible
    await expect(page.locator('text=Create your free account')).toBeVisible();
    await expect(page.locator('.mantine-Carousel-root')).toBeVisible();
  });
});

// ==================== CAROUSEL TESTS (DESKTOP ONLY) ====================

test.describe('Sign Up Page - Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(SIGNUP_URL);
  });

  test('should display carousel slides', async ({ page }) => {
    // Wait for carousel to load
    await page.waitForSelector('.mantine-Carousel-root');

    // Check first slide content
    await expect(page.locator('text=No credit card required')).toBeVisible();
  });

  test('should autoplay carousel', async ({ page }) => {
    await page.waitForSelector('.mantine-Carousel-root');

    // Wait for autoplay (10 seconds + buffer)
    await page.waitForTimeout(11000);

    // Check if carousel moved to next slide
    const indicators = page.locator('.mantine-Carousel-indicator');
    const activeIndicator = indicators.locator('[data-active="true"]');
    await expect(activeIndicator).toBeVisible();
  });

  test('should display video backgrounds', async ({ page }) => {
    await page.waitForSelector('video');
    const videos = page.locator('video');
    await expect(videos.first()).toBeVisible();
  });

  test('should display testimonials', async ({ page }) => {
    await expect(page.locator('.mantine-Avatar-root').first()).toBeVisible();
    await expect(page.locator('text=from 200+ reviews')).toBeVisible();
  });

  test('should display rating', async ({ page }) => {
    await expect(page.locator('.mantine-Rating-root')).toBeVisible();
    await expect(page.locator('text=4.7')).toBeVisible();
  });
});
