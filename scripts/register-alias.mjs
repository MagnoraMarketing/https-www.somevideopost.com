// Entry point for `node --import ./scripts/register-alias.mjs ...` — installs
// the "@/..." path-alias resolver used by the self-test harness.
import { register } from "module";
register("./alias-loader.mjs", import.meta.url);
