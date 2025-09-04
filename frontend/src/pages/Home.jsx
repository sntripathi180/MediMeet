import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <div id="speciality">
        <SpecialityMenu/>
      </div>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home