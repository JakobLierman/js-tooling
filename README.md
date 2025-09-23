# JavaScript Tooling

A personal monorepo containing JavaScript tools and configurations for modern development workflows.

## Overview

This monorepo provides a collection of reusable JavaScript/TypeScript configurations and tools that can be shared across projects. It's built with modern tooling including pnpm workspaces, Turbo for build orchestration, and automated releases via GitHub Actions.

## Packages

### [@jakoblierman/commitlint-config](./packages/commitlint-config/README.md)

A commitlint configuration package that enforces conventional commit messages.

### [@jakoblierman/eslint-config](./packages/eslint-config/README.md)

An opinionated ESLint configuration package.

### [@jakoblierman/prettier-config](./packages/prettier-config/README.md)

An opinionated Prettier configuration package.

### [@jakoblierman/tsconfig](./packages/tsconfig/README.md)

A TypeScript configuration package that provides a base configuration for TypeScript projects.

## Tech Stack

- **Package Manager**: pnpm
- **Build System**: Turbo
- **Language**: TypeScript
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Versioning**: Changesets
- **CI/CD**: GitHub Actions
- **Registry**: GitHub Packages

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/JakobLierman/js-tooling.git
cd js-tooling
pnpm install
```

### Development

Run all packages in development mode:

```bash
pnpm dev
```

### Building

Build all packages:

```bash
pnpm build
```

### Testing

Run all tests:

```bash
pnpm test
```

### Linting

Lint all packages:

```bash
pnpm lint
```

### Formatting

Format all code:

```bash
pnpm format
```

## Workspace Configuration

This monorepo uses pnpm workspaces with the following structure:

- `apps/*` - Applications
- `functions/*` - Serverless functions
- `packages/*` - Reusable packages
- `libs/*` - Shared libraries
- `tools/*` - Development tools
- `examples/*` - Example projects

## Release Process

This monorepo uses an automated release workflow with Changesets:

### Release Types

- **Production** (`main` branch): Stable releases to `latest` tag
- **Beta** (`staging` branch): Pre-release versions to `beta` tag
- **Alpha** (`develop` branch): Development versions to `alpha` tag

### Adding Changes

When making changes to a package, add a changeset:

```bash
pnpm changeset
```

This will guide you through:

1. Selecting which packages changed
2. Choosing the change type (patch, minor, major)
3. Writing a description of the change

### Manual Release

You can trigger releases manually via GitHub Actions or locally:

```bash
# Version packages (updates package.json versions)
pnpm changeset version

# Publish packages to registry
pnpm changeset publish
```

For detailed release information, see [RELEASE.md](./RELEASE.md).

## Quality Assurance

The project includes comprehensive quality checks:

- **Linting**: ESLint with custom configuration
- **Formatting**: Prettier with consistent style rules
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest with coverage reporting
- **Security**: Dependency vulnerability scanning
- **Commit Messages**: Conventional commits via commitlint

## Configuration Files

- `commitlint.config.ts` - Commit message linting
- `prettier.config.js` - Code formatting
- `lint-staged.config.ts` - Pre-commit hooks
- `turbo.json` - Build orchestration
- `vitest.config.ts` - Testing configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add a changeset if modifying packages
5. Run tests and linting
6. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Author

**Jakob Lierman**

- Email: jakob.lierman@gmail.com
- Website: https://jakoblierman.be
- GitHub: [@JakobLierman](https://github.com/JakobLierman)

## Support

For issues and questions:

- GitHub Issues: [Create an issue](https://github.com/JakobLierman/js-tooling/issues)
- Email: jakob.lierman@gmail.com
