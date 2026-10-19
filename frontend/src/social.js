// Shared Zone01 Kisumu social media accounts.
//
// Kept in one place so the footer and the community hub always show the same
// set of handles. `type` drives the footer's solid/outlined button styles;
// `color` is the brand colour used for badges on community post cards.
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
} from 'react-icons/fa6';

export const SOCIAL_LINKS = [
  {
    // Matches the CMS `platform` choices (minus `website`), so a post can map
    // straight onto the account it came from.
    key: 'facebook',
    type: 'solid',
    Icon: FaFacebookF,
    href: 'https://www.facebook.com/share/1DLp6tDVmK/?mibextid=wwXIfr',
    label: 'Facebook',
    handle: '@Zone01Kisumu',
    color: '#1877F2',
    iconClass: 'w-[13px] h-[13px] sm:w-[15px] sm:h-[15px]',
  },
  {
    key: 'x',
    type: 'outlined',
    Icon: FaXTwitter,
    href: 'https://x.com/Zone01Kisumu',
    label: 'X (formerly Twitter)',
    handle: '@Zone01Kisumu',
    color: '#000000',
    iconClass: 'w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]',
  },
  {
    key: 'instagram',
    type: 'solid',
    Icon: FaInstagram,
    href: 'https://www.instagram.com/zone01_kisumu/',
    label: 'Instagram',
    handle: '@zone01_kisumu',
    color: '#E1306C',
    iconClass: 'w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]',
  },
  {
    key: 'linkedin',
    type: 'solid',
    Icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/company/zone01kisumu/',
    label: 'LinkedIn',
    handle: 'Zone01 Kisumu',
    color: '#0A66C2',
    iconClass: 'w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]',
  },
  {
    key: 'youtube',
    type: 'solid',
    Icon: FaYoutube,
    href: 'https://www.youtube.com/@Zone01Kisumu',
    label: 'YouTube',
    handle: '@Zone01Kisumu',
    color: '#FF0000',
    iconClass: 'w-[13px] h-[13px] sm:w-[15px] sm:h-[15px]',
  },
  {
    key: 'tiktok',
    type: 'solid',
    Icon: FaTiktok,
    href: 'https://www.tiktok.com/@zone01kisumu?_r=1&_t=ZS-9ANaGVKhcEH',
    label: 'TikTok',
    handle: '@zone01kisumu',
    color: '#010101',
    iconClass: 'w-[13px] h-[13px] sm:w-[14px] sm:h-[14px]',
  },
];

/** Look up a social account by its CMS platform key. */
export const socialByKey = (key) => SOCIAL_LINKS.find((link) => link.key === key) || null;
