import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Cours {
  id: number;
  sujet: string;
  description: string;
  niveau: string;
  duree: number;
  objectif: string;
  enseignant: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_KEY = process.env.CHATGPT_API_KEY;
    const { sujet, niveau, duree, description, enseignant } = body;

    if (!sujet || !niveau || !duree || !description || !enseignant) {
      return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ message: "API key is missing." }, { status: 500 });
    }
    // Appel à l'API OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for analyzing courses.",
          },
          {
            role: "user",
            content: `
              A partir des informations suivantes, créez un plan de cours structuré avec titres, descriptions et objectifs pédagogiques, je veux quelque chose de complet et bien structuré:
              Sujet: ${sujet}
              Niveau: ${niveau}
              Durée: ${duree}
              Description: ${description}
              Enseignant: ${enseignant}
            `,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: 'cours',
            strict: true,
            schema: {
              type: "object",
              properties: {
                sujet: { type: "string" },
                niveau: { type: "string" },
                objectif: { type: "string" },
                duree: { type: "number" },
                description: { type: "string" },
                enseignant: { type: "string" },
              },
              required: ["sujet", "niveau", "objectif", "duree", "description", "enseignant"],
              additionalProperties: false
            }
          }
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur API OpenAI:", data);
      return NextResponse.json({ message: "Erreur lors de la requête à OpenAI." }, { status: 500 });
    }

    const content = data.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ message: "Erreur lors de la génération du cours." }, { status: 500 });
    }

    console.log("Cours généré:", content);
    const newCourse = JSON.parse(content);

    const filePath = path.join(process.cwd(), "data", "courses.json");

    // Lire le fichier existant
    let courses = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      courses = JSON.parse(fileData);
    }

    // Générer un ID unique
    const ids = courses.map((c: Cours) => c.id);
    const id = Math.max(...ids, 0) + 1;
    newCourse.id = id;

    // Ajouter le nouveau cours
    courses.push(newCourse);

    // Sauvegarder dans le fichier
    fs.writeFileSync(filePath, JSON.stringify(courses, null, 2));

    return NextResponse.json({ message: "Cours ajouté avec succès." }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
  }
}

