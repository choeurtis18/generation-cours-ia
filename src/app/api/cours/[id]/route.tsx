import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Cours {
  id: number;
  sujet: string;
  description: string;
  niveau: string;
  duree: string;
  objectif: string;
  enseignant: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // Attendre params
    const filePath = path.join(process.cwd(), "data", "courses.json");
    const fileData = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf8")
      : "[]";

    const courses: Cours[] = JSON.parse(fileData);
    const cours = courses.find((e) => e.id === parseInt(id)); // Utiliser id

    if (!cours) {
      return NextResponse.json(
        { message: "Cours non trouvé." },
        { status: 404 }
      );
    }

    // Créer un fichier JSON temporaire pour le téléchargement
    const exportPath = path.join(process.cwd(), "data", `course-${cours.id}.json`); // Définir exportPath
    fs.writeFileSync(exportPath, JSON.stringify(cours, null, 2));

    // Retourner le fichier comme réponse (downloadable)
    return new Response(fs.readFileSync(exportPath), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="course-${cours.id}.json"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'exportation du cours :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'exportation du cours." },
      { status: 500 }
    );
  }
}