import { GameState, PlayerColor } from "../../types/GameState"
import { Move } from "../../types/Move"
import { rollDice } from "../diceUtils"
import { getLegalMoves } from "../getLegalMoves"
import { applyMove } from "../applyMove"
import { checkWinner } from "../checkWinner"

export type TurnPhase =
    | "ROLL_DICE"
    | "SELECT_MOVE"
    | "TURN_END"
    | "GAME_OVER"

export type GameControllerState = {
    state: GameState
    phase: TurnPhase
    legalMoves: Move[]
}

export function startGame(initialState: GameState): GameControllerState {
    return {
        state: structuredClone(initialState),
        phase: "ROLL_DICE",
        legalMoves: []
    }
}

// -------------------------
// 🎲 ROLL DICE
// -------------------------
export function rollDiceStep(ctrl: GameControllerState): GameControllerState {
    if (ctrl.phase !== "ROLL_DICE") return ctrl

    const dice = rollDice()

    const isDoubles =
        dice.length === 2 &&
        dice[0] === dice[1]

    const newState: GameState = {
        ...ctrl.state,
        dice,
        usedDice: [],
        consecutiveDoubles: isDoubles
            ? ctrl.state.consecutiveDoubles + 1
            : 0
    }

    const legalMoves = getLegalMoves(newState)

    return {
        state: newState,
        phase: legalMoves.length > 0 ? "SELECT_MOVE" : "TURN_END",
        legalMoves
    }
}

// -------------------------
// ♟️ APPLY MOVE
// -------------------------
export function applyMoveStep(
    ctrl: GameControllerState,
    move: Move
): GameControllerState {
    if (ctrl.phase !== "SELECT_MOVE") return ctrl

    let newState = applyMove(ctrl.state, move)

    // Remaining dice = dice - usedDice
    const remainingDice = newState.dice.filter(
        d => !newState.usedDice.includes(d)
    )

    const legalMoves = getLegalMoves(newState)

    // ✅ If moves still possible → continue turn
    if (legalMoves.length > 0) {
        return {
            state: newState,
            phase: "SELECT_MOVE",
            legalMoves
        }
    }

    // ❗ No moves left BUT dice remain → forfeit dice
    if (remainingDice.length > 0) {
        console.log("Forfeiting remaining dice:", remainingDice)

        newState = {
            ...newState,
            dice: [],
            usedDice: []
        }
    }

    return {
        state: newState,
        phase: "TURN_END",
        legalMoves: []
    }
}

// -------------------------
// 🔄 END TURN
// -------------------------
export function endTurnStep(ctrl: GameControllerState): GameControllerState {
    if (ctrl.phase !== "TURN_END") return ctrl

    const winner = checkWinner(ctrl.state)

    if (winner) {
        return {
            state: { ...ctrl.state, winner },
            phase: "GAME_OVER",
            legalMoves: []
        }
    }

    const rolledDoubles = ctrl.state.consecutiveDoubles > 0

    if (rolledDoubles) {
        console.log("🎯 Doubles rolled → same player goes again")

        return {
            state: {
                ...ctrl.state,
                dice: [],
                usedDice: []
            },
            phase: "ROLL_DICE",
            legalMoves: []
        }
    }

    // 🔁 NORMAL TURN → NEXT PLAYER
    const nextPlayer = getNextPlayer(ctrl.state)

    return {
        state: {
            ...ctrl.state,
            currentPlayer: nextPlayer,
            dice: [],
            usedDice: [],
            consecutiveDoubles: 0
        },
        phase: "ROLL_DICE",
        legalMoves: []
    }
}

function getNextPlayer(state: GameState): PlayerColor {
    const players = state.players
    const idx = players.indexOf(state.currentPlayer)
    return players[(idx + 1) % players.length]!
}

// -------------------------
// 🤖 AI TURN
// -------------------------
export function playAITurn(
    ctrl: GameControllerState,
    strategy: (moves: Move[], state: GameState) => number
): GameControllerState {

    let current = ctrl

    // Roll
    current = rollDiceStep(current)

    // Play moves
    while (current.phase === "SELECT_MOVE") {
        const index = strategy(current.legalMoves, current.state)
        const move = current.legalMoves[index]!
        current = applyMoveStep(current, move)
    }

    // End turn (handles doubles internally now)
    current = endTurnStep(current)

    return current
}