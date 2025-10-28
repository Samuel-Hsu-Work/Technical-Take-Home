import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

type Params = { params: { id: string } };

export async function DELETE(_: Request, { params }: Params) {
  try {
    const application = await prisma.application.findUnique({ where: { id: params.id } });
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status === ApplicationStatus.WITHDRAWN) {
      return NextResponse.json({ message: "Application already withdrawn" }, { status: 200 });
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: { status: ApplicationStatus.WITHDRAWN },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return NextResponse.json({ error: "Failed to withdraw" }, { status: 500 });
  }
}
