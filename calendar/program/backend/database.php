<?php
/**
 * RoundCube Calendar
 *
 * Database backend
 *
 * @version 0.2 BETA 2
 * @author Lazlo Westerhof
 * @author Michael Duelli
 * @url http://rc-calendar.lazlo.me
 * @licence GNU GPL
 * @copyright (c) 2010 Lazlo Westerhof - Netherlands
 */
require_once('backend.php');

final class Database extends Backend 
{
  private $rcmail;
  
  public function __construct($rcmail) {
    $this->rcmail = $rcmail;
  }
  
  public function newEvent($start, $summary, $description, $location, $categories, $allDay) {
    if (!empty($this->rcmail->user->ID)) {
      $query = $this->rcmail->db->query(
        "INSERT INTO events
         (user_id, start, end, summary, description, location, categories, all_day)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        $this->rcmail->user->ID,
        $start,
        $start,
        $summary,
        $description,
        $location,
        $categories,    
        $allDay
      );
      $this->rcmail->db->insert_id('events');
    }
  }

  public function editEvent($id, $summary, $description, $location, $categories) {
    if (!empty($this->rcmail->user->ID)) {
      $query = $this->rcmail->db->query(
        "UPDATE events 
         SET summary = ?, description = ?, location = ?, categories = ?
         WHERE event_id = ?
         AND user_id = ?",
        $summary,
        $description,
        $location,
        $categories,
        $id,
        $this->rcmail->user->ID
      );
    }
  }

  public function moveEvent($id, $start, $end, $allDay) {
    if (!empty($this->rcmail->user->ID)) {
      $query = $this->rcmail->db->query(
        "UPDATE events 
         SET start = ?, end = ?, all_day = ?
         WHERE event_id = ?
         AND user_id = ?",
        $start,
        $end,
        $allDay,
        $id,
        $this->rcmail->user->ID
      );
    }
  }
  
  public function resizeEvent($id, $start, $end) {
    if (!empty($this->rcmail->user->ID)) {
      $query = $this->rcmail->db->query(
        "UPDATE events 
         SET start = ?, end = ?
         WHERE event_id = ?
         AND user_id = ?",
        $start,
        $end,
        $id,
        $this->rcmail->user->ID
      );
    }
  }

  public function removeEvent($id) {
    if (!empty($this->rcmail->user->ID)) {
      $query = $this->rcmail->db->query(
        "DELETE FROM events
         WHERE event_id=?
         AND user_id=?",
         $id,
         $this->rcmail->user->ID
      );
    }
  }
  
  public function getEvents($start, $end) {
    if (!empty($this->rcmail->user->ID)) {

      $result = $this->rcmail->db->query(
        "SELECT * FROM events 
         WHERE user_id=?",
         $this->rcmail->user->ID
       );

      $events = array(); 
      while ($result && ($event = $this->rcmail->db->fetch_assoc($result))) {
        $events[]=array( 
          'event_id'    => $event['event_id'], 
          'start'       => $this->fromGMT($event['start']), 
          'end'         => $this->fromGMT($event['end']), 
          'summary'     => $event['summary'], 
          'description' => $event['description'],
          'location'    => $event['location'],
          'categories'  => $event['categories'],
          'allDay'      => $event['all_day'],
        ); 
      }

      return $events;
    }
  }
}
?>
