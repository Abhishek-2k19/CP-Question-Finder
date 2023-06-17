// function toggleDarkMode() {
//     var stylesheet = document.getElementById('stylesheet');
//     console.log(stylesheet.getAttribute('href'))
//     if (stylesheet.getAttribute('href') === "static/css/style-light.css") {
//       stylesheet.setAttribute('href', "static/css/style-dark.css");
//       stylesheet.classList.add('transition');
//     } else {
//       stylesheet.setAttribute('href', "static/css/style-light.css");
//       stylesheet.classList.add('transition');
//     }
//     console.log(stylesheet.getAttribute('href'))
//   }

function toggleDarkMode() {
  var stylesheet = document.getElementById('stylesheet');
  var togbtn = document.getElementById('btn-tog')
  var darkMode = localStorage.getItem('darkMode');
  if (darkMode === null) {
    darkMode = false;
  } else {
    darkMode = JSON.parse(darkMode);
  }
  console.log(darkMode)
  // Store dark mode state in local storage
  
  // if (stylesheet.getAttribute('href') === "{{ url_for('static', filename='css/style-light.css') }}") {
  if (!darkMode){
    stylesheet.setAttribute('href', "static/css/style-dark.css");
    darkMode = true;
    togbtn.textContent = "Light Mode";
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  } else {
    stylesheet.setAttribute('href', "static/css/style-light.css");
    darkMode = false;
    togbtn.textContent = "Dark Mode";
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }
  
}