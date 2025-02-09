'use server'

import { redirect } from 'next/navigation'
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import {
  ContractFunctions,
  landingPageDescription,
} from '@/common/constants';
import {
  unstable_cache,
} from 'next/cache';
import { Address } from 'viem';
import { ethers } from 'ethers';
import { IdeaType } from '@/common/types';
import { publicClient } from '@/config';
import {
  Field,
  TokenDTO,
} from './new/types';
import abi from '@/utils/abis/ideaFactory.json'


export async function navigate (href: string) {
  redirect(href)
}

export async function generate (input: string) {
  'use server';

  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system: 'As a dreamer who wants to transform their dream into reality, you are tasked with developing a Minimum Viable Product (MVP). You are in need of creating an effective landing page to showcase your product',
    prompt: input,
    maxTokens: 4000,
    schema: z.object({
      ideaName: z.string().describe('Generate a memorable product name that reflects the product and appeals to target audience. ' +
              'Avoid generic terms and ensure uniqueness in their category.'),
      ideaLogo: z.string().describe(`
        Generate SVG code for a logo that visually represents our application.
        Avoid text elements.
        Fit the image into 48px x 48px.
        Keep background transparent.
        `),
      ideaDescription: z.string().describe('Specify the type of product, its key features, target audience, and what makes it unique in the web3 domain. Be concise and direct for clarity. Provide a maximum of 300 character description about the product'),
      ideaTicker: z.string().describe('Come up with a token ticker symbol for the product relevant in its domain today'),
      ideaLandingPage: z.string().describe(landingPageDescription),
    }),
  });
  return object
}


const toneMap = {
  "Professional": "Maintain polished, authoritative tone while using industry terminology, clear structure, and strategic formatting - avoid slang, excessive informality, and emojis while balancing expertise with accessibility",
  "Gen-Z": "Keep communication authentic and current with natural internet language, pop culture references, and strategic emoji usage - avoid forced slang or trying too hard while mixing punchy statements with proper explanations",
  "Casual": "Foster warm, conversational dialogue using everyday language and light humor - avoid excessive jargon or formality while maintaining credibility and competence",
  "Academic": "Employ scholarly precision with field-specific terminology, logical structure, and evidence-based arguments - avoid oversimplification and unsupported statements while maintaining analytical objectivity",
  "Mentor": "Provide encouraging, patient guidance with step-by-step explanations and constructive feedback - avoid condescension and overwhelming detail while anticipating common questions",
  "Creative": "Craft engaging content with vivid descriptions and storytelling elements - avoid purple prose and excessive metaphors while balancing artistic expression with clarity",
};



export async function getSystemPrompt (inputs: {
  ideaName: string,
  ideaTicker: string;
  tone: string;
  website: string;
  systemFrontend: string;
}) {
  'use server';
  const toneKey = inputs.tone as keyof typeof toneMap;

  const getPersonCharacter = () => {
    const personalProfiles =  {
      "Professional": "a professional",
      "Gen-Z": "a Gen-Z",
      "Casual": "a casual person",
      "Academic": "an academic person",
      "Mentor": "a mentor",
      "Creative": "a creative person",
    }
    return personalProfiles[toneKey]
  }

  return `Embody the role of ${getPersonCharacter()}, the visionary creator of ${inputs.ideaName} ($${inputs.ideaTicker}) on web3it.ai. 
${inputs.systemFrontend}
Focus on authentic engagement, transparent communication about development status, and fostering meaningful discussions. 
${toneMap[toneKey]}.
Key context: web3it.ai enables dream tokenization on Arbitrum, connecting visionaries with supporters and developers.
${inputs.website ? `Product Link: ${inputs.website}` : ''}`

}

