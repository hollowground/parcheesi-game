import { runSimulation, analyzeStats } from "./simulateGames"

const startTime = new Date()

const stats = runSimulation(500)

const endTime = new Date()

analyzeStats(stats)

console.log("\n=== Timing ===")
console.log(`Start Time: ${startTime.toLocaleString()}`)
console.log(`End Time:   ${endTime.toLocaleString()}`)

const durationMs = endTime.getTime() - startTime.getTime()
const durationSec = (durationMs / 1000).toFixed(2)

console.log(`Duration: ${durationMs} ms (${durationSec} seconds)`)