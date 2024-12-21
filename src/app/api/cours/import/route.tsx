import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { z } from "zod";

// Schéma de validation du cours
const courseSchema = z.object({
  id: z.number().optional(), // Si l'ID existe, c'est une mise à jour
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

    // Valider les données JSON
    const validatedCourse = courseSchema.parse(body);

    const filePath = path.join(process.cwd(), "data", "courses.json");
    const courses: any[] = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];

    // Si un ID existe, mettez à jour le cours
    if (validatedCourse.id) {
      const index = courses.findIndex((course) => course.id === validatedCourse.id);
      if (index !== -1) {
        courses[index] = validatedCourse;
      } else {
        return NextResponse.json(
          { message: "Cours non trouvé pour la mise à jour." },
          { status: 404 }
        );
      }
    } else {
      // Si pas d'ID, ajoutez le cours avec un nouvel ID
      const newId = Math.max(0, ...courses.map((c) => c.id)) + 1;
      validatedCourse.id = newId;
      courses.push(validatedCourse);
    }

    // Sauvegarder les cours mis à jour
    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2));

    return NextResponse.json(
      { message: "Cours importé avec succès.", course: validatedCourse },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Erreur de validation des données.", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur interne :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
