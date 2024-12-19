import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Mood Whisper Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: June 15, 2023</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the Mood Whisper platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>
          
          <h2>2. Use of Services</h2>
          <p>You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:</p>
          <ul>
            <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation</li>
            <li>To impersonate or attempt to impersonate Mood Whisper, a Mood Whisper employee, another user, or any other person or entity</li>
          </ul>
          
          <h2>3. Intellectual Property</h2>
          <p>The Mood Whisper platform and its original content, features, and functionality are and will remain the exclusive property of Mood Whisper and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Mood Whisper.</p>
          
          <h2>4. User Accounts</h2>
          <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our platform.</p>
          
          <h2>5. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use our services will immediately cease.</p>
          
          <h2>6. Limitation of Liability</h2>
          <p>In no event shall Mood Whisper, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.</p>
          
          <h2>7. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
          
          <h2>8. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at legal@moodwhisper.com.</p>
        </CardContent>
      </Card>
    </div>
  )
}

