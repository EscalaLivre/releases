# IPC INVENTORY

**Generated:** Sprint 01 — Baseline Snapshot  
**Purpose:** Complete inventory of all Electron IPC channels across services.

---

## Overview

| Metric | Value |
|---|---|
| Desktop IPC channels | 27 (25 handle + 2 push) |
| Activation Manager IPC channels | 45 |
| **Total** | **72** |


---

## 1. Desktop — EscalaDesktop (27 Channels)

### Channel Categories

| Category | Count | Channels |
|----------|-------|----------|
| App Lifecycle | 7 | app:get-info, app:get-versions, app:check-update, app:restart, app:quit, app:minimize, app:maximize |
| GitHub Integration | 7 | github:auth-start, github:auth-callback, github:get-session, github:get-repos, github:get-branches, github:get-commits, github:invalidate-session |
| Technical Admin | 11 | tech:status, tech:health, tech:metrics, tech:restart, tech:logs, tech:cleanup, tech:get-config, tech:set-config, tech:get-bridge-token, tech:validate-session, tech:get-audit |
| Events (Renderer → Main) | 2 | event:schedule-update, event:activation-change |

### Detailed Channel List

#### App Lifecycle Channels

| # | Channel | Direction | Purpose | Security |
|---|---------|-----------|---------|----------|
| 1 | `app:get-info` | Renderer → Main | Get app name, version, platform | Bridge Token |
| 2 | `app:get-versions` | Renderer → Main | Get Electron, Chrome, Node versions | Bridge Token |
| 3 | `app:check-update` | Renderer → Main | Check for available updates | Bridge Token |
| 4 | `app:restart` | Renderer → Main | Restart the application | Bridge Token |
| 5 | `app:quit` | Renderer → Main | Graceful shutdown | Bridge Token |
| 6 | `app:minimize` | Renderer → Main | Minimize window | Bridge Token |
| 7 | `app:maximize` | Renderer → Main | Toggle maximize | Bridge Token |

#### GitHub Integration Channels

| # | Channel | Direction | Purpose | Security |
|---|---------|-----------|---------|----------|
| 8 | `github:auth-start` | Renderer → Main | Start OAuth device flow | Bridge Token |
| 9 | `github:auth-callback` | Main → Renderer | OAuth completion notification | Bridge Token |
| 10 | `github:get-session` | Renderer → Main | Get current GitHub session | Bridge Token |
| 11 | `github:get-repos` | Renderer → Main | List user repositories | Bridge Token + Session |
| 12 | `github:get-branches` | Renderer → Main | List branches for a repo | Bridge Token + Session |
| 13 | `github:get-commits` | Renderer → Main | Get commit history | Bridge Token + Session |
| 14 | `github:invalidate-session` | Renderer → Main | Revoke GitHub session | Bridge Token |

#### Technical Admin Channels

| # | Channel | Direction | Purpose | Security |
|---|---------|-----------|---------|----------|
| 15 | `tech:status` | Renderer → Main | System status overview | Bridge + TechnicalAdmin |
| 16 | `tech:health` | Renderer → Main | Health check | Bridge + TechnicalAdmin |
| 17 | `tech:metrics` | Renderer → Main | System metrics (CPU, RAM) | Bridge + TechnicalAdmin |
| 18 | `tech:restart` | Renderer → Main | Restart backend service | Bridge + TechnicalAdmin |
| 19 | `tech:logs` | Renderer → Main | Retrieve logs | Bridge + TechnicalAdmin |
| 20 | `tech:cleanup` | Renderer → Main | Run cleanup tasks | Bridge + TechnicalAdmin |
| 21 | `tech:get-config` | Renderer → Main | Get runtime config | Bridge + TechnicalAdmin |
| 22 | `tech:set-config` | Renderer → Main | Update runtime config | Bridge + TechnicalAdmin |
| 23 | `tech:get-bridge-token` | Renderer → Main | Get bridge auth token | Bridge Token |
| 24 | `tech:validate-session` | Renderer → Main | Validate active session | Bridge Token |
| 25 | `tech:get-audit` | Renderer → Main | Fetch audit log | Bridge + TechnicalAdmin |

#### Event Channels

| # | Channel | Direction | Purpose | Security |
|---|---------|-----------|---------|----------|
| 26 | `event:schedule-update` | Main → Renderer | Notify schedule data changed | Bridge Token |
| 27 | `event:activation-change` | Main → Renderer | Notify activation status changed | Bridge Token |

---

## 2. Activation Manager (38 Channels)

### Channel Categories

| Category | Count |
|----------|-------|
| Customer Management | 8 |
| Installation Management | 7 |
| License Management | 8 |
| Audit Operations | 5 |
| Sync Operations (RegistrySync) | 6 |
| App Lifecycle | 4 |

### Detailed Channel List

#### Customer Management

| # | Channel | Direction | Purpose |
|---|---------|-----------|---------|
| 1 | `manager:customers:list` | Renderer → Main | List all customers |
| 2 | `manager:customers:get` | Renderer → Main | Get customer by ID |
| 3 | `manager:customers:create` | Renderer → Main | Create new customer |
| 4 | `manager:customers:update` | Renderer → Main | Update customer |
| 5 | `manager:customers:delete` | Renderer → Main | Delete customer |
| 6 | `manager:customers:search` | Renderer → Main | Search customers |
| 7 | `manager:customers:get-installations` | Renderer → Main | Get customer's installations |
| 8 | `manager:customers:get-licenses` | Renderer → Main | Get customer's licenses |

