# Specification

## Summary
**Goal:** Build a dark mode workout tracking application that allows users to manage exercises, create workouts, and track weight progress over time.

**Planned changes:**
- Implement dark mode UI theme throughout the application
- Create backend data models for Exercise (with name, equipmentType, muscleGroup), Workout (with name, exerciseIds, createdAt), and WeightEntry (with exerciseId, weight, reps, sets, date, workoutId)
- Implement backend CRUD operations for exercises, workouts, and weight entries
- Add backend filtering for exercises by equipment type (Dumbbell, Barbell, Free Weight, Machine, Plate-Loaded Machine, Cable) and muscle group (back, chest, biceps, triceps, shoulders, core, lower body)
- Create exercise library page with filtering dropdowns and alphabetical display
- Build workout creation/editing interface for naming workouts and adding exercises
- Implement weight logging interface for entering weight, reps, and sets
- Create weight progress view showing historical entries chronologically with trend indicators
- Add workouts list page displaying saved workouts with details and start session capability
- Seed database with comprehensive starter exercise library (30+ exercises across all equipment types and muscle groups)

**User-visible outcome:** Users can browse and filter exercises by equipment and muscle group, create custom workouts, log their weight training sessions with sets/reps/weight data, and view their progress over time for each exercise in a dark mode interface.
