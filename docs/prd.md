# Product Requirements Document: MarkView

---

## Executive Summary

**MarkView** is a lightweight web application that transforms GitHub repository markdown files into beautiful, navigable documentation. Users can input any public GitHub repository, browse all markdown files, apply flexible filtering rules, and view rendered markdown with syntax highlighting and an interactive Table of Contents.

### Key Value Proposition
- **Zero Setup**: No installation, no repository cloning - just paste a GitHub URL
- **Smart Filtering**: Powerful regex-based include/exclude filters to focus on relevant documentation
- **Enhanced Navigation**: Interactive Table of Contents with scroll-to-section and scrollspy highlighting
- **Beautiful Rendering**: GitHub-flavored markdown with syntax-highlighted code blocks

---

## Problem Statement

### Current Pain Points

1. **Documentation Discovery is Fragmented**
   - Developers must navigate GitHub's file browser to find documentation
   - No easy way to see all markdown files in a repository at once
   - Difficult to filter documentation by folder or naming patterns

2. **GitHub's Markdown Rendering is Limited**
   - No Table of Contents for long documents
   - No way to quickly jump between sections
   - Limited syntax highlighting options
   - No overview of all documentation files

3. **Reading Documentation is Inefficient**
   - Need to clone repositories just to browse docs
   - No way to filter out irrelevant files (tests, examples)
   - Switching between files requires multiple clicks and page loads
   - No persistent view across multiple documentation files

4. **API Rate Limits Cause Frustration**
   - Direct GitHub API usage hits rate limits quickly
   - No caching of frequently accessed content
   - Repetitive fetches waste quota

### Target Pain Point Solution

MarkView solves these problems by providing:
- **Single-view access** to all markdown files in a repository
- **Powerful filtering** to show only relevant documentation
- **Enhanced reading experience** with TOC, scrollspy, and syntax highlighting
- **Intelligent caching** to minimize API calls and respect rate limits

---

## Goals & Objectives

### Primary Goals

1. **Improve Documentation Accessibility**
   - Reduce time to find relevant documentation from minutes to seconds
   - Provide a unified view of all repository documentation

2. **Enhance Reading Experience**
   - Make long markdown documents easier to navigate with interactive TOC
   - Provide visual context of document structure and current position

3. **Streamline Workflow**
   - Eliminate need to clone repositories for documentation browsing
   - Enable quick exploration of unfamiliar codebases

### Success Metrics

- Users can load and browse a repository in <10 seconds
- 90% of users successfully apply filters on first attempt
- Average session includes viewing 3+ markdown files
- Zero crashes from invalid input or API errors
- 80%+ mobile usability score

### Non-Goals (Out of Scope for MVP)

- Editing or creating markdown files
- Private repository support with OAuth
- Version comparison or diff viewing
- Offline mode or PWA functionality
- Multi-repository comparison
- Collaboration features (comments, annotations)

---

## Target Users

### Primary Persona: Open Source Developer (Alex)

**Background:**
- Software engineer exploring new libraries and frameworks
- Reviews 5-10 GitHub repositories per week
- Needs to quickly assess documentation quality
- Works on macOS/Linux, uses Chrome/Firefox

**Pain Points:**
- Spends too much time clicking through GitHub folders
- Frustrated by lack of navigation in long README files
- Wants to see all docs at once without cloning

**Goals:**
- Quickly find installation and usage docs
- Understand project structure through documentation
- Evaluate if a library is well-documented

**How MarkView Helps:**
- One-click access to all markdown files
- Filter to show only `/docs` folder or `README` files
- TOC makes long documents scannable

---

### Secondary Persona: Technical Writer (Jordan)

**Background:**
- Creates and maintains documentation for open source projects
- Reviews documentation structure across similar projects
- Needs to audit docs for completeness

**Pain Points:**
- Hard to get an overview of all documentation in a repo
- Can't easily compare doc structures across projects
- GitHub interface doesn't show which docs are missing

**Goals:**
- Audit which documentation exists
- Review documentation organization
- Identify documentation gaps

**How MarkView Helps:**
- See all markdown files in one list
- Filter by doc type (guides, API, examples)
- Quick switching between files

---

### Tertiary Persona: Engineering Manager (Sam)

**Background:**
- Evaluates tools and libraries for team adoption
- Reviews 2-3 repositories per day during vendor selection
- Limited time for deep dives

**Pain Points:**
- Needs quick assessment of documentation quality
- Can't easily find specific topics (deployment, security)
- GitHub interface is too slow for rapid evaluation

**Goals:**
- Assess documentation completeness in <5 minutes
- Find specific topics quickly
- Compare multiple tools efficiently

**How MarkView Helps:**
- Filter for specific doc types (security, deployment)
- Quick navigation with TOC
- Fast loading with caching

---

## User Stories

### Epic 1: Repository Loading

**US-1.1: Load Repository**
- **As a** developer
- **I want to** input a GitHub repository URL or owner/repo
- **So that** I can view all markdown files in that repository

