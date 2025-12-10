# MarkView - Development Todo List

**Last Updated:** 2025-12-06
**Current Status:** Initial template setup complete, starting MVP development

---

## Project Overview

MarkView is a lightweight web app that generates readable documentation from GitHub repository Markdown files with interactive Table of Contents, regex filtering, and syntax highlighting.

---

## ✅ Completed (Foundation)

- [x] Initialize Bun + React 19 project with TypeScript
- [x] Configure TypeScript with strict mode
- [x] Set up Tailwind CSS 4
- [x] Install shadcn/ui components (Card, Button, Input, Select, Textarea, Label)
- [x] Configure Bun.serve() with HTML imports and HMR
- [x] Set up Husky pre-commit hooks
- [x] Configure Biome for linting/formatting
- [x] Create build script with HTML bundling support
- [x] Set up path aliases (@/*)

---

## 🚀 MVP Development Tasks

### Epic 1: Project Cleanup & Dependencies ✅ COMPLETED

**Goal:** Remove demo code and install required dependencies for MarkView

- [x] Remove demo `APITester.tsx` component
- [x] Clean up demo API routes from `src/index.tsx`
- [x] Update `App.tsx` to MarkView layout structure
- [x] Install markdown rendering dependencies:
  - [x] `react-markdown`
  - [x] `remark-gfm` (GitHub Flavored Markdown)
  - [x] `rehype-raw` (support HTML in markdown)
- [x] Install syntax highlighting:
  - [x] `shiki` or `rehype-prism-plus`
- [x] Install additional UI components needed:
  - [x] Add more shadcn/ui components (Tabs, ScrollArea, Separator, Sonner - Toast replacement)
- [x] Install utilities:
  - [x] LRU cache library (e.g., `lru-cache`)
- [x] Update README.md with MarkView description
- [x] Create `.env.example` with GitHub token placeholder

---

### Epic 2: GitHub API Integration ✅ COMPLETED

**Goal:** Build typed GitHub REST API client for fetching repository data

#### 2.1 Research & Setup
- [x] Create `src/lib/github/` directory structure
- [x] Create `src/lib/github/types.ts` for GitHub API type definitions
- [x] Document GitHub API endpoints needed:
  - [x] Repository validation: `GET /repos/:owner/:repo`
  - [x] Git Tree API: `GET /repos/:owner/:repo/git/trees/:ref?recursive=1`
  - [x] File contents: `GET /repos/:owner/:repo/contents/:path`
  - [x] Rate limit: `GET /rate_limit`

#### 2.2 Core GitHub Client
- [x] Create `src/lib/github/client.ts`:
  - [x] Base GitHub API client class
  - [x] Configure GitHub token from env vars
  - [x] Add request headers (Accept, User-Agent, Authorization)
  - [x] Implement rate limit header parsing
  - [x] Create error handling wrapper
  - [x] Add TypeScript types for all responses

#### 2.3 API Methods
- [x] `validateRepository(owner: string, repo: string)`:
  - [x] Check if repository exists and is accessible
  - [x] Handle 404 (not found) and 403 (private/forbidden) errors
  - [x] Return repository metadata (name, description, default branch)
- [x] `getFileTree(owner: string, repo: string, ref?: string)`:
  - [x] Fetch complete file tree recursively
  - [x] Filter to only `.md` and `.mdx` files
  - [x] Return array of file paths with metadata (sha, size, path)
  - [x] Handle large repositories (>1000 files)
- [x] `getFileContent(owner: string, repo: string, path: string, ref?: string)`:
  - [x] Fetch raw markdown content
  - [x] Decode base64 content from API response
  - [x] Handle large files
  - [x] Return raw markdown string
- [x] `getRateLimit()`:
  - [x] Fetch current rate limit status
  - [x] Return remaining calls and reset time

#### 2.4 Caching & Optimization
- [x] Implement ETag support:
  - [x] Store ETags for resources
  - [x] Send If-None-Match headers
  - [x] Handle 304 Not Modified responses
- [ ] Add unit tests for GitHub client methods (deferred to Epic 9)

---

### Epic 3: Backend API Routes & Caching ✅ COMPLETED

**Goal:** Create Next.js-style API routes using Bun.serve()

#### 3.1 Cache Infrastructure
- [x] Create `src/lib/cache.ts`:
  - [x] Implement LRU cache wrapper
  - [x] Define cache key strategy (repo+ref+path)
  - [x] Set cache size limits (e.g., 100MB)
  - [x] Add TTL configuration (5-10 minutes)
  - [x] Create cache utility functions (get, set, invalidate)

#### 3.2 API Route: Repository Validation
- [x] Create `POST /api/repository/validate` route:
  - [x] Accept JSON body: `{ owner, repo, ref? }`
  - [x] Validate input parameters
  - [x] Call GitHub client to validate repository
  - [x] Return validation result + repository metadata
  - [x] Handle errors with appropriate HTTP status codes
  - [x] Add request/response logging

#### 3.3 API Route: File List
- [x] Create `POST /api/repository/files` route:
  - [x] Accept JSON body: `{ owner, repo, ref? }`
  - [x] Fetch file tree from GitHub
  - [x] Cache file tree with ETag
  - [x] Return list of markdown files with metadata
  - [x] Handle pagination if needed
  - [x] Add cache headers to response

#### 3.4 API Route: File Content
- [x] Create `POST /api/repository/content` route:
  - [x] Accept JSON body: `{ owner, repo, ref?, path }`
  - [x] Fetch file content from GitHub
  - [x] Cache content with ETag
  - [x] Return raw markdown content
  - [x] Handle large files (streaming if needed)
  - [x] Add cache headers to response

#### 3.5 API Route: Rate Limit Status
- [x] Create `GET /api/rate-limit` route:
  - [x] Fetch and return current rate limit status
  - [x] Return remaining calls, limit, and reset time
  - [x] Cache for 60 seconds

#### 3.6 Error Handling
- [x] Create standardized error response format
- [x] Handle GitHub API errors:
  - [x] 404 Repository Not Found
  - [x] 403 Rate Limit Exceeded
  - [x] 403 Private Repository (forbidden)
  - [x] Network errors (timeout, offline)
  - [x] 500 GitHub server errors
- [x] Add error logging for debugging

---

### Epic 4: Frontend Layout & Core Components ✅ COMPLETED

**Goal:** Build the main application layout and navigation structure

#### 4.1 Main Layout
- [x] Create complete layout in `App.tsx`:
  - [x] Header with app title/logo
  - [x] Sidebar container (for file list)
  - [x] Main content area (for markdown)
  - [x] Responsive grid/flex layout
  - [x] Mobile-friendly structure

#### 4.2 Repository Input Form
- [x] Create `src/components/RepositoryInput.tsx`:
  - [x] Input field for repository (format: `owner/repo`)
  - [x] Optional branch/ref selector (supports parsing from URL)
  - [x] "Load Repository" button
  - [x] Input validation (format checking)
  - [x] Support pasting full GitHub URLs (auto-parse)
  - [x] Loading state during validation
  - [x] Error display area
  - [x] Helper text with examples

#### 4.3 File List Sidebar
- [x] Create `src/components/FileList.tsx`:
  - [x] Display list of markdown files
  - [x] Group by folder structure (nested tree or flat list)
  - [x] File selection (click to load)
  - [x] Highlight active/selected file
  - [x] Show file count
  - [x] Empty state (no files found)
  - [x] Loading skeleton
  - [x] Collapsible on mobile (drawer/sheet)
  - [x] Scrollable list (use ScrollArea)

#### 4.4 Loading & Empty States
- [x] Create `src/components/LoadingSpinner.tsx`
- [x] Create `src/components/EmptyState.tsx`:
  - [x] Empty state for no repository loaded
  - [x] Empty state for no markdown files
  - [x] Empty state for no matches after filtering
  - [x] Empty state for content fetch failure
- [x] Create skeleton loaders in `SkeletonLoaders.tsx`:
  - [x] File list skeleton
  - [x] Content skeleton
  - [x] TOC skeleton

#### 4.5 Error Display
- [x] Create `src/components/ErrorMessage.tsx`:
  - [x] Display error messages with context
  - [x] Show suggested actions for resolution
  - [x] Dismiss functionality
  - [x] Different error types (warning, error, info)
- [x] Integrated error display in App.tsx

---

### Epic 5: Markdown Rendering & Syntax Highlighting ✅ COMPLETED

**Goal:** Render markdown content with proper styling and code highlighting

#### 5.1 Markdown Renderer Setup
- [x] Create `src/components/MarkdownRenderer.tsx`:
  - [x] Configure react-markdown with remark-gfm
  - [x] Custom component renderers for:
    - [x] Headings (h1-h6) with auto-generated IDs
    - [x] Paragraphs with proper spacing
    - [x] Links (external open in new tab)
    - [x] Images (relative → absolute URLs)
    - [x] Lists (ul, ol)
    - [x] Blockquotes
    - [x] Tables
    - [x] Code blocks with language detection

#### 5.2 Syntax Highlighting
- [x] Configure Shiki for code blocks:
  - [x] Install Shiki and language grammars
  - [x] Select theme (GitHub Dark)
  - [x] Integrate with react-markdown
  - [x] Support common languages (JS, TS, Python, Go, Rust, Java, etc.)
  - [x] Add language label to code blocks
  - [ ] Optional: Add copy button to code blocks (deferred to post-MVP)
  - [x] Handle inline code separately

#### 5.3 Markdown Styling
- [x] Create `src/styles/markdown.css`:
  - [x] Typography styles for headings (sizes, weights, spacing)
  - [x] Paragraph spacing and line height
  - [x] List styles (bullets, numbers, nested)
  - [x] Link styles (color, hover, underline)
  - [x] Blockquote styling (border, background, padding)
  - [x] Table styling (borders, striping, responsive)
  - [x] Code block container (background, border, padding)
  - [x] Inline code styling
  - [x] Image max-width and responsive sizing
  - [x] Horizontal rule styling

#### 5.4 Content Processing
- [x] Transform relative image URLs to absolute GitHub URLs:
  - [x] Parse image src attributes
  - [x] Convert `./image.png` → `https://raw.githubusercontent.com/.../image.png`
  - [x] Handle various relative path formats (`../`, `./`, no prefix)
- [x] Transform relative markdown links (handled by default rendering)
- [x] Add lazy loading for images
- [x] Handle broken images (browser default handling)

#### 5.5 GitHub Flavored Markdown
- [x] Ensure GFM features work (via remark-gfm):
  - [x] Strikethrough (~~text~~)
  - [x] Task lists (- [ ] and - [x])
  - [x] Tables
  - [x] Autolinks
  - [x] Footnotes (supported by remark-gfm)

---

### Epic 6: Table of Contents & ScrollSpy ✅ COMPLETED

**Goal:** Generate interactive TOC with scroll-to-section and active highlighting

#### 6.1 TOC Generation
- [x] Create `src/lib/markdown/toc.ts`:
  - [x] Parse markdown to extract headings (H1-H4)
  - [x] Generate nested TOC structure based on heading levels
  - [x] Create unique IDs for each heading
  - [x] Handle duplicate heading text (add suffixes)
  - [x] Return TOC tree structure
  - [ ] Add unit tests for TOC generation (deferred to Epic 9)

#### 6.2 TOC Component
- [x] Create `src/components/TableOfContents.tsx`:
  - [x] Render hierarchical TOC structure
  - [x] Indent nested levels
  - [x] Clickable TOC items
  - [x] Scroll to section on click (smooth scroll)
  - [x] Update URL hash on navigation
  - [x] Active item highlighting
  - [x] ScrollArea for long TOC
  - [ ] Collapsible on mobile (deferred to post-MVP)

#### 6.3 ScrollSpy Implementation
- [x] Implement scroll tracking with Intersection Observer:
  - [x] Observe all heading elements
  - [x] Detect which heading is currently visible
  - [x] Handle multiple headings in viewport (prioritize topmost)
  - [x] Update active TOC item dynamically
  - [x] Smooth highlighting transitions (CSS transitions)
  - [x] Optimize performance (Intersection Observer)
  - [x] Clean up observers on unmount

#### 6.4 Heading ID Injection
- [x] Heading IDs already injected in MarkdownRenderer:
  - [x] Custom heading renderer
  - [x] Generate consistent IDs matching TOC
  - [x] Ensure IDs are URL-safe

#### 6.5 Scroll Behavior
- [x] Implement smooth scrolling:
  - [x] CSS scroll-behavior: smooth
  - [x] JavaScript smooth scrolling in TOC click handler
  - [x] Offset for fixed header
  - [x] Respect prefers-reduced-motion
  - [x] Handle URL hash navigation

---

### Epic 7: Regex Filtering System

**Goal:** Allow users to filter file list with include/exclude regex patterns

#### 7.1 Filter UI
- [ ] Create `src/components/FileFilters.tsx`:
  - [ ] Include filter text input
  - [ ] Exclude filter text input
  - [ ] Labels and placeholders
  - [ ] Clear/reset filter buttons
  - [ ] Filter match count display
  - [ ] Filter examples dropdown (optional)
  - [ ] Regex syntax help link/tooltip

#### 7.2 Filter Logic
- [ ] Create `src/lib/filters/regex.ts`:
  - [ ] `applyIncludeFilter(files, pattern)` function
  - [ ] `applyExcludeFilter(files, pattern)` function
  - [ ] Combined filter logic (AND operation)
  - [ ] Case-insensitive option
  - [ ] Handle empty filters (show all / exclude none)
  - [ ] Return filtered file list
  - [ ] Add unit tests for filter logic

#### 7.3 Real-time Filtering
- [ ] Integrate filters with file list:
  - [ ] Debounce filter input (300ms)
  - [ ] Apply filters on input change
  - [ ] Update file list in real-time
  - [ ] Show filtered count vs total count
  - [ ] Preserve selection if active file matches filter

#### 7.4 Regex Validation
- [ ] Add regex validation:
  - [ ] Try-catch around regex compilation
  - [ ] Display error message for invalid regex
  - [ ] Highlight invalid input (red border)
  - [ ] Show helpful error message (syntax error details)
  - [ ] Provide example valid patterns
  - [ ] Don't crash app on invalid regex

#### 7.5 Filter Presets (Optional - Post-MVP)
- [ ] Create common filter presets:
  - [ ] "Documentation only" (include: `^docs/`)
  - [ ] "Exclude tests" (exclude: `test|spec`)
  - [ ] "READMEs only" (include: `README`)
  - [ ] Preset buttons populate filter inputs
  - [ ] User can modify after selecting preset

---

### Epic 8: Error Handling & UX Polish

**Goal:** Comprehensive error handling and user experience improvements

#### 8.1 Error Boundaries
- [ ] Create React Error Boundary component:
  - [ ] Catch React rendering errors
  - [ ] Display fallback UI
  - [ ] Log errors to console
  - [ ] Provide recovery action (reload)

#### 8.2 API Error Handling
- [ ] Create `src/lib/errors.ts`:
  - [ ] Custom error classes for different scenarios
  - [ ] Error message mapping (code → user-friendly message)
  - [ ] Suggested actions for each error type
- [ ] Handle specific GitHub errors:
  - [ ] 404: "Repository not found. Check owner/repo and try again."
  - [ ] 403 Rate Limit: "GitHub API rate limit exceeded. Try again in X minutes or add a GitHub token."
  - [ ] 403 Private: "This repository is private. Use a GitHub token with access."
  - [ ] Network: "Network error. Check your internet connection."
  - [ ] 500: "GitHub is experiencing issues. Try again later."

#### 8.3 Input Validation
- [ ] Validate repository input:
  - [ ] Format: `owner/repo`
  - [ ] No special characters (except -, _)
  - [ ] Show inline validation errors
  - [ ] Disable submit button until valid
  - [ ] Parse and extract from full GitHub URLs
- [ ] Validate branch/ref input (optional field)
- [ ] Validate regex patterns (covered in Epic 7)

#### 8.4 Loading States
- [ ] Add loading indicators for:
  - [ ] Repository validation (spinner on button)
  - [ ] File list fetch (skeleton loader)
  - [ ] File content fetch (skeleton in content area)
  - [ ] Prevent duplicate requests (disable during loading)
- [ ] Show progress for long operations (optional)

#### 8.5 Accessibility
- [ ] Keyboard navigation:
  - [ ] Tab through inputs and buttons
  - [ ] Enter to submit forms
  - [ ] Arrow keys in file list (optional)
  - [ ] Focus management
- [ ] ARIA labels and roles:
  - [ ] Label all inputs
  - [ ] ARIA-live regions for dynamic content
  - [ ] Semantic HTML (nav, main, aside)
- [ ] Screen reader support:
  - [ ] Descriptive labels
  - [ ] Status announcements

#### 8.6 Mobile Responsiveness
- [ ] Test and fix mobile layout:
  - [ ] Collapsible sidebar (drawer/sheet)
  - [ ] Touch-friendly buttons and inputs
  - [ ] Readable text sizes
  - [ ] Responsive tables in markdown
  - [ ] Test on iOS Safari and Android Chrome

---

### Epic 9: Testing

**Goal:** Write tests for critical functionality

#### 9.1 Test Setup
- [ ] Configure Bun test runner
- [ ] Create test utilities and helpers
- [ ] Set up mock data fixtures:
  - [ ] Mock GitHub API responses
  - [ ] Mock repository data
  - [ ] Mock markdown files

#### 9.2 Unit Tests
- [ ] Test `src/lib/github/client.ts`:
  - [ ] Repository validation
  - [ ] File tree fetching
  - [ ] File content fetching
  - [ ] Rate limit parsing
  - [ ] Error handling
- [ ] Test `src/lib/markdown/toc.ts`:
  - [ ] TOC generation from markdown
  - [ ] Heading ID generation
  - [ ] Nested structure handling
  - [ ] Duplicate heading names
- [ ] Test `src/lib/filters/regex.ts`:
  - [ ] Include filter
  - [ ] Exclude filter
  - [ ] Combined filters
  - [ ] Invalid regex handling
- [ ] Test `src/lib/cache.ts`:
  - [ ] Cache set/get operations
  - [ ] LRU eviction
  - [ ] TTL expiration

#### 9.3 Integration Tests
- [ ] Test API routes:
  - [ ] `/api/repository/validate` with valid/invalid repos
  - [ ] `/api/repository/files` with caching
  - [ ] `/api/repository/content` with caching
  - [ ] Error scenarios for all routes
- [ ] Test end-to-end flows:
  - [ ] Load repository → fetch files → select file → render markdown
  - [ ] Apply filters → see filtered results
  - [ ] Click TOC item → scroll to section

#### 9.4 Coverage
- [ ] Set up test coverage reporting
- [ ] Aim for 70%+ coverage on critical paths
- [ ] Generate HTML coverage report

---

### Epic 10: Documentation & Deployment Prep

**Goal:** Complete documentation and prepare for deployment

#### 10.1 Documentation
- [ ] Update `README.md`:
  - [ ] Project description
  - [ ] Features list
  - [ ] Screenshots (optional)
  - [ ] Installation instructions
  - [ ] Usage guide
  - [ ] Environment variables
  - [ ] Development setup
  - [ ] Build instructions
  - [ ] Deployment guide
- [ ] Create `CONTRIBUTING.md`:
  - [ ] Development workflow
  - [ ] Code style guide
  - [ ] Commit message conventions
  - [ ] PR process
- [ ] Add inline code comments for complex logic
- [ ] Create API documentation (if needed)

#### 10.2 Environment & Configuration
- [ ] Document required environment variables:
  - [ ] `GITHUB_TOKEN` (optional, increases rate limit)
- [ ] Create `.env.example` with all vars
- [ ] Add env var validation on startup
- [ ] Document how to obtain GitHub token

#### 10.3 Build & Production
- [ ] Test production build:
  - [ ] `bun run build`
  - [ ] Verify output in `dist/`
  - [ ] Test production server locally
- [ ] Optimize bundle size:
  - [ ] Check for large dependencies
  - [ ] Enable code splitting if needed
  - [ ] Verify minification
- [ ] Add deployment instructions for:
  - [ ] Vercel
  - [ ] Netlify
  - [ ] Self-hosted (Docker)

#### 10.4 Final QA
- [ ] Manual testing checklist:
  - [ ] Load various public repositories
  - [ ] Test with large repos (1000+ markdown files)
  - [ ] Test filtering with complex regex
  - [ ] Test all markdown features (tables, code blocks, images)
  - [ ] Test TOC navigation and scrollspy
  - [ ] Test error scenarios (invalid repo, rate limit)
  - [ ] Test on different browsers (Chrome, Firefox, Safari)
  - [ ] Test on mobile devices
- [ ] Performance testing:
  - [ ] Measure page load time
  - [ ] Measure time to render large markdown files
  - [ ] Check for memory leaks
  - [ ] Verify cache is working

---

## 🎨 Post-MVP Features (Nice-to-Have)

### Phase 2: Enhanced User Experience
- [ ] **Dark Mode**
  - [ ] Toggle switch in header
  - [ ] Persist preference in localStorage
  - [ ] Dark theme for markdown content
  - [ ] Dark syntax highlighting theme
- [ ] **Search Within Markdown**
  - [ ] Full-text search across current file
  - [ ] Highlight search matches
  - [ ] Navigate between matches
  - [ ] Regex search option
- [ ] **Keyboard Shortcuts**
  - [ ] Focus search (/)
  - [ ] Toggle sidebar (b)
  - [ ] Navigate files (j/k)
  - [ ] Shortcut help modal (?)

### Phase 3: Advanced Features
- [ ] **Export to PDF**
  - [ ] Export button for current markdown
  - [ ] Preserve formatting and syntax highlighting
  - [ ] Include TOC in PDF
- [ ] **Bookmark Repositories**
  - [ ] Save frequently accessed repos
  - [ ] Store in localStorage
  - [ ] Quick load from bookmarks
- [ ] **Recent Repositories**
  - [ ] Track last 10 accessed repos
  - [ ] Click to reload
  - [ ] Clear history option
- [ ] **Markdown Preview Side-by-Side**
  - [ ] Toggle split view (raw + rendered)
  - [ ] Synchronized scrolling
  - [ ] Copy raw markdown button
- [ ] **File Search in Sidebar**
  - [ ] Fuzzy search on file names
  - [ ] Highlight matches
  - [ ] Works with regex filters
- [ ] **Repository File Search**
  - [ ] Search across all markdown content (not just filenames)
  - [ ] Full-text index
  - [ ] Search results view

### Phase 4: Performance & Analytics
- [ ] **Performance Monitoring**
  - [ ] Track page load times
  - [ ] Track API response times
  - [ ] Performance budgets
- [ ] **Error Tracking**
  - [ ] Integrate Sentry or similar
  - [ ] Track client-side errors
  - [ ] Alert on critical errors
- [ ] **Analytics** (Optional)
  - [ ] Privacy-respecting analytics
  - [ ] Track popular repositories
  - [ ] Usage patterns

---

## 📋 Implementation Order (Recommended)

### Week 1: Foundation & GitHub Integration
1. Epic 1: Cleanup & Dependencies
2. Epic 2: GitHub API Integration
3. Epic 3: Backend API Routes (partial)

### Week 2: Core UI & Rendering
4. Epic 4: Frontend Layout & Components
5. Epic 5: Markdown Rendering (partial)
6. Epic 3: Complete API Routes & Caching

### Week 3: Advanced Features
7. Epic 5: Complete Markdown Rendering & Styling
8. Epic 6: Table of Contents & ScrollSpy
9. Epic 7: Regex Filtering

### Week 4: Polish & Launch
10. Epic 8: Error Handling & UX Polish
11. Epic 9: Testing
12. Epic 10: Documentation & Deployment
13. Final QA and launch

---

## 🎯 Success Criteria

- [ ] Can load any public GitHub repository
- [ ] File list loads in <2 seconds for typical repos
- [ ] Markdown renders correctly with syntax highlighting
- [ ] TOC scrollspy works smoothly without jank
- [ ] Regex filters work in real-time (<100ms)
- [ ] Mobile responsive on iOS and Android
- [ ] Zero crashes on invalid input
- [ ] 70%+ test coverage
- [ ] Works with repos containing 1000+ markdown files
- [ ] Rate limit errors handled gracefully

---

## 🛠️ Tech Stack Summary

### Core
- **Runtime:** Bun 1.3+
- **Framework:** React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui

### Libraries
- **Markdown:** react-markdown + remark-gfm
- **Syntax Highlighting:** Shiki
- **Caching:** lru-cache
- **State Management:** React Context or Zustand
- **Testing:** Bun test runner

### APIs
- **GitHub REST API v3** (public repositories only)
- **Authentication:** GitHub Personal Access Token (optional, for higher rate limits)

---

## 🚨 Key Architectural Considerations

### 1. Rate Limiting
- Aggressive caching with ETags
- Clear rate limit status display
- Encourage users to provide GitHub tokens
- Batch requests (Git Tree API returns all files at once)

### 2. Performance
- Virtualize long file lists (1000+ items)
- Lazy load file content
- Debounce filter inputs
- Optimize ScrollSpy with Intersection Observer

### 3. Relative URLs
- Transform relative image/link URLs to absolute GitHub URLs
- Parse markdown AST to rewrite URLs
- Handle edge cases (../, ./, no prefix)

### 4. Mobile UX
- Collapsible sidebar (drawer pattern)
- Touch-friendly targets (44px minimum)
- Responsive tables in markdown
- Fixed header considerations

### 5. Caching Strategy
- ETag-based validation
- Cache TTL: 5-10 minutes
- Manual refresh option
- Cache size limits (prevent memory bloat)

---

**Note:** This todo list is a living document. Update checkboxes as tasks are completed and add new tasks as needed during development.
