"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import CourseObjective from "@/components/CourseObjective";

interface Cours {
  id: number;
  sujet: string;
  description: string;
  niveau: string;
  duree: string;
  objectif: string;
  enseignant: string;
}

export default function CoursDetails() {
  const { id } = useParams();
  const [cours, setCours] = useState<Cours | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isGeneratingFiche, setIsGeneratingFiche] = useState(false);
  const [isGeneratingQCM, setIsGeneratingQCM] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5); // État pour le nombre de questions QCM

  useEffect(() => {
    const fetchCours = async () => {
      const response = await fetch(`/api/cours/${id}`);
      const data = await response.json();
      setCours(response.ok ? data : null);
    };

    fetchCours();
  }, [id]);

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/cours/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `course-${id}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Erreur lors de l'exportation du cours.");
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation :", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileData = await file.text();
      const courseData = JSON.parse(fileData);

      const response = await fetch("/api/cours/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();
      if (response.ok) {
        setUploadMessage("Cours importé avec succès !");
        setCours(result.course);
      } else {
        setUploadMessage(result.message || "Erreur lors de l'importation.");
      }
    } catch (error) {
      setUploadMessage("Erreur lors de la lecture du fichier JSON.");
      console.error("Erreur lors de la lecture du fichier JSON :", error);
    }
  };

  const handleGenerateFiche = async () => {
    setIsGeneratingFiche(true);
    try {
      const response = await fetch(`/api/cours/${id}/revision`);
      if (response.ok) {
        const data = await response.json();
        generateQCMPDF(data.fiche);
      } else {
        console.error("Erreur lors de la génération de la fiche.");
      }
    } catch (error) {
      console.error("Erreur lors de la génération de la fiche :", error);
    } finally {
      setIsGeneratingFiche(false);
    }
  };

  const handleGenerateQCM = async () => {
    setIsGeneratingQCM(true);
    try {
      const response = await fetch(`/api/cours/${id}/qcm?questions=${numberOfQuestions}`);
      if (response.ok) {
        const data = await response.json();
        generateQCMPDF(data.qcm);
      } else {
        console.error("Erreur lors de la génération du QCM.");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du QCM :", error);
    } finally {
      setIsGeneratingQCM(false);
    }
  };

  const generateQCMPDF = (qcmContent: string) => {
    const pdf = new jsPDF();
    const marginLeft = 10;
    let yOffset = 20; // Position verticale initiale
  
    pdf.setFontSize(18);
    pdf.text("QCM - Questionnaire", marginLeft, yOffset);
    yOffset += 10; // Décaler après le titre
  
    pdf.setFontSize(12);
    pdf.text(`Sujet: ${cours?.sujet}`, marginLeft, yOffset);
    yOffset += 10;
    pdf.text(`Niveau: ${cours?.niveau}`, marginLeft, yOffset);
    yOffset += 10;
  
    pdf.setFontSize(14);
    pdf.text("Questions :", marginLeft, yOffset);
    yOffset += 10;
  
    // Séparer le contenu du QCM en lignes
    const lines = pdf.splitTextToSize(qcmContent, 180); // Séparer le texte en lignes adaptées à la largeur
    const maxHeight = pdf.internal.pageSize.height - 20; // Limite de la page
  
    // Ajouter chaque ligne et vérifier si on atteint la fin de la page
    lines.forEach((line: string | string[]) => {
      if (yOffset + 10 > maxHeight) {
        pdf.addPage(); // Ajouter une nouvelle page si nécessaire
        yOffset = 20; // Réinitialiser la position
      }
      pdf.text(line, marginLeft, yOffset);
      yOffset += 10; // Décaler pour la ligne suivante
    });
  
    pdf.save(`qcm-${cours?.sujet}.pdf`);
  };

  if (!cours) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader block"></span>
      </div>
    );
  }

  return (
    <div className="max-w-auto min-h-screen mx-auto pt-10 pl-10 pr-10 p-6 bg-white shadow rounded-lg">
      <div className="px-4 sm:px-0">
        <h3 className="text-2xl font-bold text-gray-900">{cours.sujet}</h3>
        <p className="mt-1 text-sm text-gray-500">Détails du cours et informations pédagogiques.</p>
      </div>

      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-200">
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Niveau</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{cours.niveau}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Durée</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{cours.duree} minutes</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Description</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{cours.description}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Enseignant</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{cours.enseignant}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Objectif</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              <CourseObjective objective={cours.objectif} />
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleExport}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Exporter en JSON
        </button>

        <div className="flex items-center">
          <label htmlFor="import-json" className="mr-2 text-sm font-medium text-gray-700">
            Importer un fichier JSON pour modifier le cours :
          </label>
          <input
            type="file"
            accept=".json"
            id="import-json"
            onChange={handleFileUpload}
            className="text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>

      {uploadMessage && (
        <div className={`mt-4 rounded-lg p-4 ${uploadMessage.includes("succès") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {uploadMessage}
        </div>
      )}

     

      <div className="mt-8">
        <button
          onClick={handleGenerateFiche}
          className={`inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 ${isGeneratingFiche ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={isGeneratingFiche}
        >
          {isGeneratingFiche ? "Génération en cours..." : "Générer Fiche de Révision"}
        </button>
      </div>

       {/* Input pour le nombre de questions */}
       <div className="mt-6">
        <label className="text-sm font-medium text-gray-700 ">Nombre de questions pour le QCM :</label>
        <input
          type="number"
          min="1"
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
          className="mt-1 p-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      <div className="mt-8">
        <button
          onClick={handleGenerateQCM}
          className={`inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 ${isGeneratingQCM ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={isGeneratingQCM}
        >
          {isGeneratingQCM ? "Génération du QCM..." : "Générer QCM"}
        </button>
      </div>
    </div>
  );
}
