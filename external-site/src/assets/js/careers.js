(function($) {
  $(document).ready(function() {
    var curIndex = 0;
    window.setInterval(function() {
      var itemsCount = $('.careers-hero-section__text').length || 1;
      curIndex = (curIndex + 1) % itemsCount;
      var $currentItem = $('.careers-hero-section__text.active');
      $currentItem.removeClass('active');
      var $nextItem = $('.careers-hero-section__text:nth-child(' + (curIndex + 1).toString() + ')');
      $nextItem.addClass('active');
    }, 4000)
  });

  $('.careers-banner-section').slick({
    dots: true,
    dotsClass: 'careers-banner-section__dots',
    speed: 300,
    fade: true,
    slidesToShow: 1,
    infinite: true,
    arrows: false,
    responsive: [{
      breakpoint: 768
    }]
  });

  var getShortDescription = (job) => job.metadata && job.metadata[0] && job.metadata[0].name === 'Short Description' ? job.metadata[0].value : ''

  $.ajax({
    url: 'https://boards-api.greenhouse.io/v1/boards/altitudenetworks/jobs?content=true',
    type: 'GET',
    success: ((responses) => {
      const jobs = $('#jobs-list');
      if (Array.isArray(responses.jobs)) {
        $('#jobs-loading').hide();
        responses.jobs.forEach((job) => {
          const wrapper = $('<a></a>').attr('href', job.absolute_url).attr('class', 'careers-job-item');
          console.info($($.parseHTML(job.content)[0]))

          const title = $('<h3 class="careers-job-item__title"></h3>').text(job.title);
          const description = $('<div class="careers-job-item__description"></div>').append($('<div>' + getShortDescription(job) + '</div>'));
          const location = $('<div class="careers-job-item__location"></div>').text(job.location.name.replace(', United States', ''));

          wrapper.append([title, description, location]);
          jobs.append(wrapper);
        });
      }
    })
  });

  $('a[href^="#jobs"]').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var hash = this.hash;
    $('.scroll-wrapper').animate({
      scrollTop: $(hash).offset().top - 50,
    }, 800, function(){
      window.location.hash = hash;
    });
  })
})(jQuery)