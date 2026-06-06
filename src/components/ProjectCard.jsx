"use client";
// src/components/ProjectCard.jsx
// Card project dengan image carousel.
// Di halaman publik (Projects): tampil bersih tanpa tombol aksi.
// Di Dashboard: tampil tombol Edit & Hapus (props onEdit/onDelete dikirim).

import { useState } from "react";

export default function ProjectCard({ project, onEdit, onDelete }) {
  const [currentImg, setCurrentImg] = useState(0);

  const images   = project.images ?? [];
  const techList = (project.techStack || "").split(",").map((t) => t.trim()).filter(Boolean);
  const prevImg  = () => setCurrentImg((i) => (i - 1 + images.length) % images.length);
  const nextImg  = () => setCurrentImg((i) => (i + 1) % images.length);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">

      {/* ===== HEADER CARD: category badge + foto counter ===== */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {project.category ? (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {project.category}
          </span>
        ) : (
          <span />
        )}
        {images.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            {/* Ikon kamera */}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {images.length}
          </span>
        )}
      </div>

      {/* ===== BAGIAN FOTO ===== */}
      <div className="px-4 pb-2">
      <div className="relative h-48 bg-orange-50 overflow-hidden rounded-xl">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImg].url}
              alt={`${project.title} foto ${currentImg + 1}`}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-7 h-7 flex items-center justify-center shadow-sm transition-colors text-sm">
                  ‹
                </button>
                <button onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-7 h-7 flex items-center justify-center shadow-sm transition-colors text-sm">
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImg(i)}
                      className={`h-1.5 rounded-full transition-all ${i === currentImg ? "w-4 bg-orange-500" : "w-1.5 bg-gray-300"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // Placeholder jika belum ada foto
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-black text-orange-200">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      </div>

      {/* ===== KONTEN CARD ===== */}
      <div className="p-4 flex flex-col flex-1 gap-2">

        {/* Judul + Tahun */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-gray-900 leading-snug">{project.title}</h3>
          {project.year && (
            <span className="text-xs text-gray-400 shrink-0 mt-0.5">{project.year}</span>
          )}
        </div>

        {/* Deskripsi */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Tech Stack */}
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {techList.map((tech) => (
              <span key={tech}
                className="text-xs border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full bg-white">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Tombol Edit & Hapus — hanya di Dashboard */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-3 mt-1 border-t border-gray-100">
            {onEdit && (
              <button onClick={() => onEdit(project)}
                className="flex-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors font-medium">
                ✏️ Edit
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(project.id)}
                className="flex-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg transition-colors font-medium">
                🗑️ Hapus
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
