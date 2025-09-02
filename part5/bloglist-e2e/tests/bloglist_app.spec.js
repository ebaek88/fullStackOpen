const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper.js");
const { assert } = require("console");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "test user",
        username: "test",
        password: "Q1w2e3r4!",
      },
    });

    await page.goto("/");
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
      await expect(page.locator(".blog-entry")).toBeVisible();
      await expect(page.getByText("hello world - by admin ")).toBeVisible();
      await expect(
        page.getByRole("button").filter({ hasText: "view" })
      ).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "hello world", "admin", "localhost:3003");
      });

      test("a blog can be liked", async ({ page }) => {
        // "liking" the newly created blog
        await page.getByRole("button").filter({ hasText: "view" }).click();
        await page.getByText("like", { exact: true }).click();

        // checking if the number of likes has increased from 0 to 1
        await expect(page.getByText("likes", { exact: false })).toContainText(
          "1"
        );
      });

      test("a blog can be removed by its creator", async ({ page }) => {
        // You have to register the dialog(alert, prompt, confirm, beforeunload) handler
        // BEFORE the action that triggers the dialog
        page.on("dialog", async (dialog) => await dialog.accept());
        await page.getByRole("button").filter({ hasText: "view" }).click();
        await page.getByRole("button").filter({ hasText: "remove" }).click();
        await expect(page.locator(".blog-entry")).not.toBeVisible();
      });

      test("a blog cannot be removed by users other than its creator", async ({
        page,
        request,
      }) => {
        // log out first
        await page.getByRole("button").filter({ hasText: "logout" }).click();
        // then create another random user
        await request.post("/api/users", {
          data: {
            name: "random user",
            username: "random",
            password: "Q1w2e3r4!",
          },
        });
        // then log in with the random user
        await loginWith(page, "random", "Q1w2e3r4!");
        await page.getByRole("button").filter({ hasText: "view" }).click();
        await expect(
          page.getByRole("button").filter({ hasText: "remove" })
        ).not.toBeVisible();
      });
    });

    describe("and several blogs exist", () => {
      beforeEach(async ({ page }) => {
        const numBlogs = Array.from({ length: 3 }, (_, idx) => idx);
        for (const num of numBlogs) {
          await createBlog(
            page,
            `blog${num}`,
            `author${num}`,
            `https://www.blog.com/${num}`
          );
        }
        // await createBlog(page, "blog0", "author0", "https://www.blog.com/0");
        // await createBlog(page, "blog1", "author1", "https://www.blog.com/1");
      });

      test("can sort blogs by likes in a descending order", async ({
        page,
      }) => {
        for (let i = 0; i < 3; i++) {
          await page
            .locator(".blog-entry")
            .filter({ hasText: `blog${i} - by author${i}` })
            .getByRole("button")
            .filter({ hasText: "view" })
            .click();
          for (let j = 0; j < i; j++) {
            await page
              .getByRole("button", { name: "like", exact: true })
              .nth(i)
              .click();
            await expect(
              page.getByText(`likes ${j + 1} `, { exact: false })
            ).toBeVisible();
            await page.waitForTimeout(100); // add a small delay to ensure UI stability
          }
        }

        // Sort by likes in a descending order
        await page
          .getByRole("button")
          .filter({ hasText: "sort by like(descending order)" })
          .click();

        // Check if the likes are retrieved in the expected order
        const blogsInOrder = await page
          .locator(".blog-likes")
          .allTextContents();
        // console.log(blogs);
        const likesInOrder = blogsInOrder.map((blog) => blog.split(" ")[1]);
        // console.log(likesInOrder);
        await expect(likesInOrder).toStrictEqual(
          [...likesInOrder].sort((a, b) => Number(b) - Number(a))
        );
      });

      test("can sort blogs by likes in an ascending order", async ({
        page,
      }) => {
        for (let i = 0; i < 3; i++) {
          await page
            .locator(".blog-entry")
            .filter({ hasText: `blog${i} - by author${i}` })
            .getByRole("button")
            .filter({ hasText: "view" })
            .click();
          for (let j = 0; j < i; j++) {
            await page
              .getByRole("button", { name: "like", exact: true })
              .nth(i)
              .click();
            await expect(
              page.getByText(`likes ${j + 1} `, { exact: false })
            ).toBeVisible();
            await page.waitForTimeout(100); // add a small delay to ensure UI stability
          }
        }

        // Sort by likes in an ascending order
        await page
          .getByRole("button")
          .filter({ hasText: "sort by like(ascending order)" })
          .click();

        // Check if the likes are retrieved in the expected order
        const blogsInOrder = await page
          .locator(".blog-likes")
          .allTextContents();
        // console.log(blogs);
        const likesInOrder = blogsInOrder.map((blog) => blog.split(" ")[1]);
        // console.log(likesInOrder);
        await expect(likesInOrder).toStrictEqual(
          [...likesInOrder].sort((a, b) => Number(a) - Number(b))
        );
      });
    });
  });
});
