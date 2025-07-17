class ExerciseBundle {
    id;
    title;
    exercises;  //list of exercises
    global;
    constructor(id, title, exercise, global) {
        this.id = id;
        this.title = title;
        this.exercises = exercise;
        this.global = global;
    }
}
module.exports = ExerciseBundle;