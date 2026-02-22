import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
  type Exercise = {
    name : Text;
    equipmentType : Text;
    muscleGroup : Text;
  };

  type Workout = {
    id : Nat;
    name : Text;
    exerciseIds : [Nat];
    createdAt : Time.Time;
  };

  type WeightEntry = {
    exerciseId : Nat;
    weight : Nat;
    reps : Nat;
    sets : Nat;
    date : Time.Time;
    workoutId : ?Nat;
  };

  module Exercise {
    public func compare(a : Exercise, b : Exercise) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  var exerciseIdCounter = 0;
  var workoutIdCounter = 0;
  var weightEntryIdCounter = 0;

  let exercises = Map.empty<Nat, Exercise>();
  let workouts = Map.empty<Nat, Workout>();
  let weightEntries = Map.empty<Nat, WeightEntry>();

  func validateEquipmentType(equipmentType : Text) {
    let validTypes = ["Dumbbell", "Barbell", "Free Weight", "Machine", "Plate-Loaded Machine", "Cable"];
    if (not Array.fromIter(validTypes.values()).any(func(x) { x == equipmentType })) {
      Runtime.trap("Invalid equipment type");
    };
  };

  func validateMuscleGroup(muscleGroup : Text) {
    let validGroups = ["back", "chest", "biceps", "triceps", "shoulders", "core", "lower body"];
    if (not Array.fromIter(validGroups.values()).any(func(x) { x == muscleGroup })) {
      Runtime.trap("Invalid muscle group");
    };
  };

  public shared ({ caller }) func createExercise(name : Text, equipmentType : Text, muscleGroup : Text) : async Nat {
    validateEquipmentType(equipmentType);
    validateMuscleGroup(muscleGroup);

    let exercise : Exercise = {
      name;
      equipmentType;
      muscleGroup;
    };

    exercises.add(exerciseIdCounter, exercise);
    exerciseIdCounter += 1;
    exerciseIdCounter - 1;
  };

  public query ({ caller }) func getExercise(id : Nat) : async Exercise {
    switch (exercises.get(id)) {
      case (null) { Runtime.trap("Exercise not found") };
      case (?exercise) { exercise };
    };
  };

  public shared ({ caller }) func updateExercise(id : Nat, name : Text, equipmentType : Text, muscleGroup : Text) : async () {
    validateEquipmentType(equipmentType);
    validateMuscleGroup(muscleGroup);

    switch (exercises.get(id)) {
      case (null) { Runtime.trap("Exercise not found") };
      case (?_) {
        let updatedExercise : Exercise = {
          name;
          equipmentType;
          muscleGroup;
        };
        exercises.add(id, updatedExercise);
      };
    };
  };

  public shared ({ caller }) func deleteExercise(id : Nat) : async () {
    switch (exercises.get(id)) {
      case (null) { Runtime.trap("Exercise not found") };
      case (?_) {
        exercises.remove(id);
      };
    };
  };

  public shared ({ caller }) func createWorkout(name : Text, exerciseIds : [Nat]) : async Nat {
    let workout : Workout = {
      id = workoutIdCounter;
      name;
      exerciseIds;
      createdAt = Time.now();
    };

    workouts.add(workoutIdCounter, workout);
    workoutIdCounter += 1;
    workoutIdCounter - 1;
  };

  public query ({ caller }) func getWorkout(id : Nat) : async Workout {
    switch (workouts.get(id)) {
      case (null) { Runtime.trap("Workout not found") };
      case (?workout) { workout };
    };
  };

  public shared ({ caller }) func updateWorkout(id : Nat, name : Text, exerciseIds : [Nat]) : async () {
    switch (workouts.get(id)) {
      case (null) { Runtime.trap("Workout not found") };
      case (?existingWorkout) {
        let updatedWorkout : Workout = {
          id;
          name;
          exerciseIds;
          createdAt = existingWorkout.createdAt;
        };
        workouts.add(id, updatedWorkout);
      };
    };
  };

  public shared ({ caller }) func deleteWorkout(id : Nat) : async () {
    switch (workouts.get(id)) {
      case (null) { Runtime.trap("Workout not found") };
      case (?_) {
        workouts.remove(id);
      };
    };
  };

  public shared ({ caller }) func logWeightEntry(exerciseId : Nat, weight : Nat, reps : Nat, sets : Nat, workoutId : ?Nat) : async Nat {
    let weightEntry : WeightEntry = {
      exerciseId;
      weight;
      reps;
      sets;
      date = Time.now();
      workoutId;
    };

    weightEntries.add(weightEntryIdCounter, weightEntry);
    weightEntryIdCounter += 1;
    weightEntryIdCounter - 1;
  };

  public query ({ caller }) func getWeightProgress(exerciseId : Nat) : async [WeightEntry] {
    let entries = List.empty<WeightEntry>();
    weightEntries.entries().forEach(
      func((_, entry)) {
        if (entry.exerciseId == exerciseId) {
          entries.add(entry);
        };
      }
    );
    entries.toArray();
  };

  public query ({ caller }) func filterExercisesByEquipmentType(equipmentType : Text) : async [Exercise] {
    let filtered = List.empty<Exercise>();
    exercises.values().forEach(
      func(exercise) {
        if (exercise.equipmentType == equipmentType) {
          filtered.add(exercise);
        };
      }
    );
    filtered.toArray();
  };

  public query ({ caller }) func filterExercisesByMuscleGroup(muscleGroup : Text) : async [Exercise] {
    let filtered = List.empty<Exercise>();
    exercises.values().forEach(
      func(exercise) {
        if (exercise.muscleGroup == muscleGroup) {
          filtered.add(exercise);
        };
      }
    );
    filtered.toArray();
  };

  public query ({ caller }) func getAllExercisesSorted() : async [Exercise] {
    exercises.values().toArray().sort();
  };

  // Seed initial exercise data
  public shared ({ caller }) func seedExercises() : async () {
    let initialExercises : [Exercise] = [
      // Dumbbell exercises
      { name = "Dumbbell Bench Press"; equipmentType = "Dumbbell"; muscleGroup = "chest" },
      { name = "Dumbbell Flyes"; equipmentType = "Dumbbell"; muscleGroup = "chest" },
      { name = "Dumbbell Shoulder Press"; equipmentType = "Dumbbell"; muscleGroup = "shoulders" },
      { name = "Dumbbell Lateral Raises"; equipmentType = "Dumbbell"; muscleGroup = "shoulders" },
      { name = "Dumbbell Bicep Curls"; equipmentType = "Dumbbell"; muscleGroup = "biceps" },
      { name = "Dumbbell Tricep Extensions"; equipmentType = "Dumbbell"; muscleGroup = "triceps" },
      // Barbell and Free Weight exercises
      { name = "Barbell Bench Press"; equipmentType = "Barbell"; muscleGroup = "chest" },
      { name = "Barbell Squats"; equipmentType = "Barbell"; muscleGroup = "lower body" },
      { name = "Barbell Deadlifts"; equipmentType = "Barbell"; muscleGroup = "back" },
      { name = "Barbell Rows"; equipmentType = "Barbell"; muscleGroup = "back" },
      { name = "Barbell Bicep Curls"; equipmentType = "Barbell"; muscleGroup = "biceps" },
      { name = "Barbell Tricep Extensions"; equipmentType = "Barbell"; muscleGroup = "triceps" },
      // Machine exercises
      { name = "Seated Chest Press"; equipmentType = "Machine"; muscleGroup = "chest" },
      { name = "Lat Pulldown"; equipmentType = "Machine"; muscleGroup = "back" },
      { name = "Leg Extension"; equipmentType = "Machine"; muscleGroup = "lower body" },
      { name = "Leg Curl"; equipmentType = "Machine"; muscleGroup = "lower body" },
      { name = "Shoulder Press Machine"; equipmentType = "Machine"; muscleGroup = "shoulders" },
      // Plate-Loaded Machine exercises
      { name = "Hack Squat"; equipmentType = "Plate-Loaded Machine"; muscleGroup = "lower body" },
      { name = "Seated Calf Raise"; equipmentType = "Plate-Loaded Machine"; muscleGroup = "lower body" },
      { name = "Chest Press Machine"; equipmentType = "Plate-Loaded Machine"; muscleGroup = "chest" },
      // Cable exercises
      { name = "Cable Tricep Pushdowns"; equipmentType = "Cable"; muscleGroup = "triceps" },
      { name = "Cable Bicep Curls"; equipmentType = "Cable"; muscleGroup = "biceps" },
      { name = "Cable Flyes"; equipmentType = "Cable"; muscleGroup = "chest" },
      { name = "Cable Rows"; equipmentType = "Cable"; muscleGroup = "back" },
      { name = "Cable Lat Pulldowns"; equipmentType = "Cable"; muscleGroup = "back" },
    ];

    for (exercise in initialExercises.values()) {
      ignore await createExercise(exercise.name, exercise.equipmentType, exercise.muscleGroup);
    };
  };
};
