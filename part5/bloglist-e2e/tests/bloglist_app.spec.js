const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith } = require("./helper.js");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "test user",
        username: "test",
        password: "Q1w2e3r4!",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("login form is shown", async ({ page }) => {
    await expect(page.getByText("log in to application")).toBeVisible();
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(
      page.getByRole("button").filter({ hasText: "login" })
    ).toBeVisible();
  });

  describe("login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("test");
      await page.getByLabel("password").fill("Q1w2e3r4!");
      await page.getByRole("button").filter({ hasText: "login" }).click();
      await expect(page.getByText("Welcome test!")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("test");
      await page.getByLabel("password").fill("wrongpass");
      await page.getByRole("button").filter({ hasText: "login" }).click();
      await expect(
        page.getByText("wrong credentials", { exact: false })
      ).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "test", "Q1w2e3r4!");
    });

    test("a new blog can be created", async ({ page }) => {
      await page
        .getByRole("button")
        .filter({ hasText: "create new blog" })
        .click();
      await page.getByLabel("title").fill("hello world");
      await page.getByLabel("author").fill("admin");
      await page.getByLabel("url").fill("localhost:3003");
      await page.getByRole("button").filter({ hasText: "create" }).click();

      await expect(page.locator(".success")).toBeVisible();
      await expect(page.getByText("hello world - by admin ")).toBeVisible();
      await expect(
        page.getByRole("button").filter({ hasText: "view" })
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      // creating a new blog
      await page
        .getByRole("button")
        .filter({ hasText: "create new blog" })
        .click();
      await page.getByLabel("title").fill("hello world");
      await page.getByLabel("author").fill("admin");
      await page.getByLabel("url").fill("localhost:3003");
      await page.getByRole("button").filter({ hasText: "create" }).click();

      // "liking" the newly created blog
      await page.getByRole("button").filter({ hasText: "view" }).click();
      await page.getByText("like", { exact: true }).click();

      // checking if the number of likes has increased from 0 to 1
      await expect(page.getByText("likes", { exact: false })).toContainText(
        "1"
      );
    });
  });
});
