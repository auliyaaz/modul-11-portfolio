"use client";
// src/app/dashboard/page.js
// Halaman Dashboard (route: /dashboard)
// Digunakan untuk mengelola project: tambah, edit, dan hapus.
// "use client" diperlukan karena menggunakan useState, useEffect, dan event handler.

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/ProjectForm";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = mode tambah baru
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Ambil semua project saat halaman pertama kali dibuka
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      // Pastikan selalu array, bukan objek error
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  // Buka form kosong untuk tambah project baru
  function handleOpenCreate() {
    setEditingProject(null);
    setErrorMsg("");
    setShowForm(true);
  }

  // Buka form yang sudah terisi untuk edit project
  function handleOpenEdit(project) {
    setEditingProject(project);
    setErrorMsg("");
    setShowForm(true);
  }

  // Tutup form dan reset semua state terkait form
  function handleCloseForm() {
    setShowForm(false);
    setEditingProject(null);
    setErrorMsg("");
  }

  // Kirim data form ke API — otomatis pilih POST (baru) atau PUT (edit)
  async function handleSubmit(formData) {
    setSubmitting(true);
    setErrorMsg("");

    try {
      let res;

      if (editingProject) {
        // Mode edit: update project yang sudah ada
        res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Mode tambah: buat project baru
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal menyimpan project.");
        return;
      }

      handleCloseForm();
      await fetchProjects(); // refresh daftar setelah berhasil simpan
    } catch (error) {
      setErrorMsg("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  // Hapus project setelah konfirmasi dari user
  async function handleDelete(id) {
    const yakin = window.confirm("Yakin ingin menghapus project ini?");
    if (!yakin) return;

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      await fetchProjects(); // refresh daftar setelah hapus
    } catch (error) {
      console.error("Gagal menghapus project:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Project
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola semua project portfolio Anda
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Tambah Project
          </button>
        </div>

        {/* ===== DAFTAR PROJECT ===== */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            Memuat project...
          </div>
        ) : projects.length === 0 ? (
          // Tampilan kosong — belum ada project
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-gray-500 mb-4">
              Belum ada project. Tambahkan project pertama Anda!
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah Project Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              // Kirim onEdit dan onDelete agar tombol muncul di card
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== MODAL FORM — muncul saat showForm = true ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {editingProject ? "Edit Project" : "Tambah Project Baru"}
              </h2>

              {/* Pesan error dari API */}
              {errorMsg && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  ⚠️ {errorMsg}
                </div>
              )}

              <ProjectForm
                initialData={editingProject}
                onSubmit={handleSubmit}
                onCancel={handleCloseForm}
                isLoading={submitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
