# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits](https://conventionalcommits.org/).

## [0.2.0] - 2026-02-04

### Added

- Static asset generation scripts (`generate-static-fonts.ts`, `generate-static-data.ts`)
- Static file URL generation for fonts and metadata
- `prepare` lifecycle for automatic asset generation
- Documentation for Quran Foundation API integration
- Data generation guide with complete pipeline documentation
- Static assets architecture documentation

### Fixed

- Font loading issues by including static files in build output
- Vite configuration for font MIME types and headers

### Changed

- Build workflow to include `core/static` directory in distribution
- Updated documentation to reference Quran Foundation API instead of QUL
- Removed all QUL (Quranic Universal Library) references from docs and README

## [0.1.0] - 2026-01-XX

Initial release.
