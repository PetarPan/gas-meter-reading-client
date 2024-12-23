import React from 'react'
import { HelmetProvider, Helmet } from 'react-helmet-async'

function Kalkulator() {
  return (
    <HelmetProvider>
    <Helmet>
      <title>Kalkulator količina</title>
    </Helmet>
    <div>
      Kalkulator nelegalne potrošnje, kalkulator količina - aplikacija je u izradi
    </div>
    </HelmetProvider>
  )
}

export default Kalkulator
