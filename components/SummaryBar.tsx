export function SummaryBar() {
  return (
    <div className="flex flex-col gap-3 text-slate-300">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
        Okestro CMP
      </p>
      <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
        Spatial Resource View
      </h1>
      <p className="max-w-2xl text-sm text-slate-400">
        Explore CMP domains in a single volumetric canvas. Hover or rotate to see how
        services stack across platform, services, and automation layers.
      </p>
    </div>
  )
}

