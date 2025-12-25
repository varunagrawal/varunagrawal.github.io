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

const publications = defineCollection({
  loader: file("src/data/research/publications.yaml"),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    links: z.object({
      paper: z.string().url(),
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

export const collections = { navbar, updates, publications, workshops, talks };
