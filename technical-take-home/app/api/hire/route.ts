import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ShiftStatus, ApplicationStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { applicationId, shiftId } = await req.json();

    if (!applicationId || !shiftId) {
      return NextResponse.json({ error: "applicationId and shiftId are required" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const updatedShift = await prisma.shift.update({
      where: { id: shiftId },
      data: { status: ShiftStatus.HIRED, hiredProviderId: application.userId },
    });

    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.HIRED },
    });

    return NextResponse.json({ shift: updatedShift, application: updatedApp });
  } catch (error) {
    console.error("Error hiring provider:", error);
    return NextResponse.json({ error: "Hire failed" }, { status: 500 });
  }
}
