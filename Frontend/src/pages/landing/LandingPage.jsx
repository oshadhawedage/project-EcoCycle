import React from 'react';
import { Link } from 'react-router-dom';
import LandingPageLayout from '../../components/layout/LandingPageLayout';
import LandingPic3 from '../../assets/Landing pic 3.jpg';
import LandingPic4 from '../../assets/Landing pic 4.jpg';

const LandingPage = () => {
  return (
    <LandingPageLayout>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={LandingPic3}
            alt="Environmental Protection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-800/60 to-gray-700/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-white">
              <div className="space-y-6">
                <div className="inline-block bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2 text-green-100 text-sm font-medium">
                  🌱 EcoCycle - Making E-Waste Sustainable
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Sustainable E-Waste
                  <span className="block text-green-300">Management</span>
                  <span className="block">Made Simple</span>
                </h1>
                <p className="text-xl lg:text-2xl text-green-50 leading-relaxed max-w-lg">
                  Transform your electronic waste into environmental impact. Join leading organizations in secure, certified e-waste management with complete transparency and measurable sustainability results.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">♻️</div>
                  <div className="text-sm font-semibold">100% Recycled</div>
                  <div className="text-xs text-green-200">Certified Process</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-sm font-semibold">Real-Time Tracking</div>
                  <div className="text-xs text-green-200">Full Transparency</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-sm font-semibold">4.9/5 Rating</div>
                  <div className="text-xs text-green-200">Trusted by Users</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/register"
                  className="inline-block text-center px-8 py-4 bg-white text-green-900 font-bold rounded-xl hover:bg-green-50 transition-all duration-300 no-underline text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Start Your Journey Free
                </Link>
                <a
                  href="#features"
                  className="inline-block text-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-900 transition-all duration-300 no-underline text-lg"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Right side decorative elements */}
            <div className="hidden lg:block relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-lime-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Impact Section with Image */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-green-300 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-lime-300 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  🌍 Environmental Impact
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Every Device Counts in the Fight Against E-Waste
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join a global movement of responsible organizations. Your e-waste becomes part of the solution, not the problem.
                </p>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">2,340+</div>
                  <div className="text-gray-600 font-medium">Items Recycled</div>
                  <div className="text-sm text-gray-500">This month</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">847</div>
                  <div className="text-gray-600 font-medium">Active Partners</div>
                  <div className="text-sm text-gray-500">Trusted organizations</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">156</div>
                  <div className="text-gray-600 font-medium">Certified Recyclers</div>
                  <div className="text-sm text-gray-500">R2 Certified</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">4.8★</div>
                  <div className="text-gray-600 font-medium">User Satisfaction</div>
                  <div className="text-sm text-gray-500">Average rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={LandingPic4}
                alt="E-Waste Recycling Process"
                className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                    ♻️
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Certified Process</div>
                    <div className="text-sm text-gray-600">100% Traceable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Enterprise-Grade E-Waste Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Complete visibility and control over your electronic waste management process with industry-leading standards</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Inventory</h3>
                <p className="text-gray-600 leading-relaxed">Comprehensive catalog system with automatic device detection, serial tracking, and asset valuation.</p>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Logistics Integration</h3>
                <p className="text-gray-600 leading-relaxed">Scheduled collections with real-time tracking, delivery confirmation, and chain-of-custody documentation.</p>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
                <p className="text-gray-600 leading-relaxed">Detailed ESG reporting, carbon footprint reduction metrics, and customizable KPI dashboards.</p>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Value Recovery</h3>
                <p className="text-gray-600 leading-relaxed">Monetize refurbished devices, access material credits, and unlock incentive programs.</p>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Network</h3>
                <p className="text-gray-600 leading-relaxed">Access ISO-certified recyclers with full R2/e-Stewards compliance and transparent processing standards.</p>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Compliance & Reporting</h3>
                <p className="text-gray-600 leading-relaxed">Automated certificates of destruction, audit trails, and regulatory compliance documentation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Timeline */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-white to-green-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-green-400 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-lime-400 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🚀 Simple Process
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              From Waste to Worth in
              <span className="block text-green-600">4 Easy Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process turns e-waste challenges into environmental victories
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200"></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
              {/* Step 1 */}
              <div className="group relative">
                <div className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      1
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900">
                      ✓
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h3>
                  <p className="text-gray-600 leading-relaxed">Quick registration with instant activation. Set up your profile and preferences in minutes.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      2
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900">
                      📱
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">List Devices</h3>
                  <p className="text-gray-600 leading-relaxed">Add your electronics with our smart catalog. Automatic valuation and condition assessment.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative">
                <div className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      3
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900">
                      🚚
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Schedule Pickup</h3>
                  <p className="text-gray-600 leading-relaxed">Choose your preferred time slot. Our certified team handles secure collection and transportation.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group relative">
                <div className="text-center">
                  <div className="relative inline-block mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      4
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900">
                      📊
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Track & Report</h3>
                  <p className="text-gray-600 leading-relaxed">Real-time updates, certificates of destruction, and detailed environmental impact reports.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section - Enhanced */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-green-100 to-lime-100 text-green-800 px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
              🎯 Tailored Solutions
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Built for Every
              <span className="block text-green-600">Stakeholder</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're an individual, enterprise, or recycling partner, we have the perfect platform for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Individual Users Card */}
            <div className="group relative h-full bg-white rounded-3xl border-2 border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-4 cursor-pointer">
              <div className="h-3 w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
              <div className="p-8 lg:p-10 flex flex-col h-full">
                <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300 text-center">👤</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Individual Users</h3>
                <p className="text-gray-600 mb-8 leading-relaxed flex-grow text-center text-lg">
                  Turn your old devices into rewards while making a real environmental difference.
                </p>
                <div className="space-y-4 mt-auto">
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <span className="text-blue-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">Free doorstep pickup</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <span className="text-blue-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">Real-time GPS tracking</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <span className="text-blue-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">Cash rewards & incentives</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Card - Featured */}
            <div className="group relative h-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-4 cursor-pointer lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Most Popular Choice
                </div>
              </div>
              <div className="h-3 w-full bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 mt-6"></div>
              <div className="p-8 lg:p-10 flex flex-col h-full">
                <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300 text-center">🏢</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Enterprises</h3>
                <p className="text-gray-600 mb-8 leading-relaxed flex-grow text-center text-lg">
                  Enterprise-grade IT asset management with compliance, security, and ESG reporting.
                </p>
                <div className="space-y-4 mt-auto">
                  <div className="flex items-center gap-4 p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <span className="text-indigo-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">API integrations</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <span className="text-indigo-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">Audit-ready compliance</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <span className="text-indigo-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">Executive dashboards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recycler Partners Card */}
            <div className="group relative h-full bg-white rounded-3xl border-2 border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-orange-300 hover:-translate-y-4 cursor-pointer">
              <div className="h-3 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
              <div className="p-8 lg:p-10 flex flex-col h-full">
                <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300 text-center">🏭</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Recycling Partners</h3>
                <p className="text-gray-600 mb-8 leading-relaxed flex-grow text-center text-lg">
                  Scale your recycling business with steady demand and advanced operational tools.
                </p>
                <div className="space-y-4 mt-auto">
                  <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <span className="text-orange-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">Volume guarantee</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <span className="text-orange-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">Fair market pricing</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <span className="text-orange-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700 font-medium">Digital operations platform</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mb-8">
            <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-6">
              <span className="text-white font-semibold">🌍 Join the Movement</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Make a
              <span className="block text-green-200">Real Difference?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-green-100 leading-relaxed max-w-3xl mx-auto">
              Join thousands of organizations and individuals turning e-waste challenges into environmental victories. Start your sustainable journey today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 transition-all duration-300 no-underline text-center text-lg shadow-2xl hover:shadow-xl transform hover:-translate-y-1"
            >
              🚀 Start Free Today
            </Link>
            <Link
              to="/login"
              className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-green-700 transition-all duration-300 no-underline text-center text-lg"
            >
              Sign In to Dashboard
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-green-200">
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">✓</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-green-100 to-lime-100 text-green-800 px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
              ❓ Got Questions?
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need
              <span className="block text-green-600">to Know</span>
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our e-waste management platform
            </p>
          </div>

          <div className="space-y-6">
            <div className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 font-bold text-xl">💰</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What is the cost structure?</h3>
                  <p className="text-gray-600 leading-relaxed">Our flexible pricing model adapts to your needs: free pickup for individuals, transparent volume-based pricing for enterprises, and revenue-sharing partnerships for certified recyclers. No hidden fees, no surprises.</p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 font-bold text-xl">📱</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What device types does EcoCycle handle?</h3>
                  <p className="text-gray-600 leading-relaxed">We process all IT equipment including servers, workstations, laptops, monitors, storage devices, networking gear, and peripherals. From individual smartphones to enterprise data centers - we handle it all with certified processes.</p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 font-bold text-xl">🚚</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">How does logistics and scheduling work?</h3>
                  <p className="text-gray-600 leading-relaxed">Flexible scheduling around your timeline. Our certified logistics partners handle secure packaging, transportation, and provide real-time GPS tracking with complete chain-of-custody documentation for compliance.</p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 font-bold text-xl">📊</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">How transparent is the recycling process?</h3>
                  <p className="text-gray-600 leading-relaxed">Complete transparency: real-time device tracking, detailed processing logs, material recovery reports, certificates of destruction, and comprehensive ESG analytics. You see exactly where your devices go and their environmental impact.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors no-underline"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </LandingPageLayout>
  );
};

export default LandingPage;
