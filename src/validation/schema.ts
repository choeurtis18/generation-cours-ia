import { z } from "zod";
import { DIFFICULTY_LEVELS, DURATIONS } from "../constants/course";

export const courseSchema = z.object({
    sujet: z.string().min(1, "Le sujet est requis."),
    niveau: z.enum([...DIFFICULTY_LEVELS] as [string, ...string[]]),
    duree: z.enum([...DURATIONS] as [string, ...string[]]),
    description: z.string().min(1, "La description est requise."),
    enseignant: z.string().min(1, "Le nom de l'enseignant est requis."),
  });
  