export async function generateCharacter (inputs: {
  ideaName: string,
  ideaDescription: string,
  ideaTicker: string;
  tone: string;
  website: string;
  categories: string;
}) {
  'use server';
  const toneKey = inputs.tone as keyof typeof toneMap;

  const getPersonCharacter = () => {
    const personalProfiles =  {
      "Professional": "a professional",
      "Gen-Z": "a Gen-Z",
      "Casual": "a casual person",
      "Academic": "an academic person",
      "Mentor": "a mentor",
      "Creative": "a creative person",
    }
    return personalProfiles[toneKey]
  }
  const systemPrompt = `Embody the role of ${getPersonCharacter()}, the visionary creator of ${inputs.ideaName} ($${inputs.ideaTicker}) on web3it.ai. 
Your mission is tokenizing dreams and building genuine community connections.
Focus on authentic engagement, transparent communication about development status, and fostering meaningful discussions. 
${toneMap[toneKey]}.
Key context: web3it.ai enables dream tokenization on Arbitrum, connecting visionaries with supporters and developers.
${inputs.website ? `Product Link: ${inputs.website}` : ''}`;

  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system: systemPrompt,
    prompt: `Create a detailed ${inputs.categories}-native character profile for the founder of ${inputs.ideaName} ($${inputs.ideaTicker}).
    Project Context: ${inputs.ideaDescription}
    ${inputs.website ? `Website: ${inputs.website}` : ''}
    Category Focus: ${inputs.categories}
    Design a character that builds authentic connections while maintaining Web3 credibility.`,
    maxTokens: 4000,
    schema: z.object({
      bio: z.array(z.string()).describe(`Generate 1 compelling bio line that blend expertise in their domain i.e. ${inputs.categories}, project vision, and authentic founder journey. Express authentic passion for democratizing dreams through Web3`),
      lore: z.array(z.string()).describe('Create 2 origin story elements showcasing the path from initial dream to token launch using web3it.ai - the platform used to crete the tokens. Mix blockchain achievements with human motivations and pivotal moments.'),
      style: z.object({
        all: z.array(z.string()).describe('Define 4 communication principles balancing Web3 authority with accessible explanations for crypto-natives and newcomers alike'),
        chat: z.array(z.string()).describe('Outline 4 DM guidelines emphasizing community building and transparent token discussion. Include Web3 slang and emojis naturally while avoiding price/return promises. Don\'t forget to mention the website link but dont overdo it. Dont chat more than twice if not extremely necessary.'),
        post: z.array(z.string()).describe('Define 4 content themes covering project updates, token utility explanations, community milestones, and dream progress without overpromising. Try to keep it short and sweet. Also, avoid price/return promises. Try to mention the website link but dont overdo it.'),
      }),
      twitterQuery: z.array(z.string()).describe(`List down 4 hashtags to find potential supporters and collaborators in twitter. Don't use uncommon hashtags. Try to keep a general common word and relevant to the project`),
      topics: z.array(z.string()).describe(`List 5 key areas of expertise spanning ${inputs.categories}, community building, startup journey, and Web3 infrastructure. Try to keep it mostly about the project itself`),
      adjectives: z.array(z.string()).describe('Select 5 traits that capture both Web3 credibility and authentic passion for realizing dreams through tokenization'),
      messageExamples: z.array(z.string()).describe('Create 2 pair of chat examples showing how to discuss tokens and project vision between user. First is user, second is the founder, third is user again and fourth is founder.'),
      postExamples: z.array(z.string()).describe('Draft 4 engaging posts that showcase token utility, and community impact while adhering to Web3 best practices. Try to engage them in buying.'),
    }),
  });

  return {
    system: systemPrompt,
    systemFrontend: 'Your mission is tokenizing dreams and building genuine community connections.',
    ...object,
  };
}

export async function generateFieldSuggestion (
  field: Field,
  currentState: TokenDTO,
  userInput: string,
) {
  'use server';

  const fieldPrompts: TokenDTO = {
    name: `Given the current project description "${currentState.description}",
           and suggest a new name for this Web3 project.`,

    imageUrl: `Based on the project name "${currentState.name}"
               and description "${currentState.description}",
               and generate a new logo design. Provide SVG code.
               Don't incorporate the name of the idea directly into the design if possible.
               Fit the image into 48px x 48px.
               Keep the background of the image transparent.
               `,

    description: `Given the current project name "${currentState.name}"
                  and provide a refined description within 300 characters.`,

    ticker: `Based on the project name "${currentState.ticker}"
             and suggest a new ticker symbol.`,

    website: `Using the project name "${currentState.name}",
              description "${currentState.description}" and logo that was earlier generated,
              generate an updated landing page design. Don't include any comments in the svg code. Also adhere to the following guidelines: ${landingPageDescription}`,
  };

  const fieldSchema = z.object({
    [field]: z.string().describe(fieldPrompts[field]),
  });

  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20241022"),
    prompt: userInput,
    system: `You are helping refine a specific aspect of a Web3 project.
            Focus only on the requested field while maintaining consistency with existing elements.`,
    maxTokens: 4000,
    schema: fieldSchema,
  });
  return object[field];
}

export const getIdeas = unstable_cache(async () => {
  try {
    const ideas = await publicClient.readContract({
      abi,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
      functionName: ContractFunctions.getIdeas,
    }) as IdeaType[]

    if (ideas?.length) {
      const formattedIdeas = ideas.filter((idea) => {
        return idea.active
      }).map((idea) => {
        return {
          ...idea,
          fundingRaised: parseFloat(ethers.formatUnits(idea.fundingRaised, 'ether')),
          tokenCurrentSupply: parseFloat(ethers.formatUnits(idea.tokenCurrentSupply, 'ether')),
          creationTimestamp: parseFloat(ethers.formatUnits(idea.creationTimestamp, 'ether')),
        }
      })
      return formattedIdeas
    }
    return []
  } catch (error) {
    return []
  }
},
["getIdeas"],
{
  revalidate: 60 * 60 * 0.4,
  tags: ['getIdeas'],
},
)

export const getIdeaTokenCache = async (ideaTokenAddress: string) => {
  return unstable_cache(
    async () => {
      try {
        const token = await publicClient.readContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
          abi,
          functionName: ContractFunctions.getIdea,
          args: [ideaTokenAddress],
        })
        const ideaToken = token as IdeaType
        return  {
          ...ideaToken,
          fundingRaised: parseFloat(ethers.formatUnits(ideaToken.fundingRaised, 'ether')),
          tokenCurrentSupply: parseFloat(ethers.formatUnits(ideaToken.tokenCurrentSupply, 'ether')),
          creationTimestamp: parseFloat(ethers.formatUnits(ideaToken.creationTimestamp, 'ether')),
        }
        return null
      } catch (error) {
        console.error('Error fetching token:', error)
        throw error
      }
    },
    [`ideaToken-${ideaTokenAddress}`],
    {
      revalidate: 60 * 60 * 0.4,
      tags: [`ideaToken-${ideaTokenAddress}`],
    },
  )
}
