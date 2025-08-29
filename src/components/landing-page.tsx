import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, BarChart3, Brain, Database, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className={"min-h-screen bg-background"}>
      <nav
        className={
          "border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
        }
      >
        <div className={"container mx-auto px-6 py-4"}>
          <div className={"flex items-center justify-between"}>
            <div className={"flex items-center space-x-2"}>
              <Image src={"/logo.png"} alt={"Logo"} width={30} height={30} />
              <h1 className={"text-xl font-semibold text-foreground"}>
                WRIGHT PIA SOFTWARE
              </h1>
            </div>

            <div className={"flex items-center space-x-2"}>
              <Link href={"/signup"}>
                <Button
                  variant={"outline"}
                  className="transition-all duration-300 hover:shadow-lg"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href={"/chat"}>
                <Button>
                  <p>Get Started</p>
                  <ArrowRight
                    size={20}
                    className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div
          className={
            "absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fEFJfGVufDB8fDB8fHww')]"
          }
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        </div>

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="mex-w-3xl">
            <h1 className="text-4xl lg:text6xl font-bold text-primary-foreground mb-6 leading-tight">
              AI powered Intelligence for the{" "}
              <span className="block bg-gradient-to-r from-secondary to-yellow-400 bg-clip-text text-transparent">
                Oil & Gas Industry
              </span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Harness the power of AI to optimize exploration, production, and
              distribution processes in the oil and gas sector.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={"/signup"}>
                <Button
                  variant={"default"}
                  className="border-1 border-white group text-lg px-8 py-6"
                >
                  <p>Start Free Trial</p>
                  <ArrowRight
                    size={20}
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Button>
              </Link>
              <Link href={"/chat"}>
                <Button variant={"outline"} className="text-lg px-8 py-6">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24 px-5 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Transforming the Oil & Gas Industry
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI solutions are designed to enhance efficiency and drive
              innovation in the oil and gas sector.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div
                className={
                  "w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto mb-6"
                }
              >
                <BarChart3 size={20} className="text-primary-foreground" />
              </div>
              <h3 className="text-foreground text-xl font-semibold mb-3 text-foreground">
                Production Analytics
              </h3>
              <p className="text-muted-foreground ">
                Leverage AI to gain insights into production data and optimize
                output.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div
                className={
                  "w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto mb-6"
                }
              >
                <Database size={20} className="text-primary-foreground" />
              </div>
              <h3 className="text-foreground text-xl font-semibold mb-3 text-foreground">
                Data Modelling
              </h3>
              <p className="text-muted-foreground ">
                Utilize AI to streamline data collection, storage, and analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div
                className={
                  "w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto mb-6"
                }
              >
                <Shield size={20} className="text-primary-foreground" />
              </div>
              <h3 className="text-foreground text-xl font-semibold mb-3 text-foreground">
                Data Modelling
              </h3>
              <p className="text-muted-foreground ">
                Utilize AI to streamline data collection, storage, and analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div
                className={
                  "w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto mb-6"
                }
              >
                <Brain size={20} className="text-primary-foreground" />
              </div>
              <h3 className="text-foreground text-xl font-semibold mb-3 text-foreground">
                Predictive Intelligence
              </h3>
              <p className="text-muted-foreground ">
                Utilize AI to analyze historical data and predict future trends.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join leading energy companies already using AI to optimize their
            operations
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              OilGas AI Guru
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2024 OilGas AI Guru. Powering the future of energy with artificial
            intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
