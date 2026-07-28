'use client';
import { useState } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import SolutionSection from './SolutionSection';
import HowItWorksSection from './HowItWorksSection';
import BenefitsSection from './BenefitsSection';
import FlexibilitySection from './FlexibilitySection';
import FoundingPartnerSection from './FoundingPartnerSection';
import FinalCtaSection from './FinalCtaSection';
import NewsletterSignupSection from './NewsletterSignupSection';
import Footer from './Footer';
import RequestInfoModal from './RequestInfoModal';
import FoundingPartnerModal from './FoundingPartnerModal';

export default function LandingClient() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const openRequest = () => setShowRequestModal(true);
  const closeRequest = () => setShowRequestModal(false);

  const openPartner = () => setShowPartnerModal(true);
  const closePartner = () => setShowPartnerModal(false);

  return (
    <>
      <Navbar onOpenModal={openRequest} />
      <main>
        <HeroSection onOpenModal={openRequest} />
        <NewsletterSignupSection />
        <ProblemSection />
        <SolutionSection onOpenModal={openRequest} />
        <HowItWorksSection />
        <BenefitsSection />
        <FlexibilitySection />
        <FoundingPartnerSection onOpenModal={openPartner} />
        <FinalCtaSection onOpenModal={openRequest} />
      </main>
      <Footer />
      {showRequestModal && <RequestInfoModal onClose={closeRequest} />}
      {showPartnerModal && <FoundingPartnerModal onClose={closePartner} />}
    </>
  );
}
