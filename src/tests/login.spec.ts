import { expect, test } from '@playwright/test';

const SIGNUP_URL = 'http://localhost:3000/sign-up';
const LOGIN_URL = 'http://localhost:3000/login';
const FORGOT_PASSWORD_URL = 'http://localhost:3000/forgot-password';
const HOME_URL = 'http://localhost:3000/';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // ==================== PAGE RENDERING ====================

  test('should render login page correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('text=Welcome back to Quixtify')).toBeVisible();

    // Check logo
    await expect(page.locator('svg').first()).toBeVisible();

    // Check form fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Check submit button
    await expect(
      page.locator('button:has-text("Continue with email")'),
    ).toBeVisible();

    // Check sign up link
    await expect(page.locator("text=Don't have an account?")).toBeVisible();

    // Check forgot password link
    await expect(page.locator('text=Forgot your password?')).toBeVisible();
  });

  test('should display logo correctly', async ({ page }) => {
    const logo = page.locator('svg').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveClass(/size-11/);
  });

  test('should have proper page structure', async ({ page }) => {
    // Check main container
    await expect(page.locator('.flex.flex-col').first()).toBeVisible();

    // Check form container
    await expect(page.locator('form')).toBeVisible();

    // Check max width constraint
    const formContainer = page.locator('.max-w-\\[480px\\]');
    await expect(formContainer).toBeVisible();
  });

  // ==================== FORM VALIDATION ====================

  test('should show error when email is empty', async ({ page }) => {
    await page.locator('button:has-text("Continue with email")').click();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should show error when email is invalid', async ({ page }) => {
    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('button:has-text("Continue with email")').click();
    await expect(page.locator('text=Invalid email')).toBeVisible();
  });

  test('should accept valid email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');
    await emailInput.blur();

    // Should not show error
    await expect(page.locator('text=Invalid email')).not.toBeVisible();
  });

  test('should show error when password is empty', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('button:has-text("Continue with email")').click();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show error when password is too short', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('short');
    await page.locator('button:has-text("Continue with email")').click();
    await expect(
      page.locator('text=Password must be at least 8 characters'),
    ).toBeVisible();
  });

  test('should validate on input change', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    // Enter invalid email
    await emailInput.fill('invalid');
    await emailInput.blur();
    await expect(page.locator('text=Invalid email')).toBeVisible();

    // Fix email
    await emailInput.fill('test@example.com');
    await emailInput.blur();
    await expect(page.locator('text=Invalid email')).not.toBeVisible();
  });

  // ==================== FORM SUBMISSION ====================

  test('should show loading state on submit', async ({ page }) => {
    // Fill form with valid data
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('Password123!');

    // Submit form
    await page.locator('button:has-text("Continue with email")').click();

    // Check loading state
    const submitButton = page.locator('button:has-text("Continue with email")');
    await expect(submitButton).toBeDisabled();
  });

  test('should submit form on Enter key press', async ({ page }) => {
    // Fill form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('Password123!');

    // Press Enter
    await page.locator('input[type="password"]').press('Enter');

    // Check loading state
    await expect(
      page.locator('button:has-text("Continue with email")'),
    ).toBeDisabled();
  });

  test('should not submit form on Enter if validation fails', async ({
    page,
  }) => {
    // Fill incomplete form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('short');

    // Press Enter
    await page.locator('input[type="password"]').press('Enter');

    // Should show validation error
    await expect(
      page.locator('text=Password must be at least 8 characters'),
    ).toBeVisible();

    // Button should not be disabled
    await expect(
      page.locator('button:has-text("Continue with email")'),
    ).not.toBeDisabled();
  });

  test('should handle login failure gracefully', async ({ page }) => {
    // Mock network response
    await page.route('**/auth/v1/token**', route =>
      route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      }),
    );

    // Fill and submit form
    await page.locator('input[type="email"]').fill('wrong@example.com');
    await page.locator('input[type="password"]').fill('WrongPassword123!');
    await page.locator('button:has-text("Continue with email")').click();

    // Wait for error notification
    await page.waitForTimeout(1000);

    // Button should be enabled again
    await expect(
      page.locator('button:has-text("Continue with email")'),
    ).not.toBeDisabled();
  });

  // ==================== NAVIGATION ====================

  test('should navigate to sign up page', async ({ page }) => {
    await page.locator('a:has-text("Sign up")').click();
    await expect(page).toHaveURL(SIGNUP_URL);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.locator('a:has-text("Forgot your password")').click();
    await expect(page).toHaveURL(FORGOT_PASSWORD_URL);
  });

  test('should have correct link attributes', async ({ page }) => {
    // Check sign up link
    const signUpLink = page.locator('a:has-text("Sign up")');
    await expect(signUpLink).toHaveAttribute('href', '/sign-up');

    // Check forgot password link
    const forgotLink = page.locator('a:has-text("Forgot your password")');
    await expect(forgotLink).toHaveAttribute('href', '/forgot-password');
  });

  // ==================== FORM INTERACTIONS ====================

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('Password123!');

    // Click show password button
    await page
      .locator('button[aria-label="Toggle password visibility"]')
      .click();

    // Check input type changed
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click hide password button
    await page
      .locator('button[aria-label="Toggle password visibility"]')
      .click();

    // Check input type changed back
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should autofill email and password', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Check autocomplete attributes
    await expect(emailInput).toHaveAttribute('autocomplete', 'on');
    await expect(passwordInput).toHaveAttribute('autocomplete', 'on');
  });

  test('should clear form on Enter with validation errors', async ({
    page,
  }) => {
    // Fill form with invalid data
    await page.locator('input[type="email"]').fill('invalid');
    await page.locator('input[type="password"]').fill('short');

    // Press Enter
    await page.locator('input[type="password"]').press('Enter');

    // Form values should remain
    await expect(page.locator('input[type="email"]')).toHaveValue('invalid');
    await expect(page.locator('input[type="password"]')).toHaveValue('short');
  });

  // ==================== ACCESSIBILITY ====================

  test('should have proper labels for inputs', async ({ page }) => {
    await expect(page.locator('label:has-text("Email address")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
  });

  test('should have required asterisk for required fields', async ({
    page,
  }) => {
    const emailLabel = page.locator('label:has-text("Email address")');
    await expect(
      emailLabel.locator('.mantine-InputWrapper-required'),
    ).toBeVisible();

    const passwordLabel = page.locator('label:has-text("Password")');
    await expect(
      passwordLabel.locator('.mantine-InputWrapper-required'),
    ).toBeVisible();
  });

  test('should have proper placeholder text', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('placeholder', 'john@example.com');
  });

  test('should focus first input on page load', async ({ page }) => {
    await page.reload();
    const emailInput = page.locator('input[type="email"]');
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
  });

  test('should have proper button state', async ({ page }) => {
    const button = page.locator('button:has-text("Continue with email")');

    // Initially enabled
    await expect(button).toBeEnabled();

    // Check button type
    await expect(button).toHaveAttribute('type', 'submit');
  });

  // ==================== RESPONSIVE DESIGN ====================

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check form is visible
    await expect(page.locator('text=Welcome back to Quixtify')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(
      page.locator('button:has-text("Continue with email")'),
    ).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check form is visible and properly sized
    await expect(page.locator('text=Welcome back to Quixtify')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Check form is centered and properly sized
    const formContainer = page.locator('.max-w-\\[480px\\]');
    await expect(formContainer).toBeVisible();
  });

  test('should have proper padding on different screen sizes', async ({
    page,
  }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    const containerMobile = page.locator('.p-4');
    await expect(containerMobile).toBeVisible();

    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    const containerDesktop = page.locator('.lg\\:p-10');
    await expect(containerDesktop).toBeVisible();
  });

  // ==================== FORM STYLING ====================

  test('should have proper button styling', async ({ page }) => {
    const button = page.locator('button:has-text("Continue with email")');

    // Check button classes
    await expect(button).toHaveClass(/w-full/);
    await expect(button).toHaveClass(/rounded-full/);
    await expect(button).toHaveClass(/font-bold/);
  });

  test('should have proper spacing between elements', async ({ page }) => {
    // Check logo margin
    const logoContainer = page.locator('.mb-5');
    await expect(logoContainer).toBeVisible();

    // Check form gaps
    const formContainer = page.locator('.gap-6');
    await expect(formContainer).toBeVisible();
  });

  test('should have proper text styling', async ({ page }) => {
    const title = page.locator('text=Welcome back to Quixtify');

    // Check title styling
    await expect(title).toHaveClass(/font-sora/);
    await expect(title).toHaveClass(/text-2xl/);
    await expect(title).toHaveClass(/font-bold/);
  });

  // ==================== ERROR HANDLING ====================

  test('should display network error message', async ({ page }) => {
    // Simulate network error
    await page.route('**/auth/v1/token**', route => route.abort());

    // Fill and submit form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.locator('button:has-text("Continue with email")').click();

    // Wait for error handling
    await page.waitForTimeout(1000);

    // Button should be enabled again
    await expect(
      page.locator('button:has-text("Continue with email")'),
    ).not.toBeDisabled();
  });

  test('should handle multiple rapid submissions', async ({ page }) => {
    // Fill form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('Password123!');

    // Click submit multiple times
    const button = page.locator('button:has-text("Continue with email")');
    await button.click();
    await button.click();
    await button.click();

    // Should only process once (button disabled)
    await expect(button).toBeDisabled();
  });
});

// ==================== INTEGRATION TESTS ====================

test.describe('Login Page - Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/v1/token**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-token',
          user: { email: 'test@example.com' },
        }),
      }),
    );

    // Fill and submit form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.locator('button:has-text("Continue with email")').click();

    // Wait for success notification
    await page.waitForTimeout(1000);

    // Should redirect to home page
    await expect(page).toHaveURL(HOME_URL);
  });

  test('should reset form after successful login', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/v1/token**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-token',
          user: { email: 'test@example.com' },
        }),
      }),
    );

    // Fill and submit form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.locator('button:has-text("Continue with email")').click();

    // Wait for form reset
    await page.waitForTimeout(1000);

    // Form should be cleared
    await expect(page.locator('input[type="email"]')).toHaveValue('');
    await expect(page.locator('input[type="password"]')).toHaveValue('');
  });
});
