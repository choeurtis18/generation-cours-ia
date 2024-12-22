"use client";

import React from "react";

interface QCMProps {
  questions: string;
}

export default function QCM({ questions }: QCMProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">QCM pour : {questions}</h2>

      <div className="py-4">
        <pre className="text-lg text-gray-700 whitespace-pre-line">{questions}</pre>
      </div>
    </div>
  );
}
