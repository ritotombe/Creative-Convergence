$( function() {
  $("#date_picker").flatpickr({
       mode:"range",
       allowInput: true,
       dateFormat: "d/m/Y"
     });

  $('#flat-slider-age').slider({
    orientation: 'horizontal',
    range:       true,
    values:      [17,67],
    max:         90,
    min:         3,
    slide: function( event, ui ) {
        $( "#min-age" ).html(ui.values[0]);
        $( "#max-age" ).html(ui.values[1]);
    }
    });
  $( "#min-age" ).html($( "#flat-slider-age" ).slider( "values", 0 ));
  $( "#max-age" ).html($( "#flat-slider-age" ).slider( "values", 1 ));

  $('#flat-slider-household').slider({
    orientation: 'horizontal',
    range:       true,
    values:      [800,1500],
    max:         2000,
    min:         200,
    slide: function( event, ui ) {
        $( "#min-income" ).html("$" + ui.values[0]);
        $( "#max-income" ).html("$" +ui.values[1]);
    }
    });
    $( "#min-income" ).html("$" + $( "#flat-slider-household" ).slider( "values", 0 ));
    $( "#max-income" ).html("$" + $( "#flat-slider-household" ).slider( "values", 1 ));

    $('#popover-age-info').popover({
      trigger: 'hover',
      container: '#filter_panel'
      });
 } );
