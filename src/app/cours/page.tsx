"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Cours {
    id: number;
    sujet: string;
    description: string;
    niveau: string;
    duree: number;
    objectif: string;
    enseignant: string;
}

export default function CoursesList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch("/api/cours");
      const data = await response.json();
      setCourses(data);
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des cours</h1>
      {courses.length > 0 ? (
        <ul className="space-y-4">
          {courses.map((cours: Cours) => (
            <li key={cours.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{cours.sujet}</h2>
              <p>{cours.description}</p>
              <Link
                href={`/cours/${cours.id}`}
                className="text-blue-500 underline mt-2 block"
              >
                Voir les détails
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun cours disponible.</p>
      )}
    </div>
  );
}
