import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  type Exercise = {
    name : Text;
    equipmentType : Text;
    muscleGroup : Text;
  };

  type OldActor = {
    var exerciseIdCounter : Nat;
    exercises : Map.Map<Nat, Exercise>;
  };

  type NewActor = {
    var exerciseIdCounter : Nat;
    exercises : Map.Map<Nat, Exercise>;
  };

  public func run(old : OldActor) : NewActor {
    let newExercises = List.fromArray<Exercise>([
      { name = "Alternating Single-Leg Squat"; equipmentType = "Free Weight"; muscleGroup = "lower body" },
      { name = "Machine Single-Leg Extensions"; equipmentType = "Machine"; muscleGroup = "lower body" },
      { name = "Single-Leg Hamstring Curls"; equipmentType = "Machine"; muscleGroup = "lower body" },
      { name = "Hip Adduction"; equipmentType = "Machine"; muscleGroup = "lower body" },
      { name = "Dumbbell Incline Bench Press"; equipmentType = "Dumbbell"; muscleGroup = "chest" },
      { name = "Machine Chest Press"; equipmentType = "Machine"; muscleGroup = "chest" },
      { name = "Machine Fly"; equipmentType = "Machine"; muscleGroup = "chest" },
      { name = "Dumbbell Chest Press"; equipmentType = "Dumbbell"; muscleGroup = "chest" },
      { name = "Machine Supported Row"; equipmentType = "Machine"; muscleGroup = "back" },
      { name = "Machine Lat Pulldown"; equipmentType = "Machine"; muscleGroup = "back" },
      { name = "Cable Row"; equipmentType = "Cable"; muscleGroup = "back" },
      { name = "Closed-Grip Cable Lat Pulldowns"; equipmentType = "Cable"; muscleGroup = "back" },
      { name = "Machine Rear Delt Fly"; equipmentType = "Machine"; muscleGroup = "shoulders" },
      { name = "Machine Shoulder Raises"; equipmentType = "Machine"; muscleGroup = "shoulders" },
      { name = "Dumbbell Shoulder Press"; equipmentType = "Dumbbell"; muscleGroup = "shoulders" },
      { name = "Dumbbell Shoulder Raises"; equipmentType = "Dumbbell"; muscleGroup = "shoulders" },
      { name = "Cable Shoulder Face Pulls"; equipmentType = "Cable"; muscleGroup = "shoulders" },
      { name = "Preacher Bench Bicep Curls"; equipmentType = "Free Weight"; muscleGroup = "biceps" },
      { name = "Preacher Bench Hammer Curls"; equipmentType = "Free Weight"; muscleGroup = "biceps" },
      { name = "Dumbbell Incline Bicep Curls"; equipmentType = "Dumbbell"; muscleGroup = "biceps" },
      { name = "Dumbbell Hammer Curls"; equipmentType = "Dumbbell"; muscleGroup = "biceps" },
      { name = "Dumbbell Preacher Bench Hammer Curls"; equipmentType = "Dumbbell"; muscleGroup = "biceps" },
      { name = "Tricep Overhead Extension"; equipmentType = "Cable"; muscleGroup = "triceps" },
      { name = "Cable Tricep Overhead Extension"; equipmentType = "Cable"; muscleGroup = "triceps" },
      { name = "Tricep Pulldown"; equipmentType = "Cable"; muscleGroup = "triceps" },
      { name = "Reverse Grip Tricep Pulldown"; equipmentType = "Cable"; muscleGroup = "triceps" },
      { name = "Cable Tricep Pulldowns"; equipmentType = "Cable"; muscleGroup = "triceps" },
      { name = "Cable Pallof Press"; equipmentType = "Cable"; muscleGroup = "core" },
      { name = "Cable Low–High"; equipmentType = "Cable"; muscleGroup = "core" },
      { name = "Cable High–Low"; equipmentType = "Cable"; muscleGroup = "core" },
    ]);

    var idCounter = 0;
    let exercisesMap = old.exercises;

    for (exercise in newExercises.values()) {
      exercisesMap.add(idCounter, exercise);
      idCounter += 1;
    };

    { var exerciseIdCounter = idCounter; exercises = exercisesMap };
  };
};
