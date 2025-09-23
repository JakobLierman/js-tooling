#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Types
type VersionBump = 'major' | 'minor' | 'patch';

interface PackageInfo {
  name: string;
  version: string;
  path: string;
  relativePath: string;
}

interface ChangedPackage {
  name: string;
  versionBump: VersionBump;
  commits: string[];
}

interface TurboTask {
  task: string;
  package?: string;
}

interface TurboOutput {
  tasks: TurboTask[];
}

// Conventional commit types and their corresponding version bumps
const VERSION_BUMP_MAP: Record<string, VersionBump> = {
  feat: 'minor',
  fix: 'patch',
  perf: 'patch',
  refactor: 'patch',
  style: 'patch',
  docs: 'patch',
  test: 'patch',
  build: 'patch',
  ci: 'patch',
  chore: 'patch',
  revert: 'patch',
  'BREAKING CHANGE': 'major',
};

// Get package information
const getPackageInfo = (packagePath: string): PackageInfo | null => {
  try {
    const packageJsonPath = join(packagePath, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      name: string;
      version: string;
    };
    return {
      name: packageJson.name,
      version: packageJson.version,
      path: packagePath,
      relativePath: packagePath.replace(rootDir + '/', ''),
    };
  } catch (error) {
    console.warn(
      `Could not read package.json for ${packagePath}:`,
      (error as Error).message,
    );
    return null;
  }
};

// Get all packages in the workspace
const getAllPackages = (): PackageInfo[] => {
  const packages: PackageInfo[] = [];
  const packagesDir = join(rootDir, 'packages');

  try {
    const packageDirs = execSync('ls packages/', {
      cwd: rootDir,
      encoding: 'utf8',
    })
      .trim()
      .split('\n');

    for (const packageDir of packageDirs) {
      const packagePath = join(packagesDir, packageDir);
      const packageInfo = getPackageInfo(packagePath);
      if (packageInfo) {
        packages.push(packageInfo);
      }
    }
  } catch (error) {
    console.error(
      'Error reading packages directory:',
      (error as Error).message,
    );
  }

  return packages;
};

