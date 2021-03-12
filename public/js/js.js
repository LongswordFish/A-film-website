
        // const registerForm=document.getElementById('register');
        // const error0=document.getElementById('error0');

        // registerForm.addEventListener("submit",()=>{
        //     event.preventDefault();
        //     console.log('eeee');
        //     const xhr=new XMLHttpRequest();
        //     xhr.open('POST', '/sendMSG');
        //     xhr.send('name=100&password=200&email=300');
        //     xhr.onreadystatechange=()=>{
        //         if(xhr.readyState===4){
        //             if(xhr.status>=200 && xhr.status<300){
        //                 console.log(xhr.response);
        //                 error0.innerHTML=xhr.response[0]
        //             }
        //         }
        //     }
        // });

                    // let config = {
            //     headers: {
            //         'Authorization': 'Bearer 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',
            //         'Content-Type': 'application/json',
            //         'Access-Control-Allow-Credentials':true,
            //         'Access-Control-Allow-Origin':true
            //     }
            //   };
              
            // let data = {
            //     "personalizations":
            //     [
            //         {"to":
            //             [
            //                 {"email":email,
            //                 "name":name
            //                 }
            //             ],
            //         "subject":"Welcome to FishStreaming"
            //         }
            //     ],
            //     "content": 
            //     [
            //         {"type": "text/plain", 
            //         "value": "Heya!"}
            //     ],
            //     "from":
            //         {"email":"robinyu9840@gmail.com",
            //         "name":"Robin Yu"
            //         },
            //     "reply_to":
            //         {"email":"robinyu9840@gmail.com",
            //         "name":"Robin Yu"
            //         }
            // };

            // axios.post('https://api.sendgrid.com/v3/mail/send',data,config)
            //   .then(function (response) {
            //     console.log(response);
            //   })
            //   .catch(function (error) {
            //     console.log(`error is`,error);
            //   });
            

            // const xhr=new XMLHttpRequest();
            // xhr.open('POST', 'https://api.sendgrid.com/v3/mail/send');
            // xhr.setRequestHeader('Authorization','Bearer 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');
            // xhr.setRequestHeader('Content-Type','application/json');
            // xhr.setRequestHeader("Access-Control-Allow-Credentials", true);
            // xhr.setRequestHeader("Access-Control-Allow-Origin", true);          
            // xhr.send(JSON.stringify(data));
            // xhr.onreadystatechange=()=>{
            //     if(xhr.readyState===4){
            //         console.log('readystate');
            //         if(xhr.status>=200 && xhr.status<300){
            //             console.log('status 200');
            //             console.log(xhr.response);
            //         }
            //     }
            // }