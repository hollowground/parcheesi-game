import { playConsoleGame } from "./playConsoleGame"
import { GameState } from "../../types/GameState"

function createPawns() {
    const players = ["red", "blue", "green", "yellow"] as const
    let id = 1

    return players.flatMap(player =>
        Array.from({ length: 4 }, () => ({
            id: id++,
            player,
            position: { type: "start" as const }
        }))
    )
}

const initialGameState: GameState = {
    players: ["red", "blue", "green", "yellow"],
    currentPlayer: "red",
    pawns: createPawns(),
    dice: [],
    usedDice: [],
    bonusMoves: [],
    consecutiveDoubles: 0
}

playConsoleGame(initialGameState)