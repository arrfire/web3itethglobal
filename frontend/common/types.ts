export type IdeaTokenType = {
    creatorAddress: string;
    description: string;
    fundingRaised: number;
    productUrl: string;
    name: string;
    symbol: string;
    tokenAddress: string;
    tokenImageUrl: string;
    tokenCurrentSupply: number;
    productScreenshotUrl: string;
    creationTimestamp: number;
    categories: string;
    twitterUrl: string;
    telegramUrl: string;
    active: boolean;
}

export type IdeaType = {
    creatorAddress: string;
    description: string;
    fundingRaised: string;
    productUrl: string;
    name: string;
    symbol: string;
    tokenAddress: string;
    tokenImageUrl: string;
    tokenCurrentSupply: bigint;
    productScreenshotUrl: string;
    creationTimestamp: string;
    categories: string;
    twitterUrl: string;
    telegramUrl: string;
    active: boolean;
}

export type TokenInfoType = {
    ownersCount: number;
    address: string;
}

export type IdeasType = Array<IdeaType>
export type IdeaTypeWithDomain = {
    idea: IdeaType;
    subdomain: string;
    holdersCount: number;
}

export type IdeaTypeWithDomains = Array<IdeaTypeWithDomain> | []
