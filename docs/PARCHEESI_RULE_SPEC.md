# PARCHEESI_RULE_SPEC.md

**Rule Version:** 1.0\
**Source:** Official Parcheesi Rules (2020 edition)\
**Engine Target:** Parcheesi Engine v1\
**Purpose:** Authoritative rule specification for implementing a
deterministic Parcheesi game engine using test‑driven development.

------------------------------------------------------------------------

# 1. Game Overview

Parcheesi is a race game played by four players. Each player controls
four pawns and attempts to move all pawns from the start area, around
the board track, into the home row, and finally into the finish.

Movement is determined by rolling two six‑sided dice.

The first player to move all four pawns to the **finished state** wins
the game.

------------------------------------------------------------------------

# 2. Board Structure

## 2.1 Main Track

The board contains **68 spaces** forming a loop.

Each pawn travels around the track before entering its home row.

Track indices used by the engine:

    0–67

Movement wraps around the board.

Example:

    index 67 + 2 → index 1

------------------------------------------------------------------------

## 2.2 Entry Squares

Each player has a unique **entry square** where pawns enter the track.

Example mapping:

  Player   Entry Index
  -------- -------------
  Red      0
  Blue     17
  Yellow   34
  Green    51

Rule ID: **RULE-ENTRY-001**

A pawn enters the board **only by rolling a 5**.

------------------------------------------------------------------------

## 2.3 Safety Squares

Certain track squares are designated **safety squares**.

Safety squares have the following properties:

1.  Pawns on safety squares **cannot be captured**.
2.  Multiple pawns of different colors **may share a safety square**.
3.  Safety squares **do not form blockades**.

Rule ID: **RULE-SAFETY-001**

------------------------------------------------------------------------

## 2.4 Home Rows

Each player has a private **home row** consisting of **7 spaces**.

These spaces lead to the **finish space**.

Only pawns belonging to the player may occupy these spaces.

Rule ID: **RULE-HOME-001**

------------------------------------------------------------------------

# 3. Pawn States

A pawn can exist in the following states:

### Start

Pawn is in the starting area and not yet on the board.

    { type: "start" }

------------------------------------------------------------------------

### Track

Pawn is on the main board track.

    { type: "track", index: number }

------------------------------------------------------------------------

### Home Row

Pawn has entered its final lane.

    { type: "home", index: number }

------------------------------------------------------------------------

### Finished

Pawn has reached the final space.

    { type: "finished" }

Rule ID: **RULE-PAWNSTATE-001**

------------------------------------------------------------------------

# 4. Dice Rules

## 4.1 Dice Roll

Each turn begins with a roll of **two six‑sided dice**.

Possible outcomes:

    1–6 on each die

Players may distribute dice across multiple pawns.

Rule ID: **RULE-DICE-001**

------------------------------------------------------------------------

## 4.2 Doubles

Rolling doubles grants **another turn**.

Example:

    4 + 4

Rule ID: **RULE-DOUBLES-001**

------------------------------------------------------------------------

## 4.3 Doubles Penalty

If a player rolls **three consecutive doubles**, the last pawn moved
must return to start.

Rule ID: **RULE-DOUBLES-002**

------------------------------------------------------------------------

# 5. Movement Rules

## 5.1 Entering the Board

A pawn enters the board only when a **5** is played.

Possible ways:

    5
    4 + 1
    3 + 2

The pawn is placed on the player's entry square.

Rule ID: **RULE-ENTER-001**

------------------------------------------------------------------------

## 5.2 Normal Movement

A pawn moves forward exactly the number of spaces indicated by a die.

Example:

    index 10 + die 4 → index 14

Movement wraps around the board.

Rule ID: **RULE-MOVE-001**

------------------------------------------------------------------------

## 5.3 Movement Restrictions

A pawn **cannot move past a blockade**.

Rule ID: **RULE-MOVE-002**

------------------------------------------------------------------------

# 6. Capturing

Capturing occurs when a pawn lands on a square occupied by a single
opposing pawn.

Result:

1.  Opponent pawn returns to **start**.
2.  Capturing player receives a **20 space bonus move**.

Rule ID: **RULE-CAPTURE-001**

------------------------------------------------------------------------

## 6.1 Safety Square Protection

Pawns on safety squares **cannot be captured**.

Rule ID: **RULE-CAPTURE-002**

------------------------------------------------------------------------

# 7. Blockades

A **blockade** is formed when two pawns of the same color occupy the
same square.

Blockade properties:

1.  No pawn may land on the blockade.
2.  No pawn may pass the blockade.
3.  The owner may break the blockade by moving one pawn.

Rule ID: **RULE-BLOCKADE-001**

------------------------------------------------------------------------

# 8. Home Row Rules

When a pawn completes a full circuit of the board it enters the home
row.

Movement within the home row must be **exact**.

Example:

    distance to finish = 3
    die roll = 4 → illegal move

Rule ID: **RULE-HOME-002**

------------------------------------------------------------------------

# 9. Finishing a Pawn

When a pawn reaches the final home space:

1.  Pawn enters **finished state**
2.  Player receives a **10 space bonus move**

Rule ID: **RULE-FINISH-001**

------------------------------------------------------------------------

# 10. Turn Flow

A player turn follows this sequence:

1.  Roll two dice
2.  Generate legal moves
3.  Player executes moves using dice values
4.  Apply captures or bonuses
5.  If doubles rolled → take another turn

Rule ID: **RULE-TURN-001**

------------------------------------------------------------------------

# 11. Legal Move Determination

A move is legal if:

1.  The pawn can move the exact distance.
2.  The move does not cross a blockade.
3.  The pawn does not overshoot home.
4.  The move obeys entry rules.

Rule ID: **RULE-LEGALMOVE-001**

------------------------------------------------------------------------

# 12. Victory Condition

The game ends immediately when a player has **all four pawns finished**.

Rule ID: **RULE-WIN-001**

------------------------------------------------------------------------

# 13. Engine Implementation Notes

Recommended engine modules:

    engine/
      board.ts
      moveGenerator.ts
      moveValidator.ts
      rules.ts
      turnManager.ts
      types.ts

Testing structure:

    tests/
      entry.test.ts
      movement.test.ts
      capture.test.ts
      blockade.test.ts
      home.test.ts

Each test should reference a rule ID.

Example:

``` ts
// RULE-CAPTURE-002
it("prevents capture on safety squares", () => { ... })
```

------------------------------------------------------------------------

# 14. Rule Traceability

  Rule ID             Feature                      Engine Module
  ------------------- ---------------------------- ---------------
  RULE-ENTER-001      Enter board                  moveGenerator
  RULE-CAPTURE-001    Capture pawn                 rules
  RULE-CAPTURE-002    Safety capture restriction   rules
  RULE-BLOCKADE-001   Blockade logic               moveValidator
  RULE-HOME-002       Exact home movement          moveValidator
  RULE-WIN-001        Victory condition            turnManager

------------------------------------------------------------------------

End of Specification
