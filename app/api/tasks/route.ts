import prisma from "@/app/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// Helper function to verify the JWT token (replace with your actual verification logic)
const verifyToken = (token: string) => {
  // Placeholder for your token verification logic
  // This could be Clerk, JWT, or any other authentication mechanism
  if (token === "valid-token") {
    return { userId: "12345" }; // mock return of userId, replace with real verification
  }
  return null;
};

// POST: Create a task
export async function POST(req: Request) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const authData = verifyToken(token); // Replace with actual verification function

    if (!authData || !authData.userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const { title, description, date, completed, important } = await req.json();

    if (!title || !description || !date) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    if (title.length < 3) {
      return NextResponse.json({
        error: "Title must be at least 3 characters long",
        status: 400,
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        date,
        isCompleted: completed,
        isImportant: important,
        userId: authData.userId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("ERROR CREATING TASK: ", error);
    return NextResponse.json({ error: "Error creating task", status: 500 });
  }
}

// GET: Retrieve all tasks for a user
export async function GET(req: Request) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const authData = verifyToken(token); // Replace with actual verification function

    if (!authData || !authData.userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: authData.userId,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.log("ERROR GETTING TASKS: ", error);
    return NextResponse.json({ error: "Error getting tasks", status: 500 });
  }
}

// PUT: Update a task's completion status
export async function PUT(req: Request) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const authData = verifyToken(token); // Replace with actual verification function

    if (!authData || !authData.userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const { isCompleted, id } = await req.json();

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        isCompleted,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("ERROR UPDATING TASK: ", error);
    return NextResponse.json({ error: "Error updating task", status: 500 });
  }
}

// DELETE: Delete a task
export async function DELETE(req: NextRequest, context: any): Promise<NextResponse> {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const authData = verifyToken(token); // Replace with actual verification function

    if (!authData || !authData.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "Task ID is required", status: 400 });
    }

    const task = await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("ERROR DELETING TASK:", error);
    return NextResponse.json({ error: "Error deleting task", status: 500 });
  }
}
