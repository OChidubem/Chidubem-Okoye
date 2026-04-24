# Source Control Setup Checklist (Part 4)

Use this checklist during your demo to prove proper repository setup.

## 1) Repository Privacy and Access

- [ ] Repository is **Private**.
- [ ] All team members are invited as collaborators.
- [ ] Everyone has accepted invitations.
- [ ] Team roles are clear (owner/admin vs maintain/write).

## 2) Collaboration Standards

- [ ] `main` branch is protected (require PR before merge).
- [ ] At least 1 reviewer required before merge.
- [ ] Direct pushes to `main` disabled (except instructors if needed).
- [ ] Clear branch naming convention documented (`feature/*`, `fix/*`, `docs/*`).

## 3) Version Control Hygiene

- [ ] Frequent, meaningful commits (not one large dump).
- [ ] Commit messages are descriptive.
- [ ] Pull requests describe purpose and changes.
- [ ] Issues/tasks are linked to PRs where possible.

## 4) Database Script Sharing

- [ ] `database/schema.sql` is committed.
- [ ] `database/seed.sql` (or equivalent) is committed.
- [ ] Migration scripts are versioned and ordered.
- [ ] README explains how to run DB scripts locally.

## 5) Evidence to Show in Video

- [ ] Settings page showing private repo.
- [ ] Collaborators page showing members.
- [ ] Branch protection rules.
- [ ] Network/graph or commit history showing multiple contributors.
- [ ] PR list with reviews/comments.
