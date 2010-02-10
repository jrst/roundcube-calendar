/**
 * RoundCube Calendar
 *
 * Plugin to add a calendar to RoundCube.
 *
 * @version 0.2 BETA 2
 * @author Lazlo Westerhof
 * @url http://rc-calendar.lazlo.me
 * @licence GNU GPL
 * @copyright (c) 2010 Lazlo Westerhof - Netherlands
 *
 **/
$(document).ready(function() {
  
  // start loading
  rcmail.set_busy(true,'loading');
  setTimeout("rcmail.set_busy(false)",3000);

  rcmail.addEventListener('plugin.reloadCalendar', reloadCalendar);       
  // get settings
  rcmail.addEventListener('plugin.getSettings', setSettings);
  rcmail.http_post('plugin.getSettings', '');
  
  function setSettings(response) {
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaDay ,agendaWeek, month'
    },
    height : $(window).height() - 90,

    editable: true,

    events: "./?_task=dummy&_action=plugin.getEvents",
    
    monthNames : response.settings['months'],
    monthNamesShort : response.settings['months_short'],
    dayNames : response.settings['days'],
    dayNamesShort : response.settings['days_short'],
    firstDay : response.settings['first_day'],
    firstHour : response.settings['first_hour'],
    slotMinutes : 60/response.settings['timeslots'],
    timeFormat: response.settings['time_format'],
    axisFormat : response.settings['time_format'],
    defaultView: response.settings['default_view'],
    allDayText: rcmail.gettext('all-day', 'calendar'),

    buttonText: {
      today: response.settings['today'],
      day: rcmail.gettext('day', 'calendar'),
      week: rcmail.gettext('week', 'calendar'),
      month: rcmail.gettext('month', 'calendar')
    },
    
    eventRender: function(event, element) {
      if(event.description.length) { 
        element.qtip({
          content: event.description
        });
      }
    },
    eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
      if(event.end == null) {
        event.end = event.start;
      }
      // send request to RoundCube
      rcmail.http_post('plugin.moveEvent', '_event_id='+event.id+'&_start='+event.start.getTime()/1000+'&_end='+event.end.getTime()/1000+'&_allDay='+allDay);
    },
    eventResize : function(event, delta) {
      // send request to RoundCube
      rcmail.http_post('plugin.resizeEvent', '_event_id='+event.id+'&_start='+event.start.getTime()/1000+'&_end='+event.end.getTime()/1000);
    },
    dayClick: function(date, allDay, jsEvent, view) {
         var $dialogContent = $("#event");
         $dialogContent.find("input").val("");
         $dialogContent.find("textarea").val("");
         var summary = $dialogContent.find("input[name='summary']");
         var description = $dialogContent.find("textarea[name='description']");

         var save = rcmail.gettext('save', 'calendar');
         var cancel = rcmail.gettext('cancel', 'calendar');
         var buttons = {};
         buttons[save] = function() {
           // send request to RoundCube
           rcmail.set_busy(true,'loading');
           rcmail.http_post('plugin.newEvent', '_start='+date.getTime()/1000+'&_summary='+summary.val()+'&_description='+description.val()+'&_allDay='+allDay);

           $dialogContent.dialog("close");
         };
         buttons[cancel] = function() {
           $dialogContent.dialog("close");
         };
         
         $dialogContent.dialog({
            modal: true,
            title: rcmail.gettext('new_event', 'calendar'),
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
            },
            buttons: buttons
         }).show();
      },
      eventClick : function(event) {
         var $dialogContent = $("#event");
         $dialogContent.find("input").val("");
         $dialogContent.find("textarea").val("");
         var summary = $dialogContent.find("input[name='summary']").val(event.title);
         var description = $dialogContent.find("textarea[name='description']").val(event.description);
         
         var save = rcmail.gettext('save', 'calendar');
         var remove = rcmail.gettext('remove', 'calendar');
         var cancel = rcmail.gettext('cancel', 'calendar');
         var buttons = {};
         buttons[save] = function() {
          event.title = summary.val();
          event.description = description.val();

          // send request to RoundCube
          rcmail.http_post('plugin.editEvent', '_event_id='+event.id+'&_summary='+event.title+'&_description='+description.val());

          $('#calendar').fullCalendar('updateEvent', event);
          $dialogContent.dialog("close");
         };
         buttons[remove] = function() {
          // send request to RoundCube
          rcmail.http_post('plugin.removeEvent', '_event_id='+event.id);

          $('#calendar').fullCalendar('removeEvents', event.id);

          $dialogContent.dialog("close");
         };
         buttons[cancel] = function() {
           $dialogContent.dialog("close");
         };

         $dialogContent.dialog({
            modal: true,
            title: rcmail.gettext('edit_event', 'calendar'),
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
            },
            buttons: buttons
         }).show();
      }
    });
    $('#export').show();
  }
  
  // reload calendar
  function reloadCalendar() {
    $('#calendar').fullCalendar( 'refetchEvents');
    rcmail.set_busy(false);
  }
});