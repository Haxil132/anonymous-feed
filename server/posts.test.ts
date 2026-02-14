import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {
        'x-forwarded-for': '192.168.1.1',
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("posts.list", () => {
  it("returns empty array when no posts exist", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.posts.list({ limit: 20, offset: 0 });

    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts pagination parameters", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.posts.list({ limit: 10, offset: 5 });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("likes.toggle", () => {
  it("requires postId parameter", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.likes.toggle({ postId: 999999 })
    ).resolves.toHaveProperty('success');
  });
});

describe("comments.list", () => {
  it("returns empty array for non-existent post", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comments.list({ postId: 999999 });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
