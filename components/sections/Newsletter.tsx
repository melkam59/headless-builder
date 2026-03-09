'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterProps {
  settings: any;
}

export default function Newsletter({ settings }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const heading = settings.heading?.defaultValue || 'Stay in the Loop';
  const subtext = settings.subtext?.defaultValue || 'Subscribe to get special offers';
  const buttonLabel = settings.buttonLabel?.defaultValue || 'Subscribe';
  const backgroundColor = settings.backgroundColor?.defaultValue || '#000000';
  const textColor = settings.textColor?.defaultValue || '#ffffff';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <section className="py-16 px-4" style={{ backgroundColor }}>
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: textColor }}
        >
          {heading}
        </h2>
        <p
          className="text-lg mb-8 opacity-90"
          style={{ color: textColor }}
        >
          {subtext}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white"
          />
          <Button type="submit" className="bg-white text-black hover:bg-gray-100">
            {buttonLabel}
          </Button>
        </form>
      </div>
    </section>
  );
}
