import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Construire l'URL du fichier dans le dossier public
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/courses.json`;

    // Récupérer les données via fetch
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json(
        { message: "Erreur lors de la récupération des cours." },
        { status: 500 }
      );
    }

    const courses = await response.json();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des cours :", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des cours." },
      { status: 500 }
    );
  }
}
