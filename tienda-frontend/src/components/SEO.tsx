import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: {
    name: string;
    description: string;
    price: number;
    image: string;
    availability: boolean;
    brand: string;
    category: string;
  };
}

const SEO: React.FC<SEOProps> = ({
  title = 'Fashion Store - Ropa Premium y Moda Tendencia en Perú',
  description = 'Descubre la mejor colección de ropa premium en Perú. Camisetas, pantalones, vestidos, accesorios y más con envío rápido a todo el país. Calidad garantizada.',
  keywords = 'ropa, moda, tienda de ropa, ropa premium, comprar ropa online, camisetas, vestidos, accesorios, Perú',
  image = 'https://fashionstore.com.pe/og-image.jpg',
  url = 'https://fashionstore.com.pe',
  type = 'website',
  product
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('canonical', url, true);

    // Open Graph
    updateMetaTag('og:title', title, false, 'property');
    updateMetaTag('og:description', description, false, 'property');
    updateMetaTag('og:image', image, false, 'property');
    updateMetaTag('og:url', url, false, 'property');
    updateMetaTag('og:type', type, false, 'property');
    updateMetaTag('og:site_name', 'Fashion Store', false, 'property');
    updateMetaTag('og:locale', 'es_PE', false, 'property');

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image', false, 'name');
    updateMetaTag('twitter:site', '@fashionstore', false, 'name');
    updateMetaTag('twitter:title', title, false, 'name');
    updateMetaTag('twitter:description', description, false, 'name');
    updateMetaTag('twitter:image', image, false, 'name');

    // Structured Data (JSON-LD)
    addStructuredData(product);

    // Cleanup on unmount
    return () => {
      removeStructuredData();
    };
  }, [title, description, keywords, image, url, type, product]);

  return null;
};

function updateMetaTag(name: string, content: string, isLink = false, attribute: 'name' | 'property' = 'name') {
  let element: HTMLMetaElement | HTMLLinkElement | null = null;

  if (isLink) {
    element = document.querySelector(`link[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    (element as HTMLLinkElement).href = content;
    (element as HTMLLinkElement).rel = isLink ? 'canonical' : '';
  } else {
    element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    (element as HTMLMetaElement).content = content;
  }
}

function addStructuredData(product?: SEOProps['product']) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'structured-data';

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': product ? 'Product' : 'WebSite',
    name: 'Fashion Store',
    url: 'https://fashionstore.com.pe',
    description: 'Tienda de ropa premium en Perú',
    publisher: {
      '@type': 'Organization',
      name: 'Fashion Store',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fashionstore.com.pe/favicon.svg'
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://fashionstore.com.pe/products?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  if (product) {
    structuredData['@type'] = 'Product';
    structuredData.name = product.name;
    structuredData.description = product.description;
    structuredData.image = product.image;
    structuredData.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PEN',
      availability: product.availability ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Fashion Store'
      }
    };
    structuredData.brand = {
      '@type': 'Brand',
      name: product.brand
    };
    structuredData.category = product.category;
  }

  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

function removeStructuredData() {
  const existingScript = document.getElementById('structured-data');
  if (existingScript) {
    existingScript.remove();
  }
}

export default SEO;
