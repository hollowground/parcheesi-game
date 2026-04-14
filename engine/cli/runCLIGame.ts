
import { playConsoleGame } from "./playConsoleGame"
import { GameState } from "../../types/GameState"

const initialGameState: GameState = {
    players: ["red", "blue", "green", "yellow"],
    currentPlayer: "red",
    pawns: [
        { id: 1, player: "red", position: { type: "start" } },
        { id: 2, player: "red", position: { type: "start" } },
        { id: 3, player: "red", position: { type: "start" } },
        { id: 4, player: "red", position: { type: "start" } },
        { id: 5, player: "blue", position: { type: "start" } },
        { id: 6, player: "blue", position: { type: "start" } },
        { id: 7, player: "blue", position: { type: "start" } },
        { id: 8, player: "blue", position: { type: "start" } },
        { id: 9, player: "green", position: { type: "start" } },
        { id: 10, player: "green", position: { type: "start" } },
        { id: 11, player: "green", position: { type: "start" } },
        { id: 12, player: "green", position: { type: "start" } },
        { id: 13, player: "yellow", position: { type: "start" } },
        { id: 14, player: "yellow", position: { type: "start" } },
        { id: 15, player: "yellow", position: { type: "start" } },
        { id: 16, player: "yellow", position: { type: "start" } }
    ],
    dice: [],
    usedDice: [],
    bonusMoves: [],
    consecutiveDoubles: 0
}

playConsoleGame(initialGameState)