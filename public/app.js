
// handles details click on search page
$('.info-icon').on('click', function(){
  console.log('you clicked!')
  $('.view-details').show();
  $('.info-icon').hide();
  $('.heart-icon-hide').hide();
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
});





let count = 0;
$(`.${count}`).show();

// submits the pet details form on heart click
$('.heart-icon').on('click', event => {
  $('.heart-icon').toggleClass('image-fade');
  // $('.heart-icon > path').attr('fill', 'red' );

  setTimeout(() => $('.heart-icon > path').attr('fill', 'red' ), 800)
  console.log(' you clicked the submit!')
  $(`.${count}Form`).submit();
})

$('delete-icon-class').on('click', event => {
 
  console.log(' you clicked the delete button')
  $(`.${count}Form`).submit();
})



// credit: https://stackoverflow.com/questions/15685708/determining-if-mouse-click-happened-in-left-or-right-half-of-div

// handles left and right click on img
$(`.flexPet`).click(function(event){
  var x = event.pageX - $(this).offset().left

  if (x > $(this).width()/2) {
    console.log('right half', count)

    count++
    $('.view-details').hide();
    $('.btnDetails').show();
    $(`.${count}`).show();
    $(`.${count-1}`).hide();

  } else {
    console.log('left half')
    if (count !== 0){
      count--
      $('.view-details').hide();
      $('.btnDetails').show();
      $(`.${count}`).show();
      $(`.${count+1}`).hide();
    }
  }
});
