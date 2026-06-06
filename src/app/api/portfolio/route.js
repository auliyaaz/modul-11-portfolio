// src/app/api/portfolio/route.js
// API Route untuk mengambil (GET) dan mengupdate (PUT) data portfolio mahasiswa.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findFirst();
    return NextResponse.json(portfolio ?? null);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data portfolio" }, { status: 500 });
  }
}

// PUT /api/portfolio
// Body: { name, email, bio, imageUrl, major, semester, university, location, skills,
//         github, linkedin, instagram, tiktok }
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      name, email, bio, imageUrl,
      major, semester, university, location, skills,
      github, linkedin, instagram, tiktok,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    const data = {
      name,
      email:      email      || null,
      bio:        bio        || null,
      imageUrl:   imageUrl   || null,
      major:      major      || null,
      semester:   semester   || null,
      university: university || null,
      location:   location   || null,
      skills:     skills     || null,
      github:     github     || null,
      linkedin:   linkedin   || null,
      instagram:  instagram  || null,
      tiktok:     tiktok     || null,
    };

    const existing = await prisma.portfolio.findFirst();
    const portfolio = existing
      ? await prisma.portfolio.update({ where: { id: existing.id }, data })
      : await prisma.portfolio.create({ data });

    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan portfolio" }, { status: 500 });
  }
}
