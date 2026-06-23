/** Map between zh and en routes for language switcher */
const EN_ROUTES: Record<string, string> = {
  "/": "/en",
  "/chart": "/en/chart",
  "/booking": "/en/booking",
};

const ZH_ROUTES: Record<string, string> = {
  "/en": "/",
  "/en/chart": "/chart",
  "/en/booking": "/booking",
};

export function switchLocalePath(pathname: string, target: "zh" | "en"): string {
  const path = pathname.split("?")[0] || "/";

  if (target === "en") {
    if (path.startsWith("/en")) return path;
    return EN_ROUTES[path] ?? "/en";
  }

  if (path.startsWith("/en")) {
    return ZH_ROUTES[path] ?? "/";
  }
  return path;
}

export function isEnglishPath(pathname: string): boolean {
  return pathname === "/en" || pathname.startsWith("/en/");
}
