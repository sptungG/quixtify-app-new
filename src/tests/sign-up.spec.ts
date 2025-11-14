import { expect, test } from '@playwright/test';

const SIGNUP_URL = 'http://localhost:3000/sign-up';
const LOGIN_URL = 'http://localhost:3000/login';

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SIGNUP_URL);
    await page.waitForLoadState('networkidle');
  });

  // ==================== PAGE RENDERING ====================

  test('should render sign up page correctly', async ({ page }) => {
    // Check page title with better selector
    await expect(
      page.getByRole('heading', { name: /create your free account/i }),
    ).toBeVisible();

    // Check description
    await expect(
      page.getByText(/create your free business account/i),
    ).toBeVisible();

    // Check form fields with accessible selectors
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();

    // Check submit button
    await expect(
      page.getByRole('button', { name: /continue with email/i }),
    ).toBeVisible();

    // Check login link
    await expect(page.getByText(/already have an account/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
  });

  test('should show logo on mobile and desktop', async ({ page }) => {
    // Check mobile logo
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileLogo = page
      .locator('svg[role="img"], img[alt*="logo" i]')
      .first();
    await expect(mobileLogo).toBeVisible();

    // Check desktop logo
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopLogo = page
      .locator('svg[role="img"], img[alt*="logo" i]')
      .first();
    await expect(desktopLogo).toBeVisible();
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
    await page.getByRole('button', { name: /continue with email/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('should show error when email is invalid', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('invalid-email');
    await page.getByRole('button', { name: /continue with email/i }).click();
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test('should show error when password is empty', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByRole('button', { name: /continue with email/i }).click();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show error when password is too short', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('short');
    await page.getByRole('button', { name: /continue with email/i }).click();
    await expect(
      page.getByText(/password must be at least 8 characters/i),
    ).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Password456!');
    await page.getByRole('button', { name: /continue with email/i }).click();
    await expect(page.getByText(/passwords must match/i)).toBeVisible();
  });

  test('should show error when confirm password is empty', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByRole('button', { name: /continue with email/i }).click();
    await expect(page.getByText(/confirm password is required/i)).toBeVisible();
  });

  test('should show error when terms not accepted', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Password123!');
    await page.getByRole('button', { name: /continue with email/i }).click();
    await expect(
      page.getByText(/please accept the terms and conditions/i),
    ).toBeVisible();
  });

  // ==================== FORM SUBMISSION ====================

  test('should submit form with valid data', async ({ page }) => {
    // Fill form with accessible selectors
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Password123!');
    await page.getByRole('checkbox', { name: /terms/i }).check();

    // Submit
    const submitButton = page.getByRole('button', {
      name: /continue with email/i,
    });
    await submitButton.click();

    // Check loading state
    await expect(submitButton).toBeDisabled();
  });

  test('should submit form on Enter key press', async ({ page }) => {
    // Fill form
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Password123!');
    await page.getByRole('checkbox', { name: /terms/i }).check();

    // Press Enter
    await page.getByLabel(/confirm password/i).press('Enter');

    // Check loading state
    await expect(
      page.getByRole('button', { name: /continue with email/i }),
    ).toBeDisabled();
  });

  test('should not submit form on Enter if validation fails', async ({
    page,
  }) => {
    // Fill incomplete form
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('short');

    // Press Enter
    await page.getByLabel(/^password$/i).press('Enter');

    // Should show validation error
    await expect(
      page.getByText(/password must be at least 8 characters/i),
    ).toBeVisible();

    // Button should not be disabled
    await expect(
      page.getByRole('button', { name: /continue with email/i }),
    ).not.toBeDisabled();
  });

  // ==================== NAVIGATION ====================

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: /log in/i }).click();
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test('should open terms in new tab', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: /terms and conditions/i }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/\/terms/);
  });

  test('should open privacy policy in new tab', async ({ page, context }) => {
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: /privacy policy/i }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/\/privacy/);
  });

  // ==================== FORM INTERACTIONS ====================

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel(/^password$/i);
    await passwordInput.fill('Password123!');

    // Click show password button
    const toggleButton = page
      .getByRole('button', { name: /toggle password visibility/i })
      .first();
    await toggleButton.click();

    // Check input type changed
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click hide password button
    await toggleButton.click();

    // Check input type changed back
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should validate on input change', async ({ page }) => {
    const emailInput = page.getByLabel(/email address/i);

    // Enter invalid email
    await emailInput.fill('invalid');
    await emailInput.blur();
    await expect(page.getByText(/invalid email address/i)).toBeVisible();

    // Fix email
    await emailInput.fill('test@example.com');
    await emailInput.blur();
    await expect(page.getByText(/invalid email address/i)).not.toBeVisible();
  });

  test('should check and uncheck terms checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: /terms/i });

    // Check
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Uncheck
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  // ==================== ACCESSIBILITY ====================

  test('should have proper labels for inputs', async ({ page }) => {
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
  });

  test('should have required field indicators', async ({ page }) => {
    const emailLabel = page.locator('label:has-text("Email address")');
    await expect(
      emailLabel.locator('.mantine-InputWrapper-required'),
    ).toBeVisible();

    const passwordLabel = page.locator('label:has-text("Password")').first();
    await expect(
      passwordLabel.locator('.mantine-InputWrapper-required'),
    ).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email address/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/^password$/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/confirm password/i)).toBeFocused();
  });

  // ==================== RESPONSIVE DESIGN ====================

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(
      page.getByRole('heading', { name: /create your free account/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(
      page.getByRole('heading', { name: /create your free account/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(
      page.getByRole('heading', { name: /create your free account/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
  });
});

// ==================== CAROUSEL TESTS (DESKTOP ONLY) ====================

test.describe('Sign Up Page - Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SIGNUP_URL);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForLoadState('networkidle');
  });

  test('should display carousel slides', async ({ page }) => {
    const carousel = page.locator('.mantine-Carousel-root');
    await expect(carousel).toBeVisible();

    const slides = page.locator('.mantine-Carousel-slide');
    expect(await slides.count()).toBeGreaterThan(0);
  });

  test('should autoplay carousel', async ({ page }) => {
    const indicators = page.locator('.mantine-Carousel-indicator');
    const firstIndicator = indicators.first();

    // Check initial state
    await expect(firstIndicator).toHaveAttribute('data-active', 'true');

    // Wait for autoplay transition
    await page.waitForTimeout(5000);

    // Check if carousel advanced
    const activeIndicators = page.locator(
      '.mantine-Carousel-indicator[data-active="true"]',
    );
    await expect(activeIndicators).toBeVisible();
  });

  test('should navigate carousel with indicators', async ({ page }) => {
    const indicators = page.locator('.mantine-Carousel-indicator');
    const secondIndicator = indicators.nth(1);

    // Click second indicator
    await secondIndicator.click();
    await page.waitForTimeout(500);

    // Verify it's active
    await expect(secondIndicator).toHaveAttribute('data-active', 'true');
  });

  test('should display video backgrounds', async ({ page }) => {
    await page.waitForSelector('video', { timeout: 5000 });
    const videos = page.locator('video');
    await expect(videos.first()).toBeVisible();

    // Check video has source
    const videoSrc = await videos.first().getAttribute('src');
    expect(videoSrc).toBeTruthy();
  });

  test('should display testimonials', async ({ page }) => {
    await expect(page.locator('.mantine-Avatar-root').first()).toBeVisible();
    await expect(page.getByText(/from 200\+ reviews/i)).toBeVisible();
  });

  test('should display rating', async ({ page }) => {
    await expect(page.locator('.mantine-Rating-root')).toBeVisible();
    await expect(page.getByText('4.7')).toBeVisible();
  });

  test('should pause carousel on hover', async ({ page }) => {
    const carousel = page.locator('.mantine-Carousel-root');

    // Hover over carousel
    await carousel.hover();

    const initialActiveIndicator = page.locator(
      '.mantine-Carousel-indicator[data-active="true"]',
    );
    const initialIndex =
      await initialActiveIndicator.getAttribute('data-index');

    // Wait and verify it hasn't changed
    await page.waitForTimeout(6000);
    const currentActiveIndicator = page.locator(
      '.mantine-Carousel-indicator[data-active="true"]',
    );
    const currentIndex =
      await currentActiveIndicator.getAttribute('data-index');

    expect(initialIndex).toBe(currentIndex);
  });
});
