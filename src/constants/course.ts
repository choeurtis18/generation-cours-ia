// constants/course.js

// Liste des niveaux de difficulté (compatible avec Zod)
export const DIFFICULTY_LEVELS = ["facile", "intermediaire", "difficile", "expert"] as const;

// Liste des durées possibles (compatible avec Zod)
export const DURATIONS = ["30min", "1h", "1h30min", "2h"] as const;
