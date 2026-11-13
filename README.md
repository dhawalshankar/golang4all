# GolangForAll 🇮🇳

[![CI](https://github.com/DhawalShankar/golang4all/actions/workflows/ci.yml/badge.svg)](https://github.com/DhawalShankar/golang4all/actions/workflows/ci.yml)

> **Go without the gatekeeping.**

**GolangForAll** is an independent community for people who **learn, build,
teach, and contribute with Go**. This repository contains the community
learning and content platform; execution is provided by the separately
deployed [GoLab](https://golab.golangforall.in) service.

We bring developers together through technical writing, documentation, projects, meetups, discussions, and community-driven learning.

🌐 **[golangforall.in](https://golangforall.in)**

---

## What is GolangForAll?

Go is simple to start with.

The difficult part is understanding **why it was designed the way it was**, what to build with it, and where other developers are actually using it.

GolangForAll exists to bridge that gap.

The platform brings together:

* 📚 Go learning resources
* ✍️ Technical writing
* 🛠️ Build logs and real-world projects
* 🤝 Developer meetups
* 💬 Community discussions
* 📢 Community announcements
* 🧪 Interactive Go experimentation

The goal is not to create another collection of syntax tutorials.

The goal is to build a place where **Gophers learn from each other**.

---

## 🌐 Platform

The main website is built around a Docusaurus + React frontend with Go API
functions for community posts and image uploads.

### Core areas

| Area              | Purpose                                    |
| ----------------- | ------------------------------------------ |
| **Docs**          | Structured Go learning resources           |
| **Blog**          | Community technical writing                |
| **Build Logs**    | Real projects and engineering experiences  |
| **Meetups**       | Developer events and community activity    |
| **Now**           | What the community is currently working on |
| **Announcements** | Community updates                          |

### Site experience and search

The site shares its styling and community footer across the home, docs, blog,
about, and admin pages, and uses a GolangForAll favicon. The navbar includes
social links for GitHub, LinkedIn, Instagram, and X; the footer also links to
YouTube, WhatsApp, and the founder.

Navbar search combines the local docs and static-page index with published blog
posts fetched from `/api/posts`. It matches post titles, sections, and article
content, and selecting a blog result opens that article. If the posts API is
unavailable, docs and page search remain available.

---

## 🧪 GoLab

One of the core projects in the GolangForAll ecosystem is **GoLab**.

👉 **[golab.golangforall.in](https://golab.golangforall.in)**

GoLab is a browser-based Go code execution environment with:

* Monaco Editor
* Dedicated stdin support
* Go HTTP execution engine
* Docker-based isolation
* AWS EC2 deployment
* Caddy reverse proxy
* systemd service management

Untrusted code is executed inside isolated containers with:

* Non-root execution
* Dropped Linux capabilities
* Disabled networking
* CPU limits
* Memory limits
* PID limits
* Per-request isolation

A persistent Go build cache is also used to make repeated compilation faster.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    GolangForAll     │
                    │     Frontend        │
                    │  Docusaurus/React   │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │   Go Backend    │        │      GoLab      │
        │   Blog APIs     │        │  Code Runner    │
        └────────┬────────┘        └────────┬────────┘
                 │                          │
                 ▼                          ▼
        ┌─────────────────┐        ┌─────────────────┐
        │   PostgreSQL    │        │     Docker      │
        │     Storage     │        │   Sandboxes     │
        └─────────────────┘        └────────┬────────┘
                                            │
                                            ▼
                                       AWS EC2
```

---

## ✍️ Content System

The platform includes a custom content-management console for creating, editing, and deleting community posts.

Posts are organized into sections such as:

```text
Fundamentals
Backend Engineering
Systems & Concurrency
Build Logs
Now
Meetups
Announcements
```

The public API exposes published posts, while administrative operations require an admin authentication token.

Images uploaded through the content console are sent to **Cloudinary** through a protected backend endpoint.
The Go handlers in `api/posts.go` and `api/upload.go` are deployed as Vercel
functions; the posts endpoint returns published content for the blog and navbar
search.

---

## 🔐 Security

Security is treated as part of the engineering rather than an afterthought.

The platform currently uses:

* Token-protected administrative APIs
* Protected content-management operations
* Server-side upload limits
* Cloudinary-backed media storage
* PostgreSQL persistence
* Docker isolation for GoLab
* Non-root container execution
* Dropped container capabilities
* Network-disabled execution environments
* CPU, memory, and PID limits

GoLab is specifically designed around the principle that **user-submitted code must be treated as untrusted input**.

---

## 🛠️ Tech Stack

### Frontend

* React
* Docusaurus
* JavaScript
* React Markdown
* Remark GFM
* Rehype Raw
* `@easyops-cn/docusaurus-search-local` for local docs and page search

### Backend

* Go
* Vercel Go HTTP functions
* PostgreSQL via Neon

### Infrastructure

* Docker
* AWS EC2
* Caddy
* systemd
* Linux

### Storage & Services

* PostgreSQL
* Cloudinary

### GoLab

* Go
* Docker
* Monaco Editor
* AWS EC2
* Caddy
* systemd

---

## 📁 Project Structure

A simplified view of the application:

```text
golangforall/
├── api/
│   ├── posts.go
│   └── upload.go
├── docs/
├── migrations/
│   └── 001_create_posts.sql
├── pkg/
│   └── db/
├── src/
│   ├── css/
│   ├── pages/
│   │   ├── index.js
│   │   ├── about.js
│   │   ├── admin.js
│   │   └── blog/
│   │       └── index.js
│   └── theme/
│       ├── NotFound/
│       └── SearchBar/
├── static/
│   └── img/
├── docusaurus.config.mjs
├── go.mod
├── package.json
├── sidebars.js
└── vercel.json
```

The exact structure may evolve as the platform grows.

---

## 🚀 Running Locally

The frontend requires Node.js 24 or later. Go 1.24 is required when working on
the API handlers.

Clone the repository:

```bash
git clone https://github.com/dhawalshankar/golang4all.git
cd golangforall
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run start
```

The site should then be available at:

```text
http://localhost:3000
```

Build and preview the production frontend with:

```bash
npm run build
npm run serve
```

### API environment

The Go API functions require the following environment variables:

```env
ADMIN_AUTH_TOKEN=
NEON_DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`npm run start` runs the Docusaurus frontend only; it does not run the Vercel
Go functions under `/api`. Blog data, navbar blog results, and image uploads
require a Vercel-compatible local runtime or a deployed API, configured with
these variables. The variable names are also listed in `.env.example`.

Do **not** commit production credentials or secrets to the repository.

---

## 🤝 Contributing

GolangForAll is built around community contribution.

Start with the [contribution guide](CONTRIBUTING.md). Please also read the
[Code of Conduct](CODE_OF_CONDUCT.md); security concerns should follow
[SECURITY.md](SECURITY.md), not be posted publicly.

You can contribute by:

* Writing a technical article
* Sharing a Go project
* Improving documentation
* Hosting a meetup
* Giving a technical talk
* Fixing bugs
* Improving the platform
* Sharing useful Go resources

If you've built something interesting with Go, **we want to hear about it.**

---

## 🗺️ Roadmap

Some things we want to explore as the community grows:

* [ ] More Go learning paths
* [ ] More city-based meetups
* [ ] Community project showcases
* [ ] Contributor profiles
* [ ] Better content discovery
* [ ] More GoLab capabilities
* [ ] Community-driven tutorials
* [ ] Open-source Go projects

---

## 🌍 Community

GolangForAll is more than the website.

It is developers learning together, building together, and meeting each other.

**Learn. Build. Share. Meet.**

Join the community and help make Go accessible without the gatekeeping.

---

## 🚀 Production ecosystem

GolangForAll is deployed as a connected set of learning and execution
services. The documentation and community frontend is served through the
Docusaurus/React application, its Go content APIs use PostgreSQL/NeonDB and
Cloudinary, and GoLab is exposed at `https://golab.golangforall.in` with an
independent Go runner at `https://api.golangforall.in`.

GoLab runs on AWS EC2 behind Caddy and systemd, while the frontend is hosted on
Vercel. This separation gives the public learning platform a distinct
untrusted-code execution boundary: content APIs manage educational material,
whereas the Go runner owns compilation, Docker isolation, resource controls,
timeouts, output capture, and execution telemetry.

### Repository relationships

| Repository/service | Responsibility |
|---|---|
| GolangForAll | Community content, docs, articles, and announcements |
| GoLab | Browser-based Go editor and isolated execution |

---

## ⚖️ Disclaimer

GolangForAll (`golangforall.in`) is an **independent, community-run initiative**.

It is not affiliated with, endorsed by, or connected to `golangforall.com` or any other similarly named platform, organization, or entity.

---

## 📜 License

Unless a file states otherwise, this repository is licensed under the MIT
License; see [LICENSE](LICENSE). Third-party dependencies and content remain
subject to their respective licenses.

---

<p align="center">
  <strong>GolangForAll 🇮🇳</strong><br>
  Go without the gatekeeping.
</p>
