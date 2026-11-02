export interface RiderStanding {
    readonly piloteId: string;
    readonly eventId: string;
    readonly pointsCumules: number;
    readonly positionGenerale: number;
    readonly nom?: string;
    readonly prenom?: string;
    readonly photo?: string;
    readonly nomEvent?: string;
    readonly dateEvent?: Date;
    readonly circuitEvent?: string;
    readonly nomCircuit?: string;
    readonly paysCircuit?: string;
}