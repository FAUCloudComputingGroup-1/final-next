import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" style={{ backgroundColor: '#333' }}>
      <Head/>
      <body style={{ height: '100vh' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
