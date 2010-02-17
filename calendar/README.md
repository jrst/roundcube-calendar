RoundCube Calendar
==================

Version:   0.2 BETA 2
License:   GNU GPL
Copyright: (c) 2010 Lazlo Westerhof - Netherlands
Website:   [rc-calendar.lazlo.me](http://rc-calendar.lazlo.me/ "RoundCube Calendar")
  
Features
--------

*  full calendar
* add/edit/remove events
* custom backend support
* basic event categories
* export events to ICS
* and more...

Installation
------------

1. Unpack the RoundCube calendar package you downloaded
2. Move the calendar folder into RoundCube's plugins folder
3. Run the SQL file in /calendar/SQL/
4. Remove the SQL folder
5. Login into RoundCube and click on Calendar in the menu
6. Voila!

Skins / Themes
--------------

This plugin is skinable.

This plugin ships a default skin which fits to the default skin of
RoundCube.

The plugin tries to load a plugin skin which is named after the skin
which is set for the whole RoundCube installation. The plugin's
default skin is used as the fallback if no customized skin of that
name exists.

To create your own skin, create a new directory (e.g., "myskin") in the 
this plugin's skins/ directory. Then copy the files you want to adopt
from the default skin to the folder of your new skin. Files which are
not found in the customized skin will be taken from the default skin.

Backends
--------

The plugin separates the calendar view from the underlying backend.

The following backends are available:

0. "dummy": A demonstrator for basic calendar functionality.

In contrast to other backends, "dummy" does not depend on any
databases or servers.

1. "database": The default backend

Local SQL database. There is a SQL file to initially set up the
databases and tables.

2. "google": (Status: coming soon)

Requires a Google account!

3. "caldav": (Status: alpha)

Note: This backend has only been tested with a DAViCal 0.9.7 server!

### Features:
* Event viewing (getEvents)
* Users: Either a fixed user and password is given in config.inc.php or you set
    $rcmail_config['caldav_use_roundcube_login'] = true;
  to use the RoundCube login and password for the CalDAV server. Useful when
  RoundCube webmail and CalDAV server are operated in an LDAP domain.

### Known issues:
* Cannot add/remove/move/resize events
* Different calendars per user cannot be explicitly selected
  -> needs new options for settings
* Possible problems with multiple lines in descriptions
* ... (guess there are more issues :-)

License
-------

RoundCube Calendar is licensed under the GPL License v2.
