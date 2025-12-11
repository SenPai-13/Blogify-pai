import {
  Home,
  Settings,
  Image,
  FileText,
  Clipboard,
  Menu as MenuIcon,
} from "lucide-react";
import { VscPreview } from "react-icons/vsc";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

export const PUBLIC_ROUTES = {
  HOME: { label: 'HOME', link: '/', id: 'home' },
  SERVICES: { label: 'SERVICES', link: '/services', id: 'services' },
  PRICING: { label: 'PLAN & PRICING', link: '/pricing', id: 'pricing' },
  MENU: { label: 'MENU', link: '/menu', id: 'menu' },
  BLOG: { label: 'BLOGS', link: '/blogs', id: 'blog' },
  GALLERY: { label: 'GALLERY', link: '/gallery', id: 'gallery' },
  ABOUT: { label: 'ABOUT US', link: '/about', id: 'about' },
  CONTACT: { label: 'CONTACT US', link: '/contact', id: 'contact' },
};

export const QUICK_LINKS = [
  { label: 'Home', link: '/' },
  { label: 'Services', link: '/services' },
  { label: 'Plan & Pricing', link: '/pricing' },
  { label: 'Menu', link: '/menu' },
  { label: 'Blogs', link: '/blogs' },
  { label: 'Gallery', link: '/gallery' },
  { label: 'About Us', link: '/about' },
  { label: 'Contact Us', link: '/contact' }
]


export const SOCIAL_LINKS = [
  {
    label: "Facebook",
    icon: FaFacebookF,
    href: "#",
  },
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    href: "#",
  },
  {
    label: "YouTube",
    icon: FaYoutube,
    href: "#",
  },
  {
    label: "Instagram",
    icon: FaInstagram,
    href: "#",
  },
];


export const APP_NAME = 'Good Taste Caters Thiruvalla'

export const ADMIN_NAVLINKS = [
  {
    label: "Home",
    path: "/admin",
    icon: Home,
  },
  {
    label: "Services",
    path: "/admin/services",
    icon: Settings,
  },
  {
    label: "Gallery",
    path: "/admin/gallery",
    icon: Image,
  },
  {
    label: "Blog",
    path: "/admin/blogs",
    icon: FileText,
  },
  {
    label: "Plan Management",
    path: "/admin/plan-management",
    icon: Clipboard,
  },
  {
    label: "Menu",
    path: "/admin/menu",
    icon: MenuIcon,
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
    icon: VscPreview,
  },
];
