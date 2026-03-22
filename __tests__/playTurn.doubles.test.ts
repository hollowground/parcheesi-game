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

    it("triple doubles ends turn and sends farthest pawn to start", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [2, 2], // doubles
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 2, // already rolled doubles twice

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "red", position: { type: "track", index: 20 } } // farthest
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        // ❗ farthest pawn should be sent back
        const pawn2 = finalState.pawns.find(p => p.id === 2)!
        expect(pawn2.position.type).toBe("start")

        // ❗ turn should pass (penalty ends turn)
        expect(finalState.currentPlayer).toBe("blue")

        // ❗ reset doubles counter
        expect(finalState.consecutiveDoubles).toBe(0)

    })

})