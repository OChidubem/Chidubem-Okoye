# Version Control Workflow (Recommended)

## Branch Model

- `main`: stable branch, always deployable.
- `feature/<name>`: new features.
- `fix/<name>`: bug fixes.
- `docs/<name>`: report/doc updates.

## Daily Team Process

1. Pull latest `main`.
2. Create a feature branch.
3. Commit in small increments with clear messages.
4. Push branch and open PR.
5. Request review from teammate.
6. Address comments.
7. Merge to `main` after approval.

## Commit Message Format

Use short, action-based messages:

- `feat: add overtime calculation logic`
- `fix: validate negative hourly input`
- `docs: add azure deployment section`
- `db: add initial schema and seed scripts`

## Minimum Evidence for “Effective Version Control”

To score well on this rubric section, ensure:

- Multiple contributors each have multiple commits.
- PR reviews from teammates are visible.
- Branches are used for non-trivial changes.
- Commit history shows iterative development (not one final commit).

## Example Git Commands

```bash
git checkout main
git pull origin main
git checkout -b feature/payroll-overtime
# edit files
git add .
git commit -m "feat: implement overtime pay rule"
git push -u origin feature/payroll-overtime
```

Then open a PR on GitHub and request a reviewer.
