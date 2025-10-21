import * as z from "zod";
import { EntrySchema, EntryWithoutIdSchema } from "../schemas/entrySchema.js";

export type Entry = z.infer<typeof EntrySchema>;

export type EntryWithoutId = z.infer<typeof EntryWithoutIdSchema>;
