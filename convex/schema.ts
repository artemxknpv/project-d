import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    archived: v.boolean(),
    parent: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    cover: v.optional(v.string()),
    icon: v.optional(v.string()),
    published: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parent"]),
});
