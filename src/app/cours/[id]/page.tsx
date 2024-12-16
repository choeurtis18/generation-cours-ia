"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Cours {
    sujet: string;
    description: string;
    niveau: string;
    duree: number;
    objectif: string;
    enseignant: string;
}

export default function CoursDetails() {
  const { id } = useParams(); // Récupère l'ID de l'URL
  const [cours, setCours] = useState<Cours | null>(null);

  useEffect(() => {
    const fetchCours = async () => {
      const response = await fetch(`/api/cours/${id}`);
      const data = await response.json();
      setCours(response.ok ? data : null);
    };

    fetchCours();
  }, [id]);

  if (!cours) {
    return <p>Chargement des détails du cours...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{cours.sujet}</h1>
      <p>
        <strong>Niveau :</strong> {cours.niveau}
      </p>
      <p>
        <strong>Durée :</strong> {cours.duree}
      </p>
      <p>
        <strong>Description :</strong> {cours.description}
      </p>
      <p>
        <strong>Enseignant :</strong> {cours.enseignant}
      </p>
      <h2 className="text-xl font-semibold mt-4">Objectif</h2>
      <pre className="bg-gray-100 p-4">{cours.objectif}</pre>
    </div>
  );
}
