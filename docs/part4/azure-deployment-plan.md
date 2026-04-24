# Azure Deployment Plan (Part 4)

This is a practical transition plan from local development to Azure.

## 1) Components to Deploy

### Application / Backend
- **Azure App Service** (simple managed deployment) OR
- **Azure Container Apps** (if packaging app with Docker)

### Database
- **Azure SQL Database** for relational data.
- Store schema and seed scripts in `database/` and run during provisioning.

### Secrets and Configuration
- **Azure Key Vault** for connection strings and secrets.
- Environment-specific settings through App Settings / container env vars.

### Monitoring
- **Application Insights** for logs, traces, and error visibility.

## 2) Environment Strategy

Create at least two environments:

- **Dev**: fast testing and integration.
- **Prod**: stable, instructor demo-ready.

Use separate resources or resource groups to reduce accidental impact.

## 3) Network and Security Basics

- Enforce HTTPS on public endpoints.
- Restrict DB firewall to app/service addresses.
- Grant least-privilege DB access for app identity.
- Avoid storing secrets in code or repo.

## 4) Deployment Flow

1. Developer merges approved PR to `main`.
2. CI pipeline builds project and runs checks/tests.
3. CI deploys to Dev environment.
4. Team validates behavior.
5. Manual or tagged promotion to Prod.

## 5) Initial Azure Resource Checklist

- [ ] Resource Group created.
- [ ] App Service or Container App created.
- [ ] Azure SQL Database created.
- [ ] Connection string configured as secret.
- [ ] App connected to database.
- [ ] Application Insights enabled.
- [ ] Basic smoke test run after deployment.

## 6) Risks and Mitigations

- **Risk:** wrong DB connection string in production.
  - **Mitigation:** separate secrets per environment and naming convention.
- **Risk:** breaking change merged into `main`.
  - **Mitigation:** branch protection + required reviews + tests.
- **Risk:** missing data initialization in cloud DB.
  - **Mitigation:** versioned migration scripts and documented run order.
