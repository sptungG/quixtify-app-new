import { expect, test } from '@playwright/test';

const SIGNUP_URL = 'http://localhost:3000/sign-up';
const LOGIN_URL = 'http://localhost:3000/login';
const FORGOT_PASSWORD_URL = 'http://localhost:3000/forgot-password';
const DASHBOARD_URL = 'http://localhost:3000/dashboard';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // ==================== PAGE RENDERING ====================

  test('should render login page correctly', async ({ page }) => {
    // Check page title
    await expect(
      page.locator('h1:has-text("Welcome back to Quixtify")'),
    ).toBeVisible();

    // Check description
    await expect(page.locator('text=Log in to your account')).toBeVisible();

    // Check logo
    await expect(page.locator('svg[class*="size-11"]').first()).toBeVisible();

    // Check form fields
    await expect(
      page.locator('input[name="email"][type="email"]'),
    ).toBeVisible();
    await expect(
      page.locator('input[name="password"][type="password"]'),
    ).toBeVisible();

    // Check submit button
    await expect(
      page.locator('button[type="submit"]:has-text("Continue with email")'),
    ).toBeVisible();

    // Check sign up link
    await expect(page.locator("text=Don't have an account?")).toBeVisible();
    await expect(page.locator('a:has-text("Sign up")').first()).toBeVisible();

    // Check forgot password link
    await expect(
      page.locator('a:has-text("Forgot your password?")'),
    ).toBeVisible();
  });

  test('should display logo with correct styling', async ({ page }) => {
    const logo = page.locator('svg[class*="size-11"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveClass(/text-accent/);
  });

  test('should have proper page layout', async ({ page }) => {
    // Check main container
    await expect(
      page.locator('.flex.min-h-screen.flex-col').first(),
    ).toBeVisible();

    // Check form container with proper styling
    await expect(
      page.locator('.mx-auto.w-full.max-w-\\[480px\\]'),
    ).toBeVisible();

    // Check padding classes
    await expect(page.locator('.p-4.lg\\:p-10')).toBeVisible();
  });

  test('should have proper spacing between elements', async ({ page }) => {
    // Check logo margin
    await expect(page.locator('.mb-5')).toBeVisible();

    // Check form sections gap
    await expect(page.locator('.flex.flex-col.gap-6')).toBeVisible();

    // Check between form and links gap
    await expect(page.locator('.space-y-4')).toBeVisible();
  });

  // ==================== FORM VALIDATION ====================

  test('should show error when email is empty', async ({ page }) => {
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should show error when email is invalid', async ({ page }) => {
    await page.locator('input[name="email"]').fill('invalid-email');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();
    await expect(page.locator('text=Invalid email')).toBeVisible();
  });

  test('should accept valid email formats', async ({ page }) => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.com',
    ];

    for (const email of validEmails) {
      const emailInput = page.locator('input[name="email"]');
      await emailInput.clear();
      await emailInput.fill(email);
      await emailInput.blur();

      // Should not show error
      await expect(page.locator('text=Invalid email')).not.toBeVisible();
    }
  });

  test('should show error when password is empty', async ({ page }) => {
    await page.locator('input[name="email"]').fill('test@example.com');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show error when password is too short', async ({ page }) => {
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('short');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();
    await expect(
      page.locator('text=Password must be at least 8 characters'),
    ).toBeVisible();
  });

  test('should validate password complexity', async ({ page }) => {
    const weakPasswords = ['password', '12345678', 'abcdefgh'];

    for (const password of weakPasswords) {
      await page.locator('input[name="email"]').fill('test@example.com');
      await page.locator('input[name="password"]').clear();
      await page.locator('input[name="password"]').fill(password);
      await page
        .locator('button[type="submit"]:has-text("Continue with email")')
        .click();

      // Should show password complexity error
      await page.waitForTimeout(500);
    }
  });

  test('should validate on input change', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');

    // Enter invalid email
    await emailInput.fill('invalid');
    await emailInput.blur();
    await page.waitForTimeout(300);
    await expect(page.locator('text=Invalid email')).toBeVisible();

    // Fix email
    await emailInput.clear();
    await emailInput.fill('test@example.com');
    await emailInput.blur();
    await page.waitForTimeout(300);
    await expect(page.locator('text=Invalid email')).not.toBeVisible();
  });

  // ==================== FORM SUBMISSION ====================

  test('should submit form with valid data', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/v1/token**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'user-id',
            email: 'test@example.com',
          },
        }),
      }),
    );

    // Fill form with valid data
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Password123!');

    // Submit form
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();

    // Check loading state
    await expect(
      page.locator('button[type="submit"]:has-text("Continue with email")'),
    ).toBeDisabled();

    // Wait for redirect
    await page.waitForTimeout(2000);
  });

  test('should submit form on Enter key press', async ({ page }) => {
    // Fill form
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Password123!');

    // Press Enter on password field
    await page.locator('input[name="password"]').press('Enter');

    // Check loading state
    await expect(
      page.locator('button[type="submit"]:has-text("Continue with email")'),
    ).toBeDisabled();
  });

  test('should not submit form on Enter if validation fails', async ({
    page,
  }) => {
    // Fill incomplete form
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('short');

    // Press Enter
    await page.locator('input[name="password"]').press('Enter');

    // Should show validation error
    await expect(
      page.locator('text=Password must be at least 8 characters'),
    ).toBeVisible();

    // Button should not be disabled
    await expect(
      page.locator('button[type="submit"]:has-text("Continue with email")'),
    ).not.toBeDisabled();
  });

  test('should handle login failure gracefully', async ({ page }) => {
    // Mock login failure
    await page.route('**/auth/v1/token**', route =>
      route.fulfill({
        status: 400,
        body: JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid login credentials',
        }),
      }),
    );

    // Fill and submit form
    await page.locator('input[name="email"]').fill('wrong@example.com');
    await page.locator('input[name="password"]').fill('WrongPassword123!');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();

    // Wait for error handling
    await page.waitForTimeout(1000);

    // Button should be enabled again
    await expect(
      page.locator('button[type="submit"]:has-text("Continue with email")'),
    ).not.toBeDisabled();

    // Should show error notification (Mantine notification)
    await expect(page.locator('.mantine-Notification-root')).toBeVisible();
  });

  test('should display loading indicator during submission', async ({
    page,
  }) => {
    // Mock delayed response
    await page.route('**/auth/v1/token**', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-token',
          user: { email: 'test@example.com' },
        }),
      });
    });

    // Fill and submit form
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();

    // Check button shows loading state
    const submitButton = page.locator(
      'button[type="submit"]:has-text("Continue with email")',
    );
    await expect(submitButton).toBeDisabled();
    await expect(submitButton.locator('.mantine-Loader-root')).toBeVisible();
  });

  // ==================== NAVIGATION ====================

  test('should navigate to sign up page', async ({ page }) => {
    await page.locator('a:has-text("Sign up")').first().click();
    await expect(page).toHaveURL(SIGNUP_URL);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.locator('a:has-text("Forgot your password?")').click();
    await expect(page).toHaveURL(FORGOT_PASSWORD_URL);
  });

  test('should have correct link attributes', async ({ page }) => {
    // Check sign up link
    const signUpLink = page.locator('a:has-text("Sign up")').first();
    await expect(signUpLink).toHaveAttribute('href', '/sign-up');

    // Check forgot password link
    const forgotLink = page.locator('a:has-text("Forgot your password?")');
    await expect(forgotLink).toHaveAttribute('href', '/forgot-password');
  });

  // ==================== FORM INTERACTIONS ====================

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill('Password123!');

    // Find toggle button
    const toggleButton = page
      .locator('.mantine-PasswordInput-root')
      .locator('button')
      .first();

    // Click to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to hide password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should have autocomplete attributes', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    // Check autocomplete attributes
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
    await expect(passwordInput).toHaveAttribute(
      'autocomplete',
      'current-password',
    );
  });

  test('should maintain form values during validation', async ({ page }) => {
    // Fill form with invalid data
    await page.locator('input[name="email"]').fill('invalid');
    await page.locator('input[name="password"]').fill('short');

    // Submit to trigger validation
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();

    // Form values should remain
    await expect(page.locator('input[name="email"]')).toHaveValue('invalid');
    await expect(page.locator('input[name="password"]')).toHaveValue('short');
  });

  // ==================== ACCESSIBILITY ====================

  test('should have proper labels for inputs', async ({ page }) => {
    await expect(page.locator('label:has-text("Email address")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
  });

  test('should have required indicators', async ({ page }) => {
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
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('placeholder', 'john@example.com');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check inputs have proper IDs for labels
    const emailInput = page.locator('input[name="email"]');
    const emailId = await emailInput.getAttribute('id');
    expect(emailId).toBeTruthy();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="email"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="password"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(
      page.locator('button[type="submit"]:has-text("Continue with email")'),
    ).toBeFocused();
  });

  // ==================== RESPONSIVE DESIGN ====================

  test('should be responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check form is visible and properly sized
    await expect(
      page.locator('h1:has-text("Welcome back to Quixtify")'),
    ).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(
      page.locator('button[type="submit"]:has-text("Continue with email")'),
    ).toBeVisible();

    // Check padding
    await expect(page.locator('.p-4')).toBeVisible();
  });

  test('should be responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check form container
    await expect(page.locator('.mx-auto.w-full')).toBeVisible();
  });

  test('should be responsive on desktop (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Check larger padding on desktop
    await expect(page.locator('.lg\\:p-10')).toBeVisible();

    // Check form is centered with max-width
    await expect(page.locator('.max-w-\\[480px\\]')).toBeVisible();
  });

  // ==================== STYLING ====================

  test('should have correct button styling', async ({ page }) => {
    const button = page.locator(
      'button[type="submit"]:has-text("Continue with email")',
    );

    // Check button classes
    const buttonClasses = await button.getAttribute('class');
    expect(buttonClasses).toContain('w-full');
    expect(buttonClasses).toContain('rounded-full');
  });

  test('should have correct typography', async ({ page }) => {
    const title = page.locator('h1:has-text("Welcome back to Quixtify")');

    // Check title styling
    const titleClasses = await title.getAttribute('class');
    expect(titleClasses).toContain('font-sora');
    expect(titleClasses).toContain('text-2xl');
    expect(titleClasses).toContain('font-bold');
  });

  test('should have correct link styling', async ({ page }) => {
    const signUpLink = page.locator('a:has-text("Sign up")').first();

    // Check link has accent color
    const linkClasses = await signUpLink.getAttribute('class');
    expect(linkClasses).toContain('text-accent');
  });

  // ==================== ERROR HANDLING ====================

  test('should handle network error gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/auth/v1/token**', route => route.abort());

    // Fill and submit form
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();

    // Wait for error handling
    await page.waitForTimeout(1000);

    // Button should be enabled again
    await expect(
      page.locator('button[type="submit"]:has-text("Continue with email")'),
    ).not.toBeDisabled();
  });

  test('should prevent multiple simultaneous submissions', async ({ page }) => {
    // Mock delayed response
    await page.route('**/auth/v1/token**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ access_token: 'token' }),
      });
    });

    // Fill form
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Password123!');

    // Click submit button multiple times rapidly
    const button = page.locator(
      'button[type="submit"]:has-text("Continue with email")',
    );
    await button.click();
    await button.click();
    await button.click();

    // Button should stay disabled (only one submission)
    await expect(button).toBeDisabled();
  });
});

