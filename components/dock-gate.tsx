"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const DockNav = dynamic(() => import("@/components/dock-nav"));

/**
 * Le dock du portfolio n'existe pas sur Halfred : on ne charge même pas son
 * code (Magic UI + motion, ~140 Ko) sur ces pages.
 */
export default function DockGate() {
  return /^\/(en\/)?halfred\//.test(usePathname()) ? null : <DockNav />;
}
