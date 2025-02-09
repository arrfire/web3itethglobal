import { 
  Input, 
} from "@/common/components/molecules";
import { 
  Controller, useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import lang from "@/common/lang";
import { usePrivy } from '@privy-io/react-auth';
import { Button } from "@/common/components/atoms";
import { twitterAuthSchema } from "../validationSchema";

const { manageIdea: manageIdeaCopy } = lang

export const StartTwitter = ({
  onStartAgent,
} : {
    onStartAgent: (payload: {
        username: string;
        email: string;
        password: string;
    }) => Promise<void>
}) => {
  const {
    authenticated,
  } = usePrivy()
  const {
    handleSubmit,
    control,
    formState: {
      isValid,
    },
  } = useForm({
    resolver: yupResolver(twitterAuthSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });
  return (
    <form onSubmit={handleSubmit(onStartAgent)} className='relative w-full pb-5 pt-5 flex flex-col gap-4'>
      <Controller
        name="username"
        control={control}
        rules={{ required: true }}
        render={({
          field, fieldState,
        }) => {
          const { error } = fieldState;
          const {
            ref, ...fieldProperties
          } = field;
          return (
            <Input
              id={field.name}
              labelText={manageIdeaCopy.twitterForm.username}
              placeholder="DreamStarterXYZ"
              error={!!error}
              errorMessage={error?.message}
              {...fieldProperties}
              width="w-full"
            />
          )
        }}
      />
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={({
          field, fieldState,
        }) => {
          const { error } = fieldState;
          const {
            ref, ...fieldProperties
          } = field;
          return (
            <Input
              type="email"
              id={field.name}
              labelText={manageIdeaCopy.twitterForm.email}
              placeholder="vitalik@eth.com"
              error={!!error}
              errorMessage={error?.message}
              {...fieldProperties}
              width="w-full"
            />
          )
        }}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({
          field, fieldState,
        }) => {
          const { error } = fieldState;
          const {
            ref, ...fieldProperties
          } = field;
          return (
            <Input
              type="password"
              id={field.name}
              labelText={manageIdeaCopy.twitterForm.password}
              placeholder="Password"
              error={!!error}
              errorMessage={error?.message}
              {...fieldProperties}
              width="w-full"
            />
          )
        }}
      />
      <div className="flex justify-end mt-6 gap-4">
        <Button
          size="md"
          type="submit"
          variant="primary"
          disabled={!isValid}
          className="transition-all gap-2 !px-6 disabled:from-han-purple/50 disabled:to-tulip/50 !py-2.5 w-full md:w-auto duration-150 hover:enabled:from-han-purple/70
            hover:enabled:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium"
        >
          {authenticated ? manageIdeaCopy.twitterForm.submit : manageIdeaCopy.twitterForm.connect}
        </Button>
      </div>
    </form>
  )   
}