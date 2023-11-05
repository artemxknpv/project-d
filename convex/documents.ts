import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDocsHierarchyList = query({
  args: {
    parent: v.optional(v.id("documents")),
  },
  handler: async (ctx, { parent }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { subject: userId } = identity;

    return ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parent", parent),
      )
      .filter((q) => q.eq(q.field("archived"), false))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parent: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { subject: userId } = identity;

    return ctx.db.insert("documents", {
      ...args,
      userId,
      archived: false,
      published: false,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    return ctx.db.query("documents").collect();
  },
});
