const agentBaseUrl = process.env.NEXT_PUBLIC_AGENT_URL || 'http://localhost:8000'
export const devAgentBaseUrl = process.env.NEXT_PUBLIC_DEV_AGENT_URL || 'http://localhost:5173'

export const pinataUploadUrl = '/api/pinata'
export const categoriesUrl = '/api/categories'
export const revalidateUrl = '/api/revalidate'
export const getTransfersFromMoralisUrl = `https://deep-index.moralis.io/api/v2.2/erc20/%tokenAddress%/transfers?chain=%chainId%&order=DESC`
export const getTokenBalanceMoralisUrl = `https://deep-index.moralis.io/api/v2.2/%userAddress%/erc20?chain=%chainId%`
export const getOwnersFromMoralisUrl = `https://deep-index.moralis.io/api/v2.2/erc20/%tokenAddress%/owners?chain=%chainId%&order=DESC`
export const startAgentUrl = `${agentBaseUrl}/start-twitter-agent`
export const updateCharacterUrl = `${agentBaseUrl}/agents/%agentId%/set`
export const fetchCharacterUrl = `${agentBaseUrl}/agents/%agentId%`
export const stopAgentUrl = `${agentBaseUrl}/stop-twitter/%agentId%`
export const getAllAgentsUrl = `${agentBaseUrl}/agents`
export const createDevAgentUrl = `${devAgentBaseUrl}/api/apps`
