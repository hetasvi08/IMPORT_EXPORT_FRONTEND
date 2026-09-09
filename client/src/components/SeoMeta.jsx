import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_SEO = {
  '/': {
    title: 'Nexarion Global Exports | Import Export Solutions Partner',
    description: 'Nexarion Global Exports helps businesses with trusted import export solutions, sourcing, and global trade support.'
  },
  '/products': {
    title: 'Products | Nexarion Global Exports',
    description: 'Explore global import export products from trusted suppliers at Nexarion Global Exports.'
  },
  '/categories': {
    title: 'Categories | Nexarion Global Exports',
    description: 'Browse product categories for international trade and export opportunities.'
  },
  '/catalogs': {
    title: 'Catalogs | Nexarion Global Exports',
    description: 'Download product catalogs and discover import export solutions from Nexarion Global Exports.'
  },
  '/services': {
    title: 'Services | Nexarion Global Exports',
    description: 'Import export services including sourcing, documentation, and logistics support.'
  },
  '/about': {
    title: 'About | Nexarion Global Exports',
    description: 'Learn about Nexarion Global Exports, your trusted export partner for international business.'
  },
  '/contact': {
    title: 'Contact | Nexarion Global Exports',
    description: 'Contact Nexarion Global Exports for import export inquiries, partnerships, and support.'
  }
};

const DEFAULT_SEO = {
  title: 'Nexarion Global Exports | Import Export Solutions Partner',
  description: 'Trusted import export partner for global sourcing, trade support, and export solutions.'
};

function setMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setPropertyTag(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setCanonical(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

const SeoMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = PAGE_SEO[location.pathname] || DEFAULT_SEO;
    const canonicalUrl = `https://nexarionimpex.com${location.pathname === '/' ? '/' : location.pathname}`;

    document.title = seo.title;
    setMetaTag('description', seo.description);
    setPropertyTag('og:title', seo.title);
    setPropertyTag('og:description', seo.description);
    setPropertyTag('og:url', canonicalUrl);
    setMetaTag('twitter:title', seo.title);
    setMetaTag('twitter:description', seo.description);
    setCanonical(canonicalUrl);
  }, [location.pathname]);

  return null;
};

export default SeoMeta;
