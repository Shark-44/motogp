import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RiderStanding } from '../domain/RiderStanding'
import type { GetRiderStanding } from '../application/Getrider_standing'
import { buildStandingsChart } from './buildStandingsChart'
import { useRiderStandings } from './useRiderStanding'

interface RiderStandingsPageProps {
  getRiderStanding: GetRiderStanding
}

function RiderStandingsPage({ getRiderStanding }: RiderStandingsPageProps) {
  const state = useRiderStandings(getRiderStanding)

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-white!">Classement pilotes</h1>

      {state.status === 'loading' && (
        <p role="status" className="text-muted-foreground">Chargement du classement…</p>
      )}

      {state.status === 'error' && (
        <p role="alert" className="text-destructive">
          {state.message} Vérifie que le backend est démarré, puis recharge la page.
        </p>
      )}

      {state.status === 'success' && state.standings.length === 0 && (
        <p className="text-muted-foreground">Aucun classement disponible.</p>
      )}

      {state.status === 'success' && state.standings.length > 0 && (
        <StandingsChart standings={state.standings} />
      )}
    </main>
  )
}

function StandingsChart({ standings }: { standings: RiderStanding[] }) {
  const { data, config, riderIds, maxPosition } = buildStandingsChart(standings)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution par Grand Prix (top 10)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[400px] w-full">
          <LineChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: -15 }}>
            <CartesianGrid
              vertical
              horizontal={false}
              verticalCoordinatesGenerator={({ offset, width }) => {
                const left = offset?.left ?? 0
                const total = offset?.width ?? width
              return Array.from(
              { length: data.length + 1 },
              (_, i) => left + (i * total) / data.length,
              )
              }}
            />
            <XAxis
              dataKey="event"
              scale="band"
              interval={0}
              angle={-20}
              textAnchor= "middle"
              height={90}
              tickLine={false}
              axisLine={false}
              tickMargin={30}
            />
            <YAxis
              reversed
              domain={[1, maxPosition]}
              allowDecimals={false}
              interval={0}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {riderIds.map((id) => (
              <Line
                key={id}
                dataKey={id}
                type="linear"
                stroke={`var(--color-${id})`}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default RiderStandingsPage