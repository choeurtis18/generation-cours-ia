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


export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const filePath = path.join(process.cwd(), "data", "courses.json");
        const fileData = fs.existsSync(filePath)
          ? fs.readFileSync(filePath, "utf8")
          : "[]";
    
        const courses = JSON.parse(fileData);

        const cours = courses.find((e: Cours) => e.id === parseInt(params.id));
        return NextResponse.json(cours, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
        return NextResponse.json(
          { message: "Erreur lors de la récupération des cours." },
          { status: 500 }
        );
    }
}