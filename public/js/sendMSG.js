window.onload=function(){
    console.log("haha");
    var myModal = new bootstrap.Modal(document.getElementById('registerModel'), {
        keyboard: false
      })
    console.log(myModal.innerHTML);
    myModal.show();
};



