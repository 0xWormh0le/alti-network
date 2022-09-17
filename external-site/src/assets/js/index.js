(function ($) {
  $(document).ready(function () {
    /* Start animations */
    initLottie();

    /* Resolutions section */
    $(".resolutions-section__nav-item").on("click", function (e) {
      var $curContentItem = $(".resolutions-section__content.active");
      $curContentItem.find("video").get(0).pause();
      $curContentItem.find("video").get(0).currentTime = 0;
      $curContentItem.removeClass("active");
      contentId = $(this).attr("rel");
      $(contentId).addClass("active");
      $(".resolutions-section__nav-item").removeClass("active");
      $(this).addClass("active");
      $(contentId).find("video").get(0).play();
      resolutionsNavsClicked = true;
      resolutionsActiveIndex = $(this).index();
      updateResolutionsArrowVisibility();
    });

    $(".resolutions-section__arrow.left")
      .hide()
      .on("click", function (e) {
        e.preventDefault();
        goToResolutionsSection(false);
      });

    $(".resolutions-section__arrow.right").on("click", function (e) {
      e.preventDefault();
      goToResolutionsSection(true);
    });

    // temp disable video slider now
    // $(".testimonials-section .video-wrapper").slick({
    //   dots: true,
    //   speed: 300,
    //   fade: true,
    //   slidesToShow: 1,
    //   infinite: true,
    //   arrows: true,
    //   nextArrow: ".testimonials-section__arrow.right",
    //   prevArrow: ".testimonials-section__arrow.left",
    //   appendArrows: ".slick-dots",
    //   responsive: [
    //     {
    //       breakpoint: 768,
    //     },
    //   ],
    // });
  });

  var resolutionsNavsClicked = false;
  var resolutionsActiveIndex = 0;
  var visitedSectionsIndices = [];
  var playPromise = null;
  var cycleResolutionsSection = function () {
    var $curContentItem = $(".resolutions-section__content.active");
    if (resolutionsNavsClicked) {
      $curContentItem.find("video").get(0).play();
    } else {
      goToResolutionsSection(true);
    }
  };

  var goToResolutionsSection = function (forward) {
    var resolutionsCount = $(".resolutions-section__nav-item").length || 1;
    resolutionsActiveIndex =
      (resolutionsActiveIndex + (forward ? 1 : -1)) % resolutionsCount;
    var $curNavItem = $(".resolutions-section__nav-item.active");
    var $curContentItem = $(".resolutions-section__content.active");
    $curContentItem.find("video").get(0).pause();
    $curContentItem.find("video").get(0).currentTime = 0;
    var $nextNavItem = $(
      $(".resolutions-section__nav-item").get(resolutionsActiveIndex)
    );
    var $nextContentItem = $(
      $(".resolutions-section__content").get(resolutionsActiveIndex)
    );
    $nextNavItem.addClass("active");
    $nextContentItem.addClass("active");
    $curNavItem.removeClass("active");
    $curContentItem.removeClass("active");
    var $nextVideo = $nextContentItem.find("video");
    playPromise = $nextVideo.get(0).play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        $nextVideo.on("ended", cycleResolutionsSection);
      });
    } else {
      $nextVideo.on("ended", cycleResolutionsSection);
    }

    updateResolutionsArrowVisibility();
  };

  var updateResolutionsArrowVisibility = function () {
    var resolutionsCount = $(".resolutions-section__nav-item").length || 1;
    if (resolutionsActiveIndex === 0) {
      $(".resolutions-section__arrow.left").hide();
    } else {
      $(".resolutions-section__arrow.left").show();
    }
    if (resolutionsActiveIndex === resolutionsCount - 1) {
      $(".resolutions-section__arrow.right").hide();
    } else {
      $(".resolutions-section__arrow.right").show();
    }
  };

  altNet.onMainScroll = function () {
    var resolutionsVideoPosition = $(
      ".resolutions-section__content.active"
    ).offset();
    var resolutionsVideoHeight = $(
      ".resolutions-section__content.active"
    ).height();
    var activeVideo = $(".resolutions-section__content.active video").get(0);
    if (
      resolutionsVideoPosition.top <
        window.innerHeight - resolutionsVideoHeight / 2 &&
      resolutionsVideoPosition.top > -resolutionsVideoHeight
    ) {
      if (!playPromise) {
        playPromise = $(".resolutions-section__content.active video")
          .get(0)
          .play();
        if (playPromise !== undefined) {
          playPromise.then(function () {
            $(activeVideo).on("ended", cycleResolutionsSection);
          });
        } else {
          $(activeVideo).on("ended", cycleResolutionsSection);
        }
      }
    } else {
      if (!activeVideo.paused) {
        activeVideo.pause();
        activeVideo.currentTime = 0;
        playPromise = null;
      }
    }
  };

  function initLottie() {
    var animationElements = $(".pain-section__img");
    animationElements.each(function (index, $animationElement) {
      var nextSection = index + 1;
      var lottiePlayer = lottie.loadAnimation({
        container: $animationElement, // the dom element that will contain the animation
        renderer: "canvas",
        loop: true,
        autoplay: true,
        path: "./assets/lottie/" + "pain-point-" + nextSection + "/data.json", // the path to the animation json
        rendererSettings: {
          preserveAspectRatio: "none",
        },
      });

      if (nextSection === 1) {
        lottiePlayer.addEventListener("loaded_images", function () {
          $("#animation-1").addClass("playing");
        });
      }
    });
  }

  // home banner
  $(".home-banner .banner-title").addClass("slide-in");

  $(".home-banner button").click(function (e) {
    e.preventDefault();
    console.log("close banner");
    $(".home-banner").fadeOut();
    $(".home-hero-section").removeClass("has-banner");
  });
})(jQuery);
