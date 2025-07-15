// src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Mengambil data dari request body yang dikirim oleh frontend
    const body = await request.json();
    const { name, email, password, role } = body;

    // 2. Validasi dasar: pastikan semua data yang dibutuhkan ada
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password harus diisi" },
        { status: 400 }
      );
    }

    // 3. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 } // 409 Conflict
      );
    }

    // 4. Hashing password untuk keamanan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Membuat user baru di database menggunakan Prisma
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: role || "VOLUNTEER", // Default role
      },
    });

    // 6. Mengirim kembali data user yang baru dibuat (tanpa password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
