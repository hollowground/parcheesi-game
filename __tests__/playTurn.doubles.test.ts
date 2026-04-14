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

        const finalState = playTurn(state, (moves) => moves[0]!,{ autoEndTurn: true })
        console.log("Final state after rolling doubles:", finalState)

        // ✅ doubles counter should increase
        expect(finalState.consecutiveDoubles).toBe(1)

        // ✅ player should STILL be red (real reason now)
        expect(finalState.currentPlayer).toBe("red")

    })

    it("non-doubles should pass turn to next player", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3,4], // NOT doubles
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } }
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!,{ autoEndTurn: true })
        console.log("Final state after rolling non-doubles:", finalState.pawns)

        // ❗ should move to next player
        expect(finalState.currentPlayer).toBe("blue")

    })

    it("triple doubles ends turn and sends farthest pawn to start", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [2, 2],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 2,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "red", position: { type: "track", index: 20 } } // farthest
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        const pawn1 = finalState.pawns.find(p => p.id === 1)!
        const pawn2 = finalState.pawns.find(p => p.id === 2)!

        // ✅ ensure ONLY farthest pawn reset
        expect(pawn2.position).toEqual({ type: "start" })
        expect(pawn1.position.type).toBe("track")

        // ✅ ensure it actually changed
        expect(state.pawns[1]!.position.type).toBe("track")

        // ✅ turn must pass
        expect(finalState.currentPlayer).toBe("blue")

        // ✅ doubles reset
        expect(finalState.consecutiveDoubles).toBe(0)

    })

    it("does NOT trigger triple doubles penalty if not third double", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [2, 2],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 1, // NOT third

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 20 } }
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        const pawn = finalState.pawns[0]!

        // ❗ should NOT be sent home
        expect(pawn.position.type).not.toBe("start")

        // ❗ should still be same player
        expect(finalState.currentPlayer).toBe("red")

    })

})