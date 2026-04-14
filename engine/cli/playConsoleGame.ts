import readline from "readline"
import { GameState } from "../../types/GameState"
import {
    startGame,
    rollDiceStep,
    applyMoveStep,
    endTurnStep,
    GameControllerState
} from "../controller/GameController"
import { randomStrategy } from "../strategies"


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

        // 👇 ADD IT HERE
        console.log("State:", JSON.stringify(ctrl.state, null, 2))

        // 🎲 Roll Dice
        if (ctrl.phase === "ROLL_DICE") {
            await ask(rl, "Press ENTER to roll dice...")
            ctrl = rollDiceStep(ctrl)

            console.log("Dice:", ctrl.state.dice)
        }

        // ♟️ Select Moves
        while (ctrl.phase === "SELECT_MOVE") {

            const isHuman = ctrl.state.currentPlayer === "red"

            // 🤖 AI TURN
            if (!isHuman) {
                const index = randomStrategy({
                    state: ctrl.state,
                    player: ctrl.state.currentPlayer,
                    moves: ctrl.legalMoves
                })

                const move = ctrl.legalMoves[index]!
                console.log(`AI (${ctrl.state.currentPlayer}) chose:`, describeMove(move))

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
            console.log("Turn complete.")
            ctrl = endTurnStep(ctrl)
        }
    }

    console.log("\n🏆 GAME OVER")
    console.log("Winner:", ctrl.state.winner)

    rl.close()
}

// 🧠 Customize this based on your Move type
function describeMove(move: any): string {
    const pawn = move.pawnId
    const die = move.die

    // 🟢 Entering board
    if (move.enterFromStart) {
        return `Pawn ${pawn} → Enter board (die ${die})`
    }

    // 🟡 Moving on track
    if (move.from?.type === "track" && move.to?.type === "track") {
        return `Pawn ${pawn} → Move ${die} spaces (${move.from.index} → ${move.to.index})`
    }

    // 🔵 Moving into home (future-proofing)
    if (move.to?.type === "home") {
        return `Pawn ${pawn} → Move ${die} into home`
    }

    // ⚪ Fallback
    return `Pawn ${pawn} → +${die}`
}