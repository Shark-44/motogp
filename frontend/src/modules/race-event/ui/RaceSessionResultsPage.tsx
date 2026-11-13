import React, { useState } from 'react';

export interface Pilot {
  fimNumber: number;
  name: string;
  team: string;
  isWildcard?: boolean;
}

export type SessionType = 'SPRINT' | 'RACE';
export type PilotStatus = 'FINISHED' | 'DNF' | 'DSQ';

export interface ResultEntry {
  position: number;
  fimNumber: number | null;
  status: PilotStatus;
  notes?: string;
}

// Grille de référence des 22 pilotes officiels + 2 Wildcards
const INITIAL_PILOTS: Pilot[] = [
  { fimNumber: 1, name: "Francesco Bagnaia", team: "Ducati Lenovo Team" },
  { fimNumber: 89, name: "Jorge Martín", team: "Prima Pramac Racing" },
  { fimNumber: 93, name: "Marc Márquez", team: "Gresini Racing" },
  { fimNumber: 72, name: "Marco Bezzecchi", team: "Pertamina Enduro VR46" },
  { fimNumber: 12, name: "Maverick Viñales", team: "Aprilia Racing" },
  { fimNumber: 41, name: "Aleix Espargaró", team: "Aprilia Racing" },
  { fimNumber: 33, name: "Brad Binder", team: "Red Bull KTM Factory" },
  { fimNumber: 31, name: "Pedro Acosta", team: "Red Bull GASGAS Tech3" },
  { fimNumber: 20, name: "Fabio Quartararo", team: "Monster Energy Yamaha" },
  { fimNumber: 42, name: "Álex Rins", team: "Monster Energy Yamaha" },
  { fimNumber: 36, name: "Joan Mir", team: "Repsol Honda Team" },
  { fimNumber: 10, name: "Luca Marini", team: "Repsol Honda Team" },
  { fimNumber: 5, name: "Johann Zarco", team: "LCR Honda Castrol" },
  { fimNumber: 30, name: "Takaaki Nakagami", team: "LCR Honda Idemitsu" },
  { fimNumber: 49, name: "Fabio Di Giannantonio", team: "Pertamina Enduro VR46" },
  { fimNumber: 73, name: "Álex Márquez", team: "Gresini Racing" },
  { fimNumber: 21, name: "Franco Morbidelli", team: "Prima Pramac Racing" },
  { fimNumber: 23, name: "Enea Bastianini", team: "Ducati Lenovo Team" },
  { fimNumber: 25, name: "Raúl Fernández", team: "Trackhouse Racing" },
  { fimNumber: 88, name: "Miguel Oliveira", team: "Trackhouse Racing" },
  { fimNumber: 43, name: "Jack Miller", team: "Red Bull KTM Factory" },
  { fimNumber: 37, name: "Augusto Fernández", team: "Red Bull GASGAS Tech3" },
  // Wildcards optionnels
  { fimNumber: 26, name: "Dani Pedrosa", team: "Red Bull KTM (Wildcard)", isWildcard: true },
  { fimNumber: 32, name: "Lorenzo Savadori", team: "Aprilia Test Team (Wildcard)", isWildcard: true }
];

export const RaceSessionResultsPage: React.FC = () => {
  const [sessionType, setSessionType] = useState<SessionType>('RACE');
  const [includeWildcards, setIncludeWildcards] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Nombre total de places selon les wildcards (22 ou 24)
  const maxPilots = includeWildcards ? 24 : 22;

  // Initialisation des lignes du tableau de résultat
  const [results, setResults] = useState<ResultEntry[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({
      position: i + 1,
      fimNumber: null,
      status: 'FINISHED',
      notes: ''
    }))
  );

  const availablePilots = INITIAL_PILOTS.filter(
    (p) => includeWildcards || !p.isWildcard
  );

  const handleSelectPilot = (position: number, fimNumber: number | null) => {
    setResults((prev) =>
      prev.map((item) => {
        if (item.position === position) {
          return { ...item, fimNumber };
        }
        // Si le pilote était déjà attribué ailleurs, on le libère de l'ancienne position
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
    
    // Simulation d'un appel API/Use-case applicatif
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Session ${sessionType} enregistrée avec succès !`);
    }, 600);
  };

  // Récupération des N° FIM déjà attribués pour bloquer les doublons dans les menus déroulants
  const assignedFimNumbers = new Set(
    results.slice(0, maxPilots).map((r) => r.fimNumber).filter(Boolean)
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Enregistrement des Résultats de Session</h1>
        <p style={styles.subtitle}>Saisie du classement Sprint et Race</p>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Barre d'options de la Session */}
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

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={includeWildcards}
                onChange={(e) => setIncludeWildcards(e.target.checked)}
                style={styles.checkbox}
              />
              Activer les Wildcards (+2 Pilotes / Total: 24)
            </label>
          </div>
        </div>

        {/* Tableau des Résultats */}
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
                  (p) => p.fimNumber === row.fimNumber
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
                          const isAssigned =
                            assignedFimNumbers.has(pilot.fimNumber) &&
                            pilot.fimNumber !== row.fimNumber;
                          return (
                            <option
                              key={pilot.fimNumber}
                              value={pilot.fimNumber}
                              disabled={isAssigned}
                            >
                              #{pilot.fimNumber} - {pilot.name}{" "}
                              {pilot.isWildcard ? "(WC)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td style={styles.tdTeam}>
                      {currentPilot ? currentPilot.team : '-'}
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
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  checkboxLabel: {
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  checkbox: {
    width: '16px',
    height: '16px'
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