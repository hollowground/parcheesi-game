import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { applyMove } from "../engine/applyMove"
import { GameState } from "../types/GameState"

describe("Bonus Move Rules (RULE-BONUS)", () => {

    it("RULE-BONUS-001: capture grants 20-space bonus", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],
            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },
                { id: 1, player: "blue", position: { type: "track", index: 5 } }
            ]
        }

        const move = getLegalMoves(state).find(
            m => m.pawnId === 0 &&
                m.to.type === "track" &&
                m.to.index === 5
        )!

        const newState = applyMove(state, move)

        expect(newState.bonusMoves).toContain(20)

    })

    it("RULE-BONUS-002: reaching home grants 10-space bonus", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [2],
            usedDice: [],
            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 0, player: "red", position: { type: "homeLane", index: 5 } }
            ]
        }

        const move = getLegalMoves(state)[0]!

        const newState = applyMove(state, move)

        expect(newState.bonusMoves).toContain(10)

    })

})