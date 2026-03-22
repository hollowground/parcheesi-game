import { describe, it, expect } from "vitest"
import { playTurn } from "../engine/playTurn"

import { GameState } from "../types/GameState"

describe("PlayTurn - Doubles Behavior", () => {

    it("rolling doubles allows the player to take another turn", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3, 3], // doubles
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } }
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        // ✅ doubles counter should increase
        expect(finalState.consecutiveDoubles).toBe(1)

        // ✅ player should STILL be red (real reason now)
        expect(finalState.currentPlayer).toBe("red")

    })

    it("non-doubles should pass turn to next player", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3, 4], // NOT doubles
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } }
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        // ❗ should move to next player
        expect(finalState.currentPlayer).toBe("blue")

    })

})