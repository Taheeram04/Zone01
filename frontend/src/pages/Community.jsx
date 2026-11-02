import CommunityHero from '../components/community.jsx';
import CommunityPartners from '../components/community-partners.jsx';
import OurStaff from '../components/our-staff.jsx';
import CommunityFeaturedArticle from '../components/community-featured-article.jsx';
import CommunityFeed from '../components/community-feed.jsx';

export default function Community() {
  return (
    <div className="community-page">
      <CommunityHero />
      <CommunityPartners />
      <OurStaff />
      <CommunityFeaturedArticle />
      <CommunityFeed />
    </div>
  );
}
