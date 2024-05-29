-- this is a comment in SQL (yes, the space is needed!)
-- these statements will drop the tables, DELETE THE DATA and re-add the tables
-- never ever ever ever do this on live data!!!!
DROP TABLE IF EXISTS "like";
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS follow;
DROP TABLE IF EXISTS thread;
DROP TABLE IF EXISTS keyword;
DROP TABLE IF EXISTS profile;

-- create the profile entity
CREATE TABLE IF NOT EXISTS profile (
    -- this creates the attribute for the primary key
    -- UUID is the data type for keys/ids
    -- NOT NULL means the attribute is required!
    profile_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_about VARCHAR(512),
    profile_activation_token CHAR(32),
    -- to make sure duplicate data cannot exist, create a unique index
    profile_email VARCHAR(128) NOT NULL UNIQUE,
    -- to make something optional, exclude the not null
    profile_hash CHAR(97) NOT NULL,
    profile_image_url  VARCHAR(255),
    profile_name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS keyword (
    keyword_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword_name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS thread (
    thread_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_profile_id UUID NOT NULL REFERENCES profile(profile_id),
    thread_reply_thread_id UUID REFERENCES thread(thread_id) ON DELETE CASCADE,
    thread_content VARCHAR(140) NOT NULL,
    thread_datetime timestamptz NOT NULL DEFAULT NOW(),
    thread_image_url VARCHAR(255)
);
CREATE INDEX ON thread(thread_profile_id);

CREATE TABLE IF NOT EXISTS follow (
    -- this is the profile that is doing the following
    follow_profile_id UUID NOT NULL REFERENCES profile(profile_id),
    -- this is the profile that is being followed
    follow_following_profile_id UUID NOT NULL REFERENCES profile(profile_id),
    PRIMARY KEY(follow_profile_id, follow_following_profile_id)
);

CREATE TABLE IF NOT EXISTS tag (
    tag_keyword_id UUID NOT NULL REFERENCES keyword(keyword_id),
    tag_thread_id UUID NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,
    PRIMARY KEY(tag_thread_id, tag_keyword_id)
);

CREATE INDEX ON tag(tag_keyword_id);
CREATE INDEX ON tag(tag_thread_id);

CREATE TABLE IF NOT EXISTS "like" (
    like_profile_id UUID NOT NULL REFERENCES profile(profile_id),
    like_thread_id UUID NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,
    like_datetime timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY(like_profile_id, like_thread_id)
);
CREATE INDEX ON "like"(like_thread_id);
CREATE INDEX ON "like"(like_profile_id);