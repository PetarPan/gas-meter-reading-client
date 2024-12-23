import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

function Havarije() {
  return (
    <HelmetProvider>
    <Helmet>
    <title>Aplikacija za računanje havarija</title>
  </Helmet>
    <div>
      Havarije - aplikacija je u izradi
    </div>
    </HelmetProvider>
  )
}

export default Havarije