**Acceptance Criteria:**
- Input accepts both `owner/repo` format and full GitHub URLs
- System validates repository exists and is public
- System displays error if repository is private or doesn't exist
- Repository loads within 2 seconds for typical repos (<500 files)

---

**US-1.2: Select Branch**
- **As a** developer
- **I want to** specify a branch or tag
- **So that** I can view documentation from specific versions

**Acceptance Criteria:**
- Optional branch/ref selector (defaults to main/master)
- System validates branch exists
- File list updates when branch changes

---

### Epic 2: File Browsing

**US-2.1: View All Markdown Files**
- **As a** developer
- **I want to** see a list of all markdown files in the repository
- **So that** I can browse available documentation

**Acceptance Criteria:**
- All `.md` and `.mdx` files are listed
- Files are organized by folder structure
- File count is displayed
- Empty state shown if no markdown files exist

---

**US-2.2: Select File to View**
- **As a** developer
- **I want to** click on a file in the list
- **So that** I can view its rendered content

**Acceptance Criteria:**
- Clicking a file loads and renders its content
- Active file is visually highlighted in the list
- Content loads within 1 second (cached) or 2 seconds (uncached)
- Loading state shown while fetching

---

### Epic 3: Filtering

**US-3.1: Include Filter**
- **As a** developer
- **I want to** filter files by a regex pattern
- **So that** I can focus on specific documentation

**Acceptance Criteria:**
- Include filter text input provided
- Files matching pattern are shown in real-time
- Match count displayed
- Empty filter shows all files
- Invalid regex shows error message

**Examples:**
- `^docs/` - only files in docs folder
- `README` - only README files
- `guide|tutorial` - files containing "guide" or "tutorial"

---

**US-3.2: Exclude Filter**
- **As a** developer
- **I want to** exclude files by a regex pattern
- **So that** I can hide irrelevant files

**Acceptance Criteria:**
- Exclude filter text input provided
- Files matching pattern are hidden in real-time
- Excluded count displayed
- Works in combination with include filter (AND logic)
- Invalid regex shows error message

**Examples:**
- `test|spec` - exclude test files
- `^examples/` - exclude examples folder
- `\.zh|\.ja` - exclude translations

---

**US-3.3: Clear Filters**
- **As a** developer
- **I want to** quickly reset filters
- **So that** I can see all files again

**Acceptance Criteria:**
- Clear button for each filter
- One-click reset to show all files
- Filter inputs cleared

---

### Epic 4: Markdown Rendering

**US-4.1: Render Markdown Content**
- **As a** developer
- **I want to** see rendered markdown
- **So that** I can read documentation in formatted form

**Acceptance Criteria:**
- Standard markdown elements rendered (headings, lists, links, images)
- GitHub Flavored Markdown supported (tables, task lists, strikethrough)
- Relative image URLs converted to absolute GitHub URLs
- Broken images handled gracefully
- External links open in new tab

---

**US-4.2: Syntax Highlighting**
- **As a** developer
- **I want to** see syntax-highlighted code blocks
- **So that** code examples are easy to read

**Acceptance Criteria:**
- Code blocks with language detection
- Highlighting for common languages (JS, TS, Python, Go, Rust, etc.)
- Inline code styled differently from blocks
- Theme consistent with overall design

---

### Epic 5: Table of Contents

**US-5.1: View Table of Contents**
- **As a** developer
- **I want to** see an auto-generated TOC
- **So that** I can understand document structure at a glance

**Acceptance Criteria:**
- TOC generated from H1-H4 headings
- Nested structure based on heading levels
- TOC visible alongside content (sidebar or sticky)
- Empty state if no headings

---

**US-5.2: Navigate via TOC**
- **As a** developer
- **I want to** click TOC entries
- **So that** I can jump to specific sections

**Acceptance Criteria:**
- Clicking TOC item scrolls to section (smooth scroll)
- URL hash updates with section ID
- Browser back/forward works with TOC navigation
- Offset for fixed header (if applicable)

---

**US-5.3: ScrollSpy Highlighting**
- **As a** developer
- **I want to** see which section I'm currently reading
- **So that** I can maintain context while scrolling

**Acceptance Criteria:**
- Currently visible section highlighted in TOC
- Highlighting updates smoothly while scrolling
- Handles multiple headings in viewport (highlights topmost)
- No performance issues with long documents

---

### Epic 6: Error Handling

**US-6.1: Handle Invalid Repository**
- **As a** developer
- **I want to** see a clear error message if repository doesn't exist
- **So that** I know what went wrong and how to fix it

**Acceptance Criteria:**
- 404 error shows "Repository not found" message
- Suggested action: "Check owner/repo spelling and try again"
- Previous input preserved for easy correction

---

**US-6.2: Handle Rate Limiting**
- **As a** developer
- **I want to** be notified if GitHub rate limit is exceeded
- **So that** I know when to try again or add a token

**Acceptance Criteria:**
- Rate limit error shows clear message
- Reset time displayed (e.g., "Try again in 23 minutes")
- Suggestion to add GitHub token for higher limits
- Link to instructions for obtaining token

