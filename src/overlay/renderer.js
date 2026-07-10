'use strict';
const stage = document.getElementById('stage');
let timer = null;

window.bootytap.onPlay(() => {
  stage.classList.remove('play');
  void stage.offsetWidth;
  stage.classList.add('play');
  clearTimeout(timer);
  timer = setTimeout(() => {
    stage.classList.remove('play');
    window.bootytap.done();
  }, 1900);
});
