import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Silaibuddy</h1>
              <p className="text-sm text-gray-600 mt-1">Terms & Conditions</p>
            </div>
            <Link to="/onboarding/review">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Review
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms & Conditions for Tailors
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By registering as a tailor on Silaibuddy, you agree to be bound by these Terms and Conditions. 
                  These terms constitute a legally binding agreement between you and Silaibuddy. If you do not 
                  agree with any part of these terms, you may not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Tailor Registration and Profile</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You must provide accurate, complete, and up-to-date information during registration</li>
                  <li>You are responsible for maintaining the security of your account credentials</li>
                  <li>You must be legally authorized to provide tailoring services in your jurisdiction</li>
                  <li>Identity verification is mandatory and must be completed successfully</li>
                  <li>Profile information may be displayed to customers on the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Service Standards and Quality</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You agree to provide services with professional skill and care</li>
                  <li>All work must be completed within the agreed timeframe</li>
                  <li>You must maintain high standards of workmanship and customer service</li>
                  <li>Portfolio images must accurately represent your work quality</li>
                  <li>You are responsible for handling customer complaints professionally</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Pricing and Payments</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You set your own pricing within the platform guidelines</li>
                  <li>All prices must be clearly communicated to customers before work begins</li>
                  <li>Silaibuddy may charge a commission on completed transactions</li>
                  <li>Payments will be processed according to your chosen payout method</li>
                  <li>You are responsible for applicable taxes on your earnings</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Order Management</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You may accept or decline orders based on your availability and expertise</li>
                  <li>Once accepted, orders must be completed as agreed or properly cancelled</li>
                  <li>Changes to order specifications must be mutually agreed upon</li>
                  <li>Delivery timelines must be realistic and adhered to</li>
                  <li>Proper communication with customers is required throughout the process</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Platform Usage Guidelines</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Use of the platform must comply with all applicable laws and regulations</li>
                  <li>No fraudulent, misleading, or deceptive practices are permitted</li>
                  <li>Respect intellectual property rights of others</li>
                  <li>Maintain professional communication at all times</li>
                  <li>Do not share customer contact information outside the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Privacy and Data Protection</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Your personal data will be processed according to our Privacy Policy</li>
                  <li>Customer information must be kept confidential and secure</li>
                  <li>You consent to the collection and use of data for platform operations</li>
                  <li>Identity verification documents are stored securely and used only for verification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Liability and Insurance</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You are liable for any damage to customer garments while in your possession</li>
                  <li>Silaibuddy is not responsible for disputes between tailors and customers</li>
                  <li>You should consider obtaining appropriate insurance coverage</li>
                  <li>Platform usage is at your own risk</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Account Suspension and Termination</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Silaibuddy may suspend or terminate accounts for violations of these terms</li>
                  <li>Repeated customer complaints may result in account review</li>
                  <li>You may deactivate your account at any time</li>
                  <li>Outstanding obligations must be fulfilled before account closure</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Modifications to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  Silaibuddy reserves the right to modify these terms at any time. Updated terms will be 
                  communicated through the platform or via email. Continued use of the platform after 
                  modifications constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these terms or platform usage, please contact us at:
                  <br />
                  Email: support@silaibuddy.com
                  <br />
                  Phone: +91-XXXXX-XXXXX
                </p>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-600">
                  <strong>Last Updated:</strong> August 22, 2025
                  <br />
                  <strong>Effective Date:</strong> August 22, 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
