// Composition root : le seul endroit qui connaît à la fois les adaptateurs
// et les cas d'usage. Les modules n'importent jamais ce fichier ;
// c'est le routeur qui passe les cas d'usage aux pages en props.
import { createGetCircuits } from '../modules/circuits/application/Getcircuits'
import { createHttpCircuitRepository } from '../modules/circuits/infrastructure/HttpCircuitRepository'

const circuitRepository = createHttpCircuitRepository()

export const getCircuits = createGetCircuits(circuitRepository)

