// pages/_app.js
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Nav from '@/Mods/Nav';
import styles from '../styles/_app.module.css';


export default function App({ Component, pageProps }) {
  return (
    <div className={styles.container}>
    <UserProvider>
      <Nav/>
      <Component {...pageProps} />
    </UserProvider>
    </div>
  );
}