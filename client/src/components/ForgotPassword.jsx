import { useState } from "react"
import axios from 'axios'



export default function ForgotPassword(){
    const [email,setEmail]=useState('')


    function handleSubmit(e){
        e.preventDefault()
        axios.post('http://localhost:8089/auth/forgotPassword',{email})
             .then(res=>{
                if(res.data.status){
                    alert("Check your email for reset password");
                }
             })
             .catch(err=>console.log(err))   
    }
    return(
       <>
       <form className="forgotPassword" onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>
            <input type='email' placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            <button>Send</button>
            
            <p>Do not have an Account?</p>
            <a href="/signup">Signup</a>
       </form>
       </>
    )
}