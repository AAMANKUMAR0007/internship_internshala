import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Delete a task by its id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Record<string, string> } // Updated type definition
): Promise<NextResponse> {
  try {
    // Retrieve the authenticated user's information
    const { userId } = auth();
    const { id } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the task from the database using Prisma
    const task = await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("ERROR DELETING TASK:", error);
    return NextResponse.json(
      { error: "Error deleting task", status: 500 },
      { status: 500 }
    );
  }
}
