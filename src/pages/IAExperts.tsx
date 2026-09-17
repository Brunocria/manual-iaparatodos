import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  GraduationCap,
  MessageCircle,
  Presentation,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDynamicMeta } from "@/hooks/useDynamicMeta";
import sessionImage from "@/assets/iaexperts-session.png";
import classroomImage from "@/assets/iaexperts-classroom.png";
import depoimentoOsvaldo from "@/assets/iaexperts-osvaldo.png";
import depoimentoMax from "@/assets/iaexperts-max.png";
import depoimentoKarina from "@/assets/iaexperts-karina.png";
import depoimentoCarlos from "@/assets/iaexperts-carlos.png";
import mapasMentaisComposto from "@/assets/mapas-mentais-composto.jpg.asset.json";
import webinarManual from "@/assets/webinar-manual-novo.png";
import webinarWhatsapp from "@/assets/webinar-whatsapp.png";
import webinarBiblioteca from "@/assets/webinar-biblioteca-prompts.png";
import expertVitor from "@/assets/expert-vitor.jpg";
import expertMaria from "@/assets/expert-maria.jpg";
import expertBruno from "@/assets/expert-bruno.jpg";
import expertDiran from "@/assets/expert-diran.jpg";

const testimonials = [
  {
    image: depoimentoMax,
    name: "Max Mauro",
    role: "Engenheiro e CEO da Maxtron Energia",
    result: "IA aplicada à rotina profissional",
    quote: "Hoje eu utilizo IA para pesquisa, soluções profissionais e até pessoais. O professor Yuji tem uma didática realmente diferente!",
  },
  {
    image: depoimentoKarina,
    name: "Karina Ferreira",
    role: "Médica e oncologista da Vitta",
    result: "Mais aplicabilidade na clínica",
    position: "center 15%",
    quote: "A experiência foi fantástica! O Vitor é extremamente prático, acessível e dinâmico. Muita aplicabilidade na clínica.",
  },
  {
    image: depoimentoCarlos,
    name: "Carlos Henrique de Carvalho",
    role: "Professor aposentado de engenharia civil na UFS/IFS",
    result: "Mais produtividade com IA",
    position: "center 25%",
    quote: "As aulas me abriram um leque de opções com alta produtividade. Incorporei a IA como uma ferramenta ágil e abrangente.",
  },
  {
    image: depoimentoOsvaldo,
    name: "Osvaldo Araki",
    role: "Médico",
    result: "Tecnologia sem complicação",
    quote: "O Vitor me ajudou a destrinchar a IA e desbloquear minha dificuldade com tecnologia, com um linguajar muito fácil e límpido.",
  },
];

const stageImages = [
  { src: "/lovable-uploads/vitor-yuji-palestra-1.png", alt: "Vitor Yuji ensinando inteligência artificial" },
  { src: sessionImage, alt: "Sessão individual de mentoria em IA" },
  { src: "/lovable-uploads/vitor-yuji-palestra-2.png", alt: "Turma de alunos da IA na Prática" },
  { src: classroomImage, alt: "Aula presencial de inteligência artificial" },
  { src: "/lovable-uploads/palestra-shield.jpg", alt: "Palestra sobre inteligência artificial" },
  { src: "/lovable-uploads/palestra-ivo-prado.png", alt: "Profissionais em uma aula de inteligência artificial" },
];

const brands = [
  "/lovable-uploads/logo-empresa-1.png",
  "/lovable-uploads/logo-empresa-2.png",
  "/lovable-uploads/logo-empresa-3.png",
  "/lovable-uploads/logo-empresa-4.png",
  "/lovable-uploads/logo-empresa-5.png",
  "/lovable-uploads/logo-empresa-6.png",
  "/lovable-uploads/logo-suzuki.png",
];

const courseCards = [
  { label: "Curso completo", title: "Dominando IA Generativa", description: "Fundamentos, bons prompts e aplicação prática no trabalho.", icon: Sparkles, image: "/lovable-uploads/vitor-yuji-palestra-1.png" },
  { label: "Masterclass", title: "IA para Slides", description: "Crie apresentações claras e profissionais em poucos minutos.", icon: Presentation, image: classroomImage },
  { label: "Masterclass", title: "IA para Vendas", description: "Planeje, prospecte e analise conversas comerciais com IA.", icon: TrendingUp, image: "/lovable-uploads/vitor-yuji-palestra-2.png" },
  { label: "Masterclass", title: "IA para Estudos", description: "Resuma, revise e aprenda qualquer assunto com mais velocidade.", icon: GraduationCap, image: sessionImage },
];

const experts = [
  {
    initials: "VY",
    name: "Vitor Yuji",
    role: "Expert principal",
    photo: expertVitor,
    copy: "Principal palestrante de IA de Sergipe. Jovem aprendiz da Adapta (maior empresa de IA da América Latina) e professor de mais de 50 alunos. 5 temporadas do Torneio de Robótica FLL.",
  },
  {
    initials: "MA",
    name: "Maria Augusta",
    role: "Pesquisa e inovação",
    photo: expertMaria,
    copy: "Ex-integrante da equipe SHIELD da FLL, cofundadora do projeto Mangue Mania e criadora da calculadora automática apresentada para engenheiros da NASA no MIB de 2023. Medalhista nas OBG, OP e OBLI.",
  },
  {
    initials: "B",
    name: "Bruno",
    role: "Engenharia de software",
    photo: expertBruno,
    copy: "Mais de 5 medalhas em olimpíadas científicas. Aprendeu 3 linguagens de programação complexas aos 10 anos e é programador júnior assistente de TI de Lauro Fonseca, dono da WERT, focado em habilidades de programação.",
  },
  {
    initials: "DF",
    name: "Diran Filho",
    role: "Desenvolvimento de produto",
    photo: expertDiran,
    copy: "Criador do aplicativo Cogni com Dart e Flutter, com experiência em Node.js, Python, Java, HTML, CSS e JavaScript. Cocriador do \"Reclame Aju\", plataforma para reportar problemas urbanos em Sergipe (Top 10 de 34 equipes em competição acadêmica).",
  },
];

const SectionTitle = ({ eyebrow, children, description }: { eyebrow: string; children: React.ReactNode; description?: string }) => (
  <div className="mb-12 md:mb-16">
    <span className="text-xs font-medium uppercase text-primary">{eyebrow}</span>
    <h2 className="mt-5 max-w-5xl font-editorial text-5xl font-normal leading-[0.98] md:text-7xl">{children}</h2>
    {description && <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
  </div>
);

const IAExperts = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [expertIndex, setExpertIndex] = useState(0);
  const visibleTestimonials = [0, 1, 2].map((offset) => testimonials[(testimonialIndex + offset) % testimonials.length]);
  const activeExpert = experts[expertIndex];

  useDynamicMeta({
    title: "IA Experts | Seu mentor particular de IA",
    description: "Tenha a ajuda de um expert de IA com mentoria particular, aulas coletivas e cursos completos.",
  });

  const scrollToOffer = () => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" });
  const scrollToSolutions = () => document.getElementById("solucoes")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="iaexperts min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <header className="ia-hero-nav">
        <div className="mx-auto flex h-[52px] max-w-[1240px] items-center justify-between px-5 md:px-8">
          <Button type="button" variant="ghost" onClick={scrollToSolutions} className="flex h-auto items-center gap-2.5 p-0 hover:bg-transparent" aria-label="Ir para o programa IA Experts">
            <span className="ia-brand-mark" aria-hidden="true"><span>IA</span></span>
            <span className="text-sm font-semibold">IA <strong className="font-bold">EXPERTS</strong></span>
          </Button>
          <nav className="flex items-center gap-2" aria-label="Navegação principal">
            <Button onClick={scrollToSolutions} variant="ghost" className="ia-nav-action hidden h-9 gap-2 px-3 text-xs font-medium sm:flex">
              <UserRound className="h-4 w-4" /> Mentoria particular
            </Button>
            <Button onClick={scrollToOffer} variant="ghost" className="ia-nav-action h-9 gap-2 px-3 text-xs font-medium">
              <Users className="h-4 w-4" /> Turma fundadora
            </Button>
          </nav>
        </div>
      </header>

      <section className="ia-hero relative border-b border-border">
        <div className="relative z-20 mx-auto max-w-5xl px-5 pt-14 text-center md:pt-14">
          <p className="text-sm font-semibold text-primary md:text-base">Parceria Adapta.org · Mais de 50 alunos</p>
          <h1 className="mx-auto mt-4 max-w-4xl font-editorial text-[3.35rem] font-normal leading-[0.95] md:text-[5rem]">
            <span>Tenha a ajuda de um&nbsp;</span>
            <span className="ia-title-mark" aria-label="IA"><span>IA</span></span>
            <span> de IA</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-snug text-foreground md:text-lg">
            <span>Seu trabalho não precisa só de ferramenta, mas sim de resultado.&nbsp;</span>
            <br className="hidden md:block" />
            <span> O IA Experts te entrega uma equipe de especialistas de IA para implementar com você até ele aprece</span>
          </p>

          <Button onClick={scrollToOffer} size="lg" className="ia-hero-cta mt-7 h-12 rounded-[12px] pl-5 pr-1.5 text-base font-bold transition-transform hover:-translate-y-0.5">
            Quero ter um mentor de IA
            <span className="ml-3 flex h-9 w-9 items-center justify-center rounded-[9px] bg-primary-foreground text-primary"><ArrowRight className="h-4 w-4" /></span>
          </Button>
        </div>

        <div className="ia-stage">
          <div className="ia-stage-track">
            {stageImages.map((image, index) => (
              <figure key={`${image.src}-${index}`} className={`ia-stage-card ia-stage-card-${index + 1}`}>
                <img src={image.src} alt={image.alt} loading="eager" className="h-full w-full object-cover" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-9">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[280px_1fr] md:items-center md:px-8">
          <p className="text-base leading-snug text-foreground">Mais de 5.000 empresas<br />confiam na <em className="font-editorial text-lg">IA Experts</em></p>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="ia-marquee flex w-max items-center gap-12">
              {[...brands, ...brands].map((logo, index) => <img key={`${logo}-${index}`} src={logo} alt="Empresa que confia na IA Experts" loading="lazy" className="h-16 w-40 object-contain grayscale opacity-55" />)}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionTitle eyebrow="Resultados reais">O que acontece quando um profissional <em className="text-primary">implementa IA de verdade</em></SectionTitle><div className="mb-12 flex gap-2 md:mb-16"><Button variant="outline" size="icon" aria-label="Depoimento anterior" onClick={() => setTestimonialIndex((current) => (current - 1 + testimonials.length) % testimonials.length)}><ChevronLeft className="h-5 w-5" /></Button><Button variant="outline" size="icon" aria-label="Próximo depoimento" onClick={() => setTestimonialIndex((current) => (current + 1) % testimonials.length)}><ChevronRight className="h-5 w-5" /></Button></div></div>
          <div className="grid gap-5 md:grid-cols-3">
            {visibleTestimonials.map((testimonial, index) => <article key={`${testimonial.name}-${testimonialIndex}`} className={`${index > 0 ? "hidden md:block" : "block"} overflow-hidden rounded-md border border-border bg-card transition-transform duration-300 hover:-translate-y-1`}><img src={testimonial.image} alt={testimonial.name} className="h-64 w-full object-cover" style={{ objectPosition: testimonial.position }} /><div className="p-7"><span className="text-xs font-semibold uppercase text-primary">{testimonial.result}</span><p className="mt-5 text-lg leading-relaxed text-foreground">“{testimonial.quote}”</p><div className="mt-7 border-t border-border pt-5"><p className="font-semibold">{testimonial.name}</p><p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p></div></div></article>)}
          </div>
        </div>
      </section>

      <section className="border-b border-border px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
            <h2 className="max-w-2xl font-editorial text-5xl font-normal leading-[0.98] md:text-7xl">
              Que <em className="text-primary">problema</em><br />queremos resolver?
            </h2>
            <div className="max-w-xl text-lg leading-[1.35] text-foreground md:text-[1.35rem]">
              <p>Os produtos de IA do mercado te entregam ferramentas e cursos gravados.</p>
              <p className="mt-7">Mas todo dia surgem novas ferramentas, técnicas e demandas do seu trabalho.</p>
               <p className="mt-7 font-semibold">Quem vai te ajudar com suas demandas particulares?<br />Quem vai te atualizar constantemente?</p>
              <div className="mt-9 border-y border-border py-6">
                <p className="text-xs font-bold uppercase text-primary">Estudo Bloom</p>
                <p className="mt-3 font-editorial text-3xl leading-tight">Aprender com um tutor particular é <em className="text-primary">10x mais eficaz.</em></p>
              </div>
              <p className="mt-8 font-semibold">Por isso, queremos te entregar uma equipe de especialistas de IA.</p>
            </div>
          </div>
        </div>
      </section>

      <div id="solucoes">
        <section className="relative border-b border-border px-5 py-24 md:px-8 md:py-32 [background-image:var(--ia-section-glow)]">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-semibold uppercase text-muted-foreground">01 · Especialista particular</span>
              </div>
              <h2 className="mt-8 text-5xl font-bold leading-[1.02] md:text-7xl">
                <span>Tenha um </span>
                <em className="font-editorial font-normal text-primary">especialista de IA</em>
                <span> particular</span>
              </h2>
              <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                <span>Nós te entregamos um Especialista de IA particular para você ter&nbsp;</span>
                <br />
                <strong className="font-semibold text-foreground">aulas mensais</strong>
                <span> e </span>
                <strong className="font-semibold text-foreground">contato para tirar dúvidas.</strong>
              </p>

            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
              <figure className="group relative min-h-[520px] overflow-hidden rounded-[2rem] bg-muted">
                <img src={sessionImage} alt="Aula particular de inteligência artificial" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-8">
                  <UserRound className="h-7 w-7 shrink-0 text-primary" />
                  <div><p className="text-2xl font-semibold">Aula particular mensal</p><p className="mt-1 text-sm text-muted-foreground">Direcionada às suas demandas e ao seu trabalho.</p></div>
                </figcaption>
              </figure>

              <div className="mx-auto w-full max-w-[540px]">
                <article className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                  <img src={activeExpert.photo} alt={activeExpert.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent px-6 pb-6 pt-24 md:px-8 md:pb-8">
                    <p className="text-[10px] font-semibold uppercase text-primary">{activeExpert.role}</p>
                    <h3 className="mt-2 font-editorial text-4xl leading-none md:text-5xl">{activeExpert.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{activeExpert.copy}</p>
                  </div>
                </article>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">{String(expertIndex + 1).padStart(2, "0")} / {String(experts.length).padStart(2, "0")}</p>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={() => setExpertIndex((current) => (current - 1 + experts.length) % experts.length)} aria-label="Especialista anterior">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full" onClick={() => setExpertIndex((current) => (current + 1) % experts.length)} aria-label="Próximo especialista">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl border-t border-border pt-10 text-center sm:grid-cols-2">
              <div className="px-6 py-4 sm:border-r sm:border-border"><p className="font-editorial text-3xl">Aulas mensais</p><p className="mt-2 text-xs font-semibold uppercase text-muted-foreground">Foco nas suas demandas</p></div>
              <div className="px-6 py-4"><p className="font-editorial text-3xl">Contato direto</p><p className="mt-2 text-xs font-semibold uppercase text-muted-foreground">Dúvidas quando precisar</p></div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 md:mb-16"><span className="text-xs font-medium uppercase text-primary">IA Experts Mentorias</span><h2 className="mt-5 text-5xl font-bold leading-[1.02] md:text-7xl"><span>Tenha </span><em className="font-editorial font-normal text-primary">mentorias coletivas</em></h2><p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">Receba mentorias coletivas quinzenais de IA.</p></div>
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <article className="relative min-h-[460px] overflow-hidden rounded-md">
                <img src={classroomImage} alt="Mentoria coletiva da IA Experts" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7"><div className="flex items-center gap-3 text-primary"><Users className="h-7 w-7" /><span className="font-semibold">Mentorias quinzenais</span></div><p className="mt-3 max-w-lg text-muted-foreground">Encontros ao vivo, grupo no WhatsApp e acesso às gravações para rever quando quiser.</p></div>
              </article>
              <div className="border-y border-border px-1 md:px-6">
                <div className="flex items-center justify-between border-b border-border py-5"><div><p className="text-xs font-bold uppercase text-primary">Calendário de aulas</p><h3 className="mt-2 font-editorial text-3xl">Próximos temas</h3></div><CalendarDays className="h-8 w-8 text-primary" /></div>
                <div className="divide-y divide-border">{["IA para Gestão", "IA para Marketing", "IA para Estudos", "Claude Code e VibeCoding"].map((title, index) => <div key={title} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 py-5"><span className="font-editorial text-2xl text-primary">0{index + 1}</span><p className="font-semibold">{title}</p><span className="text-xs text-muted-foreground">Em breve</span></div>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 md:mb-16"><span className="text-xs font-medium uppercase text-primary">IA Experts Cursos</span><h2 className="mt-5 text-5xl font-bold leading-[1.02] md:text-7xl"><span>Conheça </span><em className="font-editorial font-normal text-primary">Nossos Cursos</em></h2><p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">*Certificações inclusas</p></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {courseCards.map((course) => <article key={course.title} className="group relative aspect-[3/4] overflow-hidden rounded-md bg-background"><img src={course.image} alt={course.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" /><course.icon className="absolute right-5 top-5 h-9 w-9 rounded-md border border-primary/40 bg-primary/20 p-2 text-primary" /><div className="absolute inset-x-0 bottom-0 p-6"><p className="text-xs font-bold uppercase text-primary">{course.label}</p><h3 className="mt-2 text-3xl font-bold leading-none">{course.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{course.description}</p></div></article>)}
            </div>
          </div>
        </section>
      </div>

      <section className="border-y border-border bg-card px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <div className="mb-5 inline-block rounded-full border border-primary/40 px-4 py-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Presentes Especiais</span>
            </div>
            <h2 className="mt-5 text-5xl font-bold leading-[1.02] md:text-7xl">
              <span>Além disso, tenha acesso a </span>
              <em className="font-editorial font-normal text-primary">Bônus Especiais</em>
            </h2>
          </div>
          <div className="space-y-6 md:space-y-8">
            {[
              { img: mapasMentaisComposto.url, title: "Mapas Mentais e Resumos das Aulas", desc: "Mapas mentais visuais e resumos das aulas para você estudar, revisar e fixar os principais aprendizados de forma prática.", fit: "contain" as const },
              { img: webinarManual, title: "Workbook IA Experts", desc: "Seu \"guia de bolso\" de IA — um material que te acompanha durante e depois das aulas para garantir que você extraia o máximo valor." },
              { img: webinarWhatsapp, title: "Grupo no WhatsApp", desc: "Faça networking com outros profissionais e seja atualizado constantemente sobre as novidades de IA." },
              { img: webinarBiblioteca, title: "Biblioteca de Prompts", desc: "Tenha acesso a prompts exclusivos da IA Experts, prontos e testados para você aplicar no seu trabalho." },
            ].map((b, i) => {
              const reverse = i % 2 === 1;
              return (
                <div key={i} className={`grid gap-5 md:grid-cols-5 md:gap-7 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="flex flex-col justify-center rounded-md border border-border bg-background p-7 md:col-span-2 md:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Bônus {i + 1}</span>
                      </span>
                    </div>
                    <h3 className="mb-3 text-2xl font-bold leading-tight md:text-[26px]">{b.title}</h3>
                    <p className="text-[15px] leading-relaxed text-muted-foreground md:text-base">{b.desc}</p>
                  </div>
                  <div className={`relative min-h-[260px] overflow-hidden rounded-md border border-border md:col-span-3 md:min-h-[300px] ${b.fit === "contain" ? "bg-[#0f1117]" : ""}`}>
                    <img src={b.img} alt={b.title} loading="lazy" className={`absolute inset-0 h-full w-full ${b.fit === "contain" ? "object-contain p-6" : "object-cover"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="oferta" className="border-y border-border bg-card px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">OFERTA</span>
            <h2 className="mt-5 font-editorial text-5xl leading-none md:text-7xl">Garanta seu <em className="text-primary">Especialista de IA Particular</em></h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">A primeira "Escola de IA" do Brasil a te entregar um especialista de IA particular.</p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">IA Experts Mais Escolhido</span>
              <span className="text-xs font-bold text-primary">|</span>
              <span className="text-xs font-bold text-primary">75%OFF*</span>
            </div>
            <div className="mt-8 flex items-start gap-3 border-t border-border pt-6"><Clock3 className="mt-1 h-5 w-5 shrink-0 text-primary" /><p className="text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Experimente antes de decidir:</strong> você pode participar da próxima aula coletiva gratuitamente.</p></div>
          </div>
          <div className="rounded-md border border-primary/35 bg-background p-7 md:p-9">
            <p className="font-editorial text-6xl text-primary">R$800</p>
            <p className="mt-1 text-sm text-muted-foreground">valor total pelos 3 meses</p>
            <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
              {["Acesso Completo a Todos os Cursos", "Especialista de IA Particular", "Mentorias Coletivas", "Cursos e Certificações"].map((item) => <li key={item} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-primary" />{item}</li>)}
            </ul>
            <Button disabled className="mt-8 h-14 w-full rounded-full font-bold disabled:opacity-70">Inscrições em breve</Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">O novo link de inscrição ainda será liberado.</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8"><div className="mx-auto max-w-4xl"><div className="mb-10 text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" /><h2 className="mt-4 font-editorial text-5xl">Perguntas frequentes</h2></div><Accordion type="single" collapsible className="space-y-3">{[["Quanto tempo dura a turma fundadora?", "O programa inicial dura 3 meses, com acompanhamento particular, aulas coletivas e acesso aos cursos."],["Como funcionam as aulas particulares?", "Cada encontro é direcionado às suas dúvidas, ao seu trabalho e às aplicações de IA que você precisa desenvolver."],["As aulas coletivas ficam gravadas?", "Sim. As gravações entram na biblioteca para você rever durante o programa."],["Como funciona o contato para dúvidas?", "Você terá contato no WhatsApp para enviar dúvidas. Os horários e prazos de resposta serão combinados com a turma."]].map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`} className="border border-border bg-card px-5"><AccordionTrigger className="text-left font-semibold hover:no-underline">{question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>

      <footer className="border-t border-border px-5 py-9"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"><p className="font-semibold text-foreground"><span className="text-primary">IA</span> Experts</p><a href="mailto:contato.vitoryujiminomo@gmail.com" className="hover:text-primary">contato.vitoryujiminomo@gmail.com</a></div></footer>
    </main>
  );
};

export default IAExperts;
