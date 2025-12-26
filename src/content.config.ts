import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/pages/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});

const updates = defineCollection({
  loader: file("src/data/updates.yaml"),
  schema: z.object({
    text: z.string(),
  }),
});

const publications = defineCollection({
  loader: file("src/data/research/publications.yaml"),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    links: z.object({
      paper: z.string().url(),
      code: z.string().url().optional(),
    }),
  }),
});

const workshops = defineCollection({
  loader: file("src/data/research/workshops.yaml"),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
  }),
});

const talks = defineCollection({
  loader: file("src/data/research/talks.yaml"),
  schema: z.object({
    title: z.string(),
    link: z.string().url(),
  }),
});

export const collections = {
  posts,
  updates,
  publications,
  workshops,
  talks,
};
