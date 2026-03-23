import { describe, it, expect } from "vitest"
import { checkWinner } from "../engine/checkWinner"
import { GameState } from "../types/GameState"

describe("checkWinner", () => {
    it("returns player when all 4 pawns are home", () => {
        const state: GameState = {
            players: ["red"],
            currentPlayer: "red",
            dice: [],
            usedDice: [],
            bonusMoves: [],
            consecutiveDoubles: 0,
            pawns: [
                { id: 1, player: "red", position: { type: "home" } },
                { id: 2, player: "red", position: { type: "home" } },
                { id: 3, player: "red", position: { type: "home" } },
                { id: 4, player: "red", position: { type: "home" } },
            ]
        }

        expect(checkWinner(state)).toBe("red")
    })
})