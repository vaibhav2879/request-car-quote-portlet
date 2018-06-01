function MonthAsString(monthIndex) {
  var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return month[monthIndex];
}

function StringAsMonth(str){
  var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var index = month.indexOf(str);
  if (index < 0) {
    return false;
  }else{
    var tmp = index + 1;
    if (String(tmp).length === 1) {
      return '0'+tmp;
    }else{
      String(tmp);
    }
  }
}

function YYYYMMDDtofancyDate(date){
  var today = new Date();
  var todaydd = String(today.getDate());
  if (todaydd.length === 1) {
    todaydd = '0'+todaydd;
  }
  var todaymm = String(today.getMonth()+1)
  if (todaymm.length === 1) {
    todaymm = '0'+todaymm;
  }
  var todaysDate = today.getFullYear()+'-'+todaymm+'-'+todaydd;
  var prestring = "";
  if (todaysDate === date) {
    prestring = "Today, ";
  }
  // console.log(todaysDate);
  var tmp = date.split("-");
  var compiledDate = new Date(date);
  var day = DayAsString(compiledDate.getDay());
  var itemLength = tmp.length;
  var yyyy = tmp[0];
  var mm = MonthAsString((parseInt(tmp[1]) - 1));
  var dd = tmp[2];
  if (String(dd).length === 1) {
    dd = '0'+dd; 
  }
  return prestring+day+', '+dd+' '+mm+' '+yyyy;
}


function fancyDateToYYYYMMDD(date){
  var tmp = date.split(" ");
  var itemLength = tmp.length;
  var yyyy = tmp[parseInt(itemLength) - 1];
  var mm = StringAsMonth(tmp[parseInt(itemLength) - 2]);
  var dd = tmp[parseInt(itemLength) - 3];
  if (String(dd).length === 1) {
    dd = '0'+dd; 
  }
  return yyyy+'-'+mm+'-'+dd;
}

function reverseDateFormat(date,seperator){
  var tmp = date.split(seperator);
  return String(tmp[2])+'-'+String(tmp[1])+'-'+String(tmp[0]);
}


function DayAsString(dayIndex) {
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays[dayIndex];
}



jQuery.fn.weekDaysPicker = function(args){
  return this.each(function(iteration){
    var $currObj = $(this),
        option = typeof args === "undefined" ? {} : args;
        $currObj.attr("readonly","readonly");
    function GetDates(params) {
      let aryDates = [],
          numOfDays = params.numOfDays;

      if (option.allowWeekends) {
        for (var i = 0; i < numOfDays; i++) {
          var currentDate = new Date();
          currentDate.setDate(startDate.getDate() + i);
          let day = DayAsString(currentDate.getDay()),
              preString = '';
          // if (day !== "Sunday" && day !== "Saturday") {
            if (i === 0) {preString = 'Today, '}
            if (i === 1) {preString = 'Tomorrow, '}
            let tmp = {
              dateVal : $$libs.dateDDMMYYY(currentDate),
              dateString : preString + DayAsString(currentDate.getDay()) + ", " + currentDate.getDate() + " " + MonthAsString(currentDate.getMonth()) + " " + currentDate.getFullYear()
            }
            aryDates.push(tmp);
          
        }
        return aryDates;
      }else{
        for (var i = 0; i < numOfDays; i++) {
          var currentDate = new Date();
          currentDate.setDate(startDate.getDate() + i);
          let day = DayAsString(currentDate.getDay()),
              preString = '';
          if (day !== "Sunday" && day !== "Saturday") {
            if (i === 0) {preString = 'Today, '}
            if (i === 1) {preString = 'Tomorrow, '}
            let tmp = {
              dateVal : $$libs.dateDDMMYYY(currentDate),
              dateString : preString + DayAsString(currentDate.getDay()) + ", " + currentDate.getDate() + " " + MonthAsString(currentDate.getMonth()) + " " + currentDate.getFullYear()
            }
            aryDates.push(tmp);
          
          }else{
            numOfDays++;
          }
        }
        return aryDates;
      }
    }

    let inputParams = args ? args : {};
    let startDate = new Date(),
    options = {
      startDate : startDate,
      numOfDays : inputParams.numOfDays ? inputParams.numOfDays : 7,
      disableDates : inputParams.disableDates ? inputParams.disableDates : [], 
    }

    function makeDropDown (aryDates){
      let $elem = $('<div class="date-dropdown mytoll-date-dropdown"></div>'),
      $ul = $('<ul class="date-list"></ul>');
      $currObj.off('keydown');
      $currObj.on('keydown',function (e) {
        if (e.which === 9) {
          $elem.removeClass('open');
        }
      });
      for (var i = 0; i < aryDates.length; i++) {
        let tmp = '<li data-val="'+aryDates[i]["dateVal"]+'">'+aryDates[i]["dateString"]+'</li>';
        $ul.append(tmp);
        if (i === (aryDates.length - 1)) {
          $elem.append($ul);
          let $ddBoxParent = $currObj.parent();
            $ddBoxParent.find('.date-dropdown').remove();
            $ddBoxParent.append($elem);
            $currObj.on('focus click',function(event){
              event.stopPropagation();
              $elem.addClass('open');
            });

            $(document).on('click',function(evnt){
              $elem.removeClass('open');
            });
            $elem.on('click',function(evt){
              evt.stopPropagation();
            });
            $elem.on('click','li',function(evt){
              let $currOpt = $(this);
              $currObj.val($currOpt.text());
              $currObj.attr('data-val',$currOpt.data('val'));
              $currObj.trigger('change');
              $elem.removeClass('open');
            });

            var $curOptionTrvs = '';
            $currObj.on('keydown',function(e){
              if (e.keyCode === 9) {
                $elem.removeClass('open');
              }
              if ($curOptionTrvs === '') {
                $curOptionTrvs = $elem.find('li:eq(0)');
                $curOptionTrvs.addClass('traversing');  
              }else{
                let currOptTrvsIndex = $curOptionTrvs.index();
                if (e.keyCode === 40) {
                  e.preventDefault();
                  if (currOptTrvsIndex < (aryDates.length - 1)) {
                    $curOptionTrvs.removeClass('traversing');
                    $curOptionTrvs.next().addClass('traversing');
                    $curOptionTrvs = $curOptionTrvs.next();
                  }
                }
                if (e.keyCode === 38) {
                  e.preventDefault();
                  if (currOptTrvsIndex > 0) {
                    $curOptionTrvs.removeClass('traversing');
                    $curOptionTrvs.prev().addClass('traversing');
                    $curOptionTrvs = $curOptionTrvs.prev();
                  }
                }
                if (e.keyCode === 13) {
                  if ($curOptionTrvs.length) {
                    // debugger;
                    $currObj.val($curOptionTrvs.text());
                    $currObj.attr('data-val',$curOptionTrvs.data('val'));
                    $currObj.trigger('change');
                    $elem.removeClass('open');
                  }
                }
                if (e.keyCode === 27) {
                  $elem.removeClass('open');
                }
              }
            });
        }
      }
    }
    var aryDates = GetDates(options);
    makeDropDown(aryDates);
  });
}