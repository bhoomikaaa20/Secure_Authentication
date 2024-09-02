import { useState } from "react"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


export default function Signup(){
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const navigate=useNavigate();

    function handleSubmit(e){
        e.preventDefault()
        axios.post('http://localhost:8089/auth/signup',{username,email,password})
             .then(res=>{
                if(res.data.status){
                    navigate('/login')
                }
             })
             .catch(err=>console.log(err))   
    }
    return(
       <>
       <form className="signup" onSubmit={handleSubmit}>
            <h1>Signup</h1>
            <input type='text' placeholder="username" value={username} onChange={e=>setUsername(e.target.value)}/>
            <input type='email' placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            <input type='password' placeholder="password" value={password} onChange={e=>setPassword(e.target.value)}/>
            <button>Signup</button>
            <p>Already have an Account?</p>
            <a href="/login">Login</a>
       </form>
       </>
    )
}