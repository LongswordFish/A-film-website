window.onload=function(){
    var myModal = new bootstrap.Modal(document.getElementById('registerModel'), {
        keyboard: false
      });
    myModal.show();
    var closeBtn= document.getElementById('closeBtn');
    closeBtn.addEventListener('click',()=>{
        window.location.replace('/');
    });
    var clearBtn= document.getElementById('clearBtn');
    clearBtn.addEventListener('click',()=>{
        var username=document.getElementById('username_res');
        var password=document.getElementById('password_res');
        var email=document.getElementById('email_res');
        username.setAttribute('value',"");
        password.setAttribute('value',"");
        email.setAttribute('value',"");

    })

};



