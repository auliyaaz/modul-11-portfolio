// src/app/api/projects/[id]/route.js
// API Route untuk edit (PUT) dan hapus (DELETE) project berdasarkan ID.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/projects/:id
// Body: { title, description, techStack, category, year, liveUrl, repoUrl, images: ["url1", ...] }
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, techStack, category, year, liveUrl, repoUrl, images = [] } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        techStack,
        category: category || null,
        year:     year     || null,
        liveUrl:  liveUrl  || null,
        repoUrl:  repoUrl  || null,
        images: {
          deleteMany: {},
          create: images
            .filter((url) => url.trim() !== "")
            .map((url, index) => ({ url: url.trim(), order: index })),
        },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(project);
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Gagal mengupdate project" }, { status: 500 });
  }
}

// DELETE /api/projects/:id
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project berhasil dihapus" });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Gagal menghapus project" }, { status: 500 });
  }
}
