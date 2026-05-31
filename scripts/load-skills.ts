/**
 * JellyOS Skill Loader
 *
 * Recursively scans the /skills directory for SKILL.md and *.md files,
 * parses YAML frontmatter (name, description), and registers each skill
 * with the agent via registerSkill().
 *
 * Usage in extensions/jellyos.ts:
 *   import { loadSkills } from "../scripts/load-skills";
 *   loadSkills(agent);
 *
 * Skills consume zero context tokens — they are registered and shown
 * in /skills command output. The agent references them by name.
 *
 * Format — all skills use the same YAML frontmatter:
 *   ---
 *   name: skill-name
 *   description: What this skill does — when to use
 *   ---
 *   # Title
 *   Skill content (markdown) ...
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtensionAPI } from "@jellyos/agent";

interface SkillFrontmatter {
  name: string;
  description?: string;
}

/**
 * Minimal YAML frontmatter parser — handles the simple
 * `---\nname: value\ndescription: value\n---` format only.
 * No library dependency. Returns null if no frontmatter found.
 */
function parseFrontmatter(content: string): SkillFrontmatter | null {
  // Match YAML frontmatter delimited by ---
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm: Record<string, string> = {};
  const lines = match[1]!.split("\n");

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key && value) fm[key] = value;
  }

  // Require at minimum a name
  if (!fm.name) return null;

  return {
    name: fm.name,
    description: fm.description,
  };
}

/**
 * Recursively find all .md files under a directory, returning
 * relative paths from the skills root. Skips node_modules and hidden dirs.
 */
function findSkillFiles(dir: string, root: string): string[] {
  const results: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      // Skip hidden directories and node_modules
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findSkillFiles(fullPath, root));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push(path.relative(root, fullPath));
      }
    }
  } catch {
    // Permission errors, missing dirs — silently skip
  }

  return results;
}

export function loadSkills(agent: ExtensionAPI, skillsDir?: string): number {
  // Resolve skills directory — relative to the project root
  const root = skillsDir ?? path.resolve(
    // When running from extensions/jellyos.ts (compiled or ESM)
    // __dirname works in CJS; for ESM we fall back to cwd-relative
    typeof __dirname !== "undefined"
      ? path.join(__dirname, "..", "skills")
      : path.join(process.cwd(), "skills")
  );

  if (!fs.existsSync(root)) {
    console.warn(`[JellyOS/Loader] Skills directory not found: ${root}`);
    return 0;
  }

  const files = findSkillFiles(root, root);
  let loaded = 0;

  for (const file of files) {
    const filePath = path.join(root, file);
    let content: string;

    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      console.warn(`[JellyOS/Loader] Cannot read: ${file}`);
      continue;
    }

    const fm = parseFrontmatter(content);
    if (!fm) {
      console.warn(`[JellyOS/Loader] No frontmatter in: ${file} — skipping`);
      continue;
    }

    // Derive a unique slug from the name field
    const slug = fm.name.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");

    try {
      agent.registerSkill({
        name: slug,
        content: content,
      });
      loaded++;
    } catch (err: any) {
      console.warn(`[JellyOS/Loader] Failed to register ${slug}: ${err.message}`);
    }
  }

  console.log(`[JellyOS/Loader] Registered ${loaded} skills from ${files.length} files`);
  return loaded;
}