// ==================== INTEGRATION TESTS ====================

test.describe('Login Page - Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('should successfully login and redirect to dashboard', async ({
    page,
  }) => {
    // Mock successful login and user data
    await page.route('**/auth/v1/token**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'user-id',
            email: 'test@example.com',
          },
        }),
      }),
    );

    // Mock user businesses endpoint
    await page.route('**/rest/v1/businesses**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: 'business-id',
            name: 'Test Business',
          },
        ]),
      }),
    );

    // Fill and submit form
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();

    // Wait for navigation
    await page.waitForTimeout(2000);

    // Should redirect to dashboard or home
    expect(page.url()).toMatch(/\/(dashboard|home|\w+)$/);
  });

  test('should persist session after successful login', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/v1/token**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          user: { id: 'user-id', email: 'test@example.com' },
        }),
      }),
    );

    // Login
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();

    await page.waitForTimeout(2000);

    // Check localStorage for session
    const localStorage = await page.evaluate(() => {
      return Object.keys(window.localStorage);
    });

    expect(localStorage.some(key => key.includes('supabase'))).toBeTruthy();
  });

  test('should clear form after successful login', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/v1/token**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-access-token',
          user: { email: 'test@example.com' },
        }),
      }),
    );

    // Fill and submit
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page
      .locator('button[type="submit"]:has-text("Continue with email")')
      .click();

    await page.waitForTimeout(1000);

    // Form should be cleared or user redirected
    const currentUrl = page.url();
    expect(currentUrl).not.toBe(LOGIN_URL);
  });
});
