import { describe, it, expect } from 'vitest'
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"
import { ENTRY_INDEX } from "../engine/boardConfig"

describe("Entry Rules (RULE-ENTRY)", () => {

    it("RULE-ENTRY-001: pawn can enter board with roll of 5", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],

            currentPlayer: "red",

            dice: [5],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },
                { id: 2, player: "red", position: { type: "start" } },
                { id: 3, player: "red", position: { type: "start" } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(
            moves.some(
                m =>
                    m.pawnId === 0 &&
                    m.to.type === "track" &&
                    m.to.index === ENTRY_INDEX.red
            )
        ).toBe(true)
    })

    it("RULE-ENTRY-001-B: pawn cannot enter without rolling a 5", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [3],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },
                { id: 2, player: "red", position: { type: "start" } },
                { id: 3, player: "red", position: { type: "start" } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)
    })

    it("RULE-ENTRY-001-C: entry square capacity limits entry moves to two", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },
                { id: 2, player: "red", position: { type: "start" } },
                { id: 3, player: "red", position: { type: "start" } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)
        //console.log(moves)

        expect(moves.length).toBe(2)
    })

    it("RULE-ENTRY-001-D: only current player's pawns can enter from start", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "blue",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },

                { id: 2, player: "blue", position: { type: "start" } },
                { id: 3, player: "blue", position: { type: "start" } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(2)

    })

    it("RULE-ENTRY-002: entry is blocked if two same player's pawns occupy the entry square (blockade)", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },

                { id: 2, player: "red", position: { type: "track", index: ENTRY_INDEX.red } },
                { id: 3, player: "red", position: { type: "track", index: ENTRY_INDEX.red } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)
        //console.log(moves)

        expect(
            moves.some(
                m =>
                    m.pawnId === 2 &&
                    m.to.type === "track" &&
                    m.to.index === ENTRY_INDEX.red + state.dice[0]!
            ) ||
            moves.some(
                m =>
                    m.pawnId === 3 &&
                    m.to.type === "track" &&
                    m.to.index === ENTRY_INDEX.red + state.dice[0]!
            )
        ).toBe(true)

        expect(
            moves.some(
                m =>
                    m.pawnId === 0 &&
                    m.to.type === "track" &&
                    m.to.index === ENTRY_INDEX.red
            ) ||
            moves.some(
                m =>
                    m.pawnId === 1 &&
                    m.to.type === "track" &&
                    m.to.index === ENTRY_INDEX.red
            )
        ).toBe(false)

    })

    it("RULE-ENTRY-002-B: entry is blocked if two enemy pawns occupy the entry square (blockade)", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },

                { id: 2, player: "blue", position: { type: "track", index: ENTRY_INDEX.red } },
                { id: 3, player: "blue", position: { type: "track", index: ENTRY_INDEX.red } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })

    it("RULE-ENTRY-002-C: entry allowed if only one pawn occupies entry square", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },

                { id: 1, player: "red", position: { type: "track", index: ENTRY_INDEX.red } },

                { id: 2, player: "blue", position: { type: "start" } },
                { id: 3, player: "blue", position: { type: "start" } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(1)

    })

    it("RULE-ENTRY-003: entering captures enemy pawn on entry square", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },

                { id: 1, player: "blue", position: { type: "track", index: ENTRY_INDEX.red } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(1)

    })

})