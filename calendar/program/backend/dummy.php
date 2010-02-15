<?php
/**
 * RoundCube Calendar
 *
 * A dummy backend which simply demonstrates functionality
 * without the need for a fully configured backend.
 *
 * @version 0.2 BETA 2
 * @author Michael Duelli
 * @author Lazlo Westerhof
 * @url http://rc-calendar.lazlo.me
 * @licence GNU GPL
 * @copyright (c) 2010 Lazlo Westerhof - Netherlands
 */
require_once('backend.php');

final class Dummy extends Backend 
{
  public function newEvent($start, $summary, $description, $location, $categories, $allDay) {
  }

  public function editEvent($id, $summary, $description, $location, $categories) {
  }

  public function moveEvent($id, $start, $end, $allDay) {
  }
  
  public function resizeEvent($id, $start, $end) {
  }

  public function removeEvent($id) {
  }
  
  public function getEvents($start, $end) {
    $events = array();
    
    $events[]=array( 
      'event_id'    => 0,
      'start'       => strtotime($start),
      'end'         => strtotime($end),
      'summary'     => 'A dummy summary',
      'description' => 'A dummy description',
      'location'    => 'A dummy location',
      'categories'  => 'dummy',
      'allDay'      => 0,
    );
    
    return $events;
  }
}
?>