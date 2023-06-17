function toggleDarkMode() {
    var stylesheet = document.getElementById('stylesheet');
    console.log(stylesheet.getAttribute('href'))
    if (stylesheet.getAttribute('href') === "static/css/style-light.css") {
      stylesheet.setAttribute('href', "static/css/style-dark.css");
      stylesheet.classList.add('transition');
    } else {
      stylesheet.setAttribute('href', "static/css/style-light.css");
      stylesheet.classList.add('transition');
    }
    console.log(stylesheet.getAttribute('href'))
  }

