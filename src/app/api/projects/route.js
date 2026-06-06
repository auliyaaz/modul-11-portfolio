// src/app/api/projects/route.js
// API Route untuk mengambil semua project (GET) dan membuat project baru (POST).

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data project" }, { status: 500 });
  }
}

// POST /api/projects
// Body wajib : { title, description, techStack }
// Body opsional: { category, year, liveUrl, repoUrl, images: ["url1", ...] }
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, techStack, category, year, liveUrl, repoUrl, images = [] } = body;

    if (!title || !description || !techStack) {
      return NextResponse.json(
        { error: "title, description, dan techStack wajib diisi" },
        { status: 400 }
      );
    }

    const portfolio = await prisma.portfolio.findFirst();
    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio belum dibuat. Silakan isi data di halaman Admin terlebih dahulu." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        category: category || null,
        year:     year     || null,
        liveUrl:  liveUrl  || null,
        repoUrl:  repoUrl  || null,
        portfolioId: portfolio.id,
        images: {
          create: images
            .filter((url) => url.trim() !== "")
            .map((url, index) => ({ url: url.trim(), order: index })),
        },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat project baru" }, { status: 500 });
  }
}
