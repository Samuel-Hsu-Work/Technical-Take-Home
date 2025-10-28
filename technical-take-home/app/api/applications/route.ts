import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const applications = await prisma.application.findMany({
    // Include related user and shift data to view full relationships while testing.
      include: {
        user: true,  
        shift: true, 
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to load applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, shiftId } = await req.json();
    if (!userId || !shiftId) {
      return NextResponse.json({ error: "Missing userId or shiftId" }, { status: 400 });
    }

    const newApp = await prisma.application.create({
      data: { userId, shiftId },
    });

    return NextResponse.json(newApp, { status: 201 });
  } catch (error: any) {
    console.error("Prisma create error:", error);

    if (error.code) {
      return NextResponse.json(
        { error: `Prisma error code ${error.code}: ${error.meta?.cause || error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: String(error.message || "Failed to create application") }, { status: 500 });
  }
}