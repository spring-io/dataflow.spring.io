const React = require('react')

exports.onRenderBody = function ({ setPreBodyComponents }) {
  if (process.env.GOOGLE_TAGMANAGER_ID) {
    setPreBodyComponents([
      React.createElement('script', {
        src: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
        'data-domain-script': '018ee325-b3a7-7753-937b-b8b3e643b1a7',
      }),
      React.createElement('script', {
        dangerouslySetInnerHTML: {
          __html: `function OptanonWrapper() {}`,
        },
      }),
      React.createElement('script', {
        dangerouslySetInnerHTML: {
          __html: `
function setGTM(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
}
if (document.cookie.indexOf('OptanonConsent') > -1 && document.cookie.indexOf('groups=') > -1) {
    setGTM(window, document, 'script', 'dataLayer', '${process.env.GOOGLE_TAGMANAGER_ID}');
} else {
    waitForOnetrustActiveGroups();
}
var timer;
function waitForOnetrustActiveGroups() {
    if (document.cookie.indexOf('OptanonConsent') > -1 && document.cookie.indexOf('groups=') > -1) {
        clearTimeout(timer);
        setGTM(window, document, 'script', 'dataLayer', '${process.env.GOOGLE_TAGMANAGER_ID}');
    } else {
        timer = setTimeout(waitForOnetrustActiveGroups, 250);
    }
}
    `,
        },
      }),
    ])
  }
}
