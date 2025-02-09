'use client'
import { 
  useEffect,
  useMemo,
} from 'react';
import {
  ChevronDown,
  WalletIcon,
} from 'lucide-react';
import { 
  usePrivy, useWallets,
} from '@privy-io/react-auth';
import {
  Menu,
  Transition,
} from '@headlessui/react'
import { Fragment } from 'react'
import lang from '@/common/lang';
import {
  usePathname,
  useRouter,
} from 'next/navigation'
import Link from 'next/link';
import { routes } from '@/common/routes';
import { 
  getConnectChainName, getSupportedChainId, isCorrectNetwork,
} from '@/utils/helpers';
import { Button } from '../button';
import { EnsResolver } from '../ensResolver';
import toast from 'react-hot-toast';

const {
  header: {
    connectButton: connectButtonCopy,
  },
} = lang

export const ConnectButton = () => {
  const pathname = usePathname()
  const router = useRouter()
  const avatarGradient = useMemo(() => {
    const colorArr = [
      "linear-gradient(-225deg, #00c3ff 0%, #ffff1c 100%)",
      "linear-gradient(-225deg, #A770EF 0%, #CF8BF3 50% , #FDB99B 100%)",
      "linear-gradient(-225deg, #FDFC47 0%, #24FE41 100%)",
      "linear-gradient(-225deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)",
      "linear-gradient(-225deg, #00c6ff 0%, #0072ff 100%)",
    ];
    return colorArr[Math.floor(Math.random() * colorArr.length)];
  }, []);
  const {
    ready, authenticated, user, login, logout,
  } = usePrivy();

  const {
    wallets,
    ready: walletsReady,
  } = useWallets()

  
  useEffect(() => {
    const handleSwitchCorrect = async () => {
      if (walletsReady && wallets?.length && !isCorrectNetwork(wallets[0].chainId.split(":")[1])) {
        wallets[0].switchChain(getSupportedChainId())
      }
    }
    handleSwitchCorrect()
  }, [wallets, walletsReady])

  useEffect(() => {
    if (wallets.length === 0 && authenticated && walletsReady) {
      logout()
    }
  }, [logout, wallets, authenticated, walletsReady])

  return (
    <div
      {...(!ready && {
        'aria-hidden': true,
        'style': {
          opacity: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        },
      })}
    >
      {(() => {
        if (!authenticated) {
          return (
            <Button size="sm" onClick={login} variant="secondary" className="flex gap-2 md:ring-1 py-1 !px-2 md:!px-6 md:py-2.5 ring-white ring-inset hover:bg-white/15 font-medium">
              <span className='hidden md:inline'>{connectButtonCopy.connectWallet}</span>
              <WalletIcon />
            </Button>
          );
        }
        return (
          <div className='flex gap-3 relative'>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  className='px-3 md:px-4 py-2 md:py-3 rounded-2xl text-white transition-all duration-150 hover:from-han-purple/70 hover:to-tulip/70 bg-gradient-to-tr text-xs md:text-sm from-han-purple to-tulip font-medium flex gap-2 items-center ease-in-out'
                  type="button"
                >
                  <span className='rounded-full flex justify-center items-center bg-white p-0.5'>
                    <div className='w-4 h-4 md:w-5 md:h-5 rounded-full' style={{ background: avatarGradient }}>
                    </div>
                  </span>
                  <span className='hidden sm:inline'>
                    {user?.wallet?.address ? <EnsResolver defaultStyle={false} address={user?.wallet?.address} /> : ''}
                  </span>
                  <ChevronDown strokeWidth={2.5} width={20} height={20} className='w-4 h-4 md:w-5 md:h-5' />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl overflow-hidden bg-eerie-black/85 backdrop-blur-lg shadow-sm !shadow-white focus:outline-none">
                  {authenticated ? (
                    <div className='px-4 pt-3 pb-2 text-white text-sm'>{connectButtonCopy.connectedTo} <span className='whitespace-nowrap font-semibold bg-gradient-to-b from-indigo-500 to-purple-500 text-transparent bg-clip-text'>{getConnectChainName()}</span></div>
                  ) : null}
                  <hr className='border-white/15' />
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={routes.profilePath}
                          prefetch={true}
                          replace
                          className={`${
                            active ? 'bg-[#f6f6f6] text-black' : 'text-neutral-400'
                          } group flex font-medium w-full items-center rounded-xl px-3 py-2 text-sm`}
                        >
                          {connectButtonCopy.myIdeas}
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => {
                            if (user?.wallet?.address) {
                              navigator.clipboard.writeText(user.wallet.address);
                              toast.success('Address copied to clipboard');
                            }
                          }}
                          className={`${
                            active ? 'bg-[#f6f6f6] text-black' : 'text-neutral-400'
                          } group flex font-medium w-full items-center rounded-xl px-3 py-2 text-sm`}
                        >
                          Copy Address
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={async () => {
                            await logout()
                            if (pathname.includes(routes.profilePath)) {
                              router.push(routes.homePath)
                            }
                          }}
                          className={`${
                            active ? 'bg-[#f6f6f6] text-black' : 'text-neutral-400'
                          } group flex w-full font-medium items-center rounded-xl px-3 py-2 text-sm`}
                        >
                          {connectButtonCopy.logout}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        );
      })()}
    </div>
  );
};
