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
pnpm install

# run development server
pnpm dev

# build for production
pnpm build
pnpm start
```

Then open <http://localhost:3000> and explore the interactive monitoring cube.

## Project Structure

```
app/
  api/resources/route.ts  # mock API with CMP resource metrics
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

## Next Steps

- Replace mock API with real Okestro CMP telemetry & FinOps data.
- Extend cube visualisation with heatmaps and time-travel timeline.
- Wire anomaly alerts to Slack / Teams webhooks and ticketing workflows.
- Harden auth & RBAC once integrated into production CMP portal.
- Configure GitHub Secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) to enable auto-deploy via the included workflow.

---

© 2025 Okestro – AI-driven cloud governance experiences.


