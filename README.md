# Modul Portfolio — Panduan Lengkap

> Panduan ini menjelaskan **seluruh aspek teknis** proyek portfolio web ini: struktur folder, setiap file kode, cara kerja database, hingga deployment ke internet. Cocok untuk mahasiswa yang baru pertama kali menyentuh Next.js dan Prisma.

---

## Daftar Isi

1. [Gambaran Umum Proyek](#1-gambaran-umum-proyek)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Folder](#3-struktur-folder)
4. [Setup Awal — Langkah demi Langkah](#4-setup-awal--langkah-demi-langkah)
   - [4.1 Clone & Install Dependensi](#41-clone--install-dependensi)
   - [4.2 Buat Database di Neon.tech](#42-buat-database-di-neontech)
   - [4.3 Konfigurasi Environment Variable](#43-konfigurasi-environment-variable)
   - [4.4 Buat Tabel di Database (Prisma Push)](#44-buat-tabel-di-database-prisma-push)
   - [4.5 Jalankan Server Development](#45-jalankan-server-development)
5. [Database Schema — Penjelasan Lengkap](#5-database-schema--penjelasan-lengkap)
6. [Penjelasan Setiap File](#6-penjelasan-setiap-file)
   - [6.1 src/lib/prisma.js](#61-srclibprismaj)
   - [6.2 src/app/globals.css](#62-srcappglobalscss)
   - [6.3 src/app/layout.js](#63-srcapplayoutjs)
   - [6.4 src/components/Navbar.jsx](#64-srccomponentsnavbarjsx)
   - [6.5 src/components/Footer.jsx](#65-srccomponentsfooterjsx)
   - [6.6 src/app/page.js — Halaman Home](#66-srcapppagejs--halaman-home)
   - [6.7 src/app/about/page.js — Halaman About](#67-srcappaboutpagejs--halaman-about)
   - [6.8 src/app/projects/page.js — Halaman Projects](#68-srcappprojectspagejs--halaman-projects)
   - [6.9 src/app/admin/page.js — Halaman Admin](#69-srcappadminpagejs--halaman-admin)
   - [6.10 src/app/dashboard/page.js — Halaman Dashboard](#610-srcappdashboardpagejs--halaman-dashboard)
   - [6.11 src/components/ProjectCard.jsx](#611-srccomponentsprojectcardjsx)
   - [6.12 src/components/ProjectForm.jsx](#612-srccomponentsprojectformjsx)
7. [API Routes — Penjelasan Lengkap](#7-api-routes--penjelasan-lengkap)
   - [7.1 GET & PUT /api/portfolio](#71-get--put-apiportfolio)
   - [7.2 GET & POST /api/projects](#72-get--post-apiprojects)
   - [7.3 PUT & DELETE /api/projects/[id]](#73-put--delete-apiprojectsid)
8. [Alur Data: Dari Browser ke Database](#8-alur-data-dari-browser-ke-database)
9. [Cara Mengisi Portfolio (Panduan Mahasiswa)](#9-cara-mengisi-portfolio-panduan-mahasiswa)
10. [Seed Database dengan Data Contoh](#10-seed-database-dengan-data-contoh)
11. [Deploy ke Vercel](#11-deploy-ke-vercel)
12. [Troubleshooting — Masalah Umum](#12-troubleshooting--masalah-umum)

---

## 1. Gambaran Umum Proyek

Proyek ini adalah **website portfolio personal** berbasis web yang bisa dikustomisasi oleh setiap mahasiswa. Satu mahasiswa = satu instance portfolio.

**Fitur utama:**
- Halaman publik: **Home**, **About**, **Projects** — bisa dilihat siapa saja
- Halaman manajemen: **Admin** (isi data diri) dan **Dashboard** (kelola project) — hanya diakses oleh pemilik via URL langsung
- Data disimpan di **database PostgreSQL** di cloud (Neon.tech)
- Mendukung banyak foto per project (carousel gambar)
- Skills & Tools tampil dengan ikon SVG otomatis
- Desain responsif (mobile-friendly)

**Setiap mahasiswa:**
1. Menyalin (fork/clone) template ini
2. Membuat database Neon sendiri
3. Mengisi data portfolio via halaman `/admin` dan `/dashboard`
4. Deploy ke Vercel dengan URL unik masing-masing

---

## 2. Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 16.2.6 | Framework React — mengelola routing, API routes, rendering |
| **React** | 19 | Library UI — membangun komponen interaktif |
| **Tailwind CSS** | v4 | Framework CSS — styling langsung di className |
| **Prisma** | v5 | ORM — jembatan antara kode JavaScript dan database |
| **PostgreSQL** | — | Database relasional — menyimpan semua data portfolio |
| **Neon.tech** | — | Provider database PostgreSQL gratis di cloud |
| **Vercel** | — | Platform hosting untuk deploy aplikasi Next.js |

### Kenapa Next.js App Router?

Next.js memiliki dua sistem routing:
- **Pages Router** (lama): file di `pages/`
- **App Router** (baru, digunakan di proyek ini): file di `src/app/`

App Router lebih modern, mendukung Server Components, dan menjadi standar Next.js saat ini.

---

## 3. Struktur Folder

```
modul-portfolio/
├── prisma/
│   ├── schema.prisma        # Definisi tabel database
│   └── seed.js              # Script mengisi data contoh ke database
│
├── src/
│   ├── app/                 # Seluruh halaman dan API (App Router)
│   │   ├── api/             # API Routes — diakses via fetch()
│   │   │   ├── portfolio/
│   │   │   │   └── route.js         # GET + PUT /api/portfolio
│   │   │   └── projects/
│   │   │       ├── route.js         # GET + POST /api/projects
│   │   │       └── [id]/
│   │   │           └── route.js     # PUT + DELETE /api/projects/:id
│   │   │
│   │   ├── about/
│   │   │   └── page.js      # Halaman /about
│   │   ├── admin/
│   │   │   └── page.js      # Halaman /admin (tidak di navbar)
│   │   ├── dashboard/
│   │   │   └── page.js      # Halaman /dashboard (tidak di navbar)
│   │   ├── projects/
│   │   │   └── page.js      # Halaman /projects
│   │   │
│   │   ├── globals.css      # Style global + konfigurasi tema
│   │   ├── layout.js        # Layout utama — Navbar + Footer
│   │   └── page.js          # Halaman / (Home)
│   │
│   ├── components/          # Komponen UI yang dipakai ulang
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectCard.jsx  # Card satu project dengan carousel
│   │   └── ProjectForm.jsx  # Form tambah/edit project
│   │
│   └── lib/
│       └── prisma.js        # Koneksi database (singleton)
│
├── .env.example             # Template konfigurasi — salin jadi .env.local
├── .gitignore
└── package.json
```

### Aturan Penamaan di Next.js App Router

| File | Fungsi |
|------|--------|
| `page.js` | Halaman yang bisa diakses via URL |
| `layout.js` | Wrapper halaman — dipakai bersama oleh semua halaman anak |
| `route.js` | API endpoint (mirip controller di MVC) |
| `[id]/` | Folder dengan nama dinamis — `[id]` akan diisi nilai nyata |

---

## 4. Setup Awal — Langkah demi Langkah

### 4.1 Clone & Install Dependensi

```bash
# Clone repository
git clone <URL_REPOSITORY> nama-folder-kamu
cd nama-folder-kamu

# Install semua package yang diperlukan
npm install
```

Perintah `npm install` akan membaca `package.json` dan mengunduh semua dependensi ke folder `node_modules/`. Perintah ini juga otomatis menjalankan `prisma generate` (via script `postinstall`).

### 4.2 Buat Database di Neon.tech

Neon.tech menyediakan database PostgreSQL gratis untuk developer. Ikuti langkah berikut:

1. Buka [https://console.neon.tech](https://console.neon.tech) dan daftar/login
2. Klik **"New Project"** → beri nama project (contoh: `portfolio-namamu`)
3. Pilih region terdekat (misalnya **Singapore**)
4. Setelah project dibuat, buka tab **"Connection Details"**
5. Di bagian **"Connection string"**, salin URL yang formatnya seperti ini:

```
postgresql://USER:PASSWORD@HOST.neon.tech/DATABASE?sslmode=require
```

Simpan URL ini — akan dipakai di langkah berikutnya.

### 4.3 Konfigurasi Environment Variable

Environment variable adalah nilai konfigurasi yang **tidak boleh di-commit ke Git** (karena berisi password database).

1. Salin file `.env.example` menjadi `.env.local`:

```bash
# Di terminal (Mac/Linux):
cp .env.example .env.local

# Di Windows PowerShell:
Copy-Item .env.example .env.local
```

2. Buka `.env.local` dan isi dengan URL database dari Neon:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DATABASE?sslmode=require"
```

> **Penting:** File `.env.local` sudah masuk ke `.gitignore`, jadi tidak akan ter-upload ke GitHub. Ini melindungi password database Anda.

### 4.4 Buat Tabel di Database (Prisma Push)

Setelah database dikonfigurasi, jalankan perintah ini untuk membuat tabel-tabel sesuai schema:

```bash
npx prisma db push
```

Perintah ini membaca `prisma/schema.prisma` dan membuat semua tabel di database Neon secara otomatis. Output yang muncul jika berhasil:

```
Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma

🚀  Your database is now in sync with your Prisma schema.
```

Setelah `db push`, regenerasi Prisma Client:

```bash
npx prisma generate
```

### 4.5 Jalankan Server Development

```bash
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000).

> Jika port 3000 sudah dipakai, Next.js otomatis menggunakan port berikutnya (3001, 3002, dst.).

---

## 5. Database Schema — Penjelasan Lengkap

File `prisma/schema.prisma` mendefinisikan struktur database. Anggap ini seperti "blueprint" tabel.

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"   // jenis database yang digunakan
  url      = env("DATABASE_URL")  // URL diambil dari .env.local
}

generator client {
  provider = "prisma-client-js"  // generate Prisma Client untuk JavaScript
}

model Portfolio {
  id         String    @id @default(cuid())  // primary key, auto-generate
  name       String                           // nama lengkap (wajib)
  email      String?                          // ? = opsional (boleh kosong)
  bio        String?
  imageUrl   String?
  major      String?
  semester   String?
  university String?
  location   String?
  skills     String?   // "React, Next.js, TypeScript" — pisah koma
  github     String?
  linkedin   String?
  instagram  String?
  tiktok     String?
  projects   Project[]  // relasi: satu portfolio punya banyak project
  createdAt  DateTime  @default(now())
}

model Project {
  id          String         @id @default(cuid())
  title       String
  description String
  category    String?        // "Web App", "Mobile App", "IoT", dll
  techStack   String         // "React, Node.js, PostgreSQL" — pisah koma
  liveUrl     String?
  repoUrl     String?
  year        String?        // "2024", "2025"
  images      ProjectImage[] // relasi: satu project punya banyak foto
  portfolio   Portfolio      @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  portfolioId String
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model ProjectImage {
  id        String   @id @default(cuid())
  url       String   // URL foto (dari internet, bukan upload file)
  order     Int      @default(0)  // urutan tampil di carousel
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String
  createdAt DateTime @default(now())
}
```

### Penjelasan Relasi Antar Tabel

```
Portfolio  ──(1)──────────(N)──  Project  ──(1)──────────(N)──  ProjectImage
  (1 portfolio)         (banyak project)           (banyak foto)
```

- Satu **Portfolio** bisa punya banyak **Project**
- Satu **Project** bisa punya banyak **ProjectImage** (carousel foto)
- `onDelete: Cascade` = jika portfolio dihapus, semua project ikut terhapus. Jika project dihapus, semua fotonya ikut terhapus.

### Mengapa `skills` Disimpan Sebagai String?

`skills` disimpan sebagai satu string "React, Next.js, TypeScript" (bukan tabel terpisah) karena lebih sederhana untuk skala proyek ini. Di kode JavaScript, string ini di-parse dengan:

```js
const skillList = portfolio.skills.split(",").map(s => s.trim())
// → ["React", "Next.js", "TypeScript"]
```

---

## 6. Penjelasan Setiap File

### 6.1 src/lib/prisma.js

File ini membuat **koneksi ke database** menggunakan Prisma Client.

```js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

**Mengapa menggunakan pattern ini?**

Next.js memiliki fitur **hot-reload**: setiap kali Anda menyimpan file, server development otomatis restart. Tanpa pattern ini, setiap restart akan membuat koneksi database baru, sampai akhirnya database kehabisan koneksi.

Solusinya: simpan instance Prisma di `globalThis` (objek global Node.js yang tidak ikut di-reset saat hot-reload). Baris `?? new PrismaClient()` berarti "gunakan yang sudah ada, atau buat baru jika belum ada".

Di production, tidak perlu menyimpan ke global karena server tidak hot-reload.

---

### 6.2 src/app/globals.css

File CSS global yang dimuat di seluruh halaman.

```css
@import "tailwindcss";   /* Load semua class Tailwind CSS v4 */

:root {
  --background: #ffffff;
  --foreground: #111827;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), Arial, sans-serif;
}

/* Scrollbar custom — warna oranye sesuai tema */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: #f3f4f6; }
::-webkit-scrollbar-thumb { background: #f97316; border-radius: 999px; }
```

> **Catatan Tailwind v4:** Berbeda dari v3, Tailwind v4 di-import dengan `@import "tailwindcss"` (bukan `@tailwind base; @tailwind components; @tailwind utilities`).

---

### 6.3 src/app/layout.js

**Root Layout** adalah komponen yang membungkus **semua** halaman di aplikasi. Navbar dan Footer didefinisikan di sini agar muncul di setiap halaman.

```js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Load font dari Google Fonts (dioptimasi oleh Next.js)
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata = {
  title: "My Portfolio",
  description: "Portfolio mahasiswa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <Navbar />
        {/* pt-16 untuk memberi jarak agar konten tidak tertutup navbar fixed */}
        <main className="flex-1 pt-16">
          {children}  {/* Konten halaman aktif masuk di sini */}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

`{children}` adalah placeholder — Next.js otomatis mengisi ini dengan konten halaman yang sedang dikunjungi (misalnya `page.js` untuk `/`, `about/page.js` untuk `/about`, dll).

**`@/`** adalah alias untuk `src/` — jadi `@/components/Navbar` artinya `src/components/Navbar`.

---

### 6.4 src/components/Navbar.jsx

Navbar **fixed** di atas layar, dengan logo yang menampilkan nama pemilik portfolio secara dinamis.

**Konsep-konsep penting:**

**`"use client"`** — directive ini wajib ada karena komponen menggunakan:
- `useState` — menyimpan state (nama, status menu)
- `useEffect` — menjalankan kode setelah komponen muncul di layar
- `usePathname` — membaca URL halaman aktif

Tanpa `"use client"`, komponen ini akan dirender di server dan tidak bisa mengakses API browser.

```js
// Ambil nama pemilik dari API saat komponen pertama kali muncul
useEffect(() => {
  fetch("/api/portfolio")
    .then(r => r.json())
    .then(data => {
      if (data?.name) setOwnerName(data.name.split(" ")[0].toLowerCase());
    });
}, []); // [] = hanya jalankan sekali, saat pertama mount
```

**Cara kerja logo dinamis:**
- Fetch nama dari API → ambil kata pertama → lowercase
- "Daffa Maulana Ibrahim" → "daffa"
- Tampil: `daffa.` (huruf hitam + titik oranye)

**Navigasi aktif:**
```js
const isActive = pathname === link.href;
// Jika URL sekarang adalah /about, link About punya isActive = true
// Tampilan: teks gelap + border bawah oranye
```

---

### 6.5 src/components/Footer.jsx

Footer sederhana tanpa interaktivitas — tidak perlu `"use client"`.

```js
export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
      <p>
        © {new Date().getFullYear()} · Dibuat dengan{" "}
        <span className="text-orange-500 font-medium">Next.js</span> &{" "}
        <span className="text-orange-500 font-medium">Tailwind CSS</span>
      </p>
    </footer>
  );
}
```

`{new Date().getFullYear()}` menampilkan tahun saat ini secara otomatis — tidak perlu update manual setiap tahun.

---

### 6.6 src/app/page.js — Halaman Home

Route: `/`

**Layout:** Dua kolom — teks di kiri, foto "arch" (berbentuk lengkung) di kanan.

**Alur kerja:**
1. Komponen muncul → `useEffect` fetch data dari `/api/portfolio`
2. Selama loading → tampilkan spinner
3. Jika data kosong (belum setup) → tampilkan pesan + tombol ke `/admin`
4. Jika data ada → render hero dua kolom

**Elemen kunci:**

```js
// Foto dengan bentuk arch
<div className="w-full aspect-3/4 rounded-t-full rounded-b-3xl overflow-hidden">
  <img src={portfolio.imageUrl} className="w-full h-full object-cover object-top" />
</div>
```

`aspect-3/4` = rasio lebar:tinggi = 3:4 (portrait). `rounded-t-full` membuat sisi atas melingkar penuh (setengah lingkaran), `rounded-b-3xl` membuat sisi bawah sedikit melengkung.

```js
// Floating info card
<div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3">
  <span className="w-9 h-9 bg-orange-500 rounded-xl">
    {portfolio.semester}
  </span>
  <p>{portfolio.major} · {portfolio.university}</p>
</div>
```

`absolute -bottom-4 -right-4` memposisikan card di luar pojok kanan bawah frame foto, menciptakan efek "mengambang".

---

### 6.7 src/app/about/page.js — Halaman About

Route: `/about`

Halaman ini paling kompleks karena memuat:

**1. TECH_ICONS — Map Icon SVG**

```js
const TECH_ICONS = {
  "react":      { color: "#61DAFB", icon: <svg>...</svg> },
  "next.js":    { color: "#000000", icon: <svg>...</svg> },
  "typescript": { color: "#3178C6", icon: <svg>...</svg> },
  // ... 16 teknologi total
};
```

Ini adalah objek JavaScript biasa yang memetakan nama teknologi ke warna dan SVG-nya. SVG ditulis langsung sebagai JSX (tidak perlu library ikon eksternal).

**2. Cara menampilkan skill dengan ikon:**

```js
const skillList = portfolio.skills.split(",").map(s => s.trim());
// ["React", "Next.js", "TypeScript"]

{skillList.map(skill => {
  const meta = TECH_ICONS[skill.toLowerCase()];
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 border rounded-full">
      {meta?.icon && (
        <span className="w-4 h-4" style={{ color: meta.color }}>
          {meta.icon}
        </span>
      )}
      {skill}
    </span>
  );
})}
```

`skill.toLowerCase()` mengubah "React" → "react" agar cocok dengan key di `TECH_ICONS`. `meta?.icon` menggunakan optional chaining — jika `meta` undefined (skill tidak ada ikonnya), tidak error.

**3. SOCIAL_ICONS dan kartu media sosial:**

```js
const socialLinks = Object.entries(SOCIAL_ICONS)
  .map(([key, meta]) => ({ key, ...meta, url: portfolio[key] }))
  .filter(s => s.url);  // hanya tampilkan yang sudah diisi
```

`Object.entries` mengubah objek menjadi array `[["github", {...}], ["linkedin", {...}], ...]`. `.filter(s => s.url)` membuang platform yang URL-nya kosong/null.

---

### 6.8 src/app/projects/page.js — Halaman Projects

Route: `/projects`

**Fitur filter tech stack:**

```js
// Kumpulkan semua tech unik dari semua project
const allTechs = ["Semua", ...new Set(
  projects.flatMap(p =>
    (p.techStack || "").split(",").map(t => t.trim()).filter(Boolean)
  )
)];
```

`flatMap` menggabungkan array dari setiap project menjadi satu array datar. `new Set(...)` menghilangkan duplikat. `...` (spread) mengubah Set kembali ke array.

**Filter aktif:**

```js
const filtered = activeFilter === "Semua"
  ? projects
  : projects.filter(p =>
      p.techStack.split(",").map(t => t.trim()).includes(activeFilter)
    );
```

Jika filter "Semua" aktif → tampilkan semua. Jika tidak → hanya project yang techStack-nya mengandung teknologi yang dipilih.

---

### 6.9 src/app/admin/page.js — Halaman Admin

Route: `/admin` (tidak tampil di navbar — diakses manual via URL)

Halaman ini untuk mengisi dan mengedit **data diri** (bukan project). Menggunakan satu form besar dengan beberapa section.

**Alur kerja:**
1. Buka halaman → fetch data portfolio yang ada → isi form
2. User mengubah input → state `formData` berubah via `handleChange`
3. Klik "Simpan" → `handleSubmit` → PUT ke `/api/portfolio`

**Skill chip interaktif:**

```js
function handleSkillChipClick(skill) {
  const current = formData.skills
    .split(",").map(s => s.trim()).filter(Boolean);

  if (!current.includes(skill)) {
    // Tambah skill baru ke list
    const next = [...current, skill].join(", ");
    setFormData(prev => ({ ...prev, skills: next }));
  }
}
```

Setiap chip berubah warna (oranye) saat skill sudah ada di input:

```js
const alreadyAdded = formData.skills
  .split(",").map(s => s.trim()).includes(skill);

className={alreadyAdded
  ? "bg-orange-500 text-white"   // sudah ditambahkan
  : "bg-white text-gray-600"}    // belum ditambahkan
```

---

### 6.10 src/app/dashboard/page.js — Halaman Dashboard

Route: `/dashboard` (tidak tampil di navbar — diakses manual via URL)

Halaman ini untuk mengelola **project** (CRUD: Create, Read, Update, Delete).

**State yang dikelola:**

```js
const [projects, setProjects]       = useState([]);   // daftar project
const [showForm, setShowForm]       = useState(false); // tampilkan/sembunyikan modal
const [editingProject, setEditingProject] = useState(null); // null = mode tambah
const [submitting, setSubmitting]   = useState(false);
const [errorMsg, setErrorMsg]       = useState("");
```

**Logika tambah vs edit — satu fungsi `handleSubmit`:**

```js
async function handleSubmit(formData) {
  if (editingProject) {
    // Mode edit: kirim PUT ke /api/projects/{id}
    await fetch(`/api/projects/${editingProject.id}`, { method: "PUT", ... });
  } else {
    // Mode tambah: kirim POST ke /api/projects
    await fetch("/api/projects", { method: "POST", ... });
  }
}
```

Dengan cara ini, `ProjectForm` tidak perlu tahu apakah sedang tambah atau edit — itu urusan dashboard.

**Modal overlay:**

```js
{showForm && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <ProjectForm ... />
    </div>
  </div>
)}
```

`fixed inset-0` = menutupi seluruh layar. `bg-black/60` = background gelap semi-transparan. `max-h-[90vh] overflow-y-auto` = form bisa di-scroll jika kontennya panjang.

---

### 6.11 src/components/ProjectCard.jsx

Kartu project yang dipakai di halaman Projects (publik) dan Dashboard (dengan tombol edit/hapus).

**Carousel foto:**

```js
const [currentImg, setCurrentImg] = useState(0);

const prevImg = () => setCurrentImg(i => (i - 1 + images.length) % images.length);
const nextImg = () => setCurrentImg(i => (i + 1) % images.length);
```

Formula `% images.length` membuat navigasi carousel berputar (setelah foto terakhir kembali ke pertama, sebelum foto pertama lompat ke terakhir).

**Tombol Edit/Hapus hanya muncul di Dashboard:**

```js
// Di halaman Projects: <ProjectCard project={project} />
// Di Dashboard: <ProjectCard project={project} onEdit={...} onDelete={...} />

{(onEdit || onDelete) && (
  <div className="flex gap-2 pt-3 border-t">
    {onEdit && <button onClick={() => onEdit(project)}>Edit</button>}
    {onDelete && <button onClick={() => onDelete(project.id)}>Hapus</button>}
  </div>
)}
```

Jika `onEdit` dan `onDelete` tidak dikirim sebagai prop (halaman Projects), bagian tombol tidak akan muncul sama sekali.

---

### 6.12 src/components/ProjectForm.jsx

Form untuk tambah dan edit project. Bisa digunakan di dua konteks (modal dashboard).

**State foto (multi-image):**

```js
const [newImageUrl, setNewImageUrl] = useState(""); // input URL sementara

function handleAddImage() {
  const url = newImageUrl.trim();
  if (!url) return;
  setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  setNewImageUrl(""); // kosongkan input setelah tambah
}

function handleRemoveImage(index) {
  setFormData(prev => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index)
  }));
}
```

User memasukkan URL satu per satu → klik tombol `+` atau tekan Enter → URL masuk ke array `images`. Setiap URL ditampilkan sebagai thumbnail yang bisa dihapus.

**Inisialisasi saat edit:**

```js
const [formData, setFormData] = useState(() => {
  if (!initialData) return emptyForm;
  return {
    ...
    images: (initialData.images ?? []).map(img => img.url),
    // Ubah [{id, url, order}] → ["url1", "url2"] untuk form
  };
});
```

Saat mode edit, `initialData.images` berisi array objek dari database. Form hanya butuh string URL-nya saja.

---

## 7. API Routes — Penjelasan Lengkap

API Routes di Next.js adalah **endpoint backend** yang berjalan di server. File `route.js` di dalam folder `api/` secara otomatis menjadi endpoint yang bisa diakses via HTTP.

### 7.1 GET & PUT /api/portfolio

File: `src/app/api/portfolio/route.js`

**GET /api/portfolio** — Ambil data portfolio

```js
export async function GET() {
  const portfolio = await prisma.portfolio.findFirst();
  return NextResponse.json(portfolio ?? null);
}
```

`findFirst()` mengambil record pertama yang ditemukan. Desain proyek ini menggunakan **satu portfolio per instance** (tidak ada multi-user), sehingga `findFirst()` sudah cukup.

**PUT /api/portfolio** — Update (atau buat) data portfolio

```js
export async function PUT(request) {
  const body = await request.json(); // parse body JSON dari request
  const { name, email, bio, ... } = body;

  // Validasi: nama wajib diisi
  if (!name) return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });

  const existing = await prisma.portfolio.findFirst();
  const portfolio = existing
    ? await prisma.portfolio.update({ where: { id: existing.id }, data })
    : await prisma.portfolio.create({ data });

  return NextResponse.json(portfolio);
}
```

Pattern "upsert manual": cek apakah portfolio sudah ada → jika ya, update; jika belum, buat baru. Ini memastikan mahasiswa bisa mengisi form `/admin` meski database masih kosong.

---

### 7.2 GET & POST /api/projects

File: `src/app/api/projects/route.js`

**GET /api/projects** — Ambil semua project

```js
export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },  // terbaru di atas
    include: { images: { orderBy: { order: "asc" } } },
    // include: sertakan relasi ProjectImage dalam hasil
    // orderBy order: asc = foto urut sesuai field `order`
  });
  return NextResponse.json(projects);
}
```

Tanpa `include`, Prisma tidak akan menyertakan data relasi — `project.images` akan undefined.

**POST /api/projects** — Buat project baru

```js
export async function POST(request) {
  const body = await request.json();
  const { title, description, techStack, category, year, liveUrl, repoUrl, images = [] } = body;

  // Cek portfolio sudah ada belum
  const portfolio = await prisma.portfolio.findFirst();
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio belum dibuat..." }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      title, description, techStack, category, year, liveUrl, repoUrl,
      portfolioId: portfolio.id,  // hubungkan ke portfolio
      images: {
        create: images.map((url, index) => ({ url, order: index })),
        // buat ProjectImage untuk setiap URL foto
      },
    },
    include: { images: true },
  });

  return NextResponse.json(project, { status: 201 }); // 201 = Created
}
```

`images.create` adalah fitur Prisma untuk membuat relasi sekaligus dalam satu query — lebih efisien daripada loop terpisah.

---

### 7.3 PUT & DELETE /api/projects/[id]

File: `src/app/api/projects/[id]/route.js`

Folder `[id]` adalah **dynamic route** — bagian `[id]` akan diisi nilai nyata dari URL. Contoh: `PUT /api/projects/clxyz123` → `params.id = "clxyz123"`.

**PUT /api/projects/[id]** — Update project

```js
export async function PUT(request, { params }) {
  const { id } = await params;  // Next.js 15+: params adalah Promise, harus di-await
  const body = await request.json();

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...data,
      images: {
        deleteMany: {},           // hapus semua foto lama
        create: images.map(...), // buat ulang dari data baru
      },
    },
    include: { images: true },
  });
}
```

Strategi **delete-then-recreate** untuk foto: lebih sederhana daripada membandingkan foto lama vs baru. Setiap kali edit project, seluruh foto dihapus dan dibuat ulang sesuai input terbaru.

**DELETE /api/projects/[id]** — Hapus project

```js
export async function DELETE(_request, { params }) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  // Foto (ProjectImage) ikut terhapus otomatis karena onDelete: Cascade
}
```

`onDelete: Cascade` di schema Prisma memastikan foto terhapus otomatis saat project dihapus.

**Penanganan error Prisma:**

```js
if (error.code === "P2025") {
  return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
}
```

`P2025` adalah kode error Prisma untuk "record not found" — muncul jika user mencoba hapus ID yang tidak ada di database.

---

## 8. Alur Data: Dari Browser ke Database

Berikut alur lengkap saat user mengisi data di halaman Admin dan menekan "Simpan":

```
User klik "Simpan"
    ↓
handleSubmit() dipanggil
    ↓
fetch("/api/portfolio", { method: "PUT", body: JSON.stringify(formData) })
    ↓ (HTTP Request ke server Next.js)
src/app/api/portfolio/route.js → export async function PUT()
    ↓
request.json() → parse body jadi objek JavaScript
    ↓
prisma.portfolio.update({ ... }) → Prisma mengirim SQL UPDATE ke database
    ↓ (SQL Query ke Neon PostgreSQL di cloud)
Database menyimpan data → kirim balik hasilnya
    ↓
Prisma menerima hasil → return NextResponse.json(portfolio)
    ↓ (HTTP Response ke browser)
Browser menerima response → setSaved(true) → tampilkan "Berhasil disimpan!"
```

---

## 9. Cara Mengisi Portfolio (Panduan Mahasiswa)

Setelah setup selesai dan server berjalan di `http://localhost:3000`:

### Langkah 1: Isi Data Diri di Admin

Buka `http://localhost:3000/admin`

Isi semua field:
- **Nama Lengkap** — nama Anda (wajib diisi)
- **Email** — email yang bisa dihubungi
- **Bio** — deskripsi singkat tentang diri Anda (2-3 kalimat)
- **URL Foto Profil** — URL foto dari internet (bukan upload file)
  - Cara mudah: upload foto ke [imgur.com](https://imgur.com) → salin link gambar
- **Jurusan** — program studi Anda
- **Semester** — semester saat ini
- **Lokasi** — kota tempat tinggal (contoh: "Bandung, Indonesia")
- **Nama Kampus** — nama universitas lengkap
- **Skills & Tools** — ketik manual atau klik chip teknologi yang tersedia
  - Format: pisahkan dengan koma ("React, Next.js, Python")
  - Nama yang ada ikonnya: React, Next.js, TypeScript, JavaScript, Laravel, PHP, Tailwind CSS, Figma, Python, PostgreSQL, MySQL, Node.js, Vue, Flutter, Docker, Git
- **Social Media** — isi URL lengkap profil media sosial Anda

Klik **"Simpan Semua Perubahan"**.

### Langkah 2: Tambah Project di Dashboard

Buka `http://localhost:3000/dashboard`

Klik **"+ Tambah Project"** → isi form:
- **Judul** — nama project
- **Deskripsi** — penjelasan singkat apa yang dibuat dan tujuannya
- **Kategori** — pilih dari dropdown (Web App, Mobile App, IoT, dll)
- **Tahun** — tahun project dibuat
- **Tech Stack** — teknologi yang digunakan, pisah koma
- **Link Live Demo** — URL deployment jika ada
- **Link GitHub** — URL repository
- **Foto Project** — paste URL foto satu per satu → klik `+`
  - Gunakan foto screenshot project atau foto relevan dari [Unsplash](https://unsplash.com)

Klik **"Simpan Project"**.

### Langkah 3: Lihat Hasil

- `/` — halaman utama dengan nama dan foto
- `/about` — bio, skills dengan ikon, info akademik, social media
- `/projects` — semua project dengan filter dan carousel foto

---

## 10. Seed Database dengan Data Contoh

File `prisma/seed.js` berisi script untuk mengisi database dengan data contoh. Berguna untuk testing atau demo.

```bash
node prisma/seed.js
```

Script ini akan:
1. Update (atau buat) portfolio dengan data Daffa Maulana Ibrahim
2. Menghapus semua project lama
3. Membuat 6 project baru dengan total 19 foto dari Unsplash

> Untuk membuat data sendiri, edit file `prisma/seed.js` sesuai kebutuhan sebelum menjalankan.

---

## 11. Deploy ke Vercel

Vercel adalah platform hosting yang dibuat oleh tim Next.js — deployment paling mudah dan gratis untuk proyek Next.js.

### Langkah 1: Push ke GitHub

```bash
git add .
git commit -m "Initial portfolio setup"
git push origin main
```

> Pastikan `.env.local` tidak ikut di-push (sudah ada di `.gitignore`).

### Langkah 2: Import di Vercel

1. Buka [https://vercel.com](https://vercel.com) → login dengan akun GitHub
2. Klik **"Add New Project"** → **"Import Git Repository"**
3. Pilih repository portfolio Anda
4. Framework akan terdeteksi otomatis sebagai **Next.js**
5. **JANGAN klik Deploy dulu** — atur environment variable terlebih dahulu

### Langkah 3: Tambah Environment Variable

Di halaman konfigurasi Vercel, klik **"Environment Variables"**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Connection string Neon Anda (postgresql://...) |

Klik **"Add"** → kemudian klik **"Deploy"**.

### Langkah 4: Setelah Deploy

Vercel akan build dan deploy otomatis. Setelah selesai, Anda mendapat URL seperti:
`https://nama-project-anda.vercel.app`

> **Mengapa `postinstall: prisma generate` penting?**
> Di Vercel, setelah `npm install` selesai, script `postinstall` otomatis berjalan dan menjalankan `prisma generate`. Ini memastikan Prisma Client ter-generate sebelum aplikasi dijalankan. Tanpa ini, Vercel akan error karena tidak menemukan Prisma Client.

### Langkah 5: Buat Tabel di Database (Jika Belum)

Jika database Neon masih kosong (belum pernah `db push`), jalankan dari lokal:

```bash
npx prisma db push
```

Database yang sama digunakan di lokal dan production (Vercel) — cukup push sekali.

### Redeployment Otomatis

Setiap kali Anda push ke GitHub:
```bash
git add .
git commit -m "Update portfolio"
git push
```
Vercel akan otomatis rebuild dan redeploy. Tidak perlu tindakan manual.

---

## 12. Troubleshooting — Masalah Umum

### "Invalid `prisma.portfolio.findFirst()` invocation" atau Prisma Client error

Prisma Client belum di-generate atau sudah outdated setelah schema berubah.

**Solusi:**
```bash
# Hentikan dev server (Ctrl+C di terminal)
# Kemudian:
npx prisma generate
npm run dev
```

Di Windows, dev server harus dihentikan karena file engine Prisma ter-lock saat server berjalan.

---

### "The datasource property `url` is no longer supported"

Anda menggunakan Prisma v7 yang memiliki breaking change. Proyek ini membutuhkan Prisma v5.

**Solusi:**
```bash
npm install prisma@^5 @prisma/client@^5
npx prisma generate
```

---

### "projects.map is not a function" atau "projects.flatMap is not a function"

API mengembalikan objek error `{error: "..."}` bukan array, tapi kode mencoba memanggil `.map()` langsung.

**Penyebab umum:** Portfolio belum dibuat — buka `/admin` dan simpan data dulu sebelum menambah project.

**Sudah ada guard di kode:** `Array.isArray(data) ? data : []` — jika masih error, cek console browser untuk melihat response API yang sesungguhnya.

---

### Port 3000 Sudah Dipakai

```
⚠️  Port 3000 is in use, using port 3001 instead.
```

Ini normal — Next.js otomatis pindah ke port berikutnya. Akses via `http://localhost:3001`.

Jika ingin memaksa port tertentu:
```bash
npm run dev -- --port 3000
```

---

### Foto Profil Tidak Muncul

- Pastikan URL langsung mengarah ke file gambar (berakhiran `.jpg`, `.png`, `.webp`, dll)
- URL harus bisa diakses publik (bukan Google Drive private, bukan localhost)
- Coba buka URL-nya langsung di browser — jika gambar tampil, seharusnya berfungsi

---

### Database Error di Vercel tapi Lokal Baik-baik Saja

Kemungkinan `DATABASE_URL` belum diset di environment variable Vercel.

**Cek:** Vercel Dashboard → Project → Settings → Environment Variables.

---

### Perubahan Schema Tidak Masuk ke Database

Setelah mengubah `prisma/schema.prisma`, wajib menjalankan:

```bash
npx prisma db push   # sync schema ke database
npx prisma generate  # update Prisma Client
```

Tanpa `db push`, tabel di database tidak berubah meski schema sudah diedit.

---

*Panduan ini dibuat untuk Modul Praktikum Sistem Informasi Web — Asisten Laboratorium SIWEB*
