#!/usr/bin/env node
/**
 * Skill Structure Validator
 * Checks that all skills follow the required structure
 * Author: BSC Team
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillsDir = join(__dirname, '..', 'skills');

interface SkillCheck {
  name: string;
  errors: string[];
  warnings: string[];
}

function checkSkill(skillPath: string, skillName: string): SkillCheck {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required files
  if (!existsSync(join(skillPath, 'index.ts'))) {
    errors.push('Missing index.ts');
  }

  if (!existsSync(join(skillPath, 'SKILL.md'))) {
    warnings.push('Missing SKILL.md documentation');
  }

  // Check for duplicate exports
  const indexPath = join(skillPath, 'index.ts');
  if (existsSync(indexPath)) {
    const content = require('node:fs').readFileSync(indexPath, 'utf-8');
    const hasInlineCreate = /export function create\w+/.test(content);
    const hasFactoryExport = /export.*from.*factory/.test(content);
    
    if (hasInlineCreate && hasFactoryExport) {
      errors.push('Duplicate create export (inline + factory)');
    }
  }

  // Check for types directory
  if (!existsSync(join(skillPath, 'types'))) {
    warnings.push('Missing types/ directory');
  }

  return { name: skillName, errors, warnings };
}

function main() {
  console.log('🔍 Checking skill structure...\n');
  
  const skills = readdirSync(skillsDir);
  const results: SkillCheck[] = [];

  for (const skill of skills) {
    const skillPath = join(skillsDir, skill);
    if (statSync(skillPath).isDirectory()) {
      results.push(checkSkill(skillPath, skill));
    }
  }

  let hasErrors = false;

  for (const result of results.sort((a, b) => a.errors.length - b.errors.length)) {
    if (result.errors.length > 0) {
      hasErrors = true;
      console.log(`❌ ${result.name}`);
      for (const err of result.errors) {
        console.log(`   Error: ${err}`);
      }
    } else if (result.warnings.length > 0) {
      console.log(`⚠️  ${result.name}`);
      for (const warn of result.warnings) {
        console.log(`   Warning: ${warn}`);
      }
    } else {
      console.log(`✅ ${result.name}`);
    }
  }

  console.log(`\nTotal: ${results.length} skills checked`);
  const errorCount = results.filter(r => r.errors.length > 0).length;
  console.log(`Errors: ${errorCount}`);
  
  process.exit(hasErrors ? 1 : 0);
}

main();