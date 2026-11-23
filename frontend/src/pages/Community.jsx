import CommunityHero from '../components/community.jsx';
import CommunityPartners from '../components/community-partners.jsx';
import OurStaff from '../components/our-staff.jsx';
import CommunityNewsSection from '../components/community/CommunityNewsSection.jsx';
import CommunityEventsSection from '../components/community/CommunityEventsSection.jsx';
import CommunityBlogsSection from '../components/community/CommunityBlogsSection.jsx';
import CommunityPodcastBanner from '../components/community/CommunityPodcastBanner.jsx';

export default function Community() {
  return (
    <div className="community-page">
      <CommunityHero />
      <CommunityPartners />
      <OurStaff />
      <CommunityNewsSection />
      <CommunityEventsSection />
      <CommunityBlogsSection />
      <CommunityPodcastBanner />
    </div>
  );
}
