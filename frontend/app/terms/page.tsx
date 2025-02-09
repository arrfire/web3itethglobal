import { 
  Footer, Header,
} from "@/common/components/organisms";

const Terms = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen pt-20 md:pt-32">
        <div className='container text-white mx-auto flex flex-col px-4 mb-10'>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Terms and Conditions</h1>
            <div className="text-gray-300 space-y-8">
              <div className="text-sm text-gray-400">Last Updated: January 21, 2025</div>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-300">
                  By accessing and using Web3It.AI (the "Platform"), you agree to be bound by these Terms 
                  and Conditions ("Terms"). If you disagree with any part of these terms, you may not access 
                  the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Definitions</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>"Dream Tokens": Digital assets created on the Platform representing specific projects or ideas</li>
                  <li>"Platform": The Web3It.AI website, smart contracts, and related services</li>
                  <li>"User": Any individual or entity that accesses or uses the Platform</li>
                  <li>"Creator": Users who create and list Dream Tokens</li>
                  <li>"Supporter": Users who purchase or fund Dream Tokens</li>
                  <li>"Developer": Users who contribute technical expertise to projects</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Platform Services</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">3.1 Dream Token Creation</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Creators may mint unique Dream Tokens representing their projects</li>
                      <li>Each Dream Token must represent a legitimate project or idea</li>
                      <li>Creators must provide accurate and truthful information about their projects</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">3.2 Token Purchase and Support</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Supporters may purchase Dream Tokens using supported cryptocurrencies</li>
                      <li>Purchases are final and non-refundable</li>
                      <li>Token prices are set by market conditions and creator specifications</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">3.3 Developer Participation</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Developers may join projects based on creator approval</li>
                      <li>Terms of developer participation must be agreed upon separately</li>
                      <li>Platform is not responsible for agreements between creators and developers</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Arbitrum Blockchain Integration</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">4.1 Network Requirements</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>All transactions occur on the Arbitrum network</li>
                      <li>Users are responsible for maintaining sufficient funds for gas fees</li>
                      <li>Platform is not responsible for network congestion or delays</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">4.2 Smart Contract Interaction</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Users interact with smart contracts at their own risk</li>
                      <li>Platform makes no guarantees about smart contract security</li>
                      <li>Users should review smart contract code before interaction</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. User Responsibilities</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">5.1 Account Security</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Users are responsible for maintaining account security</li>
                      <li>Compromised accounts should be reported immediately</li>
                      <li>Platform is not responsible for unauthorized account access</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">5.2 Content Guidelines</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Users must not create or promote illegal content</li>
                      <li>Content must not infringe on intellectual property rights</li>
                      <li>Platform reserves the right to remove inappropriate content</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Social Media Integration</h2>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">6.1 elizaOS Usage</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Users may utilize elizaOS for social media campaigns</li>
                    <li>Platform is not responsible for third-party platform policies</li>
                    <li>Users must comply with all relevant platform guidelines</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Risks and Disclaimers</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">7.1 Investment Risks</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Dream Tokens are not guaranteed investments</li>
                      <li>Values can fluctuate significantly</li>
                      <li>Users should invest only what they can afford to lose</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">7.2 Technical Risks</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Platform may experience technical issues or downtime</li>
                      <li>Smart contracts may contain unknown vulnerabilities</li>
                      <li>Users accept all risks associated with blockchain technology</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Intellectual Property</h2>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">8.1 Project Rights</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Creators retain rights to their project intellectual property</li>
                    <li>Token ownership does not confer intellectual property rights</li>
                    <li>Developers must respect existing intellectual property rights</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Privacy and Data</h2>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">9.1 Data Collection</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Platform collects user data as outlined in Privacy Policy</li>
                    <li>Users consent to data collection through Platform use</li>
                    <li>Platform implements reasonable security measures</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform may terminate access for Terms violations</li>
                  <li>Users may terminate their account at any time</li>
                  <li>Certain Terms survive account termination</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Liability Limitations</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform provides services "as is"</li>
                  <li>Maximum liability limited to amounts paid to Platform</li>
                  <li>Platform not liable for indirect or consequential damages</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Modifications</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform may modify Terms at any time</li>
                  <li>Users will be notified of significant changes</li>
                  <li>Continued use constitutes acceptance of modified Terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Terms governed by [Jurisdiction] law</li>
                  <li>Disputes subject to [Jurisdiction] courts</li>
                  <li>Users waive right to class action</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Information</h2>
                <p className="text-gray-300 mb-4">For questions about these Terms, contact us at:</p>
                <p className="text-gray-300">support@web3it.ai</p>
              </section>

              <section className="border-t border-gray-200/5 pt-6 mt-8">
                <p className="text-sm text-gray-400">
                  By using Web3It.AI, you acknowledge that you have read, understood, and agree 
                  to be bound by these Terms and Conditions.
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

export default Terms


