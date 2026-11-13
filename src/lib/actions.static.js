// Static (GitHub Pages) build: there is no server, so there is no cache to refresh.
// next.config.mjs aliases '@/lib/actions' to this file when STATIC_EXPORT=true.
export async function refreshContent() {
  return { ok: true, tags: [], static: true };
}
