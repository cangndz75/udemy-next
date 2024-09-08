"use client";
import { Input } from "@/components/ui/input";
import { useBounce } from "@/hooks/useBounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import qs from "query-string";
import { title } from "process";

const SearchBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const [value, setValue] = React.useState("");
  const debouncedValue = useBounce(value, 500);

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedValue,
          categoryId: currentCategoryId,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, router, pathname, currentCategoryId]);

  return (
    <div className="w-full lg:flex relative hidden">
      <span className="absolute left-2 top-3">
        <CiSearch className="w-5 h-5" />
      </span>
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        type="text"
        className="mt-1 w-full py-4 px-8 focus-visible:ring-slate-100"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchBar;