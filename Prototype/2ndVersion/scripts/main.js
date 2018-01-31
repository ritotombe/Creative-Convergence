//  All component initiation

var rawDataTable;
var searchQuery = []
var selectedCompany = [];
var selectedWork = [];
var selectedPlace = [];

// $( function() {

    initiateDatePicker();
    initiateSliders();
    initiateInfo();
    initiateTypeahead();

    rawDataTable = initiateRawData();

    $("#options-container").css('height',
      $("#filter_panel").height() -
        (
          $(".options-pane").offset().top +
          $(".options-pane-head").height() +
          $(".check-all").height() +
          parseInt($("#tab-buttons").css("marginBottom")) + 3
        )
      )

    $('.filter-btn').click(function() {
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
        values:      [3,90],
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
        values:      [200,3000],
        max:         3000,
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

     function initiateRawData() {
       return $('#raw-data').DataTable( {
         data: JSON.parse(localStorage.getItem(SOURCE)),
         columns: [
           { "data": "company" },
           { "data": "creative_work" },
           { "data": "venue" },
           { "data": "latitude" },
           { "data": "longitude" },
           { "data": "date", "type": "date" },
           { "data": "school" },
           { "data": "type" },
           { "data": "age" },
           { "data": "income" },
         ],
         order: [[ 5, "asc" ]],
         // searching: false,
         dom: 'flBtip',
         buttons: [{
            extend: 'excel',
            text: 'Export to Spreadsheet..',
            exportOptions: {
                modifier: {
                    search: 'none'
                }
            }
        }],
        scrollX: true
       } );
     }

    function initiateTypeahead(){
      let companyNames = []
      let workNames =[]
      let placeNames = []

      let filter = function(suggestions, selected) {
        return $.grep(suggestions, function(suggestion) {
            return $.inArray(suggestion, selected) === -1;
        });
      }

      let data = JSON.parse(localStorage.getItem(SOURCE))
      for (item in data) {
        if (companyNames.indexOf(data[item].company) == -1){
          companyNames.push(data[item].company)
        }
        if (workNames.indexOf(data[item].creative_work) == -1){
          workNames.push(data[item].creative_work)
        }
        if (placeNames.indexOf(data[item].venue.split(', ')[1]) == -1){
          placeNames.push(data[item].venue.split(', ')[1])
        }
      }

      let company = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 5,
        local: companyNames
      });

      let work = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit:5,
        local: workNames
      });

      let place = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit:5,
        local: placeNames
      });

      company.initialize()
      work.initialize()
      place.initialize()

      // $(".tagsinput").tagsinput("removeAll");

      $(".tagsinput").tagsinput({
        tagClass: function(item) {
          switch (item.kind) {
            case 'company' : return 'label label-blue';
            case 'work' : return 'label label-green';
            case 'place' : return 'label label-brown';
          }
        },
        itemValue: 'text',
        itemText: 'text'
      });

      $('.bootstrap-tagsinput input').attr("placeholder", "Companies or Work Title");

      $('.bootstrap-tagsinput input').typeahead({
        highlight: true
      },
      {
        name: 'company',
        source: function(query, cb) {
            company.get(query, function(suggestions) {
                cb(filter(suggestions, searchQueryCompany));
            });
        },
        displayKey: function(s) { return s },
        templates: {
          header: '<hr><small class="tt-category-header">Company</small><hr>'
        }
      },
      {
        name: 'work',
        source: function(query, cb) {
            work.get(query, function(suggestions) {
                cb(filter(suggestions, searchQueryWork));
            });
        },
        displayKey: function(s) { return s },
        templates: {
          header: '<hr><small class="tt-category-header">Creative Work</small><hr>'
        }
      },
      {
        name: 'place',
        source: function(query, cb) {
            place.get(query, function(suggestions) {
                cb(filter(suggestions, searchQueryLocation));
            });
        },
        displayKey: function(s) { return s },
        templates: {
          header: '<hr><small class="tt-category-header">Place</small><hr>'
        }
      }
    )
      .on('typeahead:selected', function(ev, s, dsName) {
        if (dsName == 'company'){
          selectedCompany.push(s)
        } else if(dsName == 'work') {
          selectedWork.push(s)
        } else if(dsName == 'place') {
          selectedPlace.push(s)
        }

        $('.tagsinput').tagsinput('add', {text: s, kind: dsName})
        $('.bootstrap-tagsinput input').typeahead('close');
        $('.bootstrap-tagsinput input').typeahead('val', '');
      });
    }
//  } );
