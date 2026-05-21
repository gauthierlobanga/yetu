// 'use client';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Check } from 'lucide-react';
// import { motion } from 'motion/react';
// import { useForm, Controller } from 'react-hook-form';
// import type {
//     ControllerFieldState,
//     ControllerRenderProps,
// } from 'react-hook-form';
// import type * as z from 'zod';
// import { FileUpload } from '@/components/file-upload';
// import { Button } from '@/components/ui/button';
// import {
//     Field,
//     FieldGroup,
//     FieldContent,
//     FieldLabel,
//     FieldDescription,
//     FieldError,
//     FieldSeparator,
// } from '@/components/ui/field';
// import { Input } from '@/components/ui/input';
// // import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { formSchema } from '@/lib/form-schema';
// import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

// type Schema = z.infer<typeof formSchema>;

// export function JobApplicationForm() {
//     const form = useForm<Schema>({
//         resolver: zodResolver(formSchema as any),
//     });
//     const {
//         formState: { isSubmitting, isSubmitSuccessful },
//     } = form;

//     const handleSubmit = form.handleSubmit(async (data: Schema) => {
//         try {
//             // TODO: implement form submission
//             console.log(data);
//             form.reset();
//         } catch (error) {
//             // TODO: handle error
//         }
//     });

//     if (isSubmitSuccessful) {
//         return (
//             <div className="w-full gap-2 rounded-md border p-2 sm:p-5 md:p-8">
//                 <motion.div
//                     initial={{ opacity: 0, y: -16 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
//                     className="h-full px-3 py-6"
//                 >
//                     <motion.div
//                         initial={{ scale: 0.5 }}
//                         animate={{ scale: 1 }}
//                         transition={{
//                             delay: 0.3,
//                             type: 'spring',
//                             stiffness: 500,
//                             damping: 15,
//                         }}
//                         className="mx-auto mb-4 flex w-fit justify-center rounded-full border p-2"
//                     >
//                         <Check className="size-8" />
//                     </motion.div>
//                     <h2 className="mb-2 text-center text-2xl font-bold text-pretty">
//                         Thank you
//                     </h2>
//                     <p className="text-center text-lg text-pretty text-muted-foreground">
//                         Form submitted successfully, we will get back to you
//                         soon
//                     </p>
//                 </motion.div>
//             </div>
//         );
//     }

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="mx-auto w-full max-w-3xl gap-2 rounded-md border p-2 sm:p-5 md:p-8"
//         >
//             <FieldGroup className="mb-6 grid gap-4 md:grid-cols-6">
//                 <h1 className="col-span-full mt-6 mb-1 text-3xl font-extrabold tracking-tight">
//                     Job Application
//                 </h1>
//                 <p className="col-span-full mb-5 text-sm tracking-wide text-wrap text-muted-foreground">
//                     Please fill out the form below to apply for this position
//                 </p>

//                 <Controller
//                     name="firstName"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                         <Field
//                             data-invalid={fieldState.invalid}
//                             className="gap-1 md:col-span-3"
//                         >
//                             <FieldLabel htmlFor="firstName">
//                                 First Name *
//                             </FieldLabel>
//                             <Input
//                                 {...field}
//                                 id="firstName"
//                                 type="text"
//                                 onChange={(e) => {
//                                     field.onChange(e.target.value);
//                                 }}
//                                 aria-invalid={fieldState.invalid}
//                                 placeholder="Enter your first name"
//                             />

//                             {fieldState.invalid && (
//                                 <FieldError errors={[fieldState.error]} />
//                             )}
//                         </Field>
//                     )}
//                 />

//                 <Controller
//                     name="lastName"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                         <Field
//                             data-invalid={fieldState.invalid}
//                             className="gap-1 md:col-span-3"
//                         >
//                             <FieldLabel htmlFor="lastName">
//                                 Last Name *
//                             </FieldLabel>
//                             <Input
//                                 {...field}
//                                 id="lastName"
//                                 type="text"
//                                 onChange={(e) => {
//                                     field.onChange(e.target.value);
//                                 }}
//                                 aria-invalid={fieldState.invalid}
//                                 placeholder="Enter your last name"
//                             />

//                             {fieldState.invalid && (
//                                 <FieldError errors={[fieldState.error]} />
//                             )}
//                         </Field>
//                     )}
//                 />

//                 <Controller
//                     name="email"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                         <Field
//                             data-invalid={fieldState.invalid}
//                             className="col-span-full gap-1"
//                         >
//                             <FieldLabel htmlFor="email">
//                                 Email Address *
//                             </FieldLabel>
//                             <Input
//                                 {...field}
//                                 id="email"
//                                 type="text"
//                                 onChange={(e) => {
//                                     field.onChange(e.target.value);
//                                 }}
//                                 aria-invalid={fieldState.invalid}
//                                 placeholder="Enter your email address"
//                             />

//                             {fieldState.invalid && (
//                                 <FieldError errors={[fieldState.error]} />
//                             )}
//                         </Field>
//                     )}
//                 />

//                 <Controller
//                     name="github-url"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                         <Field
//                             data-invalid={fieldState.invalid}
//                             className="gap-1 md:col-span-3"
//                         >
//                             <FieldLabel htmlFor="github-url">
//                                 GitHub URL{' '}
//                             </FieldLabel>
//                             <Input
//                                 {...field}
//                                 id="github-url"
//                                 type="text"
//                                 onChange={(e) => {
//                                     field.onChange(e.target.value);
//                                 }}
//                                 aria-invalid={fieldState.invalid}
//                                 placeholder="Enter your GitHub URL"
//                             />

//                             {fieldState.invalid && (
//                                 <FieldError errors={[fieldState.error]} />
//                             )}
//                         </Field>
//                     )}
//                 />

//                 <Controller
//                     name="linkedin-url"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                         <Field
//                             data-invalid={fieldState.invalid}
//                             className="gap-1 md:col-span-3"
//                         >
//                             <FieldLabel htmlFor="linkedin-url">
//                                 LinkedIn URL{' '}
//                             </FieldLabel>
//                             <Input
//                                 {...field}
//                                 id="linkedin-url"
//                                 type="text"
//                                 onChange={(e) => {
//                                     field.onChange(e.target.value);
//                                 }}
//                                 aria-invalid={fieldState.invalid}
//                                 placeholder="Enter your LinkedIn URL"
//                             />

//                             {fieldState.invalid && (
//                                 <FieldError errors={[fieldState.error]} />
//                             )}
//                         </Field>
//                     )}
//                 />
//                 <FieldSeparator className="my-4" />

//                 <Controller
//                     name="position"
//                     control={form.control}
//                     render={({ field, fieldState }) => {
//                         const options = [
//                             { label: 'Frontend Developer', value: 'frontend' },
//                             { label: 'Backend Developer', value: 'backend' },
//                             {
//                                 label: 'Full Stack Developer',
//                                 value: 'fullstack',
//                             },
//                             { label: 'UI/UX Designer', value: 'designer' },
//                             { label: 'Product Manager', value: 'pm' },
//                         ];

//                         return (
//                             <Field
//                                 data-invalid={fieldState.invalid}
//                                 className="col-span-full gap-1 [&_p]:pb-2"
//                             >
//                                 <FieldLabel htmlFor="position">
//                                     Which position are you applying for? *
//                                 </FieldLabel>

//                                 {/* <ToggleGroup
//                                     variant="outline"
//                                     value={
//                                         // wrap in array and flat because value can be a string or an array
//                                         [field.value]
//                                             .flat()
//                                             .filter((val) => val !== undefined)
//                                     }
//                                     onValueChange={field.onChange}
//                                     className="flex flex-wrap items-center justify-start gap-2"
//                                 >
//                                     {options.map(({ label, value }) => (
//                                         <ToggleGroupItem
//                                             key={value}
//                                             value={value}
//                                             className="flex items-center gap-x-2"
//                                         >
//                                             {label}
//                                         </ToggleGroupItem>
//                                     ))}
//                                 </ToggleGroup> */}
//                                 {fieldState.invalid && (
//                                     <FieldError errors={[fieldState.error]} />
//                                 )}
//                             </Field>
//                         );
//                     }}
//                 />

//                 <Controller
//                     name="experience"
//                     control={form.control}
//                     render={({ field, fieldState }) => {
//                         const options = [
//                             { label: '0-1 years', value: '0-1' },
//                             { label: '2-3 years', value: '2-3' },
//                             { label: '4-5 years', value: '4-5' },
//                             { label: '6-10 years', value: '6-10' },
//                             { label: '10+ years', value: '10+' },
//                         ];

//                         return (
//                             <Field
//                                 data-invalid={fieldState.invalid}
//                                 className="col-span-full gap-1 md:col-span-3"
//                             >
//                                 <FieldLabel htmlFor="experience">
//                                     Years of Experience *
//                                 </FieldLabel>

//                                 <Select
//                                     value={field.value}
//                                     onValueChange={field.onChange}
//                                 >
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Select Experience" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {options.map((option) => (
//                                             <SelectItem
//                                                 key={option.value}
//                                                 value={option.value}
//                                             >
//                                                 {option.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                                 {fieldState.invalid && (
//                                     <FieldError errors={[fieldState.error]} />
//                                 )}
//                             </Field>
//                         );
//                     }}
//                 />

//                 <Controller
//                     name="available-date"
//                     control={form.control}
//                     render={({ field, fieldState }) => {
//                         const options = [
//                             { label: 'Within 1 week', value: 'next-week' },
//                             { label: 'Within 1 month', value: 'next-month' },
//                             {
//                                 label: 'Within 3 months',
//                                 value: 'next-3-months',
//                             },
//                         ];

//                         return (
//                             <Field
//                                 data-invalid={fieldState.invalid}
//                                 className="col-span-full gap-1 md:col-span-3"
//                             >
//                                 <FieldLabel htmlFor="available-date">
//                                     When can you start? *
//                                 </FieldLabel>

//                                 <Select
//                                     value={field.value}
//                                     onValueChange={field.onChange}
//                                 >
//                                     <SelectTrigger className="w-full">
//                                         <SelectValue placeholder="Select Experience" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {options.map((option) => (
//                                             <SelectItem
//                                                 key={option.value}
//                                                 value={option.value}
//                                             >
//                                                 {option.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                                 {fieldState.invalid && (
//                                     <FieldError errors={[fieldState.error]} />
//                                 )}
//                             </Field>
//                         );
//                     }}
//                 />

//                 <Controller
//                     name="cover-letter"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                         <Field
//                             data-invalid={fieldState.invalid}
//                             className="col-span-full gap-1"
//                         >
//                             <FieldLabel htmlFor="cover-letter">
//                                 Cover Letter{' '}
//                             </FieldLabel>
//                             <Textarea
//                                 {...field}
//                                 aria-invalid={fieldState.invalid}
//                                 id="cover-letter"
//                                 placeholder={`Tell us why you're interested in this position...`}
//                             />

//                             {fieldState.invalid && (
//                                 <FieldError errors={[fieldState.error]} />
//                             )}
//                         </Field>
//                     )}
//                 />

//                 <Controller
//                     name="file-upload"
//                     control={form.control}
//                     render={({ field, fieldState }) => (
//                         <div>
//                             <Field
//                                 data-invalid={fieldState.invalid}
//                                 className="col-span-full gap-1"
//                             >
//                                 <FieldLabel htmlFor="file-upload">
//                                     Attach Resume{' '}
//                                 </FieldLabel>

//                                 <FileUpload
//                                     {...field}
//                                     setValue={form.setValue}
//                                     name="file-upload"
//                                     placeholder="PDF, DOC or DOCX (max. 5MB)"
//                                     accept={`application/pdf, application/doc, application/docx`}
//                                     maxFiles={1}
//                                     maxSize={1048576}
//                                 />
//                             </Field>
//                             {Array.isArray(fieldState.error) ? (
//                                 fieldState.error?.map((error, i) => (
//                                     <p
//                                         key={i}
//                                         role="alert"
//                                         data-slot="field-error"
//                                         className="text-sm text-destructive"
//                                     >
//                                         {error.message}
//                                     </p>
//                                 ))
//                             ) : (
//                                 <FieldError errors={[fieldState.error]} />
//                             )}
//                         </div>
//                     )}
//                 />
//                 <p className="col-span-full mb-5 text-sm tracking-wide text-wrap text-muted-foreground">
//                     Note: By submitting this form, you agree to our terms and
//                     conditions.
//                 </p>
//             </FieldGroup>
//             <div className="flex w-full items-center justify-end">
//                 <Button disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Submit'}
//                 </Button>
//             </div>
//         </form>
//     );
// }
