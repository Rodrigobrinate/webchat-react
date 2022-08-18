import { useEffect, useState } from 'react';

export default (el: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const callback: any = ([entry]: [any]) => {
    setIsVisible(entry.isIntersecting);
  } ;

  useEffect(() => {
    const watch = new IntersectionObserver(callback);
    if (el) {
      watch.observe(el);
      return () => watch.unobserve(el);
    }
  }, [el]);

  return isVisible && !!el;
};