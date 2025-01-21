"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

interface SearchProps {
  placeholder: string;
}

export default function Search({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  // Debounce function
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): T {
    let timeout: NodeJS.Timeout;
    return function (this: unknown, ...args: Parameters<T>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    } as T;
  }

  const handleSearch = useCallback(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set("page", "1");
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      replace(`${pathName}?${params.toString()}`);
      console.log("searchParams", searchParams);
    }, 500),
    [searchParams, pathName, replace]
  );

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
