export type TransferType = {
    address: string;
    block_hash: string;
    block_timestamp: string;
    from_address: string;
    to_address: string;
    token_decimals: 18;
    token_name: string;
    transaction_hash: string;
    value: string;
    value_decimal: string;
}

export type OwnerType = {
    balance: string;
    balance_formatted: string;
    is_contract: boolean;
    owner_address: string;
    owner_address_label: string;
    percentage_relative_to_total_supply: string;
    usd_value: string;
    stake: number;
}


export type Get_Transfers_Dto = {
    result : Array<TransferType> | []
}

export type Get_Owners_Dto = {
    result : Array<OwnerType> | []
}

export type Comment = {
  id: number;
  created_at: string;
  ideaAddress: string;
  message: string;
  image: string | null;
  sender: string;
  likedby: string[];
}

export type Slot0Data = [
    bigint,
    number,
    number,
    number,
    number, 
    number, 
    boolean
];

export type Get_Token_Balance_Type = {
    [key: string]: TokenBalanceType;
}

export type TokenBalanceType = {
    token_address: string;
    balance: string;
}