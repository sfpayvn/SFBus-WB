# SFBus-WB Copilot Instructions

## Architecture Overview

This is an Angular 19 + Tailwind CSS admin dashboard for bus management system. The project uses a modular lazy-loaded architecture with role-based access control and quota management.

### Key Technologies
- **Frontend**: Angular 19, Tailwind CSS 4, Angular Material, Ng-Zorro-Antd, Angular Signals
- **Charts**: ApexCharts with ng-apexcharts wrapper
- **Testing**: Playwright for E2E (use `npm run test:e2e`)
- **Build**: Standard Angular CLI with custom base-href for deployment

## Module Structure Pattern

### Feature Module Organization
- Each major feature lives in `src/app/modules/{feature-name}/`
- Nested modules follow pattern: `modules/management/modules/{specific-management}/`
- Example: Bus management is in `modules/management/modules/bus-management/`

### Module Dependencies
- Import `MangementModule` for shared management components
- Use `MaterialModule` from `library-modules/` for Material UI components
- Import `FilesCenterManagementModule` when file upload/management is needed

## API Gateway Pattern

### Service Structure
All HTTP requests go through `ApiGatewayService` (note: typo in filename `api-gateaway.service.ts`):

```typescript
// Standard usage with quota tracking
this.apiGateway.get('/endpoint', params, {
  feature: { module: 'bus-management', function: 'list-buses' },
  skipLoading: false
});
```

### Quota Management
- All API calls include `X-Feature-Module` and `X-Feature-Function` headers
- `QuotaInterceptor` handles rate limiting responses automatically
- Use `CapsService` to check quota status before expensive operations

## Authentication & State Management

### Auth Flow
1. Login through `AuthService.login()` → sets token in cookies
2. `APP_INITIALIZER` runs `AuthService.init()` on bootstrap
3. Current user stored in cookies via `CredentialService`
4. Menu permissions loaded through `MenuService.reloadPagesAndExpand()`

### Signal-Based State
- Use Angular Signals for reactive state (see `ThemeService.theme` signal)
- Theme persisted to localStorage with automatic DOM class updates

## Component Patterns

### Dialog Components
- Follow naming: `{Entity}DetailDialogComponent`
- Place in `component/` subdirectory within feature pages
- Import in module declarations array

### Layout Structure
- Main layout in `modules/layout/` with navbar, sidebar, footer
- Auto-scroll to top on route changes
- Menu configuration in `core/constants/menu-admin.ts` and `menu-teant.ts`

## Development Workflows

### Essential Commands
```bash
npm start              # Dev server with auto-open
npm run prettier       # Format all src files
npm run test:e2e       # Playwright E2E tests with UI
npm run build         # Production build with custom base-href
```

### Code Quality
- Prettier enforced with Tailwind class ordering plugin
- Use `npm run prettier:staged` for pre-commit formatting
- ESLint configured (`npm run lint`)

## Environment Configuration

### Environment Pattern
```typescript
// environments/environment.development.ts
export class environment extends Environment {
  public override production: boolean = false;
  public override domain: string = 'sf-workbench.com';
}
export const ENV: Environment = new environment();
```

Access via: `import { ENV } from 'src/environments/environment.development'`

## Testing Strategy

### E2E Testing
- Playwright config in `playwright.config.ts`
- Tests in `tests-e2e/` directory
- Use `data-test-id` attributes for element selection
- Target localhost:4200 by default

### Test Patterns
- Feature-based test files: `{feature}.e2e.spec.ts`
- Focus on user workflows across module boundaries
- Test auth flows and role-based access

## Common Patterns

### Loading States
- Use `skipLoading: true` in API options to bypass loading interceptor
- Default behavior shows loading indicators automatically

### Error Handling
- HTTP errors automatically caught by `ApiGatewayService.handleError()`
- Quota exceeded (429) errors show toast notifications
- Auth errors redirect through guard services

### File Naming Conventions
- Services: `{feature}.service.ts` (note: some have typos like `bus-schedules.servive.ts`)
- Components: `{feature}-{type}.component.ts`
- Modules: `{feature}.module.ts` and `{feature}-routing.module.ts`

## Integration Points

- **Cookie Management**: All auth/user data via `CredentialService` + `CookieService`
- **Theme System**: Signal-based with localStorage persistence
- **Menu System**: Role-driven menu loading via `MenuService`
- **File Uploads**: Centralized through `FilesCenterManagementModule`
- **Charts**: ApexCharts integration with custom SCSS in `src/styles/apexchart.scss`