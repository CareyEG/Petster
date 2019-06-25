$('#btnDetails').on('click', function(){

  console.log('you clicked!')
  
  $('.view-details').show();
});

let count = 0;
$(`#${count}`).show();

$('#btnPet').on('click', function(){
  count++
  $(`#${count}`).show();
  $(`#${count-1}`).hide();
});
