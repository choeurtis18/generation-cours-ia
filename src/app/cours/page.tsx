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

// Styles pour les niveaux de difficulté
const difficultyStyles: Record<string, string> = {
  facile: "text-green-700 bg-green-50 ring-green-600/20",
  intermediaire: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  difficile: "text-red-700 bg-red-50 ring-red-600/20",
  expert: "text-gray-600 bg-gray-50 ring-gray-500/10",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Cours[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/cours");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Erreur lors du chargement des cours :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty(null);
    setSelectedDuration(null);
  };

  const filteredCourses = courses.filter((cours) => {
    const matchesSearch =
      cours.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cours.enseignant.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === null || cours.niveau.toLowerCase() === selectedDifficulty;

    const matchesDuration =
      selectedDuration === null || cours.duree === selectedDuration;

    return matchesSearch && matchesDifficulty && matchesDuration;
  });

  return (
    <div className="max-w-auto px-12 py-14 mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-6">Liste des cours</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Barre de recherche */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Rechercher par nom de cours ou enseignant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-4 pr-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Filtrer par difficulté */}
        <div className="relative w-full sm:w-1/4">
          <select
            value={selectedDifficulty || ""}
            onChange={(e) => setSelectedDifficulty(e.target.value || null)}
            className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Toutes les difficultés</option>
            <option value="facile">Facile</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="difficile">Difficile</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Filtrer par durée */}
        <div className="relative w-full sm:w-1/4">
          <select
            value={selectedDuration || ""}
            onChange={(e) => setSelectedDuration(e.target.value ? Number(e.target.value) : null)}
            className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Toutes les durées</option>
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
          </select>
        </div>

        {/* Bouton Réinitialiser */}
        <button
          onClick={handleResetFilters}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-300"
        >
          Réinitialiser
        </button>
      </div>

      {/* Affichage du loader */}
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
        <span className="loader block"></span>;
        </div>
      ) : filteredCourses.length > 0 ? (
        <ul role="list" className="divide-y divide-gray-100">
          {filteredCourses.map((cours: Cours) => (
            <li
              key={cours.id}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {cours.sujet}
                  </p>
                  <p
                    className={classNames(
                      difficultyStyles[cours.niveau.toLowerCase()],
                      "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {cours.niveau.charAt(0).toUpperCase() +
                      cours.niveau.slice(1)}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-md text-gray-500">
                  <p className="whitespace-nowrap">{cours.duree} minutes</p>
                  <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <p className="truncate">{cours.description}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <Link
                  href={`/cours/${cours.id}`}
                  className="hidden sm:block rounded-md bg-white px-2.5 py-1.5 text-mmd font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Voir<span className="sr-only">, {cours.sujet}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucun cours disponible.</p>
      )}
    </div>
  );
}
