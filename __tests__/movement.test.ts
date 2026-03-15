import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"
import { ENTRY_INDEX } from "../engine/boardConfig"

describe("Movement Rules (RULE-MOVE)", () => {

    it("RULE-MOVE-001: pawn on track moves forward by die value", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [3],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 10 } },

                { id: 1, player: "red", position: { type: "start" } },
                { id: 2, player: "blue", position: { type: "start" } },
                { id: 3, player: "blue", position: { type: "start" } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(1)

        const move = moves[0]!

        expect(move.pawnId).toBe(0)

        expect(move.to).toEqual({
            type: "track",
            index: 13
        })

    })

    it("RULE-MOVE-002: pawn movement wraps around the board", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [4],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 66 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves[0]!.to).toEqual({
            type: "track",
            index: 2
        })

    })

    it("RULE-MOVE-003: multiple dice generate multiple movement options", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [2, 5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 10 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(2)

        const indexes = moves.map(m =>
            m.to.type === "track" ? m.to.index : -1
        )

        expect(indexes).toContain(12)
        expect(indexes).toContain(15)

    })

    it("RULE-MOVE-004: used dice cannot generate moves", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [2, 5],
            usedDice: [2],
            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 10 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(1)

        expect(moves[0]!.to).toEqual({
            type: "track",
            index: 15
        })

    })

    it("RULE-MOVE-005: pawn cannot pass a blockade", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [4],
            usedDice: [],
            pawns: [

                { id: 0, player: "red", position: { type: "track", index: 10 } },

                { id: 1, player: "blue", position: { type: "track", index: 12 } },
                { id: 2, player: "blue", position: { type: "track", index: 12 } }

            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })

    it("RULE-MOVE-006: pawn cannot land on its own blockade", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [2],
            usedDice: [],
            pawns: [

                { id: 0, player: "red", position: { type: "track", index: 10 } },

                { id: 1, player: "red", position: { type: "track", index: 12 } },
                { id: 2, player: "red", position: { type: "track", index: 12 } }

            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(2)
        const pawnExists = moves.some(move => move.pawnId === 0)
        expect(pawnExists).toBe(false)

    })

})