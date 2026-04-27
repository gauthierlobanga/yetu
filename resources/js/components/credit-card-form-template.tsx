import * as z from "zod"
import { formSchema } from '@/lib/form-schema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { motion } from "motion/react"
import { Check } from "lucide-react"
import { Field, FieldGroup, FieldContent, FieldLabel, FieldDescription, FieldError, FieldSeparator } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"



type Schema = z.infer<typeof formSchema>;

export function DraftForm() {

const form = useForm<Schema>({
  resolver: zodResolver(formSchema as any),
})
const { formState: { isSubmitting, isSubmitSuccessful } } = form;

const handleSubmit = form.handleSubmit(async (data: Schema) => {
  try {
    // TODO: implement form submission
    console.log(data);
    form.reset();
  } catch (error) {
    // TODO: handle error
  }
});

  if (isSubmitSuccessful) {
    return (<div className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full py-6 px-3"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2"
          >
            <Check className="size-8" />
          </motion.div>
          <h2 className="text-center text-2xl text-pretty font-bold mb-2">
            Thank you
          </h2>
          <p className="text-center text-lg text-pretty text-muted-foreground">
            Form submitted successfully, we will get back to you soon
          </p>
        </motion.div>
      </div>)
  }
return (
      <form onSubmit={handleSubmit} className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border max-w-3xl mx-auto">
        <FieldGroup className="grid md:grid-cols-6 gap-4 mb-6">
          <h1 className="mt-6 mb-1 font-extrabold text-3xl tracking-tight col-span-full">Credit Card</h1>
<p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">Enter your credit card details example</p>

        <Controller
          name="fullname"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-3">
            <FieldLabel htmlFor="fullname">Full Name *</FieldLabel>
              <Input
                {...field}
                id="fullname"
                type="text"
                onChange={(e) => {
                field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your Full Name"
                
              />
              
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-3">
            <FieldLabel htmlFor="email">Email *</FieldLabel>
              <Input
                {...field}
                id="email"
                type="text"
                onChange={(e) => {
                field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your Email"
                
              />
              
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="number"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 col-span-full">
            <FieldLabel htmlFor="number">Credit Card Number (IBAN) </FieldLabel>
              <Input
                {...field}
                id="number"
                type="text"
                onChange={(e) => {
                field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your Credit Card Number"
                
              />
              
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="expiry-date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-3">
            <FieldLabel htmlFor="expiry-date">Expiry Date *</FieldLabel>
              <Input
                {...field}
                id="expiry-date"
                type="text"
                onChange={(e) => {
                field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Expiry Date"
                
              />
              
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="cvv"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-3">
            <FieldLabel htmlFor="cvv">CVV *</FieldLabel>
              <Input
                {...field}
                id="cvv"
                type="text"
                onChange={(e) => {
                field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="CVV"
                
              />
              
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
<Controller
          name="agree" 
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 col-span-full">
              <div className="flex items-center gap-2 mb-1">
                <Checkbox
                  id="agree"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  
                />
                <FieldLabel htmlFor="agree">I agree to the terms and conditions *</FieldLabel>
                
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
          </FieldGroup>
          <div className="flex justify-end items-center w-full">
            <Button disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
      </form>
)}