import { useState } from 'react';
import forge from 'node-forge';

export const usePasswordEncryption = () => {
  const [isEncrypting, setIsEncrypting] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_PASSWORD_PUBLIC_KEY || '';

  const encryptPassword = async (password: string) => {
    setIsEncrypting(true);
    try {
      const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
      const encrypted = publicKeyObj.encrypt(password, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha256.create(),
        },
      });
      
      return forge.util.encode64(encrypted);
    } catch (err) {
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  };

  return { 
    encryptPassword, 
    isEncrypting,
  };
};