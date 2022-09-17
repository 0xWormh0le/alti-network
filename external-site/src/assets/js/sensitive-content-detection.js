(function($) {
  $(document).ready(function() {
    let time_cnt = 0;

    setInterval(change_logo, 3000)

    function change_logo() {
      time_cnt++;
      if(time_cnt % 4 == 1) {
        $('#sensitive-files-header-img').attr("src", "/images/sensitive-content/office365-logo.png")
      } 
      else if(time_cnt % 4 == 2) {
        $('#sensitive-files-header-img').attr("src", "/images/sensitive-content/box.png")
      }
      else if(time_cnt % 4 == 3) {
        $('#sensitive-files-header-img').attr("src", "/images/sensitive-content/dropbox.png")
      } else {
        $('#sensitive-files-header-img').attr("src", "/images/sensitive-content/google-workspace-logo.png")
      }
    }
  })
})(jQuery)
