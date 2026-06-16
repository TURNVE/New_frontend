import { motion } from 'framer-motion';
import { ArrowRight, Building2, Layers, BarChart3, Users } from 'lucide-react';

export function OrganizationSection() {
  return (
    <section className="py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5e6ad2] via-[#6366d3] to-[#7170ff] shadow-2xl">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm"
                >
                  <Building2 className="w-4 h-4" />
                  For Organizations
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight"
                >
                  Train your teams with<br />
                  <span className="text-white/90">real-world simulations</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg text-white/80 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0"
                >
                  Create custom management simulations, track team performance, and build the next generation of leaders — all within one platform.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <a
                    href="/organization"
                    className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#5e6ad2] font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Explore Organization Page
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                  <a
                    href="/sign-up?type=organization"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                  >
                    Create Organization Account
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-1 w-full max-w-md"
              >
                <div className="space-y-4">
                  {[
                    { icon: <Layers className="w-5 h-5" />, title: 'Simulation Builder', desc: 'Custom scenarios for every role' },
                    { icon: <Users className="w-5 h-5" />, title: 'Team Management', desc: 'Organize, assign, and track' },
                    { icon: <BarChart3 className="w-5 h-5" />, title: 'Performance Analytics', desc: 'Data-driven insights & reports' },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/15 transition-colors duration-300"
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                        <p className="text-xs text-white/70">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
