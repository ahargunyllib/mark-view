# MarkView

A lightweight web application that generates readable documentation from GitHub repository Markdown files with interactive Table of Contents, regex filtering, and syntax highlighting.

## Features

- **GitHub Repository Integration**: Load any public GitHub repository
- **Interactive File List**: Browse all Markdown files in the repository
- **Beautiful Markdown Rendering**: GitHub Flavored Markdown with syntax highlighting
- **Table of Contents**: Auto-generated TOC with scroll spy navigation
- **Regex Filtering**: Filter files using include/exclude regex patterns
- **Modern UI**: Built with React 19, Tailwind CSS 4, and shadcn/ui components
- **Fast & Efficient**: Powered by Bun with intelligent caching

## Installation

Install dependencies:

```bash
bun install
```

## Usage

### Development

Start a development server with hot reloading:

```bash
bun dev
```

### Production

Build and run for production:

```bash
bun run build
bun start
```

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
GITHUB_TOKEN=your_github_personal_access_token
```

**Note**: The GitHub token is optional but recommended to increase API rate limits from 60 to 5000 requests per hour.

## Tech Stack

- **Runtime**: Bun 1.3+
- **Framework**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Markdown**: react-markdown + remark-gfm
- **Syntax Highlighting**: Shiki
- **Caching**: lru-cache

## Project Structure

```
mark-view/
├── src/
│   ├── components/        # React components
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utility libraries
│   │   ├── github/       # GitHub API client
│   │   ├── markdown/     # Markdown processing
│   │   └── filters/      # Regex filtering logic
│   ├── App.tsx           # Main application component
│   ├── index.tsx         # Server entry point
│   └── frontend.tsx      # Frontend entry point
├── docs/                 # Documentation
└── public/              # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

Built with [Bun](https://bun.com) - A fast all-in-one JavaScript runtime.
