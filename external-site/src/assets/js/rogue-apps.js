(function($) {
  $(document).ready(function() {
    var getSceneFromTime = (time) => {
      if (time < 4 || time > 23.7) {
        return [1,4]
      }
      else if (time < 16) {
        return [2,1]
      }
      else if (time < 20) {
        return [3,2]
      }
      else {
        return [4,3]
      }
    }

    setInterval(() => {
      var currentTime = $('.rogue-apps-video-section__container video')[0].currentTime
      var scene = getSceneFromTime(currentTime);
      var outScene = $(`.rogue-apps-video-section__subtitle.scene-${scene[1]}`);
      var inScene = $(`.rogue-apps-video-section__subtitle.scene-${scene[0]}`);

      if (outScene.hasClass('visible')) {
        outScene.addClass('fade');
        setTimeout(() => outScene.removeClass(['visible', 'fade']), 500);
      }
      if (!inScene.hasClass('visible')) {
        inScene.addClass(['fade','visible']);
        setTimeout(() => inScene.removeClass('fade'), 600);
      }
    }, 100);
  })
})(jQuery)