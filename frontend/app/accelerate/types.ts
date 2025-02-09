export type TokenType = {
    name: string;
    address: string;
    description: string;
    logo: string;
    landingPage: string;
    creator: string;
    ticker: string;
    categories: string;
    website: string;
}

export type AgentType = {
    agentId: string;
    owner: string;
    type: string;
    tokenAddress: string;
    character: string;
    settings: string;
    created_at: string;
    tokenName: string;
    tokenDescription: string;
    username: string;
    tone: string;
    status: string;
}

export type CharacterType = {
    adjectives: Array<string>;
    bio: Array<string>;
    id: string;
    lore: Array<string>;
    messageExamples: Array<Array<{
        user: string;
        content: {
            text: string;
        }
    }>>;
    modelProvider: string;
    postExamples: Array<string>;
    style: {
        all: Array<string>;
        chat: Array<string>;
        post: Array<string>;
    };
    website?: string;
    system: string;
    systemFrontend: string;
    topics: Array<string>;
    twitterBio: string;
    twitterQuery: Array<string>;
}

export type GET_CHARACTER_DTO = {
    id: string;
    code: number;
    character: CharacterType;
    twitter: {
        numTweets: number;
        numLikes: number;
        numRetweets: number;
        numFollowed: number;
        numReplies: number;
        processionActions: boolean;
        schedulingPosts: boolean;
        followProfiles: boolean;
        postInterval: number;
        twitterTargetUsers: string;
        actionInterval: number;
        followInterval: number;
    }
}

export type CharacterFormType = {
    systemFrontend: string;
    bio: Array<{
        value: string;
        id: string;
    }>
    adjectives: Array<{
        value: string;
        id: string;
    }>;
    lore: Array<{
        value: string;
        id: string;
    }>;
    postExamples: Array<{
        value: string;
        id: string;
    }>;
    topics: Array<{
        value: string;
        id: string;
    }>;
    styleAll: Array<{
        value: string;
        id: string;
    }>;
    styleChat: Array<{
        value: string;
        id: string;
    }>;
    stylePost: Array<{
        value: string;
        id: string;
    }>;
    twitterQuery: Array<{
        value: string;
        id: string;
    }>;
    website?: string;
    favUsers?: Array<string>;
    messageExampleOneUser: string;
    messageExampleOneAgent: string;
    messageExampleTwoUser: string;
    messageExampleTwoAgent: string;
}

export type CharacterListType = 'bio' | 'adjectives' | 'lore' | 'postExamples' | 'topics' | 'styleAll' | 'styleChat' | 'stylePost' | 'twitterQuery';

export type Settings = { 
    schedulingPosts: boolean;
    followProfiles: boolean;
    processionActions: boolean;
    postInterval: number;
    twitterTargetUsers: string;
    actionInterval: number;
    followInterval: number;
}

export type SandboxType = {
    id: string;
    sandboxId: string;
}