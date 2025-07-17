class ExerciseBundle {
    id;
    title;
    exercises;  //list of exercises
    global;
    constructor(id, title, exercises, global) {
        this.id = id;
        this.title = title;
        this.exercises = exercises;
        this.global = global;
    }
}
module.exports = ExerciseBundle;