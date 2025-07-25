import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Play } from "lucide-react";

const benefits = [
  "Reduce project delays by up to 40%",
  "Improve team communication and collaboration",
  "Streamline document management processes",
  "Enhance safety compliance tracking",
  "Real-time project progress monitoring",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose Site Tasker?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started Now
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-accent/20 to-muted/40 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-muted-foreground">Construction Site Video</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
