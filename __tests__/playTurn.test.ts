import { describe, it, expect } from "vitest"
import { playTurn } from "../engine/playTurn"
import { GameState } from "../types/GameState"

describe("PlayTurn Rules (RULE-PLAYTURN)", () => {

    it("executes a single move using available dice", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } },
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        expect(finalState.usedDice).toContain(3)

    })

})