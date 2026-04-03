import { GameState, PlayerColor } from "../../types/GameState"

export type StrategyContext = {
    state: GameState
    player: PlayerColor
    moves: any[]
}

export type Strategy = (context: StrategyContext) => number