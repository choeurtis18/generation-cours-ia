"use client";

import React from "react";

interface RevisionNoteProps {
  subject: string;
  level: string;
  duration: string;
  description: string;
  objective: string;
  teacher: string;
}

export default function RevisionNote({
  subject,
  level,
  duration,
  description,
  objective,
  teacher,
}: RevisionNoteProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Fiche de Révision : {subject}
      </h2>

      <dl className="divide-y divide-gray-200">
        {/* Niveau */}
        <div className="py-4">
          <dt className="text-sm font-medium text-gray-500">Niveau</dt>
          <dd className="mt-1 text-lg text-gray-700">{level}</dd>
        </div>

        {/* Durée */}
        <div className="py-4">
          <dt className="text-sm font-medium text-gray-500">Durée</dt>
          <dd className="mt-1 text-lg text-gray-700">{duration}</dd>
        </div>

        {/* Description */}
        <div className="py-4">
          <dt className="text-sm font-medium text-gray-500">Description</dt>
          <dd className="mt-1 text-lg text-gray-700">{description}</dd>
        </div>

        {/* Objectif */}
        <div className="py-4">
          <dt className="text-sm font-medium text-gray-500">Objectif</dt>
          <dd className="mt-1 text-lg text-gray-700 whitespace-pre-line">
            {objective}
          </dd>
        </div>

        {/* Enseignant */}
        <div className="py-4">
          <dt className="text-sm font-medium text-gray-500">Enseignant</dt>
          <dd className="mt-1 text-lg text-gray-700">{teacher}</dd>
        </div>
      </dl>
    </div>
  );
}
