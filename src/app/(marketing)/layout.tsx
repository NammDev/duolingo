import type { PropsWithChildren } from 'react'
import Header from './header'
import Footer from './footer'

const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex flex-1 flex-col items-center justify-center'>{children}</main>
      <Footer />
    </div>
  )
}

export default MarketingLayout
