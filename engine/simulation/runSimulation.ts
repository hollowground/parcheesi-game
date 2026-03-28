import { runSimulation, analyzeStats } from "./simulateGames"

const stats = runSimulation(100)

analyzeStats(stats)