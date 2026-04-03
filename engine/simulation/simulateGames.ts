import { playGame } from "../playGame"
import { GameState, PlayerColor } from "../../types/GameState"
import { isValidState } from "../validators/isValidState"
import { captureStrategy, randomStrategy } from "../strategies"
import { Strategy } from "../strategies/types"
import { greedyStrategy } from "../strategies/greedyStrategy"

type Stats = {
    wins: Record<PlayerColor, number>
    totalTurns: number[]
    diceRolls: Record<number, number>
    doublesCount: number
    totalRolls: number
    startingPositionWins: {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0
    }
}

const strategies = {
    red: captureStrategy,
    blue: randomStrategy,
    yellow: randomStrategy,
    green: greedyStrategy
}

// For simulation, we can use the same strategy for all players or mix them up
const strategiesForSimulation = createStrategies(randomStrategy)

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

function createStrategies(strategy: Strategy) {
    return {
        red: strategy,
        blue: strategy,
        yellow: strategy,
        green: strategy
    }
}

export function runSimulation(numGames: number): Stats {
    const stats: Stats = {
        wins: {
            red: 0,
            blue: 0,
            yellow: 0,
            green: 0
        },
        totalTurns: [],
        diceRolls: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        doublesCount: 0,
        totalRolls: 0,
        startingPositionWins: {
            first: 0,
            second: 0,
            third: 0,
            fourth: 0
        }
    }

    const positionMap = ["first", "second", "third", "fourth"] as const

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
        const winnerIndex = players.indexOf(result.winner!)
        const relativePosition = (winnerIndex - startIndex + 4) % 4

        const positionKey = positionMap[relativePosition]!
        stats.startingPositionWins[positionKey]++

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
    const variance =
        stats.totalTurns.reduce((sum, t) => sum + Math.pow(t - avgTurns, 2), 0) / totalGames

    const stdDev = Math.sqrt(variance)

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
    console.log(`Std Dev Turns: ${stdDev.toFixed(2)}`)
    console.log("\nStarting Position Win Rates:")
    for (const pos in stats.startingPositionWins) {
        const wins = stats.startingPositionWins[pos as keyof typeof stats.startingPositionWins]
        const pct = ((wins / totalGames) * 100).toFixed(2)
        console.log(`${pos}: ${wins} (${pct}%)`)
    }
}