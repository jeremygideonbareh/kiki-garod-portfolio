import { films } from "@/data/films"
import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/hero-section"
import { HorizontalGallery } from "@/components/horizontal-gallery"
import { FeaturedFilms } from "@/components/featured-films"
import { KineticMarquee } from "@/components/kinetic-marquee"
import { FilmDeepDive } from "@/components/film-deep-dive"
import { PhilosophySection } from "@/components/philosophy-section"
import { AwardsSection } from "@/components/awards-section"
import { TeamSection } from "@/components/team-section"
import { ContactSection } from "@/components/contact-section"
import { SectionTransition } from "@/components/section-transition"

export default function Home() {
  const featuredFilms = films.slice(0, 4)

  return (
    <main>
      <Nav />
      <section id="hero">
        <HeroSection />
      </section>
      <section id="work">
        <HorizontalGallery films={films} />
      </section>
      <SectionTransition>
        <FeaturedFilms films={featuredFilms} />
      </SectionTransition>
      <SectionTransition>
        <KineticMarquee films={films} />
      </SectionTransition>
      <SectionTransition>
        <FilmDeepDive films={films} />
      </SectionTransition>
      <section id="about">
        <PhilosophySection />
      </section>
      <SectionTransition>
        <AwardsSection />
      </SectionTransition>
      <SectionTransition>
        <TeamSection />
      </SectionTransition>
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  )
}
