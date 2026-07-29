'use client';

import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available in major cities at checkout.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy. Items must be unworn, unwashed, and have all tags attached. Returns are free for orders above ₹999.' },
  { q: 'How do I track my order?', a: 'Once your order is shipped, you\'ll receive a tracking link via email and SMS. You can also track it from My Orders in your account.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards (Visa, Mastercard, RuPay), net banking, and cash on delivery.' },
  { q: 'Do you offer free shipping?', a: 'Yes, free standard shipping on all orders above ₹999. Orders below ₹999 incur a flat ₹99 shipping fee.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are shipped. Go to My Orders, select the order, and click Cancel.' },
  { q: 'How do I use a coupon code?', a: 'Enter your coupon code at checkout in the "Apply Coupon" field. The discount will be applied to your order total.' },
  { q: 'Are your products authentic?', a: 'Yes, all products on StyleHub are 100% authentic and sourced directly from brands or authorized distributors.' },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left font-medium hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
