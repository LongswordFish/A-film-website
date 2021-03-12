window.onload=function(){

    //get the modal
    var myModal = new bootstrap.Modal(document.getElementById('registerModel'), {
        keyboard: false
      });

    //let the modal show when the page is loaded
    myModal.show();

    //when the modal is closed, redirect to the home page
    var closeBtn= document.getElementById('closeBtn');
    closeBtn.addEventListener('click',()=>{
        window.location.replace('/');
    });

    //clear all the fields when clear button is pressed
    var clearBtn= document.getElementById('clearBtn');
    clearBtn.addEventListener('click',()=>{
        var username=document.getElementById('username_res');
        var password=document.getElementById('password_res');
        var email=document.getElementById('email_res');
        var phone=document.getElementById('phone_res');
        username.setAttribute('value',"");
        password.setAttribute('value',"");
        email.setAttribute('value',"");
        phone.setAttribute('value',"");

    })

};



