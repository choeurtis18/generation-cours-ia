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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const numberOfQuestions = parseInt(url.searchParams.get('questions') || '0');

    if (numberOfQuestions <= 0) {
      return NextResponse.json({ message: "Veuillez spécifier un nombre valide de questions." }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "courses.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    const courses = JSON.parse(fileData) as Cours[];

    const cours = courses.find((c) => c.id === parseInt(id));
    if (!cours) {
      return NextResponse.json({ message: "Cours introuvable." }, { status: 404 });
    }

    const API_KEY = process.env.CHATGPT_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ message: "Clé API manquante." }, { status: 500 });
    }

    // Ajoutez le nombre de questions au prompt
    const payload = {
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are an assistant for creating quiz questions based on the course description.",
        },
        {
          role: "user",
          content: `
            Génère un QCM pour le cours suivant :
            Sujet : ${cours.sujet}
            Description : ${cours.description}
            Objectif : ${cours.objectif}
            Durée : ${cours.duree}
            Niveau : ${cours.niveau}
            Enseignant : ${cours.enseignant}
            Nombre de questions : ${numberOfQuestions}
          `,
        },
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Erreur API OpenAI :", error);
      return NextResponse.json({ message: "Erreur lors de la génération du QCM." }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return NextResponse.json({ qcm: content }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la génération du QCM :", error);
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
  }
}
