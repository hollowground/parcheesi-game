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

export function rollDiceStep(ctrl: GameControllerState): GameControllerState {
    if (ctrl.phase !== "ROLL_DICE") return ctrl

    const newState = {
        ...ctrl.state,
        dice: rollDice(),
        usedDice: []
    }

    const legalMoves = getLegalMoves(newState)

    return {
        state: newState,
        phase: legalMoves.length > 0 ? "SELECT_MOVE" : "TURN_END",
        legalMoves
    }
}

export function applyMoveStep(
    ctrl: GameControllerState,
    move: Move
): GameControllerState {
    if (ctrl.phase !== "SELECT_MOVE") return ctrl

    const newState = applyMove(ctrl.state, move)
    const legalMoves = getLegalMoves(newState)

    if (legalMoves.length > 0) {
        return {
            state: newState,
            phase: "SELECT_MOVE",
            legalMoves
        }
    }

    return {
        state: newState,
        phase: "TURN_END",
        legalMoves: []
    }
}

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

    const nextPlayer = getNextPlayer(ctrl.state)

    return {
        state: {
            ...ctrl.state,
            currentPlayer: nextPlayer,
            dice: [],
            usedDice: []
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

    // End turn
    current = endTurnStep(current)

    return current
}