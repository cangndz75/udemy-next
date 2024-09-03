"use client";
import { usePathname } from "next/navigation";
import React from "react";
import NavbarItem from "./NavbarItem";

const guestRoutes = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="flex items-center space-x-8 z-50">
      {routes.map((route) => (
        <NavbarItem href={route.href} label={route.label} key={route.href} />
      ))}
    </div>
  );
};

export default NavbarRoutes;
