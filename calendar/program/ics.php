<?php
/**
 * RoundCube Calendar
 *
 * Import from and export to iCalendar (.ics) format.
 *
 * @version 0.2 BETA 2
 * @author Lazlo Westerhof
 * @author Michael Duelli
 * @url http://rc-calendar.lazlo.me
 * @licence GNU GPL
 * @copyright (c) 2010 Lazlo Westerhof - Netherlands
 */
class iCalendar
{
  private $rcmail = null;
  private $backend = null;

  public function __construct($rcmail, $backend) {
    $this->rcmail = $rcmail;
    $this->backend = $backend;
  }

  /**
   * Import events from iCalendar format
   *
   * @param  array Associative events array
   * @access public
   */
  public function importEvents($events) {
    //TODO
    // for ($events as $event)
    //   $this->backend->newEvent(...);
  }
  
  /**
   * Export events to iCalendar format
   *
   * @param  integer Start time events window
   * @param  integer End time events window
   * @return string  Events in iCalendar format (http://tools.ietf.org/html/rfc5545)
   * @access public
   */
  public function exportEvents($start, $end) {
    if (!empty($this->rcmail->user->ID)) { // FIXME What for? (if not required, we would not need rcmail in here at all!)
      
      $events = $this->backend->getEvents($start, $end);

      $ical = "BEGIN:VCALENDAR\n";
      $ical .= "VERSION:2.0\n";
      $ical .= "PRODID:-//RoundCube Webmail//NONSGML Calendar//EN\n";
      foreach ($events as $event) {
        $ical .= "BEGIN:VEVENT\n";
        $ical .= "DTSTART:" . date('Ymd\THis\Z',$event['start'] - date('Z')) . "\n";
        if($start != $end) {
          $ical .= "DTEND:" . date('Ymd\THis\Z',$event['end'] - date('Z')) . "\n";
        }
        $ical .= "SUMMARY:" . $event['summary'] . "\n";
        $ical .= "DESCRIPTION:" . $event['description'] . "\n";
        if(!empty($event['location'])) {
          $ical .= "LOCATION:" . $event['location'] . "\n";
        }
        if(!empty($event['categories'])) {
          $ical .= "CATEGORIES:" . strtoupper($event['categories']) . "\n";
        }
        $ical .= "END:VEVENT\n";
      }
      $ical .= "END:VCALENDAR";

      return $ical;
    }
  }
}
