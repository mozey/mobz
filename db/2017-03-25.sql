create table "user" (
    -- https://www.postgresql.org/docs/8.3/static/datatype-uuid.html
    id uuid,
    -- http://stackoverflow.com/a/1076755/639133
    ip varchar(50),
    primary key (id)
);

create table mobz (
    id   uuid,
    -- Must be characters a-z and 0-9
    -- Math.pow((26+10), 6) = 2 176 782 336 unique links
    link varchar(6),
    dest point,
    -- Assume all timestamps in db is UTC
    time timestamp,
    primary key (id)
);

create table mobz_user (
    userId uuid references "user" (id),
    mobzId uuid references mobz (id)
);

create table stop (
    id     uuid,
    coords point,
    primary key (id)
);

create table stopMeta (
    id    uuid,
    key   varchar(100),
    value text,
    primary key (id)
);