---

**US-6.3: Handle Private Repositories**
- **As a** developer
- **I want to** understand why I can't access a private repository
- **So that** I know authentication is required

**Acceptance Criteria:**
- 403 error for private repos shows appropriate message
- Explains that only public repositories are supported in MVP
- Future: Link to OAuth flow

---

## Functional Requirements

### FR-1: Repository Input & Validation

**FR-1.1** System SHALL accept repository input in `owner/repo` format
**FR-1.2** System SHALL accept full GitHub URLs and extract owner/repo
**FR-1.3** System SHALL validate repository exists via GitHub API
**FR-1.4** System SHALL detect and communicate if repository is private
**FR-1.5** System SHALL allow optional branch/ref specification
**FR-1.6** System SHALL default to repository's default branch if not specified
**FR-1.7** System SHALL validate branch/ref exists
**FR-1.8** System SHALL display loading state during validation

---

### FR-2: File Discovery & Listing

**FR-2.1** System SHALL fetch complete file tree using GitHub Git Tree API
**FR-2.2** System SHALL filter tree to only `.md` and `.mdx` files
**FR-2.3** System SHALL display files in hierarchical folder structure
**FR-2.4** System SHALL show file paths relative to repository root
**FR-2.5** System SHALL display total file count
**FR-2.6** System SHALL cache file tree for 10 minutes
**FR-2.7** System SHALL handle repositories with 1000+ files
**FR-2.8** System SHALL show empty state if no markdown files found

---

### FR-3: File Filtering

**FR-3.1** System SHALL provide include filter input (regex pattern)
**FR-3.2** System SHALL provide exclude filter input (regex pattern)
**FR-3.3** System SHALL apply filters in real-time (<100ms update)
**FR-3.4** System SHALL support case-insensitive regex matching
**FR-3.5** System SHALL combine include and exclude filters with AND logic
**FR-3.6** System SHALL validate regex patterns and show errors
**FR-3.7** System SHALL display filtered count vs total count
**FR-3.8** System SHALL provide clear/reset functionality
**FR-3.9** System SHALL preserve filter state during file selection
**FR-3.10** System SHALL show empty state if filters match no files

---

### FR-4: File Content & Rendering

**FR-4.1** System SHALL fetch raw markdown content via GitHub API
**FR-4.2** System SHALL cache file content with ETag validation
**FR-4.3** System SHALL render markdown using react-markdown
**FR-4.4** System SHALL support GitHub Flavored Markdown (GFM)
**FR-4.5** System SHALL convert relative image URLs to absolute GitHub URLs
**FR-4.6** System SHALL handle relative link URLs correctly
**FR-4.7** System SHALL open external links in new tab
**FR-4.8** System SHALL render tables with responsive styling
**FR-4.9** System SHALL render task lists with checkboxes
**FR-4.10** System SHALL render blockquotes, lists, and horizontal rules
**FR-4.11** System SHALL lazy-load images
**FR-4.12** System SHALL handle broken images gracefully

---

### FR-5: Syntax Highlighting

**FR-5.1** System SHALL detect language from code fence (```language)
**FR-5.2** System SHALL apply syntax highlighting to code blocks
**FR-5.3** System SHALL support minimum 15 common languages
  - JavaScript, TypeScript, Python, Go, Rust, Java, C, C++, C#, Ruby, PHP, Shell, HTML, CSS, SQL
**FR-5.4** System SHALL use consistent theme for all code blocks
**FR-5.5** System SHALL style inline code differently from blocks
**FR-5.6** System SHALL handle code blocks without language specified

---

### FR-6: Table of Contents

**FR-6.1** System SHALL extract headings (H1-H4) from markdown
**FR-6.2** System SHALL generate nested TOC structure based on heading levels
**FR-6.3** System SHALL create unique IDs for each heading
**FR-6.4** System SHALL handle duplicate heading text with unique suffixes
**FR-6.5** System SHALL inject IDs into rendered heading elements
**FR-6.6** System SHALL display TOC in fixed/sticky position
**FR-6.7** System SHALL make TOC items clickable
**FR-6.8** System SHALL scroll to section on TOC click (smooth scroll)
**FR-6.9** System SHALL update URL hash on TOC navigation
**FR-6.10** System SHALL support browser back/forward with hash changes

---

### FR-7: ScrollSpy

**FR-7.1** System SHALL track visible headings using Intersection Observer
**FR-7.2** System SHALL highlight currently visible section in TOC
**FR-7.3** System SHALL update highlighting during scroll
**FR-7.4** System SHALL prioritize topmost heading when multiple are visible
**FR-7.5** System SHALL perform smoothly without scroll jank
**FR-7.6** System SHALL clean up observers on component unmount

---

### FR-8: Caching & Performance

**FR-8.1** System SHALL cache GitHub API responses
**FR-8.2** System SHALL use ETag headers for cache validation
**FR-8.3** System SHALL respect 304 Not Modified responses
**FR-8.4** System SHALL set cache TTL of 5-10 minutes
**FR-8.5** System SHALL implement LRU cache eviction
**FR-8.6** System SHALL limit cache size to prevent memory bloat
**FR-8.7** System SHALL provide manual refresh functionality
**FR-8.8** System SHALL track and display cache hit rate (dev mode)

---

### FR-9: Error Handling

**FR-9.1** System SHALL handle 404 (repository not found) errors
**FR-9.2** System SHALL handle 403 (rate limit exceeded) errors
**FR-9.3** System SHALL handle 403 (private repository) errors
**FR-9.4** System SHALL handle network errors (timeout, offline)
**FR-9.5** System SHALL handle 500 (GitHub server) errors
**FR-9.6** System SHALL display user-friendly error messages
**FR-9.7** System SHALL suggest corrective actions for errors
**FR-9.8** System SHALL log errors to console for debugging
**FR-9.9** System SHALL parse and display GitHub API error details
**FR-9.10** System SHALL display rate limit status (remaining calls, reset time)

---

### FR-10: Input Validation

**FR-10.1** System SHALL validate repository format (owner/repo)
**FR-10.2** System SHALL validate regex patterns before applying
**FR-10.3** System SHALL show inline validation errors
**FR-10.4** System SHALL disable submit until inputs are valid
**FR-10.5** System SHALL clear validation errors on input change
**FR-10.6** System SHALL provide helpful validation messages

---

## Non-Functional Requirements

### NFR-1: Performance

**NFR-1.1** Repository validation SHALL complete in <1 second
**NFR-1.2** File list fetch SHALL complete in <2 seconds for repos with <500 files
**NFR-1.3** File content fetch SHALL complete in <1 second (cached), <2 seconds (uncached)
**NFR-1.4** Markdown rendering SHALL complete in <500ms for files <100KB
**NFR-1.5** Filter application SHALL update UI in <100ms
**NFR-1.6** ScrollSpy SHALL update highlighting in <50ms
**NFR-1.7** Page load time SHALL be <3 seconds on 3G network
**NFR-1.8** Application SHALL handle 1000+ markdown files without performance degradation
**NFR-1.9** Application SHALL maintain 60fps during smooth scrolling

---

### NFR-2: Reliability

**NFR-2.1** Application SHALL have 99.9% uptime
**NFR-2.2** Application SHALL not crash from invalid user input
**NFR-2.3** Application SHALL not crash from malformed GitHub responses
**NFR-2.4** Application SHALL gracefully degrade on API failures
**NFR-2.5** Application SHALL recover from network interruptions

---

### NFR-3: Usability

**NFR-3.1** Application SHALL be usable without documentation
**NFR-3.2** Error messages SHALL be understandable by non-technical users
**NFR-3.3** Loading states SHALL be visible within 100ms of action
**NFR-3.4** Application SHALL provide feedback for all user actions
**NFR-3.5** Application SHALL be navigable via keyboard
**NFR-3.6** Application SHALL support touch gestures on mobile

---

### NFR-4: Accessibility

**NFR-4.1** Application SHALL meet WCAG 2.1 Level AA standards
**NFR-4.2** Application SHALL be fully keyboard navigable
**NFR-4.3** Application SHALL provide ARIA labels for all interactive elements
**NFR-4.4** Application SHALL support screen readers (NVDA, JAWS, VoiceOver)
**NFR-4.5** Application SHALL have sufficient color contrast (4.5:1 minimum)
**NFR-4.6** Application SHALL respect prefers-reduced-motion preference
**NFR-4.7** Application SHALL have semantic HTML structure

---

### NFR-5: Browser Compatibility

**NFR-5.1** Application SHALL support Chrome 120+
**NFR-5.2** Application SHALL support Firefox 120+
**NFR-5.3** Application SHALL support Safari 17+
**NFR-5.4** Application SHALL support Edge 120+
**NFR-5.5** Application SHALL provide degraded experience on IE11 (fallback message)

---

### NFR-6: Mobile Responsiveness

**NFR-6.1** Application SHALL be fully functional on mobile devices
**NFR-6.2** Application SHALL support viewport widths from 320px to 2560px
**NFR-6.3** Application SHALL have touch-friendly tap targets (44px minimum)
**NFR-6.4** Application SHALL work on iOS Safari 15+
**NFR-6.5** Application SHALL work on Android Chrome 120+
**NFR-6.6** Application SHALL adapt layout for portrait and landscape orientations

---

### NFR-7: Security

**NFR-7.1** Application SHALL only access public GitHub repositories
**NFR-7.2** Application SHALL sanitize all user input
**NFR-7.3** Application SHALL not expose GitHub tokens in client-side code
**NFR-7.4** Application SHALL use HTTPS for all API requests
**NFR-7.5** Application SHALL not execute arbitrary code from markdown
**NFR-7.6** Application SHALL sanitize markdown to prevent XSS
**NFR-7.7** Application SHALL implement Content Security Policy (CSP)

---

### NFR-8: Scalability

**NFR-8.1** Application SHALL handle concurrent users (100+ simultaneous)
**NFR-8.2** Application SHALL implement request rate limiting
**NFR-8.3** Application SHALL support horizontal scaling (stateless design)
**NFR-8.4** Cache SHALL scale to 1000+ repositories

---

### NFR-9: Maintainability

**NFR-9.1** Code SHALL have 70%+ test coverage
**NFR-9.2** Code SHALL follow consistent style guide (Biome rules)
**NFR-9.3** Code SHALL be documented with inline comments for complex logic
**NFR-9.4** Application SHALL log errors with sufficient context for debugging
**NFR-9.5** Application SHALL have automated builds and tests

---

## User Interface Requirements

### UI-1: Layout

**UI-1.1** Application SHALL use three-column layout (desktop):
- Left: File list sidebar (collapsible)
- Center: Rendered markdown content
- Right: Table of Contents (collapsible)

**UI-1.2** Application SHALL use single-column layout (mobile):
- Header with navigation controls
- Collapsible file list (drawer)
- Full-width markdown content
- Floating TOC button

**UI-1.3** Application SHALL have fixed header with:
- App logo/title
- Repository info (owner/repo, branch)
- Rate limit indicator

---

### UI-2: Repository Input

**UI-2.1** Repository input SHALL be prominently displayed on first load
**UI-2.2** Input SHALL show placeholder: "owner/repo or GitHub URL"
**UI-2.3** Input SHALL show example below: "e.g., facebook/react"
**UI-2.4** Submit button SHALL show loading spinner during validation
**UI-2.5** Errors SHALL appear inline below input with red styling

---

### UI-3: File List

**UI-3.1** File list SHALL show folder icons for directories
**UI-3.2** File list SHALL show file icons for markdown files
**UI-3.3** Active file SHALL be highlighted with background color
**UI-3.4** File list SHALL be scrollable with custom scrollbar
**UI-3.5** File count SHALL appear at top: "42 markdown files"
**UI-3.6** Empty state SHALL show illustration and helpful text

---

### UI-4: Filters

**UI-4.1** Filters SHALL appear above file list
**UI-4.2** Include filter SHALL have label "Include (regex)"
**UI-4.3** Exclude filter SHALL have label "Exclude (regex)"
**UI-4.4** Filters SHALL show match count: "Showing 15 of 42 files"
**UI-4.5** Invalid regex SHALL show red border and error message
**UI-4.6** Clear buttons SHALL appear as "X" icon in input

---

### UI-5: Markdown Content

**UI-5.1** Content area SHALL have max-width of 800px for readability
**UI-5.2** Content SHALL have generous padding (2-4rem)
**UI-5.3** Headings SHALL have consistent sizing and spacing
**UI-5.4** Links SHALL be blue and underlined on hover
**UI-5.5** Code blocks SHALL have dark background with light text
**UI-5.6** Tables SHALL have borders and striped rows
**UI-5.7** Images SHALL have max-width 100% and shadow

---

### UI-6: Table of Contents

**UI-6.1** TOC SHALL show nested bullet list
**UI-6.2** Active item SHALL be bold with accent color
**UI-6.3** TOC items SHALL show hover effect
**UI-6.4** TOC SHALL be scrollable if longer than viewport
**UI-6.5** TOC title SHALL be "On This Page" or "Contents"

---

### UI-7: Loading States

**UI-7.1** Loading spinners SHALL use consistent design
**UI-7.2** Skeleton loaders SHALL match final content layout
**UI-7.3** Loading overlays SHALL have semi-transparent background
**UI-7.4** Progress indicators SHALL show for long operations (>2s)

---

### UI-8: Error States

**UI-8.1** Error messages SHALL use red color scheme
**UI-8.2** Errors SHALL include icon (warning/error symbol)
**UI-8.3** Errors SHALL be dismissible with "X" button
**UI-8.4** Errors SHALL show suggested action as button or link

---

### UI-9: Responsive Behavior

**UI-9.1** Sidebar SHALL collapse to hamburger menu on mobile
**UI-9.2** TOC SHALL collapse to floating button on mobile
**UI-9.3** Font sizes SHALL scale appropriately for screen size
**UI-9.4** Touch targets SHALL be minimum 44x44px on mobile
**UI-9.5** Horizontal scrolling SHALL be disabled on mobile

---

## Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                  │
│  ┌──────────────────────────────────────────────┐  │
│  │            React Application                 │  │
│  │  ┌────────────┐  ┌─────────────────────┐    │  │
│  │  │   Layout   │  │   State Management  │    │  │
│  │  │ Components │  │   (React Context)   │    │  │
│  │  └────────────┘  └─────────────────────┘    │  │
│  │  ┌────────────────────────────────────┐     │  │
│  │  │      Markdown Renderer             │     │  │
│  │  │  (react-markdown + Shiki)          │     │  │
│  │  └────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP/JSON
                      ▼
┌─────────────────────────────────────────────────────┐
│              Bun Server (Backend)                   │
│  ┌──────────────────────────────────────────────┐  │
│  │            API Routes (Bun.serve)            │  │
│  │  • /api/repository/validate                  │  │
│  │  • /api/repository/files                     │  │
│  │  • /api/repository/content                   │  │
│  │  • /api/rate-limit                           │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                    │
│  ┌──────────────▼───────────────────────────────┐  │
│  │         LRU Cache (In-Memory)                │  │
│  │  • ETag-based validation                     │  │
│  │  • 5-10 minute TTL                           │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                    │
│  ┌──────────────▼───────────────────────────────┐  │
│  │       GitHub API Client                      │  │
│  │  • Typed REST API wrapper                    │  │
│  │  • Rate limit handling                       │  │
│  │  • Error transformation                      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────┐
│            GitHub REST API v3                       │
│  • Repository validation                            │
│  • Git Tree API (file list)                         │
│  • Contents API (file content)                      │
│  • Rate Limit API                                   │
└─────────────────────────────────────────────────────┘
```

---

### Technology Stack

**Frontend:**
- React 19 - UI framework
- TypeScript - Type safety
- Tailwind CSS 4 - Styling
- shadcn/ui - UI components
- react-markdown - Markdown parsing
- remark-gfm - GitHub Flavored Markdown
- Shiki - Syntax highlighting

**Backend:**
- Bun 1.3+ - Runtime and server
- Bun.serve() - HTTP server with routing
- Native fetch - HTTP client

**APIs:**
- GitHub REST API v3 - Repository data

**Caching:**
- lru-cache - In-memory LRU cache
- ETag validation - HTTP caching

**Testing:**
- Bun test runner - Unit and integration tests
- Playwright (post-MVP) - E2E testing

**DevOps:**
- Biome - Linting and formatting
- Husky - Git hooks
- GitHub Actions - CI/CD (future)

---

### API Design

#### POST /api/repository/validate

**Request:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "ref": "main"  // optional
}
```

**Response (Success):**
```json
{
  "valid": true,
  "data": {
    "name": "react",
    "owner": "facebook",
    "description": "The library for web and native user interfaces",
    "defaultBranch": "main",
    "stars": 220000,
    "isPrivate": false
  }
}
```

**Response (Error):**
```json
{
  "valid": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Repository not found",
    "suggestion": "Check the owner and repository name"
  }
}
```

---

#### POST /api/repository/files

**Request:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "ref": "main"  // optional
}
```

