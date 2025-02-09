import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import lang from '@/common/lang';
import { 
  getChainAddressLink, getChainTransactionLink,
} from '@/common/constants';
import { EnsResolver } from '@/common/components/atoms';
import { TransferType } from './types';

const { ideaPage: ideaPageCopy } = lang

dayjs.extend(relativeTime)

export const TradeTable = ({
  transfers,
  buy,
}: {
  transfers: Array<TransferType> | [];
  buy: boolean;
}) => {
  return (
    <div>
      <table className="w-full text-sm text-left ring-white/25 ring-1 text-gray-400 rtl:text-right rounded-2xl overflow-hidden">
        <thead className="text-xs border-b border-white/25 bg-white/15">
          <tr>
            <th scope="col" className="px-6 py-3 font-semibold">
              {ideaPageCopy.transactionsTable.columnOne}
            </th>
            <th scope="col" className="px-6 py-3 font-semibold">
              {ideaPageCopy.transactionsTable.columnTwo}
            </th>
            <th scope="col" className="hidden lg:block px-6 py-3 font-semibold">
              {ideaPageCopy.transactionsTable.columnThree}
            </th>
            <th scope="col" className="px-6 py-3 font-semibold">
              {ideaPageCopy.transactionsTable.columnFour}
            </th>
          </tr>
        </thead>
        <tbody>
          {transfers?.length ? transfers.map((transfer) => (
            <tr
              className="hover:bg-zinc-800"
              key={`${transfer.transaction_hash}-${transfer.to_address}`}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium hover:underline"
              >
                <a
                  className="text-white"
                  href={getChainAddressLink(transfer.to_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {buy ? <EnsResolver address={transfer.to_address} /> : <EnsResolver address={transfer.from_address} />}
                </a>
              </th>
              <th className="px-6 py-4 font-normal">
                {parseFloat(transfer.value_decimal).toFixed(0)}
              </th>
              <th className="hidden lg:block px-6 py-4 font-normal first-letter:capitalize">
                {dayjs().to(dayjs(transfer.block_timestamp))}
              </th>
              <th className="px-6 py-4 font-medium hover:underline">
                <a
                  className="text-white"
                  href={getChainTransactionLink(transfer.transaction_hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {transfer.transaction_hash.slice(2, 7)}
                </a>
              </th>
            </tr>
          )) : null}
        </tbody>
      </table>
    </div>
  );
};
