import React from 'react'
import Navbar from '../components/Navbar.jsx'
import HomepageHero from '../components/HomepageHero.jsx'
import SocialProofStrip from '../components/SocialProofStrip.jsx'
import WhatIsTeensConnect from '../components/WhatIsTeensConnect.jsx'
import CorePillars from '../components/CorePillars.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import FeaturedCommunities from '../components/FeaturedCommunities.jsx'
import ActivitiesHighlight from '../components/ActivitiesHighlight.jsx'
import SkillsOpportunitiesPreview from '../components/SkillsOpportunitiesPreview.jsx'

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <HomepageHero />
      <SocialProofStrip />
      <WhatIsTeensConnect />
      <CorePillars />
      <HowItWorks />
      <FeaturedCommunities />
      <ActivitiesHighlight />
      <SkillsOpportunitiesPreview />
    </div>
  )
}

export default Homepage
