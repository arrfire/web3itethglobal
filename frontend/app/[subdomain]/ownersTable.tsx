import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import {
  EnsResolver, LinkStyled,
} from '@/common/components/atoms';
import dynamic from 'next/dynamic';
import { getChainAddressLink } from '@/common/constants';
import { OwnerType } from './types';
const StakeProgress = dynamic(() => import('@/common/components/molecules').then(m => m.StakeProgress), {
  ssr: false,
});

dayjs.extend(relativeTime)

export const OwnersTable = ({
  owners,
} : {
  owners: Array<OwnerType> | []
}) => {
  return (
    <div>
      <div className="w-full text-sm text-left ring-white/25 ring-1 text-gray-400 rtl:text-right rounded-2xl p-4 overflow-hidden">
        {owners?.length ? (
          <div className="space-y-4 relative z-10">
            {owners.map((owner, index: number) => (
              <div key={owner.owner_address} className="group">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-white text-sm">{index + 1}.</span>
                    <LinkStyled
                      href={getChainAddressLink(owner.owner_address)}
                      target="_blank"
                      className="flex items-center gap-1 !px-0 !text-sm hover:underline font-medium"
                    >
                      <EnsResolver address={owner.owner_address} />
                    </LinkStyled>
                  </div>
                  <span className="text-neutral-300 font-medium text-sm">
                    {owner.stake.toFixed(2).replace(/[.,]00$/, "")}%
                  </span>
                </div>
                <StakeProgress
                  value={owner.stake}
                  className="h-1 bg-white/10 group-hover:bg-white/15 transition-colors"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
