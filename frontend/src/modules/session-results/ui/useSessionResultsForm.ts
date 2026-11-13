// src/modules/session-results/ui/useSessionResultsForm.ts
// Toute la logique de la saisie : lignes du tableau (une grille par session), validation,
// confirmation, envoi. La page ne fait que brancher ; ConfirmDialog ne fait qu'afficher.
import { useState } from 'react'
import type {
  ResultStatus,
  SessionResultEntry,
  SessionType,
} from '../domain/SessionResult'
import {
  validateSessionResults,
  type SaveSessionResults,
} from '../application/SaveSessionResults'
import { SESSION_LABEL } from './labels'

export interface ResultRow {
  position: number
  fimNumber: string | null
  statut: ResultStatus
}

const BASE_ROWS = 22
const MAX_ROWS = 24 // 22 pilotes + 2 wildcards

const emptyRows = (): ResultRow[] =>
  Array.from({ length: MAX_ROWS }, (_, index) => ({
    position: index + 1,
    fimNumber: null,
    statut: 'FINISHED',
  }))

interface Options {
  eventId: string
  eventName: string
  saveSessionResults: SaveSessionResults
}

export function useSessionResultsForm({
  eventId,
  eventName,
  saveSessionResults,
}: Options) {
  const [sessionType, setSessionType] = useState<SessionType>('RACE')
  const [withWildcards, setWithWildcards] = useState(false)
  // Une grille par session : changer de session ne fait perdre aucune saisie.
  const [rowsBySession, setRowsBySession] = useState<
    Record<SessionType, ResultRow[]>
  >(() => ({ SPRINT: emptyRows(), RACE: emptyRows() }))

  // null = modale fermée
  const [pending, setPending] = useState<{
    sessionType: SessionType
    entries: SessionResultEntry[]
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null) // dans la modale
  const [formError, setFormError] = useState<string | null>(null) // validation
  const [notice, setNotice] = useState<string | null>(null) // succès

  const rows = rowsBySession[sessionType].slice(
    0,
    withWildcards ? MAX_ROWS : BASE_ROWS,
  )

  // Pilotes déjà placés : la page les désactive dans les autres listes.
  const assigned = new Set(
    rows.map((row) => row.fimNumber).filter((fim): fim is string => fim !== null),
  )

  const clearMessages = () => {
    setFormError(null)
    setNotice(null)
  }

  const updateRow = (position: number, patch: Partial<ResultRow>) => {
    clearMessages()
    setRowsBySession((previous) => ({
      ...previous,
      [sessionType]: previous[sessionType].map((row) =>
        row.position === position ? { ...row, ...patch } : row,
      ),
    }))
  }

  const selectRider = (position: number, fimNumber: string | null) =>
    updateRow(position, { fimNumber })

  const setStatus = (position: number, statut: ResultStatus) =>
    updateRow(position, { statut })

  const changeSession = (type: SessionType) => {
    clearMessages()
    setSessionType(type)
  }

  // Valide, puis ouvre la modale de confirmation.
  const requestSave = () => {
    const entries: SessionResultEntry[] = []
    for (const row of rows) {
      if (row.fimNumber !== null) {
        entries.push({
          fimNumber: row.fimNumber,
          typeSession: sessionType,
          statut: row.statut,
          position: row.position,
        })
      }
    }

    const problem = validateSessionResults(entries)
    if (problem) {
      setFormError(problem)
      return
    }

    clearMessages()
    setSendError(null)
    setPending({ sessionType, entries })
  }

  // Fermer pendant l'envoi laisserait un état incohérent : on l'interdit.
  const cancel = () => {
    if (isSubmitting) return
    setPending(null)
    setSendError(null)
  }

  const confirm = async () => {
    if (!pending || isSubmitting) return
    setIsSubmitting(true)
    setSendError(null)
    try {
      await saveSessionResults(eventId, pending.entries)
      // Succès : on vide la grille de cette session, pour ne pas la renvoyer deux fois.
      setRowsBySession((previous) => ({
        ...previous,
        [pending.sessionType]: emptyRows(),
      }))
      setNotice(
        `${SESSION_LABEL[pending.sessionType]} enregistré(e) : ${pending.entries.length} pilote(s).`,
      )
      setPending(null)
    } catch (error) {
      // La modale reste ouverte et affiche la raison (ex. 400 du back).
      setSendError(
        error instanceof Error ? error.message : 'Une erreur est survenue.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    sessionType,
    changeSession,
    withWildcards,
    setWithWildcards,
    rows,
    assigned,
    selectRider,
    setStatus,
    requestSave,
    formError,
    notice,
    dialogProps: {
      open: pending !== null,
      title: 'Enregistrer les résultats',
      message: pending
        ? `${SESSION_LABEL[pending.sessionType]} de « ${eventName} » : ${pending.entries.length} pilote(s) classé(s). Enregistrer ?`
        : '',
      confirmLabel: 'Enregistrer',
      isSubmitting,
      error: sendError,
      onConfirm: confirm,
      onCancel: cancel,
    },
  }
}
