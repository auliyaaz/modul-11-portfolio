"use client";
// src/app/admin/page.js  —  Admin Panel (route: /admin)
// Tidak tampil di navbar — akses langsung via URL /admin

import { useState, useEffect } from "react";

const emptyForm = {
  name: "", email: "", bio: "", imageUrl: "",
  major: "", semester: "", university: "", location: "",
  skills: "",
  github: "", linkedin: "", instagram: "", tiktok: "",
};

// Tech yang punya icon di halaman About
const SKILL_HINTS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Laravel",
  "PHP", "Tailwind CSS", "Figma", "Python", "PostgreSQL",
  "MySQL", "Node.js", "Vue", "Flutter", "Docker", "Git",
];

const SOCIAL_FIELDS = [
  { name: "github",    label: "GitHub",    icon: "🐙", placeholder: "https://github.com/username" },
  { name: "linkedin",  label: "LinkedIn",  icon: "💼", placeholder: "https://linkedin.com/in/username" },
  { name: "instagram", label: "Instagram", icon: "📸", placeholder: "https://instagram.com/username" },
  { name: "tiktok",   label: "TikTok",    icon: "🎵", placeholder: "https://tiktok.com/@username" },
];

export default function AdminPage() {
  const [formData, setFormData]     = useState(emptyForm);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved]           = useState(false);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (data) setFormData({
          name:       data.name       || "",
          email:      data.email      || "",
          bio:        data.bio        || "",
          imageUrl:   data.imageUrl   || "",
          major:      data.major      || "",
          semester:   data.semester   || "",
          university: data.university || "",
          location:   data.location   || "",
          skills:     data.skills     || "",
          github:     data.github     || "",
          linkedin:   data.linkedin   || "",
          instagram:  data.instagram  || "",
          tiktok:     data.tiktok     || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  // Klik chip skill → tambah ke input skills
  function handleSkillChipClick(skill) {
    const current = formData.skills
      .split(",").map((s) => s.trim()).filter(Boolean);
    if (!current.includes(skill)) {
      const next = [...current, skill].join(", ");
      setFormData((prev) => ({ ...prev, skills: next }));
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 " +
    "placeholder-gray-300 bg-white transition-colors " +
    "focus:ring-2 focus:ring-orange-300 focus:border-orange-400 focus:outline-none";

  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ===== HEADER ===== */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Isi semua data di bawah, lalu klik{" "}
              <span className="text-orange-500 font-medium">Simpan</span>.
              Halaman ini tidak tampil di navbar.
            </p>
          </div>
          <div className="flex gap-3">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg transition-colors">
              → Home
            </a>
            <a href="/about" className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg transition-colors">
              → About
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">

            {/* ===== ROW 1: Info Dasar (kiri) + Info Akademik (kanan) ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Info Dasar */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                  <span className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center text-sm">👤</span>
                  <h2 className="font-semibold text-gray-800 text-sm">Info Dasar</h2>
                </div>

                <div>
                  <label className={labelClass}>Nama Lengkap <span className="text-red-400 normal-case tracking-normal">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    required placeholder="Budi Santoso" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="budi@email.com" className={inputClass} />
                </div>

                <div className="flex-1">
                  <label className={labelClass}>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange}
                    rows={4} placeholder="Ceritakan sedikit tentang diri Anda..."
                    className={`${inputClass} resize-none`} />
                </div>

                <div>
                  <label className={labelClass}>URL Foto Profil</label>
                  <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                    placeholder="https://example.com/foto.jpg" className={inputClass} />
                  {formData.imageUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={formData.imageUrl} alt="preview"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => { e.target.style.display = "none"; }} />
                      <span className="text-xs text-gray-400">Preview foto profil</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Akademik */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                  <span className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center text-sm">🎓</span>
                  <h2 className="font-semibold text-gray-800 text-sm">Info Akademik</h2>
                </div>

                <div>
                  <label className={labelClass}>Jurusan / Program Studi</label>
                  <input type="text" name="major" value={formData.major} onChange={handleChange}
                    placeholder="Teknik Informatika" className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Semester</label>
                    <input type="text" name="semester" value={formData.semester} onChange={handleChange}
                      placeholder="6" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Lokasi</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange}
                      placeholder="Bandung, Indonesia" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Nama Kampus</label>
                  <input type="text" name="university" value={formData.university} onChange={handleChange}
                    placeholder="Universitas Indonesia" className={inputClass} />
                </div>

                {/* Social Media masuk di sini, sejajar dengan Akademik */}
                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center text-sm">🔗</span>
                    <h2 className="font-semibold text-gray-800 text-sm">Social Media</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {SOCIAL_FIELDS.map((f) => (
                      <div key={f.name} className="flex items-center gap-3">
                        <span className="text-base shrink-0 w-6 text-center">{f.icon}</span>
                        <div className="flex-1">
                          <input type="url" name={f.name} value={formData[f.name]}
                            onChange={handleChange} placeholder={f.placeholder}
                            className={inputClass} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== ROW 2: Skills & Tools (full width) ===== */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <span className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center text-sm">🛠️</span>
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm">Skills &amp; Tools</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Tampil di halaman About dengan icon otomatis</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Daftar Skill</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange}
                  placeholder="React, Next.js, TypeScript, Laravel, Figma, Python"
                  className={inputClass} />
                <p className="text-xs text-gray-400 mt-2">Pisahkan dengan koma · klik chip di bawah untuk tambah cepat</p>
              </div>

              {/* Chip hints — klik untuk tambah ke input */}
              <div className="flex flex-wrap gap-2">
                {SKILL_HINTS.map((skill) => {
                  const alreadyAdded = formData.skills
                    .split(",").map((s) => s.trim()).includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillChipClick(skill)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        alreadyAdded
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                      }`}
                    >
                      {alreadyAdded ? "✓ " : ""}{skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===== TOMBOL SIMPAN ===== */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto sm:px-12 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-100"
              >
                {submitting ? "Menyimpan..." : "Simpan Semua Perubahan"}
              </button>

              {saved && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                  <span>✅</span>
                  <span>Portfolio berhasil disimpan!</span>
                </div>
              )}
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
