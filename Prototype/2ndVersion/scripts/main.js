$( function() {

    initiateDatePicker();
    initiateSliders();
    initiateInfo();

    // List Selection Drawer
    $('.list-item').click(function() {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
      } else {
        $(this).addClass("active");
      }
    })

    $('.reset-btn').click(function() {
      $('.filter-group, #main-search-panel').animate({
        left: -$('#filter_panel').width(),
      }, 200, function() {
          // TODO: After animation complete.
        }
      );
      $('.options-pane').animate({
        right: 0,
      }, 200, function() {
          // TODO: After animation complete.
        }
      );
    })

    $('.back-button').click(function() {
      $('.filter-group, #main-search-panel').animate({
        left: 0,
      }, 200, function() {
        // TODO: After animation complete.
        }
      );
      $('.options-pane').animate({
        right: -$('#filter_panel').width(),
      }, 200, function() {
        // TODO: After animation complete.
        }
      );
    })
    // List Selection Drawer - END

    // Main Pane Selector
    $('#tab-buttons a').click(function(){
      var $index = $(this).index();
      console.log($index);
      $('#main-panel-container').animate({
        left: -$('#main_panel').width() * $index
      }, 400);
    });
    // Main Pane Selector - END

    // Main Search
    // $('.tagsinput-primary, .bootstrap-tagsinput, .bootstrap-tagsinput > input, .tagsinput').focusin(function(){
    //   $('.tagsinput-primary').css({
    //     'max-height': 'none',
    //     'height': 'auto'
    //   });
    // });
    //
    // $('.bootstrap-tagsinput > input').focusout(function(){
    // console.log(!$('.tag').data('clicked'));
    //   if (!$('.tag').data('clicked')){
    //     $('.tag').data('clicked', false);
    //     $('.tagsinput-primary').animate({
    //       height: '40px'
    //     }, 200, function() {
    //       $('.tagsinput-primary').css({
    //           'max-height': '40px'
    //       });
    //     });
    //   }
    // });
    // Main Search - END

    function initiateSliders(){
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
    }

    function initiateInfo(){
      $('#popover-age-info').popover({
        trigger: 'hover',
        container: '#filter_panel'
        });

      $('#popover-income-info').popover({
        trigger: 'hover',
        container: '#filter_panel'
        });
     }

     function initiateDatePicker(){
       $("#date_picker").flatpickr({
            mode:"range",
            allowInput: true,
            dateFormat: "d/m/Y"
          });
     }
 } );
