/*###### jQuery handlers ######*/
(function($) {
  window.altNet = {};

  function getQueryParams() {
    // queryParts has format ["foo=bar","beep=boop"]
    var queryParts = location.search.split(/(\?|\&)/g).filter(function(part) { return !/(\?|\&)/.test(part) && part !== ''})

    if (queryParts.length > 0) {
      return queryParts.reduce(function(queryHash, nextValue) {
        var nextParam = nextValue.split('=')
        queryHash[nextParam[0]] = nextParam[1]
        return queryHash
      }, {})
    }
    return []
  }

  var experimentCookieValue = ''
  document.cookie.split(' ').forEach(function(experimentCookie) {
    if (experimentCookie.indexOf('altNet_experiment') > -1) {
      experimentCookieValue = '' + experimentCookie.split('=')[1]
      experimentCookieValue = experimentCookieValue.replace(';', '')
    }
  })

  // get all query params, save utm_campaign separately and save one key with all params
  var queryParams = getQueryParams()
  if (queryParams.utm_campaign) {
    localStorage.setItem('altNet_campaign', queryParams.utm_campaign)
  }
  if (queryParams.utm_source) {
    localStorage.setItem('altNet_source', queryParams.utm_source)
  }
  if (queryParams.utm_medium) {
    localStorage.setItem('altNet_medium', queryParams.utm_medium)
  }
  if (queryParams.utm_content) {
    localStorage.setItem('altNet_adName', queryParams.utm_content)
  }

  /*###### Global utility functions ######*/
  function storeUserProfile(userId, profileEmail, firstName, lastName, companyName, phoneNumber, platforms) {
    if (userId) {localStorage.setItem('altNet_userId', userId);}
    if (profileEmail) {localStorage.setItem('altNet_email', profileEmail);}
    if (firstName) {localStorage.setItem('altNet_firstName', firstName);}
    if (lastName) {localStorage.setItem('altNet_lastName', lastName);}
    if (companyName) {localStorage.setItem('altNet_companyName', companyName);}
    if (phoneNumber) {localStorage.setItem('altNet_phoneNumber', phoneNumber);}
    if (platforms) {localStorage.setItem('altNet_platforms', platforms);}
  }

  function resetUserProfile() {
    localStorage.removeItem('altNet_firstName');
    localStorage.removeItem('altNet_lastName');
    localStorage.removeItem('altNet_email');
    localStorage.removeItem('altNet_userId');
    localStorage.removeItem('altNet_companyName');
    localStorage.removeItem('altNet_platforms');
  }

  function retrieveUserProfile() {
    return {
      firstName: localStorage.getItem('altNet_firstName') ? localStorage.getItem('altNet_firstName') : '',
      lastName: localStorage.getItem('altNet_lastName') ? localStorage.getItem('altNet_lastName') : '',
      email: localStorage.getItem('altNet_email') ? localStorage.getItem('altNet_email') : '',
      userId: localStorage.getItem('altNet_userId') ? localStorage.getItem('altNet_userId') : '',
      companyName: localStorage.getItem('altNet_companyName') ? localStorage.getItem('altNet_companyName') : '',
      campaign: localStorage.getItem('altNet_campaign') ? localStorage.getItem('altNet_campaign') : '',
      medium: localStorage.getItem('altNet_medium') ? localStorage.getItem('altNet_medium') : '',
      adName: localStorage.getItem('altNet_adName') ? localStorage.getItem('altNet_adName') : '',
      source: localStorage.getItem('altNet_source') ? localStorage.getItem('altNet_source') : '',
      phoneNumber: localStorage.getItem('altNet_phoneNumber') ? localStorage.getItem('altNet_phoneNumber') : '',
      platforms: localStorage.getItem('altNet_platforms') ? localStorage.getItem('altNet_platforms') : '',
      variation: experimentCookieValue ? experimentCookieValue : ''
    };
  }
  altNet.retrieveUserProfile = retrieveUserProfile;

  altNet.sessionId = retrieveUserProfile().userId ? retrieveUserProfile().userId : uuid();
  storeUserProfile(altNet.sessionId);

  altNet.isProduction = window.location.host === 'altitudenetworks.com' || window.location.host === 'www.altitudenetworks.com';
  altNet.isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

  var pageName = window.location.pathname.split('/')[1];

  altNet.throttle = function(callback, threshold) {
    let last;
    let deferTimer;

     return function() {
      var now = +new Date;

       if (last && now < last + threshold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          callback(arguments);
        }, threshold);
      }
      else {
        last = now;
        callback(arguments);
      }
    };
  }

  function handleFormSubmissionAndAnalytics(hookUriOverride) {
    var profileEmail = $(this.elements['work-email']).val();
    var firstName = $(this.elements['first-name']) ? $(this.elements['first-name']).val() : '';
    var lastName = $(this.elements['last-name']) ? $(this.elements['last-name']).val() : '';
    var companyName = $(this.elements['company-name']) ? $(this.elements['company-name']).val() : '';
    var phoneNumber = $(this.elements['phone']) ? $(this.elements['phone']).val() : '';
    var moreInfo = $(this.elements['more-info']) ? $(this.elements['more-info']).val() : '';
    const platforms = [];
    $.each($("input[name='platform']:checked"), function(){            
      platforms.push($(this).val());
    });
    if($(this.elements['platform-other']).val()) {
      platforms.push($(this.elements['platform-other']).val())
    }
    storeUserProfile(altNet.sessionId, profileEmail, firstName, lastName, companyName, phoneNumber, platforms);
    invokeZapierHook(hookUriOverride, moreInfo);
    alias(altNet.sessionId, profileEmail);
  }

  $(document).ready(function() {
    $('.cta-subscribe__form').on('submit', function(event) {
      event.preventDefault();

      var hookUriOverride = null;
      var formSubmission = handleFormSubmissionAndAnalytics.bind(this);

      if ($(this).hasClass('get-an-rsa__form')) {
        hookUriOverride = 'https://hooks.zapier.com/hooks/catch/4572175/owiw9ii/';
      }
      else if ($(this).hasClass('get-a-demo__form')) {
        hookUriOverride = 'https://hooks.zapier.com/hooks/catch/4572175/owiqb8s/'; 
      }
      else if ($(this).hasClass('demo__form')) {
        hookUriOverride = 'https://hooks.zapier.com/hooks/catch/4572175/owiqa7m/';
      }
      else if ($(this).hasClass('assessment__form')) {
        hookUriOverride = 'https://hooks.zapier.com/hooks/catch/4572175/owirzik/';
      }
      else if ($(this).hasClass('ciso__form')) {
        hookUriOverride = 'https://hooks.zapier.com/hooks/catch/4572175/ogul6p8/';
      }
      else if ($(this).hasClass('eng-blog__form')) {
        hookUriOverride = 'https://hooks.zapier.com/hooks/catch/4572175/oqv1k30/';
      }
      // update this hook
      else if ($(this).hasClass('solutions__form')) {
        hookUriOverride = 'https://hooks.zapier.com/hooks/catch/4572175/oxm968p/';
        $('#contactSubmit').hide();
        $('.cta-subscribe__success').show();
        formSubmission(hookUriOverride)
        return
      }

      formSubmission(hookUriOverride)
      $(this).hide();
      $(this).parent().find('.cta-subscribe__success').show();
    });

    // Load copy and handle submission for dynamic forms loaded from `get-started-data.js`
    var $dynamicForm = $('.get-started__form');

    if ($dynamicForm.length > 0) {
      // Exlude full-page dynamic forms with .not('#get-started-page')
      $dynamicForm.not('#get-started--page__form').on('submit', function(event) {
        event.preventDefault();

        var formSubmission = handleFormSubmissionAndAnalytics.bind(this);
        formSubmission()

        $('.get-started__form-notice').hide();
        $('.get-started__success').show();
      });

      $.get('./assets/js/get-started-data.json', function(data) {
        var formData = data[$dynamicForm.data('id')];
        if (formData) {
          var $container = $('.get-started');
          $dynamicForm.attr('action', formData.submissionUrl);
          if (!$container.find('h2').hasClass('get-started__descr')) {
            $container.find('h2').html(formData.title);
          }
          if (!$container.find('p').hasClass('get-started__title')) {
            $container.find('p').html(formData.subtitle);
          }
          
          // Exlude in-page dynamic form sections with .not('#get-started-section')
          $dynamicForm.not('.get-started--section__form').on('submit', function(event) {
            event.preventDefault();

            var formSubmission = handleFormSubmissionAndAnalytics.bind(this);
            formSubmission()

            $('.get-started__form').hide();
            $('.get-started__success').show();
            $('.cta-subscribe__success').show();
          })
        }
      });
    }

    $('#other-platform-input').on('input', (event) => {
      if (event.target.value && event.target.value.length > 0) {
        $('#other-platform-checkbox')[0].checked = true
      }
    })

    $('.cta-subscribe-trigger__form').on('submit', function(event) {
      event.preventDefault();
      var profileEmail = $(this.elements['work-email']).val()
      storeUserProfile(altNet.sessionId, profileEmail)
      $('.cta-subscribe-modal .get-started--section__form--email').val(profileEmail);
      $('.cta-subscribe-modal').css("display", "flex").hide().fadeIn();
    });

    $('.cta-button--schedule-meeting').on('click', revealCalendly);
    $('.cta-button--hide-calendly').on('click', hideCalendly);

    $('body').on('click', function(event) {
      altimeter({
        altimeterMethod: "track",
        eventName: "External Site Click",
        metadata: {
          class: event.target.className,
          text: event.target.innerText
        }
      })
    })

    $('#mailto-nav').on('click', function(event) {
      altimeter({
        altimeterMethod: "track",
        eventName: "Top Nav Email Click",
        metadata: {
          class: event.target.className,
          text: event.target.innerText
        }
      })
    })

    $('#mailto-footer').on('click', function(event) {
      altimeter({
        altimeterMethod: "track",
        eventName: "Footer Email Click",
        metadata: {
          class: event.target.className,
          text: event.target.innerText
        }
      })
    })

    $('.document-button').on('click', function(event) {
      altimeter({
        altimeterMethod: "track",
        eventName: "Document Download",
        metadata: {
          class: event.target.className,
          text: event.target.innerText
        }
      })
    })

    /* Initialize Analytics */
    $.get('./assets/js/altimeter-data.json', function(data) {
      $('[data-altimeter]').on('click', function() {
        var key = $(this).data('altimeter');
        var altimeterData = data[key];
        if (altimeterData) {
          altimeter(altimeterData);
        }
      })
    })

    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
      var analyticsLocation = altNet.isProduction ? "Hpsbu4a5fN5e0EtPXRcPyESrXuhOxd61" : "MVJuA6giKKTsyxsTFKj0RApFANtnfAoY";
      analytics.load(analyticsLocation);
      altimeter({
        altimeterMethod: "page",
        eventName: pageName,
      });
      identify(altNet.sessionId);
    }}();

    $('.scroll-wrapper').scroll(altNet.throttle(function() {
      if (altNet.onMainScroll) {
        altNet.onMainScroll();
      }
    }, 100));
    
    $('.cta-demo').on('click', function () {
      $('.cta-subscribe-modal').fadeIn();
    })

    $('.cta-subscribe-modal__close').on('click', function() {
      $('.cta-subscribe-modal').fadeOut();
      hideCalendly();
    });
  });

  /*###### Altimeter ######*/
  function altimeter(data) {
    var apiUrl = 'https://ye3hclbzth.execute-api.us-west-2.amazonaws.com/dev-01';

    if (altNet.isProduction) {
      apiUrl = 'https://cd48y2guk1.execute-api.us-west-2.amazonaws.com/prod-external';
    }

    var profile = retrieveUserProfile()
    if (!data.metadata) {
      data.metadata = {}
    }
    data.metadata.firstName = profile.firstName;
    data.metadata.lastName = profile.lastName;
    data.metadata.email = profile.email;
    data.metadata.companyName = profile.companyName;
    data.metadata.campaign = profile.campaign;
    data.metadata.source = profile.source;
    data.metadata.medium = profile.medium;
    data.metadata.adName = profile.adName;
    data.metadata.page = pageName;
    data.metadata.variation = profile.variation
    data.metadata.phoneNumber = profile.phoneNumber
    data.metadata.platforms = profile.platforms

    if (!data.userId) {
      data.userId = profile.userId
    }

    $.ajax(apiUrl + '/altimeter', {
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'application/json'
    });

    if (data.altimeterMethod !== 'alias' && data.altimeterMethod !== 'identify') {
      analytics[data.altimeterMethod](data.eventName, data.metadata);
    }
  }

  altNet.altimeter = altimeter;

  function alias(oldId, newId) {
    identify(newId);

    altimeter({
      altimeterMethod: "alias",
      eventName: "",
      userId: oldId,
      newUserId: newId
    });

    storeUserProfile(newId);
    
    analytics.alias(newId, oldId);
  }

  function identify(userId, metadata) {
    metadata = metadata ? metadata : {};

    altimeter({
      altimeterMethod: "identify",
      eventName: "",
      userId: userId
    });

    analytics.identify(userId, metadata);
  }

  /*###### Google Sign In ######*/
  function attachSignIn(element) {
    if (element) {
      auth2.attachClickHandler(element, {},
        function(googleUser) { // success
          var profile = googleUser.getBasicProfile();
          var profileName = profile.getName().split(' ');
          var profileFirstName = '';
          var profileLastName = '';
          if (profileName.length === 2) {
            profileFirstName = profileName[0];
            profileLastName = profileName[1];
          }
          else {
            profileFirstName = profileName;
          }
          var profileEmail = profile.getEmail();

          storeUserProfile(altNet.sessionId, profileEmail, profileFirstName, profileLastName);
          invokeZapierHook();
          alias(altNet.sessionId, profileEmail);
          
        },
        function(error) { // error
          console.error(error);
        }
      );
    }
  }

  function invokeZapierHook(hookUriOverride, moreInfo) {
    var userData = retrieveUserProfile();

    userData.page = pageName ? pageName : 'home'
    userData.moreInfo = moreInfo ? moreInfo : ''

    var zapierUri = !!hookUriOverride ? hookUriOverride : 'https://hooks.zapier.com/hooks/catch/4572175/owittks/';

    altimeter({
      altimeterMethod: "track",
      eventName: "Entered email"
    })

    if (!altNet.isProduction) {
      console.info('sending data', userData);
      altimeter({
        altimeterMethod: "track",
        eventName: "Submitted email"
      });
      return;
    }
    
    $.ajax({
      url: zapierUri,
      type: 'POST',
      data: userData,
      success: altimeter({
        altimeterMethod: "track",
        eventName: "Submitted email"
      })
    });
  }

  function revealCalendly() {
    var profile = altNet.retrieveUserProfile();

    function isCalendlyEvent(e) {
      return e.data.event && e.data.event.indexOf('calendly') === 0;
    };
     
    window.addEventListener(
      'message',
      function(e) {
        if (isCalendlyEvent(e)) {
          altimeter({
            altimeterMethod: "track",
            eventName: e.data.event.replace(/\.|\_+/g, ' '),
          });
        }
      }
    );

    var isModal = $(this).parents('.cta-subscribe-modal').length > 0
    var isPricing = $(this).parents('.cta-pricing-modal').length > 0
    var widgetWrapperId = 'calendly-widget-'
    widgetWrapperId += isModal || isPricing ? 'modal' : 'page'

    var eventName = "Calendly Intro Request Started" 
    eventName += isPricing ? " Pricing Page" : ""

    var calendlyUrl = isPricing ? 'https://calendly.com/altitude-networks/30-min-with-altitude-networks?hide_event_type_details=1' : 'https://calendly.com/altitude-networks/introductions?hide_event_type_details=1'

    altimeter({
      altimeterMethod: "track",
      eventName: eventName,
    });

    /* initialize Calendly and prefill form */
    Calendly.initInlineWidget({
      url: calendlyUrl,
      parentElement: document.getElementById(widgetWrapperId),
      prefill: {
        name: profile.name,
        email: profile.email
      },
    });

    

    if (isModal) {
      $('.cta-subscribe-modal .calendly-closed').hide();
      $('.cta-subscribe-modal .calendly-open').show();
      $('.cta-subscribe-modal .calendly-wrapper').show();
    }
    else if (isPricing) {
      $('.cta-pricing-modal .calendly-closed').hide();
      $('.cta-pricing-modal .calendly-open').show();
      $('.cta-pricing-modal .calendly-wrapper').show(); 
    }
    else {
      $('.calendly-closed').not('.cta-subscribe-modal .calendly-closed').hide();
      $('.calendly-open').not('.cta-subscribe-modal .calendly-open').show();
      $('.calendly-wrapper').not('.cta-subscribe-modal .calendly-wrapper').show();
    }
  }

  function hideCalendly() {
    $('.calendly-inline-widget').empty()
    $('.calendly-closed').show();
    $('.calendly-open').hide();
    $('.calendly-wrapper').hide();
  }

  })(jQuery);

  function initShowHide (elementId, display) {
    if(elementId && display) {
      const el = document.querySelector(`#${elementId}`);
      el.style.display = display;
    }
  }