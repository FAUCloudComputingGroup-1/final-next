import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

let Home=()=> {
  const {push}=useRouter()
  const { isLoading , user, error}= useUser()
  const loginHandler=()=>push('/api/auth/login')
  const logoutHandler=()=>push('/api/auth/logout')
  user?console.log(user):console.log("othing yet")
  if (isLoading)
  {
    return(<h1>Loading...</h1>)
  }
  return (
    <React.Fragment>
    { user ? (
      <React.Fragment>
      <p>welcome: {user.name}</p> <img src={user.picture} alt="BigCo Inc.logo"/>
      <button onClick={logoutHandler}>Logout</button>
      </React.Fragment>)
      : 
      (<button onClick={loginHandler}>Login</button>)}
    </React.Fragment>

  )
}
export default Home;



