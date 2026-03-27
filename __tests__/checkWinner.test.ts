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

    it("does NOT declare winner with only 3 pawns home", () => {

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
                { id: 4, player: "red", position: { type: "track", index: 10 } },
            ]
        }

        expect(checkWinner(state)).toBeUndefined()

    })

    it("does NOT count homeLane as finished", () => {

        const state: GameState = {
            players: ["red"],
            currentPlayer: "red",
            dice: [],
            usedDice: [],
            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "homeLane", index: 6 } },
                { id: 2, player: "red", position: { type: "home" } },
                { id: 3, player: "red", position: { type: "home" } },
                { id: 4, player: "red", position: { type: "home" } },
            ]
        }

        expect(checkWinner(state)).toBeUndefined()

    })

    it("correctly identifies winner among multiple players", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",
            dice: [],
            usedDice: [],
            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                // red incomplete
                { id: 1, player: "red", position: { type: "home" } },
                { id: 2, player: "red", position: { type: "home" } },
                { id: 3, player: "red", position: { type: "track", index: 5 } },
                { id: 4, player: "red", position: { type: "track", index: 10 } },

                // blue complete
                { id: 5, player: "blue", position: { type: "home" } },
                { id: 6, player: "blue", position: { type: "home" } },
                { id: 7, player: "blue", position: { type: "home" } },
                { id: 8, player: "blue", position: { type: "home" } },
            ]
        }

        expect(checkWinner(state)).toBe("blue")

    })
})