// prisma/seed.js
// Script untuk mengisi database dengan data contoh.
// Jalankan dengan: node prisma/seed.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeder...");

  // ── 1. UPSERT PORTFOLIO ──────────────────────────────────────────────
  const existing = await prisma.portfolio.findFirst();

  const portfolioData = {
    name:       "Daffa Maulana Ibrahim",
    email:      "daffa@mahasiswa.ac.id",
    bio:        "Mahasiswa Sistem Informasi semester 6 di Institut Teknologi Nasional Bandung yang suka mengubah masalah rumit menjadi produk digital yang bersih dan mudah dipakai. Fokus di persimpangan web development, UI/UX, dan data — membangun antarmuka yang benar-benar nyaman digunakan.",
    imageUrl:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    major:      "Sistem Informasi",
    semester:   "6",
    university: "Institut Teknologi Nasional Bandung",
    location:   "Bandung, Indonesia",
    skills:     "React, Next.js, TypeScript, Laravel, Tailwind CSS, Figma, Python, PostgreSQL",
    github:     "https://github.com/daffami",
    linkedin:   "https://linkedin.com/in/daffa-maulana",
    instagram:  "https://instagram.com/daffa.mi",
    tiktok:     "https://tiktok.com/@daffa.codes",
  };

  const portfolio = existing
    ? await prisma.portfolio.update({ where: { id: existing.id }, data: portfolioData })
    : await prisma.portfolio.create({ data: portfolioData });

  console.log("✅ Portfolio:", portfolio.name);

  // ── 2. HAPUS SEMUA PROJECT LAMA ──────────────────────────────────────
  await prisma.projectImage.deleteMany({});
  await prisma.project.deleteMany({ where: { portfolioId: portfolio.id } });
  console.log("🗑️  Project lama dihapus");

  // ── 3. BUAT PROJECT BARU ─────────────────────────────────────────────
  const projects = [
    {
      title:       "SIAKAD Mobile",
      description: "Sistem informasi akademik berbasis mobile yang memungkinkan mahasiswa memantau nilai, jadwal kuliah, dan pembayaran UKT langsung dari smartphone mereka.",
      category:    "Mobile App",
      techStack:   "React Native, Firebase, Expo",
      year:        "2025",
      liveUrl:     null,
      repoUrl:     "https://github.com/daffami/siakad-mobile",
      images: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&h=500&fit=crop",
      ],
    },
    {
      title:       "Nimbus Dashboard",
      description: "Dashboard analitik real-time untuk platform e-commerce — menampilkan data penjualan, inventaris, dan insight pelanggan dalam satu tampilan yang intuitif.",
      category:    "Web App",
      techStack:   "Next.js, TypeScript, Tailwind CSS",
      year:        "2025",
      liveUrl:     "https://nimbus-dashboard.vercel.app",
      repoUrl:     "https://github.com/daffami/nimbus-dashboard",
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop",
      ],
    },
    {
      title:       "SmartWaste IoT",
      description: "Sistem monitoring tempat sampah berbasis IoT yang mendeteksi tingkat kepenuhan secara real-time dan mengoptimalkan rute pengumpulan sampah di lingkungan kampus.",
      category:    "IoT",
      techStack:   "Arduino, Node.js, MQTT",
      year:        "2024",
      liveUrl:     null,
      repoUrl:     "https://github.com/daffami/smartwaste-iot",
      images: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
      ],
    },
    {
      title:       "HRIS Pro",
      description: "Platform manajemen SDM lengkap untuk usaha kecil menengah — mengelola absensi, penggajian, dan pengajuan cuti karyawan dalam satu sistem terintegrasi.",
      category:    "Web App",
      techStack:   "Laravel, MySQL, Bootstrap",
      year:        "2024",
      liveUrl:     "https://hris-pro.netlify.app",
      repoUrl:     "https://github.com/daffami/hris-pro",
      images: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop",
      ],
    },
    {
      title:       "EventKampus",
      description: "Aplikasi mobile untuk menemukan, mendaftar, dan mendapatkan pengingat seminar, workshop, dan kompetisi di lingkungan kampus secara mudah.",
      category:    "Mobile App",
      techStack:   "Flutter, Supabase, Dart",
      year:        "2024",
      liveUrl:     null,
      repoUrl:     "https://github.com/daffami/event-kampus",
      images: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
      ],
    },
    {
      title:       "SentiTweet",
      description: "Alat analisis sentimen berbahasa Indonesia yang memproses tweet secara real-time menggunakan NLP, lalu memvisualisasikan tren opini publik dalam bentuk grafik interaktif.",
      category:    "Data / ML",
      techStack:   "Python, scikit-learn, Streamlit",
      year:        "2023",
      liveUrl:     "https://sentitweet.streamlit.app",
      repoUrl:     "https://github.com/daffami/sentitweet",
      images: [
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=500&fit=crop",
      ],
    },
  ];

  for (const proj of projects) {
    const { images, ...data } = proj;
    const created = await prisma.project.create({
      data: {
        ...data,
        portfolioId: portfolio.id,
        images: {
          create: images.map((url, i) => ({ url, order: i })),
        },
      },
    });
    console.log(`   ✅ ${created.title} (${images.length} foto)`);
  }

  console.log("\n🎉 Seeder selesai! Buka http://localhost:3000 untuk melihat hasilnya.");
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
