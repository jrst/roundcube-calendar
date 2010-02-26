/**
 * RoundCube Calendar
 *
 * Plugin to add a calendar to RoundCube.
 *
 * @version 0.2 BETA 2
 * @author Lazlo Westerhof
 * @author Roland Liebl
 * @url http://rc-calendar.lazlo.me
 * @licence GNU GPL
 * @copyright (c) 2010 Lazlo Westerhof - Netherlands
 *
 **/

/* calendar initialization */
$(document).ready(function() {
  
  // start loading
  rcmail.set_busy(true,'loading');

  rcmail.addEventListener('plugin.reloadCalendar', reloadCalendar);
  // get settings
  rcmail.addEventListener('plugin.getSettings', setSettings);
  rcmail.http_post('plugin.getSettings', '');

  function setSettings(response) {
  rcmail.set_busy(false,'loading');
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaDay ,agendaWeek, month'
    },
    height : $(window).height() - 100,

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

    loading : function(isLoading) {
      if(isLoading) {
        rcmail.enable_command('plugin.calendar_print', false);
        rcmail.set_busy(true,'loading');
      } else {
        rcmail.set_busy(false,'loading');
        /* datepicker localization */
        Date.dayNames = [
                          response.settings['days'][0],
                          response.settings['days'][1],
                          response.settings['days'][2],
                          response.settings['days'][3],
                          response.settings['days'][4],
                          response.settings['days'][5],
                          response.settings['days'][6]
                         ];
        Date.abbrDayNames = [
                          response.settings['days_short'][0],
                          response.settings['days_short'][1],
                          response.settings['days_short'][2],
                          response.settings['days_short'][3],
                          response.settings['days_short'][4],
                          response.settings['days_short'][5],
                          response.settings['days_short'][6]
                            ];
        Date.monthNames = [
                          response.settings['months'][0],
                          response.settings['months'][1],
                          response.settings['months'][2],
                          response.settings['months'][3],
                          response.settings['months'][4],
                          response.settings['months'][5],
                          response.settings['months'][6],
                          response.settings['months'][7],
                          response.settings['months'][8],
                          response.settings['months'][9],
                          response.settings['months'][10],
                          response.settings['months'][11]
                          ];
        Date.abbrMonthNames = [
                          response.settings['months_short'][0],
                          response.settings['months_short'][1],
                          response.settings['months_short'][2],
                          response.settings['months_short'][3],
                          response.settings['months_short'][4],
                          response.settings['months_short'][5],
                          response.settings['months_short'][6],
                          response.settings['months_short'][7],
                          response.settings['months_short'][8],
                          response.settings['months_short'][9],
                          response.settings['months_short'][10],
                          response.settings['months_short'][11]
                          ];

        Date.firstDayOfWeek = response.settings['first_day'];
        
        /* refresh print preview */
        if(calpopup){
          previewPrintEvents();
        }
      }
    },    
    eventRender: function(event, element, view) {
      rcmail.enable_command('plugin.calendar_print', true);
      if(view.name != "month") {
        if (event.className) {
          if(!event.allDay)
            element.find('span.fc-event-title').after("<span class=\"fc-event-categories\">"+rcmail.gettext(event.className, 'calendar')+"</span>");
        }
        if (event.location) {
          element.find('span.fc-event-title').after("<span class=\"fc-event-location\">@"+event.location+"</span>");
        }
        if (event.description) {
          if(!event.allDay){
            var mydescription = event.description;
            if(mydescription.length > 20)
              mydescription = mydescription.substring(0,20) + " ...";
            element.find('span.fc-event-title').after("<span class=\"fc-event-description\">"+mydescription+"</span>");
          }
        }
      }
      if(event.description.length && event.description.length > 20) {
        element.qtip({
          content: {
            text: "<pre>"+event.description+"</pre>"
          },
          position: {
            corner: {
              target: 'mouse',
              tooltip: 'bottomLeft'
            },
            hide: {
              fixed: true,
              when: {
                event: 'mouseout'
              }
            }
          }
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
         resetForm($dialogContent);
         var summary = $dialogContent.find("input[name='summary']");
         var description = $dialogContent.find("textarea[name='description']");
         var categories = $dialogContent.find("select[name='categories']");
         var location = $dialogContent.find("input[name='location']");

         var save = rcmail.gettext('save', 'calendar');
         var cancel = rcmail.gettext('cancel', 'calendar');
         var buttons = {};
         buttons[save] = function() {
           // send request to RoundCube
           rcmail.http_post('plugin.newEvent', '_start='+date.getTime()/1000+'&_summary='+summary.val()+'&_description='+description.val()+'&_location='+location.val()+'&_categories='+categories.val()+'&_allDay='+allDay);

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
         resetForm($dialogContent);
         var summary = $dialogContent.find("input[name='summary']").val(event.title);
         var description = $dialogContent.find("textarea[name='description']").val(event.description);
         var location = $dialogContent.find("input[name='location']").val(event.location);
         var categories = $dialogContent.find("select[name='categories']").val(event.className);

         var save = rcmail.gettext('save', 'calendar');
         var remove = rcmail.gettext('remove', 'calendar');
         var cancel = rcmail.gettext('cancel', 'calendar');
         var buttons = {};
         buttons[save] = function() {
          event.title = summary.val();
          event.description = description.val();
          event.location = location.val();
          event.className = categories.val();

          // send request to RoundCube
          rcmail.http_post('plugin.editEvent', '_event_id='+event.id+'&_summary='+event.title+'&_description='+description.val()+'&_location='+location.val()+'&_categories='+categories.val());

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
    $('#toolbar').show();
  }
  
  // reload calendar
  function reloadCalendar() {
    $('#calendar').fullCalendar( 'refetchEvents');
  }
  
  // reset form
  function resetForm($dialogContent) {
    $dialogContent.find("input").val("");
    $dialogContent.find("textarea").val("");
    $dialogContent.find("select").val("");
  }
  
  /* datepicker localization */
  $.dpText = {
    TEXT_PREV_YEAR: rcmail.gettext('prev_year','calendar'),
    TEXT_PREV_MONTH: rcmail.gettext('prev_month','calendar'),
    TEXT_NEXT_YEAR: rcmail.gettext('next_year','calendar'),
    TEXT_NEXT_MONTH: rcmail.gettext('next_month','calendar'),
    TEXT_CLOSE: rcmail.gettext('cancel','calendar'),
    TEXT_CHOOSE_DATE: rcmail.gettext('choose_date','calendar'),
    HEADER_FORMAT: 'mmmm yyyy'
  }
  
  /* datepicker initialization */
  $(function()
  {
    Date.format = 'dd/mm/yyyy';
    var dp_start = '01/01/1900';

    $('.date-pick')
      .datePicker({
        createButton:false,
        startDate:dp_start,
        displayClose:true
      })
      .bind(
        'click',
        function()
        {
          $(this).dpDisplay();
          this.blur();
          return false;
        }
      )
      .bind(
        'dateSelected',
        function(e, selectedDate, $td)
        {
          $('#calendar').fullCalendar( 'gotoDate', $.fullCalendar.parseDate(selectedDate));
        }
      );
      $('#dp_position').dpSetPosition($.dpConst.POS_BOTTOM, $.dpConst.POS_RIGHT);
  });
  
  /* enable GUI commands */
  /* export events */
  function exportEvents() {
    return true;
  }
  rcmail.register_command('plugin.exportEvents', exportEvents, true);
  
  /* date picker */
  function selectDate() {
    return true;
  }
  rcmail.register_command('plugin.calendar_datepicker', selectDate, true);

  /* print events */
  var calpopup;
  function previewPrintEvents(){
    var url = './?_task=dummy&_action=plugin.calendar_print';
    url = url + '&_view='  + escape($('#calendar').fullCalendar('getView').name.replace('agenda','basic'));
    url = url + '&_date='   + escape($('#calendar').fullCalendar('getDate'));
    calpopup = window.open(url, "Print", "width=720,height=740,location=0,resizable=1,scrollbars=1");
    calpopup.focus();
    return true;
  }
  rcmail.register_command('plugin.calendar_print', previewPrintEvents);

});