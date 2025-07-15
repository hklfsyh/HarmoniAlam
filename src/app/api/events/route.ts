// src/app/api/events/route.ts

import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET!;

// Kita akan membuat fungsi POST untuk membuat event baru
export async function POST(request: Request) {
  try {
    // 1. Ambil token dari header Authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token tidak ditemukan atau format salah" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];

    // 2. Verifikasi token dan dapatkan payload (data user)
    let decodedPayload;
    try {
      decodedPayload = jwt.verify(token, secret) as {
        userId: string;
        role: UserRole;
      };
    } catch (error) {
      return NextResponse.json(
        { error: "Token tidak valid atau kadaluarsa" },
        { status: 401 }
      );
    }

    // 3. Cek Izin: Hanya ORGANIZER yang boleh membuat event
    if (decodedPayload.role !== "ORGANIZER") {
      return NextResponse.json(
        { error: "Anda tidak punya izin untuk membuat event" },
        { status: 403 }
      ); // 403 Forbidden
    }

    // 4. Ambil data event dari body request
    const body = await request.json();
    const { title, description, location, date } = body;

    // Validasi dasar
    if (!title || !description || !location || !date) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // 5. Buat event baru di database
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date), // Pastikan format tanggal benar
        organizerId: decodedPayload.userId, // Hubungkan event dengan user yang membuatnya
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
