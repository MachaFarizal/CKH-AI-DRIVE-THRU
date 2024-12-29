import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, BarChart2, Clock, Shield } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              Drive-Thru Analytics Platform
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Optimize your drive-thru operations with real-time analytics, AI-powered insights, and comprehensive monitoring solutions.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 md:py-4 md:text-lg md:px-10"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to optimize your drive-thru
            </h2>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={Camera}
                title="Real-time Monitoring"
                description="Monitor multiple camera feeds with AI-powered vehicle and customer detection."
              />
              <Feature
                icon={BarChart2}
                title="Advanced Analytics"
                description="Get detailed insights into service times, customer patterns, and peak hours."
              />
              <Feature
                icon={Clock}
                title="Wait Time Optimization"
                description="Reduce wait times with predictive analytics and real-time alerts."
              />
              <Feature
                icon={Shield}
                title="Secure & Reliable"
                description="Enterprise-grade security with 99.9% uptime guarantee."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Choose the plan that fits your needs</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <PricingTier
              name="Starter"
              price="99"
              features={[
                "2 camera inputs",
                "7-day data retention",
                "Basic analytics",
                "Email support"
              ]}
              buttonText="Start Free Trial"
              highlighted={false}
            />
            <PricingTier
              name="Professional"
              price="199"
              features={[
                "5 camera inputs",
                "30-day data retention",
                "Advanced analytics",
                "Priority support",
                "Custom alerts"
              ]}
              buttonText="Start Free Trial"
              highlighted={true}
            />
            <PricingTier
              name="Enterprise"
              price="Contact us"
              features={[
                "Unlimited cameras",
                "90-day data retention",
                "Custom analytics",
                "24/7 phone support",
                "Dedicated account manager"
              ]}
              buttonText="Contact Sales"
              highlighted={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="text-center">
    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mt-6 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-2 text-base text-gray-500">{description}</p>
  </div>
);

const PricingTier = ({ name, price, features, buttonText, highlighted }: { 
  name: string, 
  price: string, 
  features: string[], 
  buttonText: string, 
  highlighted: boolean 
}) => (
  <div className={`rounded-lg shadow-lg ${highlighted ? 'ring-2 ring-blue-600' : ''}`}>
    <div className="p-8">
      <h3 className="text-2xl font-semibold text-gray-900">{name}</h3>
      <p className="mt-4">
        <span className="text-4xl font-extrabold text-gray-900">${price}</span>
        {price !== "Contact us" && <span className="text-base font-medium text-gray-500">/month</span>}
      </p>
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="text-blue-600 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link
          to="/signup"
          className={`block w-full py-3 px-6 text-center rounded-md shadow ${
            highlighted
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  </div>
);

export default Landing;