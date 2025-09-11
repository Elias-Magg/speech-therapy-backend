CREATE SCHEMA IF NOT EXISTS speech_therapy;

CREATE TABLE IF NOT EXISTS speech_therapy.exercise_bundle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT null,
    global BOOL not null
);

CREATE TABLE IF NOT EXISTS speech_therapy.exercise (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id UUID NOT NULL,
    step int NOT NULL,
    title TEXT NOT null,
    description TEXT,
    audio BYTEA,
    picture BYTEA,
    video_file_path TEXT,
    FOREIGN KEY (bundle_id) REFERENCES speech_therapy.exercise_bundle(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS speech_therapy.user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    year_of_birth INT CHECK (year_of_birth >= 1900 AND year_of_birth <= EXTRACT(YEAR FROM CURRENT_DATE)),
    type TEXT NOT NULL CHECK (type IN ('clinician', 'patient', 'admin')),
    clinician_id UUID,
    email TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    FOREIGN KEY (clinician_id) REFERENCES speech_therapy.user(id)
);


CREATE TABLE IF NOT EXISTS speech_therapy.user_bundle (
    user_id UUID NOT NULL,
    bundle_id UUID NOT NULL,
    PRIMARY KEY (user_id, bundle_id),
    FOREIGN KEY (user_id) REFERENCES speech_therapy.user(id) ON DELETE CASCADE,
    FOREIGN KEY (bundle_id) REFERENCES speech_therapy.exercise_bundle(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS speech_therapy.clinician_patient_note (
  clinician_id UUID NOT NULL
    REFERENCES speech_therapy."user"(id) ON DELETE CASCADE,
  patient_id   UUID NOT NULL
    REFERENCES speech_therapy."user"(id) ON DELETE CASCADE,
  note         TEXT NOT NULL DEFAULT '',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (clinician_id, patient_id)
);