'use client'
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useOutsideClick } from "@/common/hooks";
import lang from "@/common/lang";
import { routes } from "@/common/routes";
import debounce from "debounce-promise";
import { motion } from "framer-motion";
import {
  ChevronDown, PackageSearch,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  components,
} from "react-select";
import AsyncSelect from "react-select/async";
import { getIdeas } from "@/app/actions";
import { useGetIdeas } from "@/app/dreams/useGetIdeas";

const {
  header: {
    searchIdeas: searchIdeasCopy,
  },
} = lang

export const SearchIdeas = ({
  searchEnabled,
  setSearchEnabled,
} : {
  searchEnabled: boolean;
  setSearchEnabled: (value: boolean) => void;
}) => {
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [availableIdeas, setAvailableIdeas] = useState<any>([])

  useOutsideClick({
    isVisible: searchEnabled,
    ref: searchBoxRef,
    callback: () => setSearchEnabled(false),
  });

  useEffect(() => {
    const getData = async () => {
      const ideas = await getIdeas()
      setAvailableIdeas(ideas)
    }
    getData()
  }, [])

  const {
    ideas,
  } = useGetIdeas({
    ideaTokens: availableIdeas,
  })

  const promiseOptions = debounce(async (inputValue: string) => {
    return [
      ...ideas.map((idea) => ({
        label: idea.idea.name,
        value: `${idea.idea.name} (${idea.subdomain})`,
        subdomain: idea.subdomain,
      })).filter((idea) => idea.label.toLowerCase().includes(inputValue.toLowerCase())),
    ]
    return []
  }, 1000)

  return (
    searchEnabled && (
      <div className='w-full fixed top-0 left-0 h-screen flex justify-center items-center backdrop-blur-md z-[9999] bg-black/60'>
        <motion.div
          ref={searchBoxRef}
          className="relative"
          initial={{
            opacity: 0,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <span className="absolute top-2.5 md:top-1/2 md:-translate-y-1/2 left-3 text-violets-are-blue z-10">
            <PackageSearch width={24} height={24} strokeWidth={1.5} />
          </span>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={promiseOptions}
            placeholder={searchIdeasCopy.placeholder}
            components={{
              IndicatorSeparator: () => <span></span>,
              DropdownIndicator: (state) => {
                return <span className={`text-violets-are-blue cursor-pointer ${state.selectProps.menuIsOpen ? "rotate-180" : ""}`}><ChevronDown/></span>
              },
              Option: (props) => {
                return (
                  <components.Option {...props}>
                    <div className="flex items-center justify-between">
                      <span className=" font-normal text-sm">{props.data.label}</span>
                      <div className="bg-gradient-to-tl from-han-purple to-tulip rounded-full text-sm px-2 py-1/2 font-medium">
                        <span className="text-white uppercase font-semibold text-xs">
                          {props.data.subdomain}
                        </span>
                      </div>
                    </div>
                  </components.Option>
                );
              },
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary25: '#f6f6f6',
                primary: '#f6f6f6',
              },
            })}
            noOptionsMessage={() => searchIdeasCopy.noIdeasFound}
            autoFocus={true}
            onChange={(inputValue) => {
              if (inputValue) {
                router.push(routes.projectDetailPath.replace('%subdomain%', inputValue.subdomain))
                setSearchEnabled(false)
              }
            }}
            classNames={{
              container: () => "w-[320px] md:w-[400px]",
              control: () => `!bg-white/15 backdrop-blur-sm shadow-sm shadow-white hover:shadow-violets-are-blue active:shadow-violets-are-blue !rounded-2xl py-1.5 !pr-3 !pl-10 !border-0 !ring-0 font-normal bg-white`,
              placeholder: () => '!text-gray-400',
              input: () => '!ring-0 !my-0 cursor-text !text-white ',
              menu: () => '!rounded-2xl overflow-hidden !bg-white/5 backdrop-blur-sm !shadow-sm !shadow-white',
              menuList: () => '!py-0',
              option: (state) => `${state.isFocused ? "!text-black" : "!text-neutral-400"} transition-all duration-200 ease-in-out active:!bg-[#f6f6f6] !cursor-pointer capitalize active:!text-black`,
            }}
          />
        </motion.div>
      </div>
    )
  )
}
