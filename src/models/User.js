class User {
    id;
    type;
    email;
    name;
    surname;
    clinician_id;
    constructor(id, type, email, name, surname, clinician_id) {
        this.id = id;
        this.type = type;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.clinician_id = clinician_id;
    }
}
module.exports = User;