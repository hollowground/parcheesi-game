import { runSimulation, analyzeStats, runStrategyComparison } from "./simulateGames"
import { randomStrategy } from "../strategies"
import { PlayerColor } from "../../types/GameState"

const strategies: Record<PlayerColor, typeof randomStrategy> = {
    red: randomStrategy,
    blue: randomStrategy,
    yellow: randomStrategy,
    green: randomStrategy
}

//type Mode = "simulation" | "comparison"

let MODE = "comparison" as "simulation" | "comparison"

const startTime = new Date()

if (MODE === "simulation") {
    const stats = runSimulation(50, strategies)
    analyzeStats(stats)
} else {
    const results = runStrategyComparison(100)
    console.log("\n=== Strategy Comparison ===")
    console.log(results)
}

const endTime = new Date()
console.log("\n=== Timing ===")
console.log(`Start Time: ${startTime.toLocaleString()}`)
console.log(`End Time:   ${endTime.toLocaleString()}`)

const durationMs = endTime.getTime() - startTime.getTime()
const durationSec = (durationMs / 1000).toFixed(2)

console.log(`Duration: ${durationMs} ms (${durationSec} seconds)`)

