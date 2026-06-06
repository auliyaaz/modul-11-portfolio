"use client";
// src/components/ProjectForm.jsx
// Form untuk membuat atau mengedit project.
// Mendukung banyak foto (unlimited) — masukkan via URL satu per satu.

import { useState } from "react";

const CATEGORIES = ["Web App", "Mobile App", "IoT", "Data / ML", "UI/UX", "Game", "Lainnya"];

const emptyForm = {
  title: "", description: "", category: "", year: "",
  techStack: "", liveUrl: "", repoUrl: "", images: [],
};

export default function ProjectForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(() => {
    if (!initialData) return emptyForm;
    return {
      title:       initialData.title       || "",
      description: initialData.description || "",
      category:    initialData.category    || "",
      year:        initialData.year        || "",
      techStack:   initialData.techStack   || "",
      liveUrl:     initialData.liveUrl     || "",
      repoUrl:     initialData.repoUrl     || "",
      images:      (initialData.images ?? []).map((img) => img.url),
    };
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddImage() {
    const url = newImageUrl.trim();
    if (!url) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    setNewImageUrl("");
  }

  function handleRemoveImage(index) {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  function handleImageKeyDown(e) {
    if (e.key === "Enter") { e.preventDefault(); handleAddImage(); }
  }

  function handleSubmit(e) { e.preventDefault(); onSubmit(formData); }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Judul */}
      <div>
        <label className={labelClass}>Judul Project <span className="text-red-500">*</span></label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required
          placeholder="Sistem Informasi Akademik" className={inputClass} />
      </div>

      {/* Deskripsi */}
      <div>
        <label className={labelClass}>Deskripsi <span className="text-red-500">*</span></label>
        <textarea name="description" value={formData.description} onChange={handleChange} required
          rows={4} placeholder="Jelaskan project ini..." className={`${inputClass} resize-none`} />
      </div>

      {/* Kategori + Tahun */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Kategori</label>
          <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
            <option value="">Pilih kategori...</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tahun</label>
          <input type="text" name="year" value={formData.year} onChange={handleChange}
            placeholder="2024" className={inputClass} />
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <label className={labelClass}>Tech Stack <span className="text-red-500">*</span></label>
        <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} required
          placeholder="React, Node.js, PostgreSQL" className={inputClass} />
        <p className="text-xs text-gray-400 mt-1">Pisahkan dengan koma</p>
      </div>

      {/* Live URL & Repo URL */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Link Live Demo</label>
          <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange}
            placeholder="https://..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Link GitHub</label>
          <input type="url" name="repoUrl" value={formData.repoUrl} onChange={handleChange}
            placeholder="https://github.com/..." className={inputClass} />
        </div>
      </div>

      {/* Foto Project */}
      <div>
        <label className={labelClass}>
          Foto Project{" "}
          <span className="text-gray-400 font-normal">({formData.images.length} ditambahkan)</span>
        </label>
        <div className="flex gap-2">
          <input type="url" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={handleImageKeyDown} placeholder="Tempel URL foto lalu klik + atau Enter"
            className={inputClass} />
          <button type="button" onClick={handleAddImage}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors shrink-0">
            +
          </button>
        </div>

        {formData.images.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {formData.images.map((url, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <img src={url} alt={`Foto ${index + 1}`}
                  className="w-10 h-10 rounded object-cover shrink-0 bg-gray-100 border border-gray-200"
                  onError={(e) => { e.target.className = "w-10 h-10 rounded bg-gray-100 shrink-0"; }} />
                <span className="text-xs text-gray-500 flex-1 truncate">{url}</span>
                <button type="button" onClick={() => handleRemoveImage(index)}
                  className="text-red-400 hover:text-red-600 text-sm shrink-0 transition-colors">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tombol */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Menyimpan..." : "Simpan Project"}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-200 hover:border-gray-400 text-gray-700 py-2.5 rounded-lg font-semibold transition-colors">
          Batal
        </button>
      </div>
    </form>
  );
}
