"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NavBar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}