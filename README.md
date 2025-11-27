# ⚛️ ATOM Framework

**Build faster, ship sooner.** A compiler-driven full-stack framework that treats your code like a single cohesive unit, not a collection of disparate parts.

[![npm version](https://img.shields.io/npm/v/atom-framework.svg)](https://www.npmjs.com/package/atom-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 👋 Meet ATOM

We built ATOM because we were tired of the boilerplate. Tired of setting up API routes just to talk to a database. Tired of configuring bundlers, optimizers, and routers.

ATOM compiles your backend and frontend together. You write functions, we handle the API, the serialization, the hydration, and the deployment.

**It's not magic, it's just a smarter compiler.**

## ✨ Features that Matter

- **Unified Codebase** - Write server and client code in the same file. We split it for you.
- **Server Actions** - Call a server function from a button click. No `fetch()`, no API endpoints.
- **Zero-Config Performance** - Automatic image optimization, critical CSS extraction, and code splitting.
- **Real-Time by Default** - Built-in WebSocket support for instant updates.
- **Deploy Anywhere** - One command to ship to Vercel, Cloudflare, or Docker.
- **Type-Safe** - Your backend types flow directly to your frontend. No syncing required.
- **DevTools HUD** - Built-in performance monitoring and SEO analysis right in your browser.

## 📦 Get Started

Create a new project in seconds:

```bash
npx atom-framework create my-app
```

This sets up everything you need: TypeScript, Tailwind CSS, and a ready-to-run project.

## 🎯 Quick Commands

```bash
# Start the dev server (with instant hot reload)
atom dev

# Build for production
atom build

# Preview production build locally
atom start

# Deploy to the world
atom deploy vercel
```

## 💡 How it Works

Here is a complete, working application in one file:

```atom
@Title "Hello World"

// Server-side logic lives here
@Flow Actions {
  secure_greet: async function(name) {
    // This runs on the server!
    return { message: `Hello, ${name}!` };
  }
};

// Client-side view
@View {
  const [response, setResponse] = useState(null);
  
  return div([
    h1(response ? response.message : "Waiting..."),
    button("Say Hello", { 
      // Call server function directly
      onclick: () => Actions.secure_greet("Friend").then(setResponse) 
    })
  ]);
}
```

No API routes. No generic `useEffect` fetch calls. Just functions calling functions.

## 📚 Documentation

Ready to dive deeper?

- **[Documentation Index](./docs/INDEX.md)** - Start your journey here.
- **[Complete Guide](./docs/COMPLETE_GUIDE.md)** - From zero to hero.
- **[Server Actions](./docs/DATA_FETCHING.md)** - Learn how the magic works.
- **[Database](./docs/DATABASE.md)** - Connect to Postgres, MySQL, or MongoDB.
- **[Deployment](./docs/DEPLOYMENT.md)** - Ship to production.

## 🤝 Contributing

We welcome contributions from everyone! Here's how to get involved:

- **[Contributing Guide](./CONTRIBUTING.md)** - Learn how to contribute
- [GitHub Repository](https://github.com/adnanadilalpha/atom)
- [Report an Issue](https://github.com/adnanadilalpha/atom/issues)
- [Submit a Pull Request](https://github.com/adnanadilalpha/atom/pulls)

### Quick Contribution Flow
1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test: `npm test && atom build`
4. Submit a PR - CI will run automatically
5. Once approved, your PR will auto-merge to main! 🎉

## 🤝 Community

ATOM is open source and built by developers, for developers. Join us!

## 📄 License

MIT © [ATOM Framework](https://github.com/adnanadilalpha/atom)
