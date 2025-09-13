"use client";

import React from "react";
import { TestimonialsSection as TestimonialsMarquee } from "@/components/testimonials-with-marquee";

const testimonials = [
  {
    author: {
      name: "My Mom",
      handle: "@mymom",
      avatar: "/avatars/sarah.jpg"
    },
    text: "Glacier has revolutionized how I store my recipe books. The cryptographic proofs give me complete confidence in data integrity.",
    href: "#"
  },
  {
    author: {
      name: "My Dad",
      handle: "@mydad",
      avatar: "/avatars/marcus.jpg"
    },
    text: "As a storage provider, Glacier's smart contracts make everything automated and trustless. I've never seen a more elegant system.",
    href: "#"
  },
  {
    author: {
      name: "My Dog",
      handle: "@dog",
      avatar: "/avatars/emily.jpg"
    },
    text: "Woof. Woof?",
    href: "#"
  },
  {
    author: {
      name: "Me",
      handle: "@delbyte",
      avatar: "/avatars/alex.jpg"
    },
    text: "The performance and reliability of Glacier's network is outstanding. Zero downtime and lightning-fast retrievals.",
    href: "#"
  },
  {
    author: {
      name: "My Girlfriend",
      handle: "@girlfren",
      avatar: "/avatars/lisa.jpg"
    },
    text: "Finally, a storage solution that truly respects user privacy. No more worrying about data being accessed without permission.",
    href: "#"
  },
  {
    author: {
      name: "My Other Dog who is fluent in English",
      handle: "@smartdog",
      avatar: "/avatars/david.jpg"
    },
    text: "The economic incentives for providers are perfectly balanced. I've been earning steady income while contributing to the network.",
    href: "#"
  }
];

export const TestimonialsSection = React.memo(() => {
  return (
    <TestimonialsMarquee
      title="Trusted by People Worldwide"
      description="Join users who have chosen Glacier for their decentralized storage needs"
      testimonials={testimonials}
      className="bg-black text-white"
    />
  );
})