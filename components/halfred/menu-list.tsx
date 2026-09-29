"use client";

import type { ReactNode } from "react";

/** Liste du menu Halfred : referme le `<details>` parent dès qu'un lien est choisi. */
export default function MenuList({ children }: { children: ReactNode }) {
  return (
    <ul
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) event.currentTarget.closest("details")?.removeAttribute("open");
      }}
    >
      {children}
    </ul>
  );
}
