import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation wrappers. Use these everywhere instead of next/link /
// next/navigation so the active locale prefix is preserved.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
