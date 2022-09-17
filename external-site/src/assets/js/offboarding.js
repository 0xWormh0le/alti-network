(function($) {
  $(document).ready(function() {
  	$('.offboarding-slider-section__slick').slick({
  	  dots: true,
  	  speed: 300,
  	  centerMode: true,
  	  centerPadding: '140px',
  	  variableWidth: true,
  	  infinite: false,
  	  nextArrow: '.feature-page-slider-section__arrow.right',
  	  prevArrow: '.feature-page-slider-section__arrow.left',
  	  responsive: [{
  	    breakpoint: 768
  	  }]
  	});
  })
})(jQuery)