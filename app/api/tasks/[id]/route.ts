import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Remove a task by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } } // Ensure params are correctly typed
): Promise<NextResponse> {
  try {
    // Authenticate the user
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate task ID
    if (!params.id) {
      return new NextResponse("Bad Request: Missing task ID", { status: 400 });
    }

    // Delete the task using Prisma
    const deletedTask = await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
