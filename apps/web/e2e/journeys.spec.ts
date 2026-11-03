import { test, expect, type Page } from '@playwright/test';

const user = {
  id: 'u1',
  email: 'alex@example.com',
  createdAt: new Date().toISOString(),
  profile: { username: 'alex', displayName: 'Alex', bio: 'Hello', avatarUrl: null, bannerUrl: null },
};

const post = {
  id: 'p1',
  title: 'A new FolkTuk post',
  content: 'Hello from the feed #folk',
  authorId: 'u1',
  published: true,
  createdAt: new Date().toISOString(),
  author: user,
  likes: [],
};

async function mockCommonApi(page: Page) {
  await page.route('**/identity/me', async (route) => route.fulfill({ json: user }));
  await page.route('**/posts?*', async (route) => route.fulfill({ json: { items: [], nextCursor: null } }));
  await page.route('**/posts/trending', async (route) => route.fulfill({ json: [{ topic: '#folk', count: 3 }] }));
  await page.route('**/tags/trending', async (route) => route.fulfill({ json: [{ tag: '#folk', count: 3 }] }));
  await page.route('**/communities/joined', async (route) => route.fulfill({ json: [] }));
}

async function authenticate(page: Page) {
  await page.addInitScript(() => localStorage.setItem('folktuk_token', 'test-token'));
  await mockCommonApi(page);
}

test.describe('FolkTuk user journeys', () => {
  test('signs up and stores the JWT token', async ({ page }) => {
    await page.route('**/identity/signup', async (route) => route.fulfill({ status: 201, json: user }));
    await page.route('**/identity/login', async (route) => route.fulfill({ json: { accessToken: 'signup-token', user } }));
    await page.goto('/register');
    await page.getByPlaceholder('Display name').fill('Alex');
    await page.getByPlaceholder('Username').fill('alex');
    await page.getByPlaceholder('Email').fill(user.email);
    await page.getByPlaceholder('Password').fill('Password123!');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('folktuk_token'))).toBe('signup-token');
  });

  test('logs in and stores the JWT token', async ({ page }) => {
    await page.route('**/identity/login', async (route) => route.fulfill({ json: { accessToken: 'test-token', user } }));
    await page.goto('/login');
    await page.getByPlaceholder('Email or username').fill(user.email);
    await page.getByPlaceholder('Password').fill('Password123!');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('folktuk_token'))).toBe('test-token');
  });

  test('creates a post and renders it immediately', async ({ page }) => {
    await authenticate(page);
    await page.route('**/posts', async (route) => {
      if (route.request().method() === 'POST') await route.fulfill({ status: 201, json: post });
    });
    await page.goto('/');
    await page.getByPlaceholder('Post title').fill(post.title);
    await page.getByPlaceholder("What's on your mind?").fill(post.content);
    await page.getByRole('button', { name: /publish post/i }).click();
    await expect(page.getByRole('heading', { name: post.title })).toBeVisible();
  });

  test('opens comments, adds a comment, and toggles a like', async ({ page }) => {
    await authenticate(page);
    await page.route('**/posts?*', async (route) => route.fulfill({ json: { items: [post], nextCursor: null } }));
    await page.route('**/posts/p1/comments', async (route) => {
      if (route.request().method() === 'GET') await route.fulfill({ json: [] });
      else await route.fulfill({ status: 201, json: { id: 'c1', postId: 'p1', authorId: 'u1', content: 'Great post', createdAt: new Date().toISOString() } });
    });
    await page.route('**/posts/p1/like', async (route) => route.fulfill({ status: 201, json: { id: 'like-1' } }));
    await page.goto('/');
    await page.getByRole('button', { name: /comment/i }).click();
    await expect(page.getByText('No comments yet.')).toBeVisible();
    await page.getByPlaceholder('Add a comment...').fill('Great post');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('Great post')).toBeVisible();
    await page.getByRole('button', { name: /like/i }).click();
    await expect(page.getByRole('button', { name: /liked/i })).toBeVisible();
  });

  test('updates the profile display name and bio in the header area', async ({ page }) => {
    await authenticate(page);
    await page.route('**/users/me/activity?*', async (route) => route.fulfill({ json: { ...user, posts: { data: [], total: 0, page: 1, limit: 20 }, comments: [], postLikes: [], commentLikes: [] } }));
    await page.route('**/users/me', async (route) => route.fulfill({ json: { ...user, profile: { ...user.profile, displayName: 'Updated Alex', bio: 'Updated bio' } } }));
    await page.goto('/profile');
    await page.getByRole('button', { name: /edit profile/i }).click();
    await page.getByLabel(/display name/i).fill('Updated Alex');
    await page.getByLabel(/^bio$/i).fill('Updated bio');
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText('Updated Alex')).toBeVisible();
    await expect(page.getByText('Updated bio')).toBeVisible();
  });

  test('searches and selects a trending tag', async ({ page }) => {
    await page.route('**/search?*', async (route) => route.fulfill({ json: { query: '#folk', type: 'tags', posts: [], communities: [], users: [], tags: [{ tag: '#folk', count: 3 }] } }));
    await page.goto('/search?q=%23folk');
    await expect(page.getByText('#folk')).toBeVisible();
    await page.getByText('#folk').first().click();
    await expect(page.locator('input').first()).toHaveValue('#folk');
  });
});
