export interface Rider {
    readonly id: string,
    readonly fimNumber: string,
    readonly nom: string,
    readonly prenom: string,
    readonly pays: string,
    readonly dateAnniversaire: Date,
    readonly photo: string,
}