import { devAgentBaseUrl } from "./utils/network/endpoints"

const basePath = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_ROOT_DOMAIN : 'localhost:3000'
export const routes = {
  homePath: process.env.NODE_ENV === "production" ? `https://${basePath}` : `http://${basePath}`,
  viewProjectsPath: '/dreams',
  projectDetailPath:
    process.env.NODE_ENV === "production" ?
      (process.env.NEXT_PUBLIC_ROOT_DOMAIN === "dreamstarter.vercel.app" ? `https://${basePath}/%subdomain%` : `https://%subdomain%.${basePath}`) : `http://%subdomain%.${basePath}`,
  createProjectPath: '/generate',
  newIdeaPath: process.env.NODE_ENV === "production" ? `https://${basePath}/new` : `http://${basePath}/new`,
  profilePath: process.env.NODE_ENV === "production" ? `https://${basePath}/my-dreams` : `http://${basePath}/my-dreams`,
  reviewPlan: process.env.NODE_ENV === "production" ? `https://${basePath}/accelerate` : `http://${basePath}/accelerate`,
  privacyPath: process.env.NODE_ENV === "production" ? `https://${basePath}/privacy` : `http://${basePath}/privacy`,
  termsPath: process.env.NODE_ENV === "production" ? `https://${basePath}/terms` : `http://${basePath}/terms`,
  aboutPath: process.env.NODE_ENV === "production" ? `https://${basePath}/about` : `http://${basePath}/about`,
  devAgentPath: `${devAgentBaseUrl}/apps/%id%`,
}
