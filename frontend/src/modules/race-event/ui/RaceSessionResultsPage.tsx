import React, { useState } from 'react';
import type { Rider } from '@/modules/riders/domain/Riders';

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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Enregistrement des Résultats de Session</h1>
        <p style={styles.subtitle}>Saisie du classement Sprint et Race</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div style={styles.configCard}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Type de Session :</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value as SessionType)}
              style={styles.select}
            >
              <option value="SPRINT">Sprint Race</option>
              <option value="RACE">Course Principale (Race)</option>
            </select>
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Pos.</th>
                <th style={styles.th}>N° FIM / Pilote</th>
                <th style={styles.th}>Écurie</th>
                <th style={styles.th}>Statut / Incidents</th>
                <th style={styles.th}>Remarques (ex: Chute)</th>
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
                    style={{
                      ...styles.tr,
                      backgroundColor: row.status === 'DNF' ? '#FFF0F0' : 'transparent'
                    }}
                  >
                    <td style={styles.tdPos}>P{row.position}</td>
                    <td style={styles.td}>
                      <select
                        value={row.fimNumber ?? ''}
                        onChange={(e) =>
                          handleSelectPilot(
                            row.position,
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                        style={styles.selectPilot}
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
                    <td style={styles.tdTeam}>
                      {currentPilot ? currentPilot.team ?? '-' : '-'}
                    </td>
                    <td style={styles.td}>
                      <select
                        value={row.status}
                        onChange={(e) =>
                          handleStatusChange(
                            row.position,
                            e.target.value as PilotStatus
                          )
                        }
                        style={{
                          ...styles.selectStatus,
                          borderColor: row.status === 'DNF' ? '#E53E3E' : '#CBD5E0'
                        }}
                      >
                        <option value="FINISHED">Classé / Arrivé</option>
                        <option value="DNF">Abandon (DNF / Chute)</option>
                        <option value="DSQ">Disqualifié (DSQ)</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <input
                        type="text"
                        placeholder={row.status === 'DNF' ? 'Ex: Chute T3, Panne Moteur...' : 'Note optionnelle...'}
                        value={row.notes}
                        onChange={(e) =>
                          handleNotesChange(row.position, e.target.value)
                        }
                        style={styles.inputNotes}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={styles.actions}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={styles.submitBtn}
          >
            {isSubmitting ? 'Enregistrement...' : `Valider les résultats (${sessionType})`}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1A202C'
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096'
  },
  configCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '16px',
    backgroundColor: '#F7FAFC',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    marginBottom: '20px'
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  label: {
    fontWeight: '600',
    fontSize: '14px'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #CBD5E0',
    backgroundColor: '#FFF'
  },
  tableWrapper: {
    overflowX: 'auto',
    border: '1px solid #E2E8F0',
    borderRadius: '8px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    backgroundColor: '#EDF2F7',
    padding: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#4A5568'
  },
  tr: {
    borderBottom: '1px solid #E2E8F0'
  },
  tdPos: {
    padding: '12px',
    fontWeight: '700',
    width: '60px',
    color: '#2B6CB0'
  },
  tdTeam: {
    padding: '12px',
    fontSize: '13px',
    color: '#718096'
  },
  td: {
    padding: '10px 12px'
  },
  selectPilot: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #CBD5E0'
  },
  selectStatus: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #CBD5E0'
  },
  inputNotes: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #CBD5E0',
    fontSize: '13px'
  },
  actions: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  submitBtn: {
    padding: '12px 24px',
    backgroundColor: '#3182CE',
    color: '#FFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default RaceSessionResultsPage;