import React, { useState } from 'react';
import type { Rider } from '@/modules/riders/domain/Riders';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';

export type SessionType = 'SPRINT' | 'RACE';
export type PilotStatus = 'FINISHED' | 'DNF' | 'DSQ';

export interface ResultEntry {
  position: number;
  fimNumber: number | null;
  status: PilotStatus;
  notes?: string;
}

// Extension locale si ton type Rider du domaine n'expose pas encore name/team
interface DisplayRider extends Rider {
  name?: string;
  team?: string;
}

interface RidersPageProps {
  getRiders: Rider[];
}

// Les mêmes classes pour tous les champs : un seul endroit à changer pour le style.
const fieldClass =
  'w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground';

export const RaceSessionResultsPage = ({ getRiders }: RidersPageProps) => {
  const [sessionType, setSessionType] = useState<SessionType>('RACE');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const INITIAL_PILOTS: DisplayRider[] = getRiders;
  const maxPilots = INITIAL_PILOTS.length > 0 ? INITIAL_PILOTS.length : 22;

  const [results, setResults] = useState<ResultEntry[]>(() =>
    Array.from({ length: maxPilots }, (_, i) => ({
      position: i + 1,
      fimNumber: null,
      status: 'FINISHED',
      notes: ''
    }))
  );

  const availablePilots = INITIAL_PILOTS;

  const handleSelectPilot = (position: number, fimNumber: number | null) => {
    setResults((prev) =>
      prev.map((item) => {
        if (item.position === position) {
          return { ...item, fimNumber };
        }
        if (fimNumber !== null && item.fimNumber === fimNumber) {
          return { ...item, fimNumber: null };
        }
        return item;
      })
    );
  };

  const handleStatusChange = (position: number, status: PilotStatus) => {
    setResults((prev) =>
      prev.map((item) =>
        item.position === position ? { ...item, status } : item
      )
    );
  };

  const handleNotesChange = (position: number, notes: string) => {
    setResults((prev) =>
      prev.map((item) =>
        item.position === position ? { ...item, notes } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const activeResults = results.slice(0, maxPilots);
    const payload = {
      sessionType,
      totalDrivers: maxPilots,
      results: activeResults.filter((r) => r.fimNumber !== null)
    };

    console.log("Payload session envoyé :", payload);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Session ${sessionType} enregistrée avec succès !`);
    }, 600);
  };

  const assignedFimNumbers = new Set(
    results
      .slice(0, maxPilots)
      .map((r) => (r.fimNumber !== null ? Number(r.fimNumber) : null))
      .filter((num): num is number => num !== null)
  );

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white!">
          Enregistrement des Résultats de Session
        </h1>
        <p className="text-sm text-white/70">Saisie du classement Sprint et Race</p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <CardContent className="flex flex-wrap items-center gap-3">
            <label htmlFor="session-type" className="text-sm font-semibold">
              Type de Session :
            </label>
            <select
              id="session-type"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value as SessionType)}
              className={cn(fieldClass, 'w-auto')}
            >
              <option value="SPRINT">Sprint Race</option>
              <option value="RACE">Course Principale (Race)</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="h-10 px-3 font-medium">Pos.</th>
                  <th className="h-10 px-3 font-medium">N° FIM / Pilote</th>
                  <th className="h-10 px-3 font-medium">Écurie</th>
                  <th className="h-10 px-3 font-medium">Statut / Incidents</th>
                  <th className="h-10 px-3 font-medium">Remarques (ex: Chute)</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, maxPilots).map((row) => {
                  const currentPilot = availablePilots.find(
                    (p) => Number(p.fimNumber) === Number(row.fimNumber)
                  );

                  return (
                    <tr
                      key={row.position}
                      className={cn(
                        'border-b border-border/50 transition-colors last:border-0',
                        row.status === 'DNF' ? 'bg-destructive/10' : 'hover:bg-muted/50'
                      )}
                    >
                      <td className="w-16 p-3 font-bold">P{row.position}</td>
                      <td className="p-2">
                        <select
                          aria-label={`Pilote en position ${row.position}`}
                          value={row.fimNumber ?? ''}
                          onChange={(e) =>
                            handleSelectPilot(
                              row.position,
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                          className={fieldClass}
                        >
                          <option value="">-- Sélectionner Pilote --</option>
                          {availablePilots.map((pilot) => {
                            const pilotNum = Number(pilot.fimNumber);
                            const isAssigned =
                              assignedFimNumbers.has(pilotNum) &&
                              pilotNum !== Number(row.fimNumber);
                            return (
                              <option
                                key={pilot.fimNumber}
                                value={pilot.fimNumber}
                                disabled={isAssigned}
                              >
                                #{pilot.fimNumber} - {pilot.name ?? ''}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {currentPilot ? currentPilot.team ?? '-' : '-'}
                      </td>
                      <td className="p-2">
                        <select
                          aria-label={`Statut en position ${row.position}`}
                          value={row.status}
                          onChange={(e) =>
                            handleStatusChange(
                              row.position,
                              e.target.value as PilotStatus
                            )
                          }
                          className={cn(
                            fieldClass,
                            row.status === 'DNF' && 'border-destructive'
                          )}
                        >
                          <option value="FINISHED">Classé / Arrivé</option>
                          <option value="DNF">Abandon (DNF / Chute)</option>
                          <option value="DSQ">Disqualifié (DSQ)</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          aria-label={`Remarque en position ${row.position}`}
                          placeholder={row.status === 'DNF' ? 'Ex: Chute T3, Panne Moteur...' : 'Note optionnelle...'}
                          value={row.notes}
                          onChange={(e) =>
                            handleNotesChange(row.position, e.target.value)
                          }
                          className={fieldClass}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'bg-red-600 font-semibold text-white hover:bg-red-700 disabled:opacity-50'
            )}
          >
            {isSubmitting ? 'Enregistrement...' : `Valider les résultats (${sessionType})`}
          </button>
        </div>
      </form>
    </main>
  );
};

export default RaceSessionResultsPage;
