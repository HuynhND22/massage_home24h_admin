import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormProps } from 'react-hook-form';
import { z } from 'zod';

// Hook wrapper cho React Hook Form với Zod validation
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
) {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });

  return form;
}

export default useZodForm;
