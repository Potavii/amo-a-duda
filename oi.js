// oi.js
$(document).ready(function(){
  // Mude o seletor de '.title' para '.ico'
  $('.ico').click(function(){
    $('.container').addClass('open');
  });


  $('.close').click(function(){
    $('.container').removeClass('open');
  });
});