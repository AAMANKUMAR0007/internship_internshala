import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// DELETE: Delete a task by its id
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    // Retrieve the authenticated user's information
    const { userId } = auth();
    const { id } = context.params;

    // If no user is found, return an Unauthorized response
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the task from the database using Prisma
    const task = await prisma.task.delete({
      where: { id },
    });

    // Return the deleted task as a JSON response
    return NextResponse.json(task);
  } catch (error) {
    console.error("ERROR DELETING TASK:", error);
    return NextResponse.json(
      { error: "Error deleting task", status: 500 },
      { status: 500 }
    );
  }
}
