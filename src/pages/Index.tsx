import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Leaf, FileCheck, BarChart3, Award, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RatingLevelsOverview } from '@/components/RatingBadge';
import Header from '@/components/Header';
import logo from '@/assets/logo.png';

const features = [
  { icon: Shield, title: 'Safety Compliance', desc: 'Earthquake zone certificates, fire safety NOCs, structural stability audits' },
  { icon: Leaf, title: 'LEED Green Building', desc: 'Comprehensive green building certification scoring aligned with LEED standards' },
  { icon: BarChart3, title: 'CMM-Style Rating', desc: '5-level maturity model from Initial to Exemplary for facility assessment' },
  { icon: FileCheck, title: 'PDF Reports', desc: 'Generate professional compliance reports and certificates with watermarked branding' },
  { icon: Award, title: 'Certifications', desc: 'Track mandatory and optional compliance certificates with expiry management' },
  { icon: Building2, title: 'Society Management', desc: 'Manage multiple housing societies with detailed facility assessment tracking' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <img src={logo} alt="CHS Rate" className="mx-auto mb-6 h-20 w-20 drop-shadow-2xl" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-primary-foreground md:text-6xl"
          >
            CHS Rate
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80"
          >
            Rate and certify Cooperative Housing Societies with a CMM-style maturity model.
            LEED Green Building compliance, earthquake zone certificates, and comprehensive facility assessments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/signup">
              <Button size="lg" className="gradient-accent text-accent-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity border-0">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" className="bg-secondary text-secondary-foreground font-semibold shadow-lg hover:bg-secondary/90 border-0">
                Login
              </Button>
            </Link>
          </motion.div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-primary">Comprehensive Facility Rating</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg gradient-green">
                  <f.icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <h3 className="mb-1 font-semibold text-card-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating Levels */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-primary">Maturity Rating Levels</h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-muted-foreground">
            Similar to SEI CMM, societies are rated across 5 maturity levels based on facility quality, safety compliance, and sustainability.
          </p>
          <RatingLevelsOverview />
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-hero py-10 text-center text-primary-foreground/60">
        <div className="container mx-auto px-4">
          <img src={logo} alt="CHS Rate" className="mx-auto mb-3 h-10 w-10 opacity-60" />
          <p className="text-sm">© 2026 CHS Rate — Cooperative Housing Society Facility Rating System</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
