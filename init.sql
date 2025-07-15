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
    title TEXT NOT NULL,
    description TEXT,
    audio BYTEA,
    picture BYTEA,
    video_file_path TEXT,
    FOREIGN KEY (bundle_id) REFERENCES speech_therapy.exercise_bundle(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS speech_therapy.user (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	type TEXT NOT NULL CHECK (type IN ('user', 'clinician', 'admin')),
	name TEXT NOT NULL,
	surname TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS speech_therapy.user_bundle (
    user_id UUID NOT NULL,
    bundle_id UUID NOT NULL,
    PRIMARY KEY (user_id, bundle_id),
    FOREIGN KEY (user_id) REFERENCES speech_therapy.user(id) ON DELETE CASCADE,
    FOREIGN KEY (bundle_id) REFERENCES speech_therapy.exercise_bundle(id) ON DELETE CASCADE
);