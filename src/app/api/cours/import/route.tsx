import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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

    const filePath = path.join(process.cwd(), "data", "courses.json");
    const courses: Cours[] = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];

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

    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2));
    return NextResponse.json({ message: "Cours importé avec succès." }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Erreur de validation.", errors: error.errors }, { status: 400 });
    }
    console.error("Erreur interne :", error);
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
  }
}
