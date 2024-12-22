"use client";

import React, { useState } from "react";
import { DIFFICULTY_LEVELS, DURATIONS } from "../constants/course";

export default function Home() {
  const [sujet, setSujet] = useState("");
  const [niveau, setNiveau] = useState("facile");
  const [duree, setDuree] = useState("30min");
  const [description, setDescription] = useState("");
  const [enseignant, setEnseignant] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { sujet, niveau, duree, description, enseignant };

    try {
      const response = await fetch("/api/elprofessor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setResponseMessage(result.message);
        setSujet("");
        setNiveau("facile");
        setDuree("30min");
        setDescription("");
        setEnseignant("");
        window.location.href = "/cours";
      } else {
        const error = await response.json();
        setResponseMessage(error.message || "Une erreur est survenue.");
      }
    } catch (err) {
      setResponseMessage("Une erreur réseau est survenue.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">Ajouter un Cours</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sujet */}
          <div>
            <label htmlFor="sujet" className="block text-sm font-medium text-gray-700">
              Sujet :
            </label>
            <input
              id="sujet"
              type="text"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-black"
              required
              placeholder="Exemple : Introduction à la programmation"
            />
          </div>

          {/* Niveau */}
          <div>
            <label htmlFor="niveau" className="block text-sm font-medium text-gray-700 ">
              Niveau de difficulté :
            </label>
            <select
              id="niveau"
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-black"
              required
            >
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Durée */}
          <div>
            <label htmlFor="duree" className="block text-sm font-medium text-gray-700">
              Durée :
            </label>
            <select
              id="duree"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-black"
              required
            >
              {DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description :
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-black"
              rows={4}
              required
              placeholder="Décrivez brièvement le contenu et les objectifs du cours à fin de procéder à la créatrion du plan de ce dernier"
            ></textarea>
          </div>

          {/* Enseignant */}
          <div>
            <label htmlFor="enseignant" className="block text-sm font-medium text-gray-700">
              Nom de l'enseignant :
            </label>
            <input
              id="enseignant"
              type="text"
              value={enseignant}
              onChange={(e) => setEnseignant(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 text-black"
              required
              placeholder="Exemple : M. Dupont"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-md shadow-md hover:bg-indigo-700 transition"
          >
            Soumettre
          </button>
        </form>

        {/* Response Message */}
        {responseMessage && (
          <div
            className={`mt-4 p-4 rounded-md ${
              responseMessage.includes("succès")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
}
