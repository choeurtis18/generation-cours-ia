"use client";

import React from "react";

export default function CourseObjective({ objective }: { objective: string }) {
  const sections = objective.split("###").map((section) => section.trim());

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Plan du Cours</h2>
      {sections.map((section, index) => {
        const [title, ...content] = section.split("\n").map((line) => line.trim());

        return (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <ul className="list-disc pl-6 space-y-2">
              {content.map((line, idx) => (
                <li key={idx} className="text-gray-700">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
