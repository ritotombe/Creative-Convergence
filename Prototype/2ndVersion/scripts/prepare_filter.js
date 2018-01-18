var venuesSelected = []
var participatingSelected = []
var typeSelected = []

// $( function() {

  populateLists()

  $("#venues").on("click", () => {
    let innerHTML = "";
    $("#options").html(innerHTML)
    for (item in venues){
      if (venuesSelected.indexOf(venues[item]) >= 0){
        innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition active">${venues[item]}</li>`
      } else {
        innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition">${venues[item]}</li>`
      }
    }
    $(".title").html("Venue/s");
    $("#options").html(innerHTML) ;
  })

  $("#schools").on("click", () => {
    let innerHTML = "";
    $("#options").html(innerHTML)
    // for (item in venues){
    //   if (venuesSelected.indexOf(venues[item]) >= 0){
    //     innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition active">${venues[item]}</li>`
    //   } else {
    //     innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition">${venues[item]}</li>`
    //   }
    // }
    $(".title").html("School/s");
    $("#options").html(innerHTML) ;
  })

  $("#type").on("click", () => {
    let innerHTML = "";
    $("#options").html(innerHTML)
    // for (item in venues){
    //   if (venuesSelected.indexOf(venues[item]) >= 0){
    //     innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition active">${venues[item]}</li>`
    //   } else {
    //     innerHTML += `<li class = "list-item btn btn-block btn-lg btn-info notransition">${venues[item]}</li>`
    //   }
    // }
    $(".title").html("Type/s");
    $("#options").html(innerHTML) ;
  })

  $('.check-all').click(function() {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(".list-item").removeClass("active");
      venuesSelected = []
      populateLists(1)
    } else {
      $(this).addClass("active");
      $(".list-item").addClass("active");
      venuesSelected = Object.keys(venues)
      populateLists(1)
    }
  })

  $('#options').on("click", ".list-item",function() {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      removeHelper(venuesSelected, venuesSelected.indexOf($(this).html()))
      populateLists()
    } else {
      $(this).addClass("active");
      venuesSelected.push($(this).html())
      populateLists()
    }
  })

  function populateLists(mode){
    if (venuesSelected.length == 0){
      // console.log( Object.keys(venues));
      venuesSelected = Object.keys(venues)
    }
    $("#venues-selected").html(venuesSelected.length)

    if (!$(".check-all").hasClass("active") && mode != 1) {
      $(".check-all").addClass("active");
    }
  }

  function removeHelper(array, index) {
    if (index > -1) {
      array.splice(index, 1);
    }
    return array
  }
// });
