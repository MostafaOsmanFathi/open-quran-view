# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits](https://conventionalcommits.org/).

## [0.2.0] - 2026-02-04

### Added

- Modular static asset generation scripts for fonts and data
- Static file copying to dist in tsup build configuration
- Static asset URL generation for Quran fonts and metadata

### Fixed

- Font sanitizer rejection errors by ensuring static files are copied to dist

### Changed

- Improved font path resolution using import.meta.url and fileURLToPath
- Updated build workflow to include core/static directory in distribution
