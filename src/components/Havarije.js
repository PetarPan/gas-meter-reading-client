import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

function Havarije() {
  return (
    <HelmetProvider>
    <Helmet>
    <title>Promena lozinke</title>
  </Helmet>
    <div>
      Havarije
    </div>
    </HelmetProvider>
  )
}

export default Havarije
