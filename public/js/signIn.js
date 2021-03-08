window.onload=function(){
    var myModal = new bootstrap.Modal(document.getElementById('signInModel'), {
        keyboard: false
      });
    myModal.show();
    var closeBtn= document.getElementById('closeBtn');
    closeBtn.addEventListener('click',()=>{
        window.location.replace('/');
    });
    var clearBtn= document.getElementById('clearBtn');
    clearBtn.addEventListener('click',()=>{
        var password=document.getElementById('password_signIN');
        var username=document.getElementById('username_signIN');
        password.setAttribute('value',"");
        username.setAttribute('value',"");
    })
};