**Response:**
```json
{
  "files": [
    {
      "path": "README.md",
      "sha": "abc123",
      "size": 12340,
      "type": "blob"
    },
    {
      "path": "docs/CONTRIBUTING.md",
      "sha": "def456",
      "size": 5678,
      "type": "blob"
    }
  ],
  "total": 42,
  "cached": true
}
```

---

#### POST /api/repository/content

**Request:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "path": "README.md",
  "ref": "main"  // optional
}
```

**Response:**
```json
{
  "content": "# React\n\nThe library for...",
  "path": "README.md",
  "size": 12340,
  "cached": true
}
```

---

#### GET /api/rate-limit

**Response:**
```json
{
  "limit": 5000,
  "remaining": 4892,
  "reset": 1670000000,
  "resetIn": "42 minutes"
}
```

---

### Caching Strategy

**File Tree Cache:**
- Key: `tree:${owner}:${repo}:${ref}`
- TTL: 10 minutes
- Validation: ETag from GitHub API
- Eviction: LRU

**File Content Cache:**
- Key: `content:${owner}:${repo}:${ref}:${path}`
- TTL: 10 minutes
- Validation: ETag from GitHub API
- Eviction: LRU

**Rate Limit Cache:**
- Key: `ratelimit`
- TTL: 60 seconds
- No validation needed

**Cache Size Limits:**
- Max entries: 1000
- Max memory: 100MB
- Eviction policy: Least Recently Used (LRU)

---

### Data Flow

**1. Load Repository:**
```
User Input → Validate Format → API: /repository/validate
→ Check Cache → GitHub API → Cache Response → Return to Client
```

**2. Fetch File List:**
```
Repository Info → API: /repository/files → Check Cache
→ GitHub Git Tree API → Filter .md/.mdx → Cache Response
→ Return to Client → Render File List
```

**3. Load File Content:**
```
File Selection → API: /repository/content → Check Cache
→ GitHub Contents API → Decode Base64 → Cache Response
→ Return to Client → Parse Markdown → Render with Shiki
→ Generate TOC → Setup ScrollSpy
```

**4. Apply Filters:**
```
User Input → Validate Regex → Apply to File List (Client-Side)
→ Update UI (Real-Time) → Show Match Count
```

---

## Success Metrics

### User Engagement Metrics

1. **Adoption Rate**
   - Target: 100 unique users in first month
   - Target: 1000 unique users in first quarter

2. **Session Duration**
   - Target: Average 5+ minutes per session
   - Indicates users find value in browsing

3. **Files Viewed Per Session**
   - Target: Average 3+ files per session
   - Indicates successful navigation

4. **Filter Usage Rate**
   - Target: 40% of users apply filters
   - Indicates feature discoverability

5. **Return User Rate**
   - Target: 30% return within 7 days
   - Indicates product-market fit

---

### Performance Metrics

1. **Load Time**
   - Target: 90th percentile <3 seconds
   - Measure: Time to interactive

2. **API Response Time**
   - Target: Median <500ms (cached)
   - Target: Median <2s (uncached)

3. **Cache Hit Rate**
   - Target: 60%+ cache hits
   - Indicates effective caching

4. **Error Rate**
   - Target: <1% of requests result in errors
   - Excludes user input errors

---

### Quality Metrics

1. **Crash Rate**
   - Target: 0% crashes from invalid input
   - Target: <0.1% crashes overall

2. **Test Coverage**
   - Target: 70%+ code coverage
   - Focus on critical paths

3. **Accessibility Score**
   - Target: Lighthouse accessibility score 90+

4. **Mobile Usability**
   - Target: Google Mobile-Friendly Test pass
   - Target: Lighthouse mobile score 80+

---

### Business Metrics

1. **GitHub API Quota Efficiency**
   - Target: Average <10 API calls per session
   - Indicates effective caching

2. **Support Requests**
   - Target: <5 requests per 100 users
   - Indicates intuitive UX

3. **Feature Request Rate**
   - Measure: Track requests for dark mode, search, etc.
   - Informs post-MVP roadmap

---

## MVP Scope

### In Scope (MVP)

**Core Features:**
- ✅ Repository input and validation
- ✅ File list browsing
- ✅ Include/exclude regex filtering
- ✅ Markdown rendering with GFM
- ✅ Syntax highlighting
- ✅ Table of Contents generation
- ✅ ScrollSpy active section highlighting
- ✅ Error handling for all failure scenarios
- ✅ Mobile responsive design
- ✅ Caching with ETag validation

**Supported Scenarios:**
- ✅ Public GitHub repositories only
- ✅ Default branch and specified branches/tags
- ✅ Repositories with up to 5000 files
- ✅ Markdown files up to 1MB

---

### Out of Scope (Post-MVP)

**Phase 2:**
- ⏳ Dark mode toggle
- ⏳ Full-text search within markdown
- ⏳ Keyboard shortcuts
- ⏳ Export to PDF
- ⏳ Bookmark frequently used repositories
- ⏳ Recent repositories list

**Phase 3:**
- ⏳ Private repository support (OAuth)
- ⏳ Side-by-side raw markdown view
- ⏳ Copy code button in code blocks
- ⏳ Custom syntax highlighting themes
- ⏳ Offline mode / PWA

**Not Planned:**
- ❌ Editing or creating markdown
- ❌ Version comparison / diff view
- ❌ Collaboration features (comments, annotations)
- ❌ Multi-repository comparison
- ❌ GitLab / Bitbucket support

---

## Assumptions & Constraints

### Assumptions

1. **Users have internet access** - No offline mode in MVP
2. **Users access public repositories** - Private repos require OAuth (post-MVP)
3. **GitHub API is available** - No fallback if GitHub is down
4. **Users use modern browsers** - Chrome 120+, Firefox 120+, Safari 17+
5. **Markdown files are text-based** - Binary files not supported
6. **Users understand basic regex** - For filtering features
7. **Repositories are reasonably sized** - Performance tested up to 5000 files

---

### Technical Constraints

1. **GitHub API Rate Limits:**
   - Unauthenticated: 60 requests/hour per IP
   - Authenticated: 5000 requests/hour per token
   - Mitigation: Aggressive caching, encourage token usage

2. **Browser Compatibility:**
   - Must support Intersection Observer (scrollspy)
   - Must support ES2020+ features
   - Fallback for older browsers: Show upgrade message

3. **File Size Limits:**
   - GitHub API limits: Files >1MB require special handling
   - Rendering performance: Large files (>500KB) may be slow
   - Mitigation: Show warning for large files

4. **Memory Constraints:**
   - Client-side: Rendering 100+ large files may cause issues
   - Server-side: Cache size limited to 100MB
   - Mitigation: LRU eviction, lazy loading

---

### Business Constraints

1. **No Backend Infrastructure (MVP):**
   - Use Bun.serve() for simplicity
   - No database, no authentication
   - All state is ephemeral

2. **Free Tier Hosting:**
   - Deploy on Vercel/Netlify free tier
   - May have bandwidth/execution limits

3. **No Monetization (MVP):**
   - Free for all users
   - No premium features
   - Future: Consider GitHub Sponsors

---

## Risks & Mitigation

### Risk 1: GitHub API Rate Limiting

**Probability:** High
**Impact:** High

**Description:** Users without GitHub tokens will hit 60 req/hour limit quickly, making the app unusable.

**Mitigation:**
- Aggressive caching with 10-minute TTL
- ETag validation to avoid unnecessary fetches
- Batch API calls (Git Tree API returns all files in one request)
- Prominent rate limit status display
- Clear instructions for adding GitHub token
- Consider implementing request queuing

---

### Risk 2: Large Repository Performance

**Probability:** Medium
**Impact:** Medium

**Description:** Repositories with thousands of markdown files may cause UI slowdown or crashes.

**Mitigation:**
- Virtualize file list (render only visible items)
- Lazy load file content (don't fetch until selected)
- Show warning for repos with >1000 files
- Implement pagination or "load more" pattern
- Profile and optimize rendering performance

---

### Risk 3: Malicious Markdown Content

**Probability:** Low
**Impact:** High

**Description:** Markdown could contain XSS attacks or malicious scripts.

**Mitigation:**
- Use react-markdown with sanitization enabled
- Disable HTML rendering in markdown (or sanitize with DOMPurify)
- Implement Content Security Policy (CSP)
- Audit dependencies for vulnerabilities
- Test with known malicious markdown samples

---

### Risk 4: Relative URL Transformation Failures

**Probability:** Medium
**Impact:** Medium

**Description:** Edge cases in relative URL conversion may break images/links.

**Mitigation:**
- Comprehensive unit tests for URL transformation
- Test with real-world repositories (React, Vue, Next.js docs)
- Handle all relative path formats (../, ./, no prefix)
- Provide fallback for broken images
- Log transformation failures for debugging

---

### Risk 5: Browser Compatibility Issues

**Probability:** Low
**Impact:** Medium

**Description:** Advanced features (Intersection Observer, Smooth Scroll) may not work on older browsers.

**Mitigation:**
- Feature detection with graceful degradation
- Polyfills for critical features
- Browser compatibility testing in CI
- Clear browser requirements in docs
- Fallback UI for unsupported browsers

---

### Risk 6: Cache Invalidation Bugs

**Probability:** Medium
**Impact:** Low

**Description:** Stale cached content may be served after repository updates.

**Mitigation:**
- Use ETag validation on every request
- Provide manual refresh button
- Set reasonable TTL (5-10 minutes)
- Display cache status to users (dev mode)
- Monitor cache hit/miss rates

---

### Risk 7: Mobile UX Degradation

**Probability:** Medium
**Impact:** Medium

**Description:** Complex UI (sidebar, TOC, content) may not work well on small screens.

**Mitigation:**
- Mobile-first design approach
- Collapsible UI elements (drawer, sheet)
- Touch-friendly tap targets (44px+)
- Test on real devices (iOS, Android)
- Progressive enhancement strategy

---

## Timeline & Milestones

### Phase 1: Foundation (Week 1)
**Goal:** Infrastructure and GitHub integration

- [x] Project setup (Bun, React, TypeScript, Tailwind)
- [ ] Remove demo code
- [ ] Install dependencies (react-markdown, Shiki, etc.)
- [ ] GitHub API client implementation
- [ ] Basic API routes
- [ ] Caching infrastructure

**Deliverable:** Working GitHub API integration with caching

---

### Phase 2: Core UI (Week 2)
**Goal:** Basic application flow working

- [ ] Application layout (header, sidebar, content)
- [ ] Repository input form
- [ ] File list component
- [ ] Basic markdown rendering
- [ ] Loading and error states

**Deliverable:** Can load a repository and view rendered markdown

---

### Phase 3: Advanced Features (Week 3)
**Goal:** Complete MVP feature set

- [ ] Regex filtering (include/exclude)
- [ ] Table of Contents generation
- [ ] ScrollSpy implementation
- [ ] Syntax highlighting
- [ ] Mobile responsive design

**Deliverable:** All MVP features implemented

---

### Phase 4: Polish & Launch (Week 4)
**Goal:** Production-ready application

- [ ] Comprehensive error handling
- [ ] Accessibility improvements
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deployment

**Deliverable:** Live production application

---

### Post-MVP (Ongoing)
**Goal:** Iterative improvements based on feedback

- [ ] Dark mode (Phase 2.1)
- [ ] Search functionality (Phase 2.2)
- [ ] Keyboard shortcuts (Phase 2.3)
- [ ] Export to PDF (Phase 3.1)
- [ ] Private repository support with OAuth (Phase 3.2)

---

## Appendix

### Glossary

- **ETag**: HTTP header used for cache validation
- **GFM**: GitHub Flavored Markdown (tables, task lists, etc.)
- **LRU**: Least Recently Used (cache eviction strategy)
- **ScrollSpy**: UI pattern that highlights active section during scroll
- **TOC**: Table of Contents
- **Rate Limit**: GitHub API usage quota

---

### References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [react-markdown Documentation](https://github.com/remarkjs/react-markdown)
- [Shiki Documentation](https://shiki.matsu.io/)
- [Bun Documentation](https://bun.sh/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

### Revision History

| Version | Date       | Author       | Changes                    |
|---------|------------|--------------|----------------------------|
| 1.0     | 2025-12-06 | Product Team | Initial PRD for MVP        |

---

**Document Status:** Draft - Ready for Review
**Next Review Date:** 2025-12-13
**Approvals Required:** Engineering Lead, Design Lead
