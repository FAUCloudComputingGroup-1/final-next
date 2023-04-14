// pages/_app.js
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Nav from '@/Mods/Nav';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Nav/>
      <Component {...pageProps} />
    </UserProvider>
  );
}