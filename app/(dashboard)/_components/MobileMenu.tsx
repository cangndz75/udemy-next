import React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import NavbarRoutes from "./NavbarRoutes";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="md:hidden pr-4" />
      </SheetTrigger>
      <SheetContent>
        <div className="p-6">
            <Logo />
        </div>
        <div className="flex flex-row w-full px-6 pb-10F">
            <NavbarRoutes />    
        </div>      
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
