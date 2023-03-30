

  $('.dropdown-item').on('click', function() {
    var value = $(this).data('value');
    $('#userType').val(value);
    $('#userTypeDropdown').text(value);
  });
