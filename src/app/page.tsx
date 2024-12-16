"use client";

import React, { useState } from "react";

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
      const response = await fetch("/api/elprofressor", {
        method: "POST", // Important : Doit être POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        setResponseMessage(result.message);
        // Réinitialiser le formulaire après succès
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Cours</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Sujet :</label>
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block">Niveau de difficulté :</label>
          <select
            value={duree}
            onChange={(e) => setNiveau(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="facile">facile</option>
            <option value="intermediaire">intermédiaire</option>
            <option value="difficile">difficile</option>
            <option value="expert">expert</option>
          </select>
        </div>
        <div>
          <label className="block">Durée :</label>
          <select
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="30min">30min</option>
            <option value="1h">1h</option>
            <option value="1h30min">1h30min</option>
            <option value="2h">2h</option>
          </select>
        </div>
        <div>
          <label className="block">Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
            required
          ></textarea>
        </div>
        <div>
          <label className="block">Nom de l'enseignant :</label>
          <input
            type="text"
            value={enseignant}
            onChange={(e) => setEnseignant(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Soumettre
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-green-600">{responseMessage}</p>
      )}
    </div>
  );
}
