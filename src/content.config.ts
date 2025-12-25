import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const navbar = defineCollection({
  loader: file("src/data/navbar.yaml"),
  schema: z.object({
    title: z.string(),
    url: z.string(),
    external: z.boolean(),
  }),
});

const updates = defineCollection({
  loader: file("src/data/updates.yaml"),
  schema: z.object({
    text: z.string(),
  }),
});

export const collections = { navbar, updates };
