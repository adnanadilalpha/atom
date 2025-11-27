# Contributing to ATOM Framework

Thank you for your interest in contributing to ATOM Framework! 🎉

## Quick Start

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/atom.git
   cd atom
   npm install
   ```

2. **Make Changes**
   ```bash
   # Create a feature branch
   git checkout -b feature/your-feature-name

   # Make your changes, then test
   npm test
   atom build
   ```

3. **Submit PR**
   - Push your branch: `git push origin feature/your-feature-name`
   - Create a PR on GitHub
   - CI will run automatically
   - Once approved, PR will auto-merge to main

## Development Workflow

```bash
# Development server
atom dev

# Build for production
atom build

# Test production build
atom start

# Run tests
npm test

# Type checking (if using TypeScript)
npm run typecheck
```

## CI/CD Pipeline

### Automated Checks
- ✅ **Tests (18.x)**: Tests on Node.js 18.x
- ✅ **Tests (20.x)**: Tests on Node.js 20.x
- ✅ **Build**: Ensures project compiles successfully
- ✅ **Linting**: Code quality checks
- ✅ **TypeScript**: Type safety verification
- ✅ **Coverage**: Test coverage reporting

### Auto-Merge Process
Approved PRs will automatically merge to `main` branch after:
1. All CI checks pass ✅
2. At least one maintainer approval ✅
3. No conflicts with main ✅
4. Not a draft PR ✅

### Release Process
New versions are published automatically when you:
1. Update version in `package.json`
2. Create a git tag: `git tag v1.x.x && git push --tags`
3. GitHub Actions publishes to npm automatically

## Code Guidelines

### Style
- Use consistent indentation (2 spaces)
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Keep functions focused and small (< 50 lines)

### Testing
- Add tests for new features
- Update tests when changing existing code
- Aim for >80% test coverage
- Test both success and error cases

### Documentation
- Update docs for API changes
- Add examples for new features
- Keep CHANGELOG.md current

## Branch Protection

The `main` branch is protected:
- ✅ Requires PR reviews
- ✅ Requires CI to pass
- ✅ Auto-merge enabled for approved PRs
- ✅ No direct pushes allowed

## Getting Help

- 📖 **Documentation**: Check `/docs` folder
- 🐛 **Issues**: Open bug reports on GitHub
- 💬 **Discussions**: Use GitHub Discussions for questions
- 📧 **Contact**: Reach out to maintainers

## Recognition

Contributors are recognized in:
- CHANGELOG.md for each release
- GitHub contributors list
- Future Hall of Fame (coming soon!)

Thank you for contributing to ATOM Framework! 🚀