#### Installation Management

| # | Channel | Direction | Purpose |
|---|---------|-----------|---------|
| 9 | `manager:installations:list` | Renderer → Main | List all installations |
| 10 | `manager:installations:get` | Renderer → Main | Get installation by ID |
| 11 | `manager:installations:create` | Renderer → Main | Register new installation |
| 12 | `manager:installations:update` | Renderer → Main | Update installation |
| 13 | `manager:installations:deactivate` | Renderer → Main | Deactivate installation |
| 14 | `manager:installations:by-customer` | Renderer → Main | List by customer |
| 15 | `manager:installations:heartbeat` | Renderer → Main | Update last seen |

#### License Management

| # | Channel | Direction | Purpose |
|---|---------|-----------|---------|
| 16 | `manager:licenses:list` | Renderer → Main | List all licenses |
| 17 | `manager:licenses:get` | Renderer → Main | Get license by ID |
| 18 | `manager:licenses:create` | Renderer → Main | Create new license |
| 19 | `manager:licenses:update` | Renderer → Main | Update license |
| 20 | `manager:licenses:revoke` | Renderer → Main | Revoke license |
| 21 | `manager:licenses:validate` | Renderer → Main | Validate license key |
| 22 | `manager:licenses:redeem` | Renderer → Main | Redeem license key |
| 23 | `manager:licenses:by-customer` | Renderer → Main | List by customer |

#### Audit Operations

| # | Channel | Direction | Purpose |
|---|---------|-----------|---------|
| 24 | `manager:audit:list` | Renderer → Main | List audit events |
| 25 | `manager:audit:get` | Renderer → Main | Get audit event by ID |
| 26 | `manager:audit:by-entity` | Renderer → Main | Get events by entity |
| 27 | `manager:audit:by-date-range` | Renderer → Main | Get events in date range |
| 28 | `manager:audit:export` | Renderer → Main | Export audit log |

#### Sync Operations (RegistrySync)

| # | Channel | Direction | Purpose |
|---|---------|-----------|---------|
| 29 | `manager:sync:status` | Renderer → Main | Get sync status |
| 30 | `manager:sync:trigger` | Renderer → Main | Trigger manual sync |
| 31 | `manager:sync:history` | Renderer → Main | Get sync history |
| 32 | `manager:sync:config` | Renderer → Main | Get sync configuration |
| 33 | `manager:sync:update-config` | Renderer → Main | Update sync configuration |
| 34 | `manager:sync:conflicts` | Renderer → Main | Get sync conflicts |

#### App Lifecycle

| # | Channel | Direction | Purpose |
|---|---------|-----------|---------|
| 35 | `manager:app:info` | Renderer → Main | Get app information |
| 36 | `manager:app:version` | Renderer → Main | Get version |
| 37 | `manager:app:quit` | Renderer → Main | Quit application |
| 38 | `manager:app:minimize` | Renderer → Main | Minimize window |

---

## EscalaDesktopBridge Interface

The bridge is the security boundary between the Electron renderer and the main process.

```typescript
interface EscalaDesktopBridge {
  // App lifecycle
  getAppInfo(): Promise<AppInfo>;
  getAppVersions(): Promise<AppVersions>;
  checkForUpdate(): Promise<UpdateInfo>;
  restartApp(): Promise<void>;
  quitApp(): Promise<void>;
  minimizeWindow(): Promise<void>;
  maximizeWindow(): Promise<void>;

  // GitHub integration
  startGitHubAuth(): Promise<AuthResult>;
  onGitHubAuthCallback(callback: (result: AuthResult) => void): void;
  getGitHubSession(): Promise<GitHubSession | null>;
  getGitHubRepos(): Promise<GitHubRepo[]>;
  getGitHubBranches(owner: string, repo: string): Promise<GitHubBranch[]>;
  getGitHubCommits(owner: string, repo: string, branch: string, limit?: number): Promise<GitHubCommit[]>;
  invalidateGitHubSession(): Promise<void>;

  // Technical admin
  getSystemStatus(): Promise<SystemStatus>;
  getSystemHealth(): Promise<HealthStatus>;
  getSystemMetrics(): Promise<SystemMetrics>;
  restartBackend(): Promise<void>;
  getLogs(options?: LogOptions): Promise<LogEntry[]>;
  triggerCleanup(): Promise<CleanupResult>;
  getRuntimeConfig(): Promise<RuntimeConfig>;
  setRuntimeConfig(config: Partial<RuntimeConfig>): Promise<void>;
  getBridgeToken(): Promise<string>;
  validateSession(): Promise<boolean>;
  getAuditLog(options?: AuditOptions): Promise<AuditEntry[]>;

  // Events
  onScheduleUpdate(callback: (data: ScheduleUpdateEvent) => void): void;
  onActivationChange(callback: (data: ActivationChangeEvent) => void): void;
}
```

---

## Security Model Summary

| Layer | Mechanism | Scope |
|-------|-----------|-------|
| **Bridge Token** | Static token generated at startup | All IPC channels |
| **Session Token** | Per-session from backend JWT | GitHub + Technical channels |
| **TechnicalAdmin** | Role check on backend | Technical + GitHub config channels |
| **RegistrySync** | Internal only (no external IPC) | Activation Manager sync channels |
