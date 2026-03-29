import { runSimulation, analyzeStats } from "./simulateGames"

const stats = runSimulation(200)

analyzeStats(stats)