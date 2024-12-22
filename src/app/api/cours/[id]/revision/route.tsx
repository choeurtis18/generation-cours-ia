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
    // Extraction précise de l'ID dans l'URL
    const url = new URL(request.url);
    const match = url.pathname.match(/\/api\/cours\/(\d+)\/revision/);
    const id = match ? match[1] : null;

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

    const courses = (await response.json()) as Cours[];

    // Rechercher le cours correspondant
    const cours = courses.find((c) => c.id === parseInt(id));
    if (!cours) {
      return NextResponse.json({ message: "Cours introuvable." }, { status: 404 });
    }

    // Vérification de la clé API
    const API_KEY = process.env.CHATGPT_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ message: "Clé API manquante." }, { status: 500 });
    }

    // Construire le payload pour OpenAI
    const payload = {
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are an assistant for creating concise revision notes.",
        },
        {
          role: "user",
          content: `
            Crée une fiche de révision concise pour le cours suivant :
            Sujet : ${cours.sujet}
            Description : ${cours.description}
            Objectif : ${cours.objectif}
            Durée : ${cours.duree}
            Niveau : ${cours.niveau}
            Enseignant : ${cours.enseignant}
          `,
        },
      ],
    };

    // Appel à l'API OpenAI
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error("Erreur API OpenAI :", error);
      return NextResponse.json({ message: "Erreur lors de la génération de la fiche." }, { status: 500 });
    }

    // Extraire le contenu généré
    const data = await openAIResponse.json();
    const content = data.choices[0]?.message?.content;

    return NextResponse.json({ fiche: content }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la génération de la fiche :", error);
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
  }
}
