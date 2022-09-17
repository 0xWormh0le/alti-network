(function($) {
  $(document).ready(function() {
    $('.product-risk-section__item').on('click', function() {
      if (window.innerWidth > 768) {
        const $element = $(this);
        const index = $element.index('.product-risk-section__item') + 1;
        const $currentItem = $element.closest('.product-risk-section').find('.product-risk-section__item.active');
        $currentItem.removeClass('active');
        $element.closest('.product-risk-section').find('.product-section__image').attr('id', `risk-${index}`);
        $element.addClass('active');
      }
    })
  })
})(jQuery)