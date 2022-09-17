(function($) {
  $(document).ready(function() {
	/* headshot effect on hover in About Us page */
    $('.headshot').on({ 'touchstart' : function() {
      var currentHeadshot = $(this);
      currentHeadshot.addClass('selected');
      currentHeadshot.on({ 'touchend' : function() {
        currentHeadshot.removeClass('selected');
        currentHeadshot.off('touchstart', 'touchend');
      }});
    }});

    if (altNet.isChrome) {
      $('.headshot').addClass('webp');
    }
    else {
      $('.headshot').addClass('slow');
    }
  })
})(jQuery)