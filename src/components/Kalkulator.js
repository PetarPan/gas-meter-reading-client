import React from 'react'
import { HelmetProvider, Helmet } from 'react-helmet-async'

function Kalkulator() {
  return (
    <HelmetProvider>
    <Helmet>
      <title>Kalkulator</title>
    </Helmet>
    <div>
      Kalkulator nelegalne potrošnje
    </div>
    </HelmetProvider>
  )
}

export default Kalkulator
