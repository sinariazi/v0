import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Mood Whisper Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: June 15, 2023</p>
          
          <h2>1. Introduction</h2>
          <p>Mood Whisper ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our employee engagement platform.</p>
          
          <h2>2. Information We Collect</h2>
          <p>We collect information that you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Company name and job title</li>
            <li>Survey responses and feedback</li>
            <li>Usage data and analytics</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Analyze and understand how our services are used</li>
            <li>Communicate with you about our services</li>
            <li>Protect against, identify, and prevent fraud and other illegal activities</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.</p>
          
          <h2>5. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. Please contact us to exercise these rights.</p>
          
          <h2>6. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          
          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@moodwhisper.com.</p>
        </CardContent>
      </Card>
    </div>
  )
}

