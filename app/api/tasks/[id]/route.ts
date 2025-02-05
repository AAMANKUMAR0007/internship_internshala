import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Delete a task by its id
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } // Corrected here
): Promise<Response> {
  try {
    // Use Clerk's auth function to get the current user
    const { userId } = auth();
    const { id } = context.params; // Access params from context

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the task from your database via Prisma
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
