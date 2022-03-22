import { WebProvider } from '@/Contexts/WebContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <WebProvider>
      <Component {...pageProps} />
    </WebProvider>
  )
}

export default MyApp
