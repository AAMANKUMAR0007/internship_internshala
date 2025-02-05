import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Remove a task by ID
export async function DELETE(
  req: NextRequest,
  context: { params?: { id?: string } } // params are optional
): Promise<NextResponse> {
  try {
    // Authenticate the user
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate and extract task ID
    const taskId = context.params?.id;
    if (!taskId) {
      return new NextResponse("Bad Request: Missing task ID", { status: 400 });
    }

    // Delete the task using Prisma
    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
