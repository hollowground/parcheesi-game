export type PlayerColor = 'red' | 'blue' | 'yellow' | 'green'

export interface Pawn {
    id: number
    player: PlayerColor
    position: Position
}

export type Position =
    | { type: 'start' }
    | { type: 'track', index: number }
    | { type: 'homeLane', index: number }
    | { type: 'home' }

export interface GameState {
    players: PlayerColor[]
    pawns: Pawn[]

    currentPlayer: PlayerColor

    dice: number[]
    usedDice: number[]

    winner?: PlayerColor
}