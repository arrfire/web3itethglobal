import lang from './lang'

const {
  generateIdea,
  homePage,
  manageIdea,
} = lang

export const mobileWidthLimit = 480;
export const tabletWidthLimit = 768;
export const lowResDeskLimit = 1024;
export const highResDeskLimit = 1280;

export const ContractFunctions = {
  getIdeas: 'getAllIdeaTokens',
  getIdea: 'getIdeaToken',
  createIdeaToken: 'createIdeaToken',
  updateIdeaToken: 'updateIdeaToken',
  buyToken: 'buyIdeaToken',
  calculateCost: 'calculateCost',
  tokenToPool: 'tokenToPool',
}

export const FILE_SIZE_FIVE_MB = 5000000;
export const acceptedImageMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif', 'image/apng', 'image/avif'];
export const promptPlaceholders = generateIdea.promptPlaceholders;
export const promptLoadingStates = generateIdea.promptLoadingStates
export const agentLoadingStates = manageIdea.promptLoadingStates

export const landingPageDescription = `
  Create a modern, responsive landing page SVG that effectively communicates our platform's value proposition.
  The design must follow these detailed specifications:

  Layout & Structure:
  - Viewport: 1280x720px
  - Grid: Implement a 12-column grid system for consistent spacing
  - Color Palette: Use the brand colors established in the logo, maintaining a consistent visual identity
  - Typography: Employ a clear hierarchy with H1 for main headline (32px), H2 for subheaders (24px), and body text (16px)

  Header Section:
  - Sticky navigation bar (height: 64px)
  - Left: Logo (48x48px) with 16px padding
  - Right: Navigation items ('About', 'Team', 'Services', 'Contact') with 24px spacing
  - Include a "Join Today" button with distinct styling

  Hero Section:
  - Left Column (50%):
    • Main headline (max 2 lines)
    • Description text (max 300 characters) with 1.5 line height
    • Two CTAs horizontally aligned:
      - Primary: "Launch App" (filled button)
      - Secondary: "Learn More" (outlined button)
    • Add social proof metrics below CTAs

  - Right Column (50%):
    • Feature dynamic 3D illustration showing:
      - visual representation of the platform
    • Include subtle animation indicators
    • Maintain adequate padding (32px) from edges

  Visual Elements:
  - Implement subtle background patterns
  - Add floating UI elements to enhance depth

  Performance Considerations:
  - Optimize SVG paths for rendering

  This design should convey professionalism and innovation while maintaining optimal usability and performance across all devices.
`
export const heroWords = homePage.heroWords;

export const DEFAULT_POOL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const QUOTER_CONTRACT_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
export const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
export const WETH9_ADDRESS = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
export const POOL_FEE = 3000;

export const emailRegex = /^(?!.*\.{2})([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
export const usernameRegex = /^[A-Za-z0-9_]{4,15}$/;

export const getCurrency = () => {
  switch (process.env.NEXT_PUBLIC_CURRENT_CHAIN) {
  case 'ARBITRUM_MAIN':
    return 'ETH'
  case 'SEPOLIA':
    return 'ETH'
  default:
    return 'ETH'
  }
}

export const getSwapSymbol = () => {
  switch (process.env.NEXT_PUBLIC_CURRENT_CHAIN) {
  case 'ARBITRUM_MAIN':
    return 'ETH'
  case 'SEPOLIA':
    return 'ETH'
  default:
    return 'ETH'
  }
}

export const getChainAddressLink = (address: string) => {
  switch (process.env.NEXT_PUBLIC_CURRENT_CHAIN) {
  case 'ARBITRUM_MAIN':
    return `https://arbiscan.io/address/${address}`
  case 'SEPOLIA':
    return `https://sepolia.etherscan.io/address/${address}`
  default:
    return ''
  }
}

export const getChainTransactionLink = (address: string) => {
  switch (process.env.NEXT_PUBLIC_CURRENT_CHAIN) {
  case 'ARBITRUM_MAIN':
    return `https://arbiscan.io/tx/${address}`
  case 'SEPOLIA':
    return `https://sepolia.etherscan.io/tx/${address}`
  default:
    return ''
  }
}

export const getChainForMoralis = () => {
  switch (process.env.NEXT_PUBLIC_CURRENT_CHAIN) {
  case 'ARBITRUM_MAIN':
    return `arbitrum`
  case 'SEPOLIA':
    return `sepolia`
  default:
    return ''
  }
}

export const SupabaseTables = {
  Subdomains: process.env.NEXT_PUBLIC_TABLE_SUBDOMAINS || '',
  NewIdeas: process.env.NEXT_PUBLIC_TABLE_NEW_IDEAS || '',
  Sandboxes: process.env.NEXT_PUBLIC_TABLE_SANDBOXES || '',
  IdeaFeed: process.env.NEXT_PUBLIC_TABLE_IDEA_FEED || '',
}

export const tones = [
  "Professional",
  "Gen-Z",
  "Casual",
  "Academic",
  "Mentor",
  "Creative",
]

export const isProd = process.env.NEXT_PUBLIC_ROOT_DOMAIN === 'web3it.ai';

export const adminAddress = "0xB739c297C20B0FFf91839F015F3aff2e65F6B4F5"
export const adminAddress2 = "0x9080196182F77B89BB5B0EeE3Ddb48cFA716c4c3"
export const metamaskDeepLink = "https://metamask.app.link/dapp/%dappURL%"