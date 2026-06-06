"use client";
// src/app/projects/page.js  —  Halaman Projects (route: /projects)

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Kumpulkan semua tech stack unik untuk filter
  const allTechs = ["Semua", ...new Set(
    projects.flatMap((p) =>
      (p.techStack || "").split(",").map((t) => t.trim()).filter(Boolean)
    )
  )];

  const filtered = activeFilter === "Semua"
    ? projects
    : projects.filter((p) =>
        (p.techStack || "").split(",").map((t) => t.trim()).includes(activeFilter)
      );

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ===== HEADER: judul kiri, deskripsi kanan ===== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <h1 className="text-5xl font-black text-gray-900">Projects</h1>
          <p className="text-gray-400 max-w-xs text-right leading-relaxed">
            A selection of things I've designed, built, and shipped during my studies.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* Filter Pills */}
            {projects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {allTechs.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setActiveFilter(tech)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      activeFilter === tech
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <div className="text-5xl mb-4">📂</div>
                <p>Belum ada project. Tambahkan di{" "}
                  <a href="/dashboard" className="text-orange-500 underline">Dashboard</a>
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                <p className="text-center text-gray-300 text-sm mt-10">
                  {filtered.length} / {projects.length} projects
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
