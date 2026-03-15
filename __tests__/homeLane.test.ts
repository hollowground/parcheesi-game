import { describe, it, expect } from 'vitest'
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"
import { HOME_ENTRY_INDEX, HOME_LENGTH } from "../engine/boardConfig"

describe("Home Lane Rules (RULE-HOME)", () => {
    it("RULE-HOME-001: pawn enters home lane after passing home entry", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [2],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 62 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves[0]!.to).toEqual({
            type: "homeLane",
            index: 1
        })

    })

    it("RULE-HOME-002: pawn moves within home lane", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "homeLane", index: 2 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves[0]!.to).toEqual({
            type: "homeLane",
            index: 5
        })

    })

    it("RULE-HOME-003: pawn must roll exact value to reach home", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "homeLane", index: 5 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })

    it("RULE-HOME-004: pawn reaches home with exact roll", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [2],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "homeLane", index: 5 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)
        console.log(`Moves: ${JSON.stringify(moves)}`)

        expect(moves[0]!.to).toEqual({ type: "home" })

    })

})