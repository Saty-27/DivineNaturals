import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Milk, Leaf, Truck, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--eco-cream)] to-[var(--eco-light)]">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">
        {/* Hero Section */}
        <div className="eco-gradient p-8 text-white text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Milk className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Divine Naturals</h1>
            <p className="text-white/90">Pure. Fresh. Daily.</p>
          </div>
        </div>

        {/* Features */}
        <div className="p-6 space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold eco-text mb-2">Why Choose Us?</h2>
            <p className="eco-text-muted">Pure, fresh, and delivered with care</p>
          </div>

          <div className="grid gap-4">
            <Card className="eco-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--eco-primary)]/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-[var(--eco-primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold eco-text">100% Organic</h3>
                  <p className="text-sm eco-text-muted">Sourced from verified organic farms</p>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--eco-accent)]/20 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-[var(--eco-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold eco-text">Fresh Delivery</h3>
                  <p className="text-sm eco-text-muted">Delivered within 24 hours of milking</p>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--eco-secondary)]/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[var(--eco-secondary)]" />
                </div>
                <div>
                  <h3 className="font-semibold eco-text">Quality Assured</h3>
                  <p className="text-sm eco-text-muted">Tested for purity and freshness</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farm Image */}
          <div className="rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
              alt="Farm fresh dairy" 
              className="w-full h-48 object-cover"
            />
          </div>

          {/* CTA */}
          <div className="space-y-4 pt-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full eco-button py-6 text-lg flex items-center justify-center gap-3"
              data-testid="button-login-google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login with Google
            </Button>
            <p className="text-center text-sm eco-text-muted">
              Secure authentication powered by Google
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
