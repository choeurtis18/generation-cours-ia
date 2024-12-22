import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { courseSchema } from "@/validation/schema"; // Import du schéma centralisé

// Interface pour les cours
interface Cours {
  id: number;
  sujet: string;
  description: string;
  niveau: string;
  duree: string;
  objectif: string;
  enseignant: string;
}

// Fonction pour formater les erreurs Zod
function formatZodErrors(errors: z.ZodIssue[]): { field: string; message: string }[] {
  return errors.map((error) => ({
    field: error.path.join("."),
    message: error.message,
  }));
}

export async function POST(request: Request) {
  try {
    console.log("Requête POST reçue...");

    // Lire et parser le corps de la requête
    const body = await request.json();
    console.log("Corps de la requête :", body);

    // Valider les données avec Zod
    const validatedData = courseSchema.parse(body);
    console.log("Données validées :", validatedData);

    // Vérifier la clé API OpenAI
    const API_KEY = process.env.CHATGPT_API_KEY;
    if (!API_KEY) {
      console.error("Clé API manquante.");
      return NextResponse.json({ message: "API key is missing." }, { status: 500 });
    }

    // Préparer l'appel à OpenAI
    const { sujet, niveau, duree, description, enseignant } = validatedData;
    const payload = {
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for analyzing courses.",
        },
        {
          role: "user",
          content: `
            A partir des informations suivantes, créez un plan de cours structuré :
            Sujet: ${sujet}, Niveau: ${niveau}, Durée: ${duree}
            Description: ${description}, Enseignant: ${enseignant}.
          `,
        },
      ],
    };
    console.log("Payload envoyé à OpenAI :", payload);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API OpenAI :", errorText);
      return NextResponse.json({ message: "Erreur lors de la requête OpenAI." }, { status: 500 });
    }

    const data = await response.json();
    console.log("Réponse OpenAI :", data);

    const content = data.choices[0]?.message?.content;
    if (!content) {
      console.error("Contenu vide retourné par OpenAI.");
      return NextResponse.json({ message: "Erreur lors de la génération du cours." }, { status: 500 });
    }

    console.log("Cours généré :", content);

    // Lecture des données existantes depuis le dossier "data"
    const dataPath = path.join(process.cwd(), "data", "courses.json");
    let courses: Cours[] = [];

    if (fs.existsSync(dataPath)) {
      try {
        const fileData = fs.readFileSync(dataPath, "utf8");
        courses = JSON.parse(fileData);
      } catch (error) {
        console.error("Erreur lors de la lecture des données existantes :", error);
        return NextResponse.json(
          { message: "Erreur lors de la lecture des données existantes." },
          { status: 500 }
        );
      }
    } else {
      console.warn("Fichier courses.json non trouvé. Création d'un nouveau fichier.");
    }

    // Générer un ID unique et ajouter le cours
    const id = Math.max(...courses.map((c) => c.id), 0) + 1;
    const newCourse = {
      id,
      sujet,
      niveau,
      duree,
      description,
      enseignant,
      objectif: content,
    };
    courses.push(newCourse);

    // Sauvegarder le fichier mis à jour dans le dossier "data"
    try {
      fs.writeFileSync(dataPath, JSON.stringify(courses, null, 2));
      console.log("Nouveau cours sauvegardé :", newCourse);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données :", error);
      return NextResponse.json(
        { message: "Erreur lors de la sauvegarde des données." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Cours ajouté avec succès.", course: newCourse },
      { status: 200 }
    );
  } catch (error) {
    // Gérer les erreurs Zod
    if (error instanceof z.ZodError) {
      console.error("Erreur de validation Zod :", error.errors);

      const formattedErrors = formatZodErrors(error.errors);
      return NextResponse.json(
        { 
          message: "Erreur de validation des données.", 
          errors: formattedErrors 
        },
        { status: 400 }
      );
    }

    // Gérer les erreurs inattendues
    console.error("Erreur attrapée :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
