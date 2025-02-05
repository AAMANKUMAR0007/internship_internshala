import prisma from "@/app/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Remove a task by ID
export async function DELETE(
  req: NextRequest
): Promise<NextResponse> {
  try {
    // Get task ID from the request body
    const { id } = await req.json();

    // Check if the task ID is provided
    if (!id) {
      return new NextResponse("Bad Request: Missing task ID", { status: 400 });
    }

    // Delete the task using Prisma
    const deletedTask = await prisma.task.delete({
      where: { id: id },
    });

    // Return the deleted task as JSON response
    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
