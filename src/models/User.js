class User {
    id;
    type;
    name;
    surname;
    exerciseBundles;
    constructor(id,type, name, surname, exerciseBundles) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.surname = surname;
        this.exerciseBundles = exerciseBundles;
    }
}
module.exports = User;