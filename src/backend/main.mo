import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
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
    let validTypes = [
      "Dumbbell",
      "Barbell",
      "Free Weight",
      "Machine",
      "Plate-Loaded Machine",
      "Cable",
      "Treadmill",
      "Assault Bike",
      "Bike",
      "Stairmaster",
    ];
    if (not Array.fromIter(validTypes.values()).any(func(x) { x == equipmentType })) {
      Runtime.trap("Invalid equipment type");
    };
  };

  func validateMuscleGroup(muscleGroup : Text) {
    let validGroups = [
      "back",
      "chest",
      "biceps",
      "triceps",
      "shoulders",
      "core",
      "lower body",
      "full body",
    ];
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
};
