# Contributing to HubSpot Sync App

First off, thank you for considering contributing to HubSpot Sync App! It's people like you that make this tool better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

1. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/hubspot-sync-app.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add some feature"
   ```

5. Run tests and linting:
   ```bash
   npm run test
   npm run lint
   npm run typecheck
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

- All TypeScript must adhere to the ESLint configuration
- Use TypeScript's strict mode
- Prefer interfaces over type aliases
- Use explicit return types for functions
- Document complex functions with JSDoc comments

### Testing

- Write tests for all new functionality
- Maintain or improve code coverage
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

## Questions?

Feel free to contact the project maintainers if you have any questions.