import { runSimulation, analyzeStats } from "./simulateGames"

const stats = runSimulation(2000)

analyzeStats(stats)