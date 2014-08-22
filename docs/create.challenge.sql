--
-- PostgreSQL database dump challenge table v0.0.2
--

CREATE TABLE challenges (
    id integer NOT NULL,
    "regStartDate" timestamp with time zone,
    "subEndDate" timestamp with time zone,
    title character varying(128),
    type character varying(32),
    overview character varying(140),
    description text,
    "registeredDescription" text,
    tags text[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE SEQUENCE challenges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- alter table from v0.0.1
--
/*
 ALTER TABLE IF EXISTS challenges RENAME COLUMN "startDate" to "regStartDate";
 ALTER TABLE IF EXISTS challenges RENAME COLUMN "endDate" to "subEndDate";
 ALTER TABLE IF EXISTS challenges ALTER COLUMN  "title" TYPE character varying(128);
 ALTER TABLE IF EXISTS challenges ALTER COLUMN  "title" DROP NOT NULL
 ALTER TABLE IF EXISTS challenges ALTER COLUMN  "overview"  TYPE character varying(140);
 ALTER TABLE IF EXISTS challenges ALTER COLUMN  "description"  TYPE text;
 ALTER TABLE IF EXISTS challenges DROP COLUMN "functionalRequirements";
 ALTER TABLE IF EXISTS challenges ADD COLUMN "registeredDescription" text;