// Use git to detect changed packages
const getChangedPackagesFromGit = (): string[] => {
  try {
    // Get changed files since last commit
    const changedFiles = execSync('git diff --name-only HEAD~1 HEAD', {
      cwd: rootDir,
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(Boolean);

    const changedPackages = new Set<string>();

    // Check which packages have changed
    for (const file of changedFiles) {
      if (file.startsWith('packages/')) {
        const packageDir = file.split('/')[1];
        if (!packageDir) continue;
        const packagePath = join(rootDir, 'packages', packageDir);
        const packageInfo = getPackageInfo(packagePath);
        if (packageInfo) {
          changedPackages.add(packageInfo.name);
        }
      }
    }

    return Array.from(changedPackages);
  } catch (error) {
    console.warn(
      'Could not get changed packages from git:',
      (error as Error).message,
    );
    return [];
  }
};

// Use Turborepo to detect changed packages
const getChangedPackagesFromTurbo = (): string[] => {
  try {
    // Use turbo to get changed packages
    const turboOutput = execSync('pnpm turbo run build --dry-run=json', {
      cwd: rootDir,
      encoding: 'utf8',
    });

    const turboData = JSON.parse(turboOutput) as TurboOutput;
    const changedPackages = new Set<string>();

    // Extract package names from turbo output
    for (const task of turboData.tasks) {
      if (task.task === 'build' && task.package) {
        changedPackages.add(task.package);
      }
    }

    return Array.from(changedPackages);
  } catch (error) {
    console.warn(
      'Could not get changed packages from Turborepo:',
      (error as Error).message,
    );
    return [];
  }
};

// Get commits that affect specific packages
const getCommitsForPackage = (
  packageName: string,
  packagePath: string,
): string[] => {
  try {
    const packageDir = packagePath.split('/').pop();
    if (!packageDir) return [];

    const commits = execSync(
      `git log --oneline --follow -- packages/${packageDir}`,
      {
        cwd: rootDir,
        encoding: 'utf8',
      },
    )
      .trim()
      .split('\n')
      .filter(Boolean);

    return commits;
  } catch (error) {
    console.warn(
      `Could not get commits for package ${packageName}:`,
      (error as Error).message,
    );
    return [];
  }
};

// Get commits since last release
const getCommitsSinceLastRelease = (): string[] => {
  try {
    // Get the last tag
    const lastTag = execSync('git describe --tags --abbrev=0', {
      cwd: rootDir,
      encoding: 'utf8',
    }).trim();

    // Get commits since last tag
    const commits = execSync(`git log ${lastTag}..HEAD --oneline`, {
      cwd: rootDir,
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(Boolean);

    return commits;
  } catch (error) {
    console.warn(
      'Could not get commits since last release:',
      (error as Error).message,
    );
    // Fallback to last 10 commits
    try {
      const commits = execSync('git log -10 --oneline', {
        cwd: rootDir,
        encoding: 'utf8',
      })
        .trim()
        .split('\n')
        .filter(Boolean);
      return commits;
    } catch (fallbackError) {
      console.error(
        'Could not get any commits:',
        (fallbackError as Error).message,
      );
      return [];
    }
  }
};

// Parse commit message to determine version bump
const parseCommitMessage = (commitMessage: string): VersionBump => {
  // Remove commit hash
  const message = commitMessage.replace(/^[a-f0-9]+ /, '');

  // Check for breaking changes
  if (message.includes('BREAKING CHANGE')) {
    return 'major';
  }

  // Check for exclamation mark syntax (any type can have breaking changes)
  if (message.match(/^(\w+)(\(.+\))?!:/)) {
    return 'major';
  }

  // Parse conventional commit format
  const match = message.match(/^(\w+)(\(.+\))?(!)?:/);
  if (match) {
    const type = match[1];
    if (!type) return 'patch';

    return VERSION_BUMP_MAP[type] || 'patch';
  }

  return 'patch';
};

// Get the highest version bump from commits
const getHighestVersionBump = (commits: string[]): VersionBump => {
  const bumps = commits.map(parseCommitMessage);

  if (bumps.includes('major')) return 'major';
  if (bumps.includes('minor')) return 'minor';

  return 'patch';
};

// Generate changeset content
const generateChangesetContent = (
  packageName: string,
  versionBump: VersionBump,
  commits: string[],
): string => {
  const changes = commits
    .map((commit) => {
      const message = commit.replace(/^[a-f0-9]+ /, '');
      return `- ${message}`;
    })
    .join('\n');

  return `---
"${packageName}": ${versionBump}
---

${changes || 'Automated release based on commit messages'}`;
};

// Create changeset file
const createChangesetFile = (
  packageName: string,
  versionBump: VersionBump,
  commits: string[],
): string => {
  const changesetDir = join(rootDir, '.changeset');
  if (!existsSync(changesetDir)) {
    mkdirSync(changesetDir, { recursive: true });
  }

  const timestamp = Date.now();
  const filename = `auto-${packageName.replace('@', '').replace('/', '-')}-${timestamp}.md`;
  const filepath = join(changesetDir, filename);

  const content = generateChangesetContent(packageName, versionBump, commits);
  writeFileSync(filepath, content);

  console.log(`Created changeset for ${packageName}: ${filename}`);
  return filepath;
};

// Main function
const main = async (): Promise<void> => {
  console.log('🚀 Generating automated changesets...');

  // Get all packages
  const packages = getAllPackages();
  console.log(`Found ${packages.length} packages`);

  if (packages.length === 0) {
    console.log('No packages found, skipping changeset generation');
    return;
  }

  // Try to get changed packages from both git and turbo
  const gitChangedPackages = getChangedPackagesFromGit();
  const turboChangedPackages = getChangedPackagesFromTurbo();

  console.log('Changed packages from git:', gitChangedPackages);
  console.log('Changed packages from Turborepo:', turboChangedPackages);

  // Combine both methods to get a comprehensive list
  const allChangedPackages = new Set([
    ...gitChangedPackages,
    ...turboChangedPackages,
  ]);
  const changedPackageNames = Array.from(allChangedPackages);

  if (changedPackageNames.length === 0) {
    console.log('No packages changed, skipping changeset generation');
    return;
  }

  // Get commits since last release
  const allCommits = getCommitsSinceLastRelease();
  console.log(`Found ${allCommits.length} commits since last release`);

  if (allCommits.length === 0) {
    console.log('No commits found, skipping changeset generation');
    return;
  }

  // Create changesets for each changed package
  const changedPackages: ChangedPackage[] = [];

  for (const packageInfo of packages) {
    if (changedPackageNames.includes(packageInfo.name)) {
      console.log(`Processing changed package: ${packageInfo.name}`);

      // Get commits specific to this package
      const packageCommits = getCommitsForPackage(
        packageInfo.name,
        packageInfo.path,
      );

      // If no package-specific commits, use all commits
      const relevantCommits =
        packageCommits.length > 0 ? packageCommits : allCommits;

      // Determine version bump for this package
      const versionBump = getHighestVersionBump(relevantCommits);

      changedPackages.push({
        name: packageInfo.name,
        versionBump,
        commits: relevantCommits,
      });
    }
  }

  if (changedPackages.length === 0) {
    console.log('No packages to process, skipping changeset generation');
    return;
  }

  // Create changesets for each changed package
  for (const packageInfo of changedPackages) {
    try {
      createChangesetFile(
        packageInfo.name,
        packageInfo.versionBump,
        packageInfo.commits,
      );
    } catch (error) {
      console.error(
        `Error creating changeset for ${packageInfo.name}:`,
        (error as Error).message,
      );
    }
  }

  console.log(`✅ Generated ${changedPackages.length} automated changesets!`);
};

// Run the script
main().catch(console.error);
