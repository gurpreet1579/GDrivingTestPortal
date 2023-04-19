function displayAvailability(availability) {
    const availabilityList = $('#dropdown-menu-slot-g2');
    availabilityList.empty();
    $('#message').empty();
    if(availability.length == 0){
      $('#message').append(`<h5 class="txt-color-theme txt-cntr">No slot available. Select another date</h5>`);
    }
    availability.forEach(function(slot) {
      availabilityList.append(` <li><a class="dropdown-item" href="#">${slot}</a></li>`);
    });
}

function displayPotenialAvailability(availability) {
  const availabilityList = $('#dropdown-menu-slot');
  availabilityList.empty();

  availability.forEach(function(slot) {
    availabilityList.append(`<li><a class="dropdown-item" href="#">${slot}</a></li>`);
  });
}

$(document).ready(function() {

  // for Driver, shows available slot for specific date
    $("#bookSlotDate").change(function(){
      const date = $('#bookSlotDate').val();
  
      $.ajax({
        type: 'GET',
        url: '/user/get-slot',
        data: {
          date: date
        },
        success: function(response) {
          displayAvailability(response.data.availability);
        },
        error: function(err) {
          console.error(`Failed to get availability for selected date: ${err}`);
        }
      });
    });

    // for admin, shows available slots from 9 am to 2pm, which admin made available
    $("#potentialSlotDate").change(function(){
      
      const date = $('#potentialSlotDate').val();
  
      $.ajax({
        type: 'GET',
        url: '/admin/get-potential-slot',
        data: {
          date: date
        },
        success: function(response) {
            console.log("response is  "  + response.data.potentialSlots);
          displayPotenialAvailability(response.data.potentialSlots);
        },
        error: function(err) {
          console.error(`Failed to get availability for selected date: ${err}`);
        }
      });
    });




    // when item from drop is selected text of displayed button is change and input value is set to item selected
    $('.dropdown-menu a').click(function() {
      $('#userTypeBtn').text($(this).text());
      $('#userType').val($(this).text());
    });


  $(".dropdown").on("click","#dropdown-menu-slot a",function(){
    $('#timeSlotBtn').text($(this).text());
    $('#potentialTimeSlot').val($(this).text());
 })

  $(".dropdown").on("click","#dropdown-menu-slot-g2 a",function(){
    $('#avaTimeSlotBtn').text( $(this).text() );
    $('#avaTimeSlot').val( $(this).text()  );
 })

  });