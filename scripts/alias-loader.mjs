// Resolves the project's "@/..." TypeScript path alias for plain `node` runs.
//
// Next.js and tsc both understand the alias from tsconfig.json, but the
// self-test harness runs the same modules under Node's own TypeScript
// stripping, which does not read tsconfig paths.
import { pathToFileURL } from "url";
import { dirname, resolve as resolvePath } from "path";
import { fileURLToPath } from "url";

const SRC = resolvePath(dirname(fileURLToPath(import.meta.url)), "..", "src");

export async function resolve(specifier, context, nextResolve) {
  // "server-only" is a build-time guard for the Next bundler: its default
  // entry throws on purpose. Under plain Node it would abort the harness, so
  // it resolves to the same empty module the react-server condition uses.
  if (specifier === "server-only") {
    return { url: pathToFileURL(resolvePath(SRC, "..", "scripts", "server-only-stub.mjs")).href, shortCircuit: true };
  }
  if (specifier.startsWith("@/")) {
    const base = resolvePath(SRC, specifier.slice(2));
    // The alias is extensionless in source; try the real file extensions.
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
      try {
        return await nextResolve(pathToFileURL(candidate).href, context);
      } catch { /* try the next candidate */ }
    }
  }
  return nextResolve(specifier, context);
}
