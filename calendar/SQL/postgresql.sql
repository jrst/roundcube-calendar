/**
 * RoundCube Calendar
 *
 * Plugin to add a calendar to RoundCube.
 *
 * @version 0.2 BETA 2
 * @author Lazlo Westerhof
 * @author Albert Lee
 * @url http://rc-calendar.lazlo.me
 * @licence GNU GPL
 * @copyright (c) 2010 Lazlo Westerhof - Netherlands
 *
 **/

CREATE SEQUENCE event_ids
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;

CREATE TABLE events (
    event_id integer DEFAULT nextval('event_ids'::regclass) NOT NULL,
    user_id integer NOT NULL,
    "start" timestamp without time zone DEFAULT now() NOT NULL,
    "end" timestamp without time zone DEFAULT now() NOT NULL,
    "summary" character varying(255) NOT NULL,
    "description" text NOT NULL,
    "location" character varying(255) NOT NULL,
    "categories" character varying(255) NOT NULL,
    "all_day" smallint NOT NULL DEFAULT 0
);

CREATE INDEX events_event_id_idx ON events USING btree (event_id);


--
-- Constraints Table `events`
--
ALTER TABLE ONLY events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
