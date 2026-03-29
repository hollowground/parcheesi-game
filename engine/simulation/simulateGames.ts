import { playGame } from "../playGame"
import { GameState, PlayerColor } from "../../types/GameState"
import { isValidState } from "../validators/isValidState"



type Stats = {
    wins: Record<PlayerColor, number>
    totalTurns: number[]
}

const randomStrategy = (moves: any[]) => {
    return Math.floor(Math.random() * moves.length)
}

const strategies = {
    red: randomStrategy,
    blue: randomStrategy,
    yellow: randomStrategy,
    green: randomStrategy
}

let initialGameState: GameState = {
    players: ["red", "blue", "yellow", "green"],
    currentPlayer: "red",
    dice: [],
    usedDice: [],
    bonusMoves: [],
    consecutiveDoubles: 0,
    pawns: [
        { id: 1, player: "red", position: { type: "start" } },
        { id: 2, player: "red", position: { type: "start" } },
        { id: 3, player: "red", position: { type: "start" } },
        { id: 4, player: "red", position: { type: "start" } },
        { id: 5, player: "blue", position: { type: "start" } },
        { id: 6, player: "blue", position: { type: "start" } },
        { id: 7, player: "blue", position: { type: "start" } },
        { id: 8, player: "blue", position: { type: "start" } },
        { id: 9, player: "yellow", position: { type: "start" } },
        { id: 10, player: "yellow", position: { type: "start" } },
        { id: 11, player: "yellow", position: { type: "start" } },
        { id: 12, player: "yellow", position: { type: "start" } },
        { id: 13, player: "green", position: { type: "start" } },
        { id: 14, player: "green", position: { type: "start" } },
        { id: 15, player: "green", position: { type: "start" } },
        { id: 16, player: "green", position: { type: "start" } }
    ]
}


export function runSimulation(numGames: number): Stats {
    const stats: Stats = {
        wins: {
            red: 0,
            blue: 0,
            yellow: 0,
            green: 0
        },
        totalTurns: []
    }

    for (let i = 0; i < numGames; i++) {
        const players: PlayerColor[] = ["red", "blue", "yellow", "green"]
        const startIndex = Math.floor(Math.random() * 4)

        const state = structuredClone(initialGameState)
        state.currentPlayer = players[startIndex]!

        const result = playGame(state, strategies)
        // 🔍 Validate final state
        if (!isValidState(result.finalState)) {
            console.error("Invalid state detected:", result.finalState)
            throw new Error(`Invalid game state on iteration ${i}`)
        }

        stats.wins[result.winner!]++
        stats.totalTurns.push(result.turnCount)

        if (i % 1000 === 0) {
            console.log(`Completed ${i} games`)
        }
    }

    return stats
}

export function analyzeStats(stats: Stats) {
    const totalGames = stats.totalTurns.length

    const avgTurns =
        stats.totalTurns.reduce((a, b) => a + b, 0) / totalGames

    const maxTurns = Math.max(...stats.totalTurns)
    const minTurns = Math.min(...stats.totalTurns)

    console.log("\n=== Simulation Results ===")

    console.log("\nWin Distribution:")
    for (const color in stats.wins) {
        const wins = stats.wins[color as PlayerColor]
        const pct = ((wins / totalGames) * 100).toFixed(2)
        console.log(`${color}: ${wins} (${pct}%)`)
    }

    console.log("\nGame Length:")
    console.log(`Average Turns: ${avgTurns.toFixed(2)}`)
    console.log(`Min Turns: ${minTurns}`)
    console.log(`Max Turns: ${maxTurns}`)
}