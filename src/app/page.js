"use client";
// src/app/page.js  —  Halaman Home (route: /)
// Layout dua kolom: teks kiri, foto kanan dengan bentuk arch.

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then(setPortfolio)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="text-7xl">👋</div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio belum disetup.</h1>
        <p className="text-gray-500 max-w-md">
          Pergi ke halaman Admin untuk mengisi data diri Anda terlebih dahulu.
        </p>
        <Link
          href="/admin"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
        >
          Setup Portfolio →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden">

      {/* Dekorasi background — lingkaran peach di kanan */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-125 h-125 bg-orange-50 rounded-full -mr-32 pointer-events-none" />
      <div className="absolute right-16 top-1/4 w-72 h-72 bg-orange-100/60 rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12">

        {/* ===== KOLOM KIRI: Teks ===== */}
        <div className="flex flex-col gap-6">
          <p className="text-gray-400 text-base">Hi there, I'm</p>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
            {portfolio.name}
            <span className="text-orange-500">.</span>
          </h1>

          {portfolio.bio && (
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              {portfolio.bio}
            </p>
          )}

          {portfolio.major && (
            <p className="text-gray-400 text-sm">
              An <span className="text-gray-700 font-semibold">{portfolio.major} student</span>
              {portfolio.university && ` at ${portfolio.university}`}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/projects"
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors shadow-md shadow-orange-200"
            >
              View my work
              <span className="text-lg">↗</span>
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-gray-200 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl font-semibold transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>

        {/* ===== KOLOM KANAN: Foto arch ===== */}
        <div className="relative flex justify-center md:justify-end">

          {/* Frame foto berbentuk arch — rounded penuh di atas, lurus di bawah */}
          <div className="relative w-72 md:w-80">
            <div className="w-full aspect-3/4 rounded-t-full rounded-b-3xl overflow-hidden bg-orange-100/80 border border-orange-100">
              {portfolio.imageUrl ? (
                <img
                  src={portfolio.imageUrl}
                  alt={portfolio.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                // Placeholder jika belum ada foto
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl font-black text-orange-200">
                    {portfolio.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Floating info card — pojok kanan bawah */}
            {(portfolio.semester || portfolio.major) && (
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg shadow-gray-200/80 px-4 py-3 flex items-center gap-3 border border-gray-100">
                {portfolio.semester && (
                  <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">{portfolio.semester}</span>
                  </div>
                )}
                <div className="text-left">
                  <p className="text-gray-900 font-semibold text-sm leading-tight">
                    {portfolio.semester ? `Semester ${portfolio.semester}` : portfolio.major}
                  </p>
                  {portfolio.major && (
                    <p className="text-gray-400 text-xs mt-0.5">
                      {portfolio.major}
                      {portfolio.university && ` · ${portfolio.university}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
