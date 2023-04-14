import Head from 'next/head';
import styles from '../styles/index.module.css';
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
          <center><h1 className={styles.userName}>Welcome: {user.name}</h1></center>
          <div className={styles.imageContainer}>
            <img className={styles.userImage} src={user.picture} alt="User Avatar" />
          </div>
          <center><button className={styles.logoutButton} onClick={logoutHandler}>Logout</button></center>
      </React.Fragment>)
      : 
      (<center><button className={styles.loginButton} onClick={loginHandler}>Login</button></center>)}
    </React.Fragment>

  )
  return (
    <div className={styles.container}>
      {user ? (
        <React.Fragment>
          <h1 className={styles.userName}>Welcome: {user.name}</h1>
          <div className={styles.imageContainer}>
            <img className={styles.userImage} src={user.picture} alt="User Avatar" />
          </div>
          <button className={styles.logoutButton} onClick={logoutHandler}>
            Logout
          </button>
        </React.Fragment>
      ) : (
        <button className={styles.loginButton} onClick={loginHandler}>
          Login
        </button>
      )}
    </div>
  );
}
export default Home;



