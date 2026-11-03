# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journeys.spec.ts >> FolkTuk user journeys >> opens profile editing and submits display name and bio
- Location: e2e\journeys.spec.ts:41:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3001/profile/u1", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test';
  2  | 
  3  | const user = {
  4  |   id: 'u1',
  5  |   email: 'alex@example.com',
  6  |   createdAt: new Date().toISOString(),
  7  |   profile: { username: 'alex', displayName: 'Alex', bio: 'Hello', avatarUrl: null, bannerUrl: null },
  8  | };
  9  | 
  10 | function mockApi(page: Page) {
  11 |   return page.route('**/identity/login', async (route) => {
  12 |     await route.fulfill({ json: { accessToken: 'test-token', user } });
  13 |   });
  14 | }
  15 | 
  16 | test.describe('FolkTuk user journeys', () => {
  17 |   test.beforeEach(async ({ page }) => {
  18 |     await page.route('**/identity/me', async (route) => route.fulfill({ json: user }));
  19 |     await page.route('**/posts?*', async (route) => route.fulfill({ json: { data: [], total: 0, page: 1, limit: 10 } }));
  20 |     await page.route('**/posts/trending', async (route) => route.fulfill({ json: [{ topic: '#folk', count: 3 }] }));
  21 |     await page.route('**/tags/trending', async (route) => route.fulfill({ json: [{ tag: '#folk', count: 3 }] }));
  22 |     await page.route('**/communities/joined', async (route) => route.fulfill({ json: [] }));
  23 |   });
  24 | 
  25 |   test('logs in and stores the JWT token', async ({ page }) => {
  26 |     await mockApi(page);
  27 |     await page.goto('/login');
  28 |     await page.getByLabel(/email/i).fill(user.email);
  29 |     await page.getByLabel(/password/i).fill('Password123!');
  30 |     await page.getByRole('button', { name: /log in/i }).click();
  31 |     await expect.poll(() => page.evaluate(() => localStorage.getItem('folktuk_token'))).toBe('test-token');
  32 |   });
  33 | 
  34 |   test('searches and opens a trending tag', async ({ page }) => {
  35 |     await page.route('**/search?*', async (route) => route.fulfill({ json: { query: '#folk', type: 'tags', posts: [], communities: [], users: [], tags: [{ tag: '#folk', count: 3 }] } }));
  36 |     await page.goto('/search?q=%23folk');
  37 |     await expect(page.getByText('#folk')).toBeVisible();
  38 |     await page.getByText('#folk').first().click();
  39 |   });
  40 | 
  41 |   test('opens profile editing and submits display name and bio', async ({ page }) => {
  42 |     await page.route('**/users/u1?*', async (route) => route.fulfill({ json: { ...user, posts: { data: [], total: 0, page: 1, limit: 10 } } }));
  43 |     await page.route('**/users/me', async (route) => route.fulfill({ json: { ...user, profile: { ...user.profile, displayName: 'Updated Alex', bio: 'Updated bio' } } }));
> 44 |     await page.goto('/profile/u1');
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  45 |     await page.getByRole('button', { name: /edit profile/i }).click();
  46 |     await page.getByLabel(/display name/i).fill('Updated Alex');
  47 |     await page.getByLabel(/^bio$/i).fill('Updated bio');
  48 |     await page.getByRole('button', { name: /save changes/i }).click();
  49 |     await expect(page.getByText('Updated Alex')).toBeVisible();
  50 |     await expect(page.getByText('Updated bio')).toBeVisible();
  51 |   });
  52 | });
  53 | 
```