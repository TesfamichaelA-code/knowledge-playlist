import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Layers,
  BookOpen,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  GraduationCap,
} from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  // If already logged in, go straight to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">LearnPath</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gap-1.5">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[96px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Your personal learning companion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Master anything with{' '}
            <span className="text-gradient">structured</span>{' '}
            learning paths
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Organize videos, articles, and documentation into curated learning paths.
            Track your progress and never lose sight of your learning goals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-base px-8 h-12">
                Start Learning for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                See how it works
              </Button>
            </a>
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            No credit card required. Free forever.
          </p>
        </div>

        {/* Hero visual / mockup */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-secondary/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground font-mono">learnpath — dashboard</span>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              {/* Mock dashboard cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'React Mastery', category: 'Frontend', progress: 72, resources: 12 },
                  { title: 'System Design', category: 'Architecture', progress: 45, resources: 8 },
                  { title: 'TypeScript Deep Dive', category: 'Languages', progress: 90, resources: 15 },
                ].map((path) => (
                  <div
                    key={path.title}
                    className="glass-card rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{path.title}</p>
                        <p className="text-xs text-muted-foreground">{path.category}</p>
                      </div>
                      <BookOpen className="h-4 w-4 text-primary/60" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{path.resources} resources</span>
                        <span>{path.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow under the mockup */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/10 blur-[64px] rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-border/40">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to{' '}
              <span className="text-gradient">learn smarter</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Build your own curriculum from the best resources on the internet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Curated Paths',
                description:
                  'Create learning paths from videos, articles, docs, and PDFs. Organize resources in the order that makes sense for you.',
              },
              {
                icon: BarChart3,
                title: 'Track Progress',
                description:
                  'Mark resources as complete, track your progress percentage, and see exactly where you left off.',
              },
              {
                icon: Zap,
                title: 'Continue Learning',
                description:
                  'Jump back into your most recent resource instantly. Never lose momentum on your learning journey.',
              },
              {
                icon: BookOpen,
                title: 'Embedded Viewer',
                description:
                  'Watch videos and read articles right inside the app. No more switching between browser tabs.',
              },
              {
                icon: GraduationCap,
                title: 'Categories',
                description:
                  'Group your paths by topic — Frontend, Backend, DevOps, Design, or anything you want to learn.',
              },
              {
                icon: Sparkles,
                title: 'Beautiful & Fast',
                description:
                  'A dark-themed, distraction-free interface designed for focused learning. Built for speed.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border/50 bg-card/30 p-6 space-y-3 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-border/40 bg-secondary/20">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Get started in <span className="text-gradient">3 steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create a path',
                description: 'Name your learning path and choose a category to get started.',
              },
              {
                step: '02',
                title: 'Add resources',
                description: 'Drop in YouTube videos, blog posts, docs, or any URL you want to learn from.',
              },
              {
                step: '03',
                title: 'Learn & track',
                description: 'Work through your resources, track your progress, and complete your path.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / trust */}
      <section className="py-20 px-6 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <CheckCircle2 key={i} className="h-5 w-5 text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">Built for self-directed learners</p>
          </div>
          <blockquote className="text-xl sm:text-2xl font-medium italic leading-relaxed text-foreground/90">
            "The best way to learn is to build your own curriculum from the resources
            that resonate with you. LearnPath makes that effortless."
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to take control of your{' '}
            <span className="text-gradient">learning?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start building your personalized learning paths today. It's free.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2 text-base px-10 h-12">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">LearnPath</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LearnPath. Built for learners, by learners.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
