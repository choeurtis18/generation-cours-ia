import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "courses.json");
    const fileData = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf8")
      : "[]";

    const courses = JSON.parse(fileData);
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des cours :", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des cours." },
      { status: 500 }
    );
  }
}
