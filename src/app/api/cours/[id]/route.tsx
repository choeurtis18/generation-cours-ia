import { NextRequest, NextResponse } from "next/server";

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
    // Récupérer l'ID depuis l'URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ message: "ID de cours invalide." }, { status: 400 });
    }

    // URL publique pour accéder au fichier courses.json
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/courses.json`;

    // Récupérer les données via fetch
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json(
        { message: "Erreur lors de la récupération des cours." },
        { status: 500 }
      );
    }

    const courses: Cours[] = await response.json();
    const cours = courses.find((e) => e.id === parseInt(id));

    if (!cours) {
      return NextResponse.json({ message: "Cours non trouvé." }, { status: 404 });
    }

    // Générer un fichier JSON pour l'exportation
    const exportedData = JSON.stringify(cours, null, 2);
    return new Response(exportedData, {
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
