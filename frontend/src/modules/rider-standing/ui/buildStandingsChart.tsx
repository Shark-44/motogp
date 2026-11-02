import type { ChartConfig } from "@/components/ui/chart";
import type { RiderStanding } from "../domain/RiderStanding";

const TOP_N = 10;

type ChartRow = { event: string } & Record<string, string | number>;

export function buildStandingsChart(standings: RiderStanding[]) {
  // 1. Les GP, triés par date (new Date() accepte Date ET string venant du JSON)
  const eventsById = new Map<string, { label: string; time: number }>();
  for (const s of standings) {
    if (!eventsById.has(s.eventId)) {
      eventsById.set(s.eventId, {
        label: s.nomEvent ?? s.eventId,
        time: s.dateEvent ? new Date(s.dateEvent).getTime() : 0,
      });
    }
  }
  const sortedEvents = [...eventsById.entries()].sort(
    (a, b) => a[1].time - b[1].time,
  );
  const lastEventId = sortedEvents.at(-1)?.[0];

  // 2. Le top 10 = les 10 premiers au DERNIER GP
  const topRiders = standings
    .filter((s) => s.eventId === lastEventId)
    .sort((a, b) => a.positionGenerale - b.positionGenerale)
    .slice(0, TOP_N);
  const topIds = new Set(topRiders.map((r) => r.piloteId));

  // 3. Le pivot : une ligne par GP, une clé par pilote
  const rows = new Map<string, ChartRow>(
    sortedEvents.map(([id, e]) => [id, { event: e.label }]),
  );
  let maxPosition = TOP_N;
  for (const s of standings) {
    if (!topIds.has(s.piloteId)) continue;
    rows.get(s.eventId)![s.piloteId] = s.positionGenerale;
    maxPosition = Math.max(maxPosition, s.positionGenerale);
  }

  // 4. La config shadcn : libellé + couleur par pilote
  const config: ChartConfig = Object.fromEntries(
    topRiders.map((r, i) => [
      r.piloteId,
      {
        label: `${r.prenom ?? ""} ${r.nom ?? r.piloteId}`.trim(),
        color: `hsl(${i * 36} 70% 50%)`,
      },
    ]),
  );

  return {
    data: [...rows.values()],
    config,
    riderIds: topRiders.map((r) => r.piloteId),
    maxPosition,
  };
}