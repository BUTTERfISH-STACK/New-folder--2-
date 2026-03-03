import Link from 'next/link';
import { ArrowRight, Sparkles, FileText, GraduationCap, LayoutDashboard, Shield, Zap, Star } from 'lucide-react';
import { HeroScene } from '@/components/3d/hero-scene';

export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">CVRedo</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/builder" className="text-sm text-muted-foreground hover:text-white transition-colors">CV Builder</Link>
            <Link href="/courses" className="text-sm text-muted-foreground hover:text-white transition-colors">Courses</Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-white transition-colors">Dashboard</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/builder" 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black text-sm font-semibold hover:shadow-glow-gold transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <HeroScene />
        
        {/* Gradient orbs for extra depth */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="gradient-orb orb-1" />
          <div className="gradient-orb orb-2" />
          <div className="gradient-orb orb-3" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Star className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm text-muted-foreground">AI-Powered Career Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Redesign Your{' '}
            <span className="text-gradient-gold">Future</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Create stunning, ATS-optimized resumes with AI assistance. 
            Build your career with premium tools designed for the modern professional.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              href="/builder"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-semibold hover:shadow-glow-gold transition-all"
            >
              <Zap className="w-5 h-5" />
              Start Building Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/courses"
              className="flex items-center gap-2 px-8 py-4 rounded-xl glass hover:bg-white/10 transition-all"
            >
              <GraduationCap className="w-5 h-5 text-[#06b6d4]" />
              Browse Courses
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-20 flex items-center justify-center gap-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-gold">50K+</div>
              <div className="text-sm text-muted-foreground">CVs Created</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">10K+</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Premium <span className="text-gradient-cyan">Career Tools</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to land your dream job, from resume building to interview preparation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Link href="/builder" className="group">
              <div className="glass-card-hover p-8 rounded-2xl h-full tilt-hover">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#b8860b]/20 flex items-center justify-center mb-6 border border-[#d4af37]/20">
                  <FileText className="w-7 h-7 text-[#d4af37]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI CV Builder</h3>
                <p className="text-muted-foreground">
                  Create stunning resumes with intelligent suggestions. 3D preview, ATS optimization, and export to PDF.
                </p>
              </div>
            </Link>
            
            {/* Feature 2 */}
            <Link href="/courses" className="group">
              <div className="glass-card-hover p-8 rounded-2xl h-full tilt-hover">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center mb-6 border border-cyan-500/20">
                  <GraduationCap className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Career Courses</h3>
                <p className="text-muted-foreground">
                  Master resume writing, interview skills, and career pivots with expert-led video courses.
                </p>
              </div>
            </Link>
            
            {/* Feature 3 */}
            <Link href="/dashboard" className="group">
              <div className="glass-card-hover p-8 rounded-2xl h-full tilt-hover">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-6 border border-purple-500/20">
                  <LayoutDashboard className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Dashboard</h3>
                <p className="text-muted-foreground">
                  Track your progress, manage multiple CVs, and monitor your career journey all in one place.
                </p>
              </div>
            </Link>
            
            {/* Feature 4 */}
            <div className="glass-card p-8 rounded-2xl h-full">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center mb-6 border border-pink-500/20">
                <Shield className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ATS Optimization</h3>
              <p className="text-muted-foreground">
                Our resumes are optimized to pass through Applicant Tracking Systems with flying colors.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="glass-card p-8 rounded-2xl h-full">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-6 border border-blue-500/20">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Suggestions</h3>
              <p className="text-muted-foreground">
                Get intelligent recommendations to improve your resume content, formatting, and keywords.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="glass-card p-8 rounded-2xl h-full">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-6 border border-emerald-500/20">
                <Star className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Templates</h3>
              <p className="text-muted-foreground">
                Choose from 8+ handcrafted templates designed by career experts and designers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="glass-card p-12 rounded-3xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 via-transparent to-[#06b6d4]/5" />
            
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 relative">
              Ready to Transform Your Career?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 relative">
              Join thousands of professionals who have landed their dream jobs with CVRedo.
            </p>
            <Link 
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-semibold hover:shadow-glow-gold transition-all"
            >
              <Zap className="w-5 h-5" />
              Start Building for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold">CVRedo</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 CVRedo. Open source under MIT License.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
