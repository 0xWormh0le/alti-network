(function ($) {
  $(document).ready(function () {
    const initialHash = window.location.hash; // hash when first load the page

    if (initialHash) {
      scrollToElement(initialHash);

      // have to scroll to the corresponding hash block and also update the nav item
      const $currentItem = $(".terms-of-service-nav-item.active");
      if ($currentItem.attr("href") !== initialHash) {
        $currentItem.removeClass("active");
        $(`.terms-of-service-nav-item a[href="${initialHash}"]`)
          .parent()
          .addClass("active");
      }
    }

    function scrollToElement(target) {
      $(".scroll-wrapper").scrollTop($(target).offset().top);
    }

    $(".terms-of-service-nav-item").on("click", function () {
      const $element = $(this);
      const $currentItem = $element
        .parent()
        .find(".terms-of-service-nav-item.active");
      $currentItem.removeClass("active");
      $element.addClass("active");

      // Figure out element to scroll to
      const target = $(this).find("a").attr("href");

      scrollToElement(target);
    });
  });
})(jQuery);
