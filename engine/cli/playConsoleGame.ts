import readline from "readline"
import { GameState } from "../../types/GameState"
import {
    startGame,
    rollDiceStep,
    applyMoveStep,
    endTurnStep,
    GameControllerState
} from "../controller/GameController"

// 🔁 Toggle this to true to let the game play automatically
const AUTO_PLAY = false

function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
}

function ask(rl: readline.Interface, question: string): Promise<string> {
    return new Promise(resolve => rl.question(question, resolve))
}

export async function playConsoleGame(initialState: GameState) {
    const rl = createInterface()
    let ctrl: GameControllerState = startGame(initialState)

    while (ctrl.phase !== "GAME_OVER") {

        console.log("\n========================")
        console.log(`Player: ${ctrl.state.currentPlayer}`)

        printState(ctrl.state)

        // 🎲 Roll Dice
        if (ctrl.phase === "ROLL_DICE") {
            if (!AUTO_PLAY) {
                await ask(rl, `Player ${ctrl.state.currentPlayer} - Press ENTER to roll dice...`)
            }

            ctrl = rollDiceStep(ctrl)
            console.log("🎲 Dice Rolled:", ctrl.state.dice)
        }

        // ♟️ Select Moves
        while (ctrl.phase === "SELECT_MOVE") {

            // ✅ FIX: Handle no legal moves
            if (ctrl.legalMoves.length === 0) {
                console.log("❌ No legal moves available. Ending turn.")
                ctrl = endTurnStep(ctrl)
                break
            }

            const isHuman = ctrl.state.currentPlayer === "red"

            // 🤖 AI TURN
            if (AUTO_PLAY || !isHuman) {
                const index = basicStrategy({
                    state: ctrl.state,
                    moves: ctrl.legalMoves
                })

                const move = ctrl.legalMoves[index]!
                console.log(`🤖 AI (${ctrl.state.currentPlayer}) chose:`, describeMove(move))

                ctrl = applyMoveStep(ctrl, move)
                continue
            }

            // 👤 HUMAN TURN
            console.log("\nLegal Moves:")
            ctrl.legalMoves.forEach((move, i) => {
                console.log(`${i}:`, describeMove(move))
            })

            const answer = await ask(rl, "Select move index: ")
            const index = parseInt(answer)

            if (isNaN(index) || index < 0 || index >= ctrl.legalMoves.length) {
                console.log("Invalid selection. Try again.")
                continue
            }

            const move = ctrl.legalMoves[index]
            ctrl = applyMoveStep(ctrl, move!)
        }

        // 🔄 End Turn
        if (ctrl.phase === "TURN_END") {
            console.log("✅ Turn complete.")
            ctrl = endTurnStep(ctrl)
            console.log(`➡️ Next player: ${ctrl.state.currentPlayer}`)
        }
    }

    console.log("\n🏆 GAME OVER")
    console.log("Winner:", ctrl.state.winner)

    rl.close()
}

// ----------------------------------
// 🧠 BASIC AI STRATEGY
// ----------------------------------
function basicStrategy({ moves }: { state: GameState, moves: any[] }): number {

    // 🥇 Priority 1: Capture moves
    const captureMoves = moves.filter(m => m.capture)
    if (captureMoves.length > 0) {
        return moves.indexOf(captureMoves[0])
    }

    // 🥈 Priority 2: Enter from start
    const enterMoves = moves.filter(m => m.enterFromStart)
    if (enterMoves.length > 0) {
        return moves.indexOf(enterMoves[0])
    }

    // 🎲 Fallback: random
    return Math.floor(Math.random() * moves.length)
}

// ----------------------------------
// 🧾 BETTER STATE DISPLAY
// ----------------------------------
function printState(state: GameState) {
    const grouped: Record<string, any[]> = {}

    for (const pawn of state.pawns) {
        if (!grouped[pawn.player]) grouped[pawn.player] = []
        grouped[pawn.player]!.push(pawn.position)
    }

    console.log("\n📊 Board State:")
    for (const player of state.players) {
        console.log(`${player}:`, grouped[player])
    }

    console.log("🎲 Dice:", state.dice)
    console.log("✅ Used:", state.usedDice)
    console.log("⭐ Bonus:", state.bonusMoves)
    console.log("🎯 Doubles Count:", state.consecutiveDoubles)
}

// ----------------------------------
// 🧠 MOVE DESCRIPTION
// ----------------------------------
function describeMove(move: any): string {
    const pawn = move.pawnId
    const die = move.die

    if (move.enterFromStart) {
        return `Pawn ${pawn} → Enter board (die ${die})`
    }

    if (move.capture) {
        return `Pawn ${pawn} → Capture using ${die} (${move.from.index} → ${move.to.index})`
    }

    if (move.from?.type === "track" && move.to?.type === "track") {
        return `Pawn ${pawn} → Move ${die} (${move.from.index} → ${move.to.index})`
    }

    if (move.to?.type === "home") {
        return `Pawn ${pawn} → Move ${die} into HOME`
    }

    return `Pawn ${pawn} → +${die}`
}