import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCheckIcon } from "lucide-react";
const bannerVariants = cva("border text-center flex items-center w-full p-3 rounded-lg text-center", {
  variants: {
    variant: {
      warning: "bg-yellow-300 border-yellow-100 text-yellow-900",
      success: "bg-green-300 border-green-100 text-green-900",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  label: string;
}

const IconMap = {
  warning: AlertCircle,
  success: CheckCheckIcon,
};

const Banner = ({ label, variant }: BannerProps) => {
  const Icon = IconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-5 w-5 mr-2" />
      {label}
    </div>
  );
};

export default Banner;
