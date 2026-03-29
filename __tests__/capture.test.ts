import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { applyMove } from "../engine/applyMove"
import { GameState } from "../types/GameState"
import { SAFETY_SQUARES } from "../engine/boardConfig"

describe("Capturing Rules", () => {

    it("RULE-CAPTURE-001: landing on opponent pawn captures it", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },
                { id: 1, player: "blue", position: { type: "track", index: 5 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        const captureMove = moves.find(
            m => m.pawnId === 0 &&
                m.to.type === "track" &&
                m.to.index === 5
        )

        expect(captureMove).toBeDefined()
        expect(captureMove!.capture).toBe(true)

    })


    it("RULE-CAPTURE-001B: captured pawn returns to START", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },
                { id: 1, player: "blue", position: { type: "track", index: 5 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const move = getLegalMoves(state).find(
            m => m.pawnId === 0 &&
                m.to.type === "track" &&
                m.to.index === 5
        )!

        const newState = applyMove(state, move)

        const capturedPawn = newState.pawns.find(p => p.id === 1)!

        expect(capturedPawn.position).toEqual({ type: "start" })

    })


    it("RULE-CAPTURE-002: cannot capture pawn on safety square", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [5],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },
                { id: 1, player: "blue", position: { type: "track", index: 7 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const safeSquare = SAFETY_SQUARES[1]
        //console.log(`Safety square for blue: ${safeSquare}`)
        const moves = getLegalMoves(state)
        //console.log(`Legal moves: ${JSON.stringify(moves)}`)

        const move = moves.find(
            m => m.pawnId === 0 &&
                m.to.type === "track" &&
                m.to.index === 7
        )

        expect(move).toBeDefined()

        const newState = applyMove(state, move!)

        const bluePawn = newState.pawns.find(p => p.id === 1)

        expect(bluePawn?.position).toEqual({ type: "track", index: 7 })
    })


    it("RULE-CAPTURE-003: landing on opponent blockade is illegal", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },

                { id: 1, player: "blue", position: { type: "track", index: 5 } },
                { id: 2, player: "blue", position: { type: "track", index: 5 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        const illegalMove = moves.find(
            m => m.pawnId === 0 &&
                m.to.type === "track" &&
                m.to.index === 5
        )

        expect(illegalMove).toBeUndefined()

    })

    it("RULE-CAPTURE-004: cannot land on enemy blockade even on safety square", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",

            dice: [5],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },

                { id: 1, player: "blue", position: { type: "track", index: 7 } },
                { id: 2, player: "blue", position: { type: "track", index: 7 } }
            ],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        const illegalMove = moves.find(
            m => m.to.type === "track" && m.to.index === 7
        )

        expect(illegalMove).toBeUndefined()

    })

})