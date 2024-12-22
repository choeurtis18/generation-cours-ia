import { NextResponse } from "next/server";
import { z } from "zod";

interface Cours {
  id: number;
  sujet: string;
  niveau: string;
  duree: string;
  description: string;
  enseignant: string;
  objectif: string;
}

// Validation des données d'un cours
const courseSchema = z.object({
  id: z.number().optional(),
  sujet: z.string().min(1, "Le sujet est requis."),
  niveau: z.string().min(1, "Le niveau est requis."),
  duree: z.string().min(1, "La durée est requise."),
  description: z.string().min(1, "La description est requise."),
  enseignant: z.string().min(1, "Le nom de l'enseignant est requis."),
  objectif: z.string().min(1, "L'objectif est requis."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedCourse = courseSchema.parse(body);

    // URL publique du fichier courses.json dans public
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/courses.json`;

    // Lecture du fichier via fetch
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json({ message: "Erreur lors de la lecture des cours." }, { status: 500 });
    }

    const courses: Cours[] = await response.json();

    // Modification ou ajout de cours
    if (validatedCourse.id) {
      const index = courses.findIndex((course) => course.id === validatedCourse.id);
      if (index !== -1) {
        courses[index] = { ...validatedCourse, id: validatedCourse.id! };
      } else {
        return NextResponse.json({ message: "Cours non trouvé." }, { status: 404 });
      }
    } else {
      const newId = Math.max(0, ...courses.map((c) => c.id)) + 1;
      courses.push({ ...validatedCourse, id: newId });
    }

    // Écriture dans le fichier dans public (non supportée dans public, voir explication)
    return NextResponse.json({ message: "Cours mis à jour localement (non sauvegardé)." }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Erreur de validation.", errors: error.errors }, { status: 400 });
    }
    console.error("Erreur interne :", error);
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
  }
}
