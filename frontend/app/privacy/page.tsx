import { 
  Footer, Header,
} from "@/common/components/organisms";

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen pt-20 md:pt-32">
        <div className='container text-white mx-auto flex flex-col px-4 mb-10'>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            <div className="text-gray-300 space-y-8">
              <div className="text-sm text-gray-400">Last Updated: January 21, 2025</div>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p className="text-gray-300">
                  Web3It.AI ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">2.1 Information You Provide</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Wallet addresses</li>
                      <li>Profile information (username, email, bio)</li>
                      <li>Dream project details and descriptions</li>
                      <li>Communications with our support team</li>
                      <li>Developer credentials and experience</li>
                      <li>Social media handles for elizaOS integration</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">2.2 Information Automatically Collected</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Transaction data on the Arbitrum blockchain</li>
                      <li>Smart contract interactions</li>
                      <li>Device information (browser type, IP address)</li>
                      <li>Usage patterns and platform interaction data</li>
                      <li>Performance and error data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">2.3 Blockchain Data</h3>
                    <p className="mb-2">Public blockchain data including:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Transaction history</li>
                      <li>Token ownership</li>
                      <li>Smart contract interactions</li>
                      <li>Wallet balances</li>
                      <li>Gas fees and transaction costs</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">3.1 Platform Operations</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Process transactions and Dream Token operations</li>
                      <li>Maintain platform security and integrity</li>
                      <li>Verify user identities and prevent fraud</li>
                      <li>Provide customer support</li>
                      <li>Improve platform functionality</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">3.2 Communication</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Send important updates about your dreams or investments</li>
                      <li>Notify about platform changes or maintenance</li>
                      <li>Provide transaction confirmations</li>
                      <li>Share relevant community updates</li>
                      <li>Send security alerts</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">3.3 Platform Improvement</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Analyze usage patterns</li>
                      <li>Identify technical issues</li>
                      <li>Enhance user experience</li>
                      <li>Develop new features</li>
                      <li>Optimize platform performance</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">4.1 Public Blockchain Data</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All blockchain transactions are publicly visible</li>
                      <li>Smart contract interactions are transparent</li>
                      <li>Wallet addresses are publicly accessible</li>
                      <li>Transaction history is permanently recorded</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">4.2 Third-Party Service Providers</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Cloud hosting providers</li>
                      <li>Analytics services</li>
                      <li>Customer support tools</li>
                      <li>Security monitoring services</li>
                      <li>Social media integration services (elizaOS)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">4.3 Legal Requirements</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Law enforcement requests</li>
                      <li>Court orders</li>
                      <li>Legal obligations</li>
                      <li>Protection of rights and safety</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">5.1 Security Measures</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Encryption of sensitive data</li>
                      <li>Regular security audits</li>
                      <li>Access controls</li>
                      <li>Monitoring systems</li>
                      <li>Incident response procedures</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">5.2 Smart Contract Security</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Regular code audits</li>
                      <li>Bug bounty programs</li>
                      <li>Security best practices</li>
                      <li>Vulnerability monitoring</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">6.1 Account Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Access your personal information</li>
                      <li>Update profile details</li>
                      <li>Delete account (where possible)</li>
                      <li>Export your data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">6.2 Communication Preferences</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Opt-out of marketing communications</li>
                      <li>Modify notification settings</li>
                      <li>Choose communication channels</li>
                      <li>Manage email preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">6.3 Blockchain Data</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Understanding of permanent nature of blockchain data</li>
                      <li>Right to transactional privacy through supported methods</li>
                      <li>Options for wallet address privacy</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Children's Privacy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform not intended for users under 18</li>
                  <li>No knowing collection of minor's data</li>
                  <li>Removal of minor's data upon discovery</li>
                  <li>Parent/guardian notification procedures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. International Data Transfers</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cross-border data transfer compliance</li>
                  <li>Data protection standards</li>
                  <li>International privacy laws</li>
                  <li>Transfer safeguards</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Privacy Policy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Notice of material changes</li>
                  <li>Update notification procedures</li>
                  <li>Continued use constitutes acceptance</li>
                  <li>Previous version availability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
                <p className="text-gray-300 mb-4">For privacy-related questions or concerns:</p>
                <ul className="space-y-2">
                  <li>Email: support@web3it.ai</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Specific Regional Rights</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">11.1 European Economic Area (GDPR)</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Right to access</li>
                      <li>Right to rectification</li>
                      <li>Right to erasure</li>
                      <li>Right to data portability</li>
                      <li>Right to object</li>
                      <li>Right to withdraw consent</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">11.2 California Privacy Rights (CCPA)</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Right to know</li>
                      <li>Right to delete</li>
                      <li>Right to opt-out</li>
                      <li>Right to non-discrimination</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Blockchain-Specific Privacy Considerations</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">12.1 Transaction Privacy</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Understanding of public nature of blockchain</li>
                      <li>Available privacy enhancement tools</li>
                      <li>Transaction monitoring limitations</li>
                      <li>Data permanence implications</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">12.2 Smart Contract Privacy</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Code transparency requirements</li>
                      <li>Interaction visibility</li>
                      <li>Data storage considerations</li>
                      <li>Privacy-preserving features</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Technical Privacy Measures</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">13.1 Data Minimization</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Collection limitation principles</li>
                      <li>Storage duration policies</li>
                      <li>Data necessity evaluation</li>
                      <li>Regular data review and deletion</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">13.2 Privacy by Design</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Privacy-first development approach</li>
                      <li>Regular privacy impact assessments</li>
                      <li>Privacy-enhancing technologies</li>
                      <li>User control mechanisms</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">14. Compliance and Monitoring</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Regular privacy audits</li>
                  <li>Compliance monitoring</li>
                  <li>Staff training</li>
                  <li>Incident response procedures</li>
                  <li>Documentation maintenance</li>
                </ul>
              </section>

              <section className="border-t border-gray-200/5 pt-6 mt-8">
                <p className="text-sm text-gray-400">
                  By using Web3It.AI, you agree to the collection and use of information 
                  in accordance with this Privacy Policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
   
  )
};

export default PrivacyPolicy


