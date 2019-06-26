//
let petType;

$('#btnDetails').on('click', function(){

  console.log('you clicked!')
  
  $('.view-details').show();
});

let count = 0;
$(`.${count}`).show();

$('#btnPet').on('click', function(){
  count++
  $(`.${count}`).show();
  $(`.${count-1}`).hide();
});

// console.log($('#pet-type-dropdown').val());

// $('submit').on('click', event => {
//   petType = $('#pet-type-dropdown').val();
//   console.log(petType)
// })
