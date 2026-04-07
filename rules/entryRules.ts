import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import { ENTRY_INDEX } from "../engine/boardConfig"

export function getEntryMoves(state: GameState): Move[] {

  const moves: Move[] = []

  // must roll a 5
  if (!state.dice.includes(5)) {
    return moves
  }

  //console.log(`Die is ${state.dice[0]}, checking entry moves`)

  const entryIndex = ENTRY_INDEX[state.currentPlayer]
  //console.log(`Entry index for player ${state.currentPlayer}: ${entryIndex}`)

  // pawns currently on the entry square
  const entryOccupants = state.pawns.filter(p =>
    p.position.type === "track" &&
    p.position.index === entryIndex
  )

  const occupantCount = entryOccupants.length
  //console.log(`Entry square has ${occupantCount} occupants`)

  // square full (blockade)
  if (occupantCount >= 2) {
    return moves
  }

  // pawns in start
  const startPawns = state.pawns.filter(p =>
    p.player === state.currentPlayer &&
    p.position.type === "start"
  )
  //console.log(`Player has ${startPawns.length} pawns in start`) 

  // only allow remaining capacity
  const capacity = 2 - occupantCount
  //console.log(`Entry square capacity: ${capacity}`)
  //const allowed = startPawns.slice(0, capacity)
  //console.log(`Allowed pawns to enter: ${allowed.map(p => p.id).join(", ")}`)

  for (const pawn of startPawns) {
    moves.push({
      pawnId: pawn.id,
      from: pawn.position,
      to: { type: "track", index: entryIndex },
      die: 5,
      enterFromStart: true
    })
  }

  return moves
}