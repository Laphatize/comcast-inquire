import "@/styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs'

export default function App({ Component, pageProps }) {

  return (
    <ClerkProvider>

      <Component {...pageProps} />
    </ClerkProvider>
  )
}
