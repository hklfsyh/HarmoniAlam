// src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Ambil email dan password dari body request
    const body = await request.json();
    const { email, password } = body;

    // Validasi dasar
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // 2. Cari user di database berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Jika user tidak ditemukan, kirim error
    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      ); // 401 Unauthorized
    }

    // 3. Bandingkan password yang diinput dengan password di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Jika password tidak cocok, kirim error
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // 4. Jika password cocok, buat JSON Web Token (JWT)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET tidak ditemukan di .env");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1h" } // Token akan kadaluarsa dalam 1 jam
    );

    // 5. Kirim token sebagai response
    return NextResponse.json({
      message: "Login berhasil",
      token: token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
