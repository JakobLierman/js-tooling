import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

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
const getPackageInfo = (packagePath: string): PackageInfo | undefined => {
  try {
    const packageJsonPath = path.join(packagePath, 'package.json');
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

    return undefined;
  }
};

// Get all packages in the workspace
const getAllPackages = (): PackageInfo[] => {
  const packages: PackageInfo[] = [];
  const packagesDir = path.join(rootDir, 'packages');

  try {
    const packageDirs = execSync('ls packages/', {
      cwd: rootDir,
      encoding: 'utf8',
    })
      .trim()
      .split('\n');

    for (const packageDir of packageDirs) {
      const packagePath = path.join(packagesDir, packageDir);
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
    // Get changed files (staged and unstaged)
    const changedFiles = execSync('git diff --name-only --cached HEAD', {
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
        const packagePath = path.join(rootDir, 'packages', packageDir);
        const packageInfo = getPackageInfo(packagePath);
        if (packageInfo) {
          changedPackages.add(packageInfo.name);
        }
      }
    }

    return [...changedPackages];
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

    return [...changedPackages];
  } catch (error) {
    console.warn(
      'Could not get changed packages from Turborepo:',
      (error as Error).message,
    );

    return [];
  }
};

// Get commits since the last version bump for a specific package
const getCommitsSinceLastVersionBump = (packagePath: string): string[] => {
  try {
    const packageDir = packagePath.split('/').pop();
    if (!packageDir) return [];

    // Get commits that modified this specific package's package.json
    const commits = execSync(
      `git log --oneline --follow -- packages/${packageDir}/package.json`,
      {
        cwd: rootDir,
        encoding: 'utf8',
      },
    )
      .trim()
      .split('\n')
      .filter(Boolean);

    let lastVersionBumpCommit = '';

    // Find the most recent version bump commit
    for (const commit of commits) {
      const commitHash = commit.split(' ')[0];
      if (!commitHash) continue;

      try {
        // Get the diff for this commit to see if version was changed
        const diff = execSync(
          `git show ${commitHash} -- packages/${packageDir}/package.json`,
          { cwd: rootDir, encoding: 'utf8' },
        );

        // Check if the diff contains version changes
        if (
          diff.includes('"version"') &&
          (diff.includes('+') || diff.includes('-'))
        ) {
          lastVersionBumpCommit = commitHash;
          break;
        }
      } catch {
        // Skip commits where we can't get the diff
        continue;
      }
    }

    // If no version bump found, return all commits for this package
    if (!lastVersionBumpCommit) {
      return commits;
    }

    // Get commits since the last version bump
    const commitsSinceLastBump = execSync(
      `git log --oneline ${lastVersionBumpCommit}..HEAD -- packages/${packageDir}`,
      {
        cwd: rootDir,
        encoding: 'utf8',
      },
    )
      .trim()
      .split('\n')
      .filter(Boolean);

    return commitsSinceLastBump;
  } catch (error) {
    console.warn(
      `Could not get commits since last version bump for package:`,
      (error as Error).message,
    );

    return [];
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
  if (/^\w+(?:\(.+\))?!:/.test(message)) {
    return 'major';
  }

  // Parse conventional commit format
  const match = /^(\w+)(?:\(.+\))?!?:/.exec(message);
  if (match) {
    const type = match[1];
    if (!type) return 'patch';

    return VERSION_BUMP_MAP[type] ?? 'patch';
  }

  return 'patch';
};

// Get the highest version bump from commits
const getHighestVersionBump = (commits: string[]): VersionBump => {
  const bumps = new Set(commits.map(parseCommitMessage));

  if (bumps.has('major')) return 'major';
  if (bumps.has('minor')) return 'minor';

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
  const changesetDir = path.join(rootDir, '.changeset');
  if (!existsSync(changesetDir)) {
    mkdirSync(changesetDir, { recursive: true });
  }

  const timestamp = Date.now();
  const filename = `auto-${packageName.replace('@', '').replace('/', '-')}-${timestamp.toString()}.md`;
  const filepath = path.join(changesetDir, filename);

  const content = generateChangesetContent(packageName, versionBump, commits);
  writeFileSync(filepath, content);

  console.log(`Created changeset for ${packageName}: ${filename}`);

  return filepath;
};

// Main function
const main = (): Promise<void> | void => {
  console.log('🚀 Generating automated changesets...');

  // Get all packages
  const packages = getAllPackages();
  console.log(`Found ${packages.length.toString()} packages`);

  if (packages.length === 0) {
    console.log('No packages found, skipping changeset generation');

    return;
  }

  // Try to get changed packages from git first
  const gitChangedPackages = getChangedPackagesFromGit();
  console.log('Changed packages from git:', gitChangedPackages);

  // Use git changes as primary source, fallback to turbo if no git changes
  let changedPackageNames = gitChangedPackages;

  if (gitChangedPackages.length === 0) {
    const turboChangedPackages = getChangedPackagesFromTurbo();
    console.log('No git changes, using Turborepo:', turboChangedPackages);
    changedPackageNames = turboChangedPackages;
  }

  if (changedPackageNames.length === 0) {
    console.log('No packages changed, skipping changeset generation');

    return;
  }

  // Create changesets for each changed package
  const changedPackages: ChangedPackage[] = [];

  for (const packageInfo of packages) {
    if (changedPackageNames.includes(packageInfo.name)) {
      console.log(`Processing changed package: ${packageInfo.name}`);

      // Get commits since the last version bump for this specific package
      const commitsSinceLastBump = getCommitsSinceLastVersionBump(
        packageInfo.path,
      );

      // Only create changeset if there are commits since the last version bump
      if (commitsSinceLastBump.length === 0) {
        console.log(
          `No commits since last version bump found for ${packageInfo.name}, skipping`,
        );
        continue;
      }

      // Use commits since last version bump
      const relevantCommits = commitsSinceLastBump;

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

  console.log(
    `✅ Generated ${changedPackages.length.toString()} automated changesets!`,
  );
};

try {
  // Run the script
  await main();
} catch (error) {
  console.error(error);
}
