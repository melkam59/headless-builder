import Hero from '@/components/sections/Hero';
import themeData from '@/themes/horizon-theme.json';

export default function PreviewPage() {
  // Find the hero section from the theme JSON
  const heroSection = themeData.sections.find(section => section.type === 'hero');

  if (!heroSection) {
    return <div>Hero section not found</div>;
  }

  return (
    <main className="min-h-screen">
      <Hero settings={heroSection.settings} blocks={heroSection.blocks} />
    </main>
  );
}
