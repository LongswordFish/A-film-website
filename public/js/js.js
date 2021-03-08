
        const registerForm=document.getElementById('register');
        const error0=document.getElementById('error0');

        registerForm.addEventListener("submit",()=>{
            event.preventDefault();
            console.log('eeee');
            const xhr=new XMLHttpRequest();
            xhr.open('POST', '/sendMSG');
            xhr.send('name=100&password=200&email=300');
            xhr.onreadystatechange=()=>{
                if(xhr.readyState===4){
                    if(xhr.status>=200 && xhr.status<300){
                        console.log(xhr.response);
                        error0.innerHTML=xhr.response[0]
                    }
                }
            }
        });