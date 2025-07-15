class DefaultExerciseBundle {
    id;
    title;
    exercises;
    constructor(id, title, exercise) {
        this.id = id;
        this.title = title;
        this.exercises = exercise;
    }
}
module.exports = DefaultExerciseBundle;