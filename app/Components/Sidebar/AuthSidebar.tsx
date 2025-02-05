"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "./Sidebar"; // Adjust this import if your Sidebar is in a different location

const AuthSidebar = () => {
  const { userId } = useAuth(); // This hook is client-only

  // Render nothing if the user is not authenticated.
  if (!userId) return null;

  return <Sidebar />;
};

export default AuthSidebar;
