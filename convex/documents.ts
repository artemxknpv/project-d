import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { subject: userId } = identity;
    const existingDoc = await ctx.db.get(args.id);

    if (!existingDoc) {
      throw new Error("Doc not found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Not authorized");
    }

    const recursiveArchive = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parent", docId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          archived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    await recursiveArchive(args.id);

    return ctx.db.patch(args.id, { archived: true });
  },
});

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

export const getArchived = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { subject: userId } = identity;

    return ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("archived"), true))
      .order("desc")
      .collect();
  },
});

export const restore = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { subject: userId } = identity;
    const existingDoc = await ctx.db.get(args.id);

    if (!existingDoc) {
      throw new Error("Doc not found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Not authorized");
    }

    const recursiveRestore = async (docId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parent", docId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { archived: false });
        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      archived: false,
    };

    if (existingDoc.parent) {
      const parent = await ctx.db.get(existingDoc.parent);
      if (parent?.archived) {
        options.parent = undefined;
      }
    }

    await recursiveRestore(args.id);
    return ctx.db.patch(args.id, options);
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { subject: userId } = identity;
    const existingDoc = await ctx.db.get(args.id);

    if (!existingDoc) {
      throw new Error("Doc not found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Not authorized");
    }

    return ctx.db.delete(args.id);
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { subject: userId } = identity;

    return ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("archived"), false))
      .order("desc")
      .collect();
  },
});
