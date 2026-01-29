// import Layout from "@/components/Layout";
// import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return (
//     <Layout>
//       <Component {...pageProps} />
//     </Layout>
//   )
// }


import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ThemeProvider>
  )
}