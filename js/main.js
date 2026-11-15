// Shared behaviour for every page

// Mobile menu
var menuBtn = document.getElementById('menu-btn');
var nav = document.getElementById('site-nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Footer year
var yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// If the audio file has not been added yet, hide the player and keep the transcript
var audio = document.getElementById('solar-audio');
if (audio) {
  var source = audio.querySelector('source');
  if (source) {
    source.addEventListener('error', function () {
      audio.style.display = 'none';
      var note = document.getElementById('audio-note');
      if (note) {
        note.hidden = false;
      }
    });
  }
}
