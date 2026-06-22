import { rmSync } from "fs";

try {
  rmSync(".next", { recursive: true, force: true });
} catch {
  // ignore
}
