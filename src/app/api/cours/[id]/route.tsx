import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de l'URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Récupérer l'ID depuis l'URL

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ message: "ID de cours invalide." }, { status: 400 });
    }
    
    const filePath = path.join(process.cwd(), "data", "courses.json");
    const fileData = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "[]";

    const courses: Cours[] = JSON.parse(fileData);
    const cours = courses.find((e) => e.id === parseInt(id));

    if (!cours) {
      return NextResponse.json({ message: "Cours non trouvé." }, { status: 404 });
    }

    const exportPath = path.join(process.cwd(), "data", `course-${cours.id}.json`);
    fs.writeFileSync(exportPath, JSON.stringify(cours, null, 2));

    return new Response(fs.readFileSync(exportPath), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="course-${cours.id}.json"`,
      },
    });
  } catch (error) {
    console.error("Erreur :", error);
    return NextResponse.json({ message: "Erreur interne." }, { status: 500 });
  }
}