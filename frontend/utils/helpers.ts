import {
  SupabaseTables,
} from "@/common/constants";
import { 
  pinataUploadUrl, 
  revalidateUrl,
} from "@/common/utils/network/endpoints";
import {
  ClassValue, clsx,
} from "clsx";
import { twMerge } from "tailwind-merge";

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const camelToSnakeCase = (propertyName: string) => propertyName
  .replace(
    /[A-Z]/g,
    (letter) => `_${letter.toLowerCase()}`,
  );


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseObjectPropertiesToSnakeCase = (object: any): any => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return [camelToSnakeCase(key), value];
      }
      const parsedNestedObject = parseObjectPropertiesToSnakeCase(value);
      return [camelToSnakeCase(key), parsedNestedObject];
    }),
  );
};

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export const abbreviateNumber = (number: string) => {
  const parsedNumber = parseFloat(number)
  const tier = Math.log10(Math.abs(parsedNumber)) / 3 | 0;
  if (tier == 0) {
    return parsedNumber;
  }
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = parsedNumber / scale;
  return scaled.toFixed(3).replace(/[.,]000$/, "") + suffix;
}

export const abbreviateNumberWithoutDecimals = (number: string) => {
  const parsedNumber = parseFloat(number);
  const tier = Math.log10(Math.abs(parsedNumber)) / 3 | 0;
  
  if (tier === 0) {
    return parseFloat(parsedNumber.toFixed(3)).toString();
  }
  
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = parsedNumber / scale;
  return parseFloat(scaled.toFixed(3)).toString() + suffix;
}

export const createFileFormData = async (
  content: string,
  filename: string,
): Promise<FormData> => {
  const blob = new Blob([content], { type: 'image/svg+xml' });
  const file = new File([blob], filename);
  const formData = new FormData();
  formData.set('file', file);
  return formData;
};

export const uploadToPinata = async (formData: FormData): Promise<string> => {
  const response = await fetch(pinataUploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Pinata upload failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!data) {
    throw new Error('No data received from Pinata');
  }

  return data;
};

export const getUniqueSubdomain = async (
  supabase: any,
  ticker: string,
  maxAttempts: number = 100,
): Promise<string> => {
  const baseTicker = ticker.toLowerCase().replace(/[^a-z0-9]/g, '');
  const { data: existingDomains } = await supabase
    .from(SupabaseTables.Subdomains)
    .select('subdomain')
    .ilike('subdomain', `${baseTicker}%`);

  if (!existingDomains?.length) {
    return baseTicker;
  }
  const existingSuffixes = existingDomains
    .map((d: { subdomain: string; }) => {
      const match = d.subdomain.match(new RegExp(`^${baseTicker}(\\d*)$`));
      return match ? (match[1] ? parseInt(match[1]) : 0) : -1;
    })
    .filter((n: number) => n >= 0)
    .sort((a: number, b: number) => a - b);

  let nextSuffix = 0;
  for (let i = 0; i <= existingSuffixes.length; i++) {
    if (i === existingSuffixes.length || existingSuffixes[i] !== i) {
      nextSuffix = i;
      break;
    }
  }
  if (nextSuffix < maxAttempts) {
    return nextSuffix === 0 ? baseTicker : `${baseTicker}${nextSuffix}`;
  }
  return `${baseTicker}${Date.now()}`;
};

export const getAverageColor = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (typeof img === 'string') {
    const src = img;
    img = new Image();
    img.setAttribute('crossOrigin', '');
    img.src = src;
  }

  if (!context) {
    return 'violets-are-blue';
  }
  const size = 25;
  canvas.width = size;
  canvas.height = size;

  context.imageSmoothingEnabled = true;
  context.drawImage(img, 0, 0, size, size);
  const imageData = context.getImageData(0, 0, size, size).data;

  const colorMap = new Map<string, number>();

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    if (imageData[i + 3] < 125) {
      continue;
    }
    const brightness = (r + g + b) / 3;
    if (brightness > 240 || brightness < 15) {
      continue;
    }
    const range = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(b - r));
    if (range < 20) {
      continue;
    }
    const toHex = (n: number): string => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    colorMap.set(color, (colorMap.get(color) || 0) + 1);
  }

  if (colorMap.size === 0) {
    return 'violets-are-blue';
  }
  let maxFreq = 0;
  let primaryColor = '';

  for (const [color, freq] of colorMap) {
    if (freq > maxFreq) {
      maxFreq = freq;
      primaryColor = color;
    }
  }

  return primaryColor;
};

export const isColorSimilar = (color1: string, color2: string, threshold = 30): boolean => {
  const hex2rgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const rgb1 = hex2rgb(color1);
  const rgb2 = hex2rgb(color2);

  if (!rgb1 || !rgb2) {
    return false;
  }
  return Math.abs(rgb1.r - rgb2.r) < threshold &&
         Math.abs(rgb1.g - rgb2.g) < threshold &&
         Math.abs(rgb1.b - rgb2.b) < threshold;
};

export const processMarkdown = (text: string) => {
  const lines = text.split('\n');
  const processedLines = lines.map((line) => {
    if (line.trim().match(/^[-*]\s/)) {
      return line.replace(/^[-*]\s(.+)/, '<li class="ml-6 mb-0.5">$1</li>');
    }
    return line;
  });
  return processedLines.join('\n');
};



export const isMobileDevice = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)


export const isCorrectNetwork = (chainId: string) => {
  switch (process.env.NEXT_PUBLIC_CURRENT_CHAIN) {
  case 'ARBITRUM_MAIN':
    return chainId === "42161"
  case 'SEPOLIA':
    return chainId === "11155111"
  default:
    return false
  }
}

export const getSupportedChainId = () => {
  switch (process.env.NEXT_PUBLIC_CURRENT_CHAIN) {
  case 'ARBITRUM_MAIN':
    return 42161
  case 'SEPOLIA':
    return 11155111
  default:
    return 42161
  }
}

export const getConnectChainName = () => {
  switch (process.env.NEXT_PUBLIC_CURRENT_CHAIN) {
  case 'ARBITRUM_MAIN':
    return 'Arbitrum'
  case 'SEPOLIA':
    return 'Sepolia'
  default:
    return 'Arbitrum'
  }
}

export const formatAddress = (addr: string) => {
  if (!addr) {
    return '';
  }
  const prefix = addr.slice(0, 4);
  const suffix = addr.slice(-4);
  return `${prefix}...${suffix}`;
};

export const revalidateTagData = async (tagName: string) => {
  await fetch(revalidateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tagName,
    }),
  })
} 

export const extractTwitterUsername = (url: string) => {
  if (!url) {
    return null;
  }
  const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)(?:\/.*)?$/;
  
  const match = url.match(pattern);
  return match ? match[1] : null;
};