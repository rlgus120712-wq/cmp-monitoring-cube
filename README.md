# Okestro Cost Navigator

An interactive 3D monitoring experience that visualises CMP resource health on a cube-based scene. Built with **Next.js 14**, **React Three Fiber**, and **Zustand** to showcase FinOps insights, anomaly alerts, and optimisation recommendations for Okestro customers.

## Features

- 🎛️ **Cube Monitoring Scene** – Orbit a 3D cube and inspect each face to see compute, storage, network, security and FinOps KPIs.
- 📈 **Live Summary Bar** – Aggregated cost, forecast variance, anomaly count, and governance posture at a glance.
- 💡 **Actionable Insights** – Each face highlights recommended remediations, recent changes, and policy status.
- ⚡ **Real-Time Ready** – Structured state store and API route ready to plug into actual CMP telemetry.

## Getting Started

```bash
# install dependencies
npm install

# run development server
npm run dev

# build static output for production
npm run build

# optional: export & preview static files
npm run export
npx serve out
```

Then open <http://localhost:3000> and explore the interactive monitoring cube.

## Project Structure

```
app/
  page.tsx                # main dashboard shell
components/
  CubeScene.tsx           # 3D cube visualisation
  SummaryBar.tsx          # top KPI bar
  ResourcePanel.tsx       # side detail panel
lib/
  mockData.ts             # sample metrics
  types.ts                # shared TypeScript interfaces
stores/
  resourceStore.ts        # zustand store for cube state
```

## Deployment

- **GitHub Pages**: the repo includes `.github/workflows/pages.yml`, which builds the static export and publishes to Pages on every push to `main`.  
  - In repository settings, set **Pages → Build and deployment** to **GitHub Actions** before the first run.  
  - The workflow sets `GITHUB_PAGES=true` and uploads the `out/` directory from `npm run build`.

- **Other hosts**: any static host (S3, CloudFront, Netlify, etc.) can serve the files inside `out/`.

> 手動で `npm run build` 또는 `npm run export` 를 실행하여 GitHub Pages용 산출물을 생성하려면 `GITHUB_PAGES=true npm run build` 처럼 환경변수를 함께 지정해야 기본 경로(`/cmp-monitoring-cube`)가 반영됩니다.

## Next Steps

- Replace mock API with real Okestro CMP telemetry & FinOps data.
- Extend cube visualisation with heatmaps and time-travel timeline.
- Wire anomaly alerts to Slack / Teams webhooks and ticketing workflows.
- Harden auth & RBAC once integrated into production CMP portal.

---

© 2025 Okestro – AI-driven cloud governance experiences.


