import { describe, it, expect } from "vitest"
import { playGame } from "../engine/playGame"
import { GameState } from "../types/GameState"

describe("Play Game Rules (RULE-PLAYGAME)", () => {

    it("plays until a winner is determined", () => {

        const state: GameState = {
            players: ["red", "blue"],
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
                { id: 5, player: "blue", position: { type: "track", index: 0 } }
            ]
        }

        const strategy = () => 0 // always pick first move

        const result = playGame(state, {
            red: strategy,
            blue: strategy
        })

        expect(result.winner).toBeDefined()

    })

    it("declares correct winner when all pawns reach home", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "blue", position: { type: "home" } },
                { id: 2, player: "blue", position: { type: "home" } },
                { id: 3, player: "blue", position: { type: "home" } },
                { id: 4, player: "blue", position: { type: "home" } }
            ]
        }

        const result = playGame(state, {
            red: () => 0,
            blue: () => 0
        })

        // ❗ MUST be blue, not first player
        expect(result.winner).toBe("blue")

    })

})