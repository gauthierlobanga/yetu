'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm, Controller } from 'react-hook-form';

import type {
    ControllerFieldState,
    ControllerRenderProps,
} from 'react-hook-form';
import * as z from 'zod';
import { FileUpload } from '@/components/file-upload';
import {
    FormHeader,
    FormFooter,
    StepFields,
    PreviousButton,
    NextButton,
    SubmitButton,
    MultiStepFormContent,
} from '@/components/multi-step-viewer';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldGroup,
    FieldContent,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MultiStepFormProvider } from '@/hooks/use-multi-step-viewer';
import { formSchema } from '@/lib/form-schema';

//------------------------------
type Schema = z.infer<typeof formSchema>;

export function EmployeeForm() {
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema as any),
    });
    const {
        formState: { isSubmitting, isSubmitSuccessful },
    } = form;

    const handleSubmit = form.handleSubmit(async (data: Schema) => {
        try {
            // TODO: implement form submission
            console.log(data);
            form.reset();
        } catch (error) {
            // TODO: handle error
        }
    });
    const stepsFields = [
        /** première section */
        {
            fields: [
                'firstName',
                'lastName',
                'email',
                'phone',
                'dateOfBirth',
                'address',
            ],
            component: (
                <>
                    <h2 className="col-span-full mt-4 mb-1 text-2xl font-bold tracking-tight">
                        Personal Information
                    </h2>
                    <p className="col-span-full mb-5 text-sm tracking-wide text-wrap text-muted-foreground">
                        Please provide your personal details for our records
                    </p>

                    <Controller
                        name="firstName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1 md:col-span-3"
                            >
                                <FieldLabel htmlFor="firstName">
                                    First Name *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="firstName"
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your first name"
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="lastName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1 md:col-span-3"
                            >
                                <FieldLabel htmlFor="lastName">
                                    Last Name *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="lastName"
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your last name"
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-full gap-1"
                            >
                                <FieldLabel htmlFor="email">
                                    Email Address *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your email address"
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1 md:col-span-3"
                            >
                                <FieldLabel htmlFor="phone">
                                    Phone Number *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="phone"
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your phone number"
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="dateOfBirth"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1 md:col-span-3"
                            >
                                <FieldLabel htmlFor="dateOfBirth">
                                    Date of Birth *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="dateOfBirth"
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="address"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-full gap-1"
                            >
                                <FieldLabel htmlFor="address">
                                    Home Address *
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    id="address"
                                    placeholder="Enter your complete home address"
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </>
            ),
        },
        /** deuxième section */
        {
            fields: [
                'position',
                'department',
                'startDate',
                'employmentType',
                'manager',
            ],
            component: (
                <>
                    <h2 className="col-span-full mt-4 mb-1 text-2xl font-bold tracking-tight">
                        Employment Details
                    </h2>
                    <p className="col-span-full mb-5 text-sm tracking-wide text-wrap text-muted-foreground">
                        Please provide your employment information
                    </p>

                    <Controller
                        name="position"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-full gap-1"
                            >
                                <FieldLabel htmlFor="position">
                                    Job Title/Position *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="position"
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter your job title"
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
                        <Controller
                            name="department"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const options = [
                                    {
                                        label: 'Engineering',
                                        value: 'engineering',
                                    },
                                    { label: 'Marketing', value: 'marketing' },
                                    { label: 'Sales', value: 'sales' },
                                    { label: 'Human Resources', value: 'hr' },
                                    { label: 'Finance', value: 'finance' },
                                    {
                                        label: 'Operations',
                                        value: 'operations',
                                    },
                                ];

                                return (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="col-span-full gap-1"
                                    >
                                        <FieldLabel htmlFor="department">
                                            Department *
                                        </FieldLabel>

                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select your department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <Controller
                            name="startDate"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="col-span-full gap-1"
                                >
                                    <FieldLabel htmlFor="startDate">
                                        Start Date *
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="startDate"
                                        type="text"
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    <Controller
                        name="employmentType"
                        control={form.control}
                        render={({ field, fieldState }) => {
                            const options = [
                                { label: 'Full-time', value: 'fulltime' },
                                { label: 'Part-time', value: 'parttime' },
                                { label: 'Contract', value: 'contract' },
                                { label: 'Intern', value: 'intern' },
                            ];

                            return (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="col-span-full gap-1 [&_p]:pb-2"
                                >
                                    <FieldLabel htmlFor="employmentType">
                                        Employment Type *
                                    </FieldLabel>

                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        {options.map(({ label, value }) => (
                                            <div
                                                key={value}
                                                className="flex items-center gap-x-2"
                                            >
                                                <RadioGroupItem
                                                    value={value}
                                                    id={value}
                                                />
                                                <Label htmlFor={value}>
                                                    {label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            );
                        }}
                    />

                    <Controller
                        name="manager"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-full gap-1"
                            >
                                <FieldLabel htmlFor="manager">
                                    Direct Manager *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="manager"
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    aria-invalid={fieldState.invalid}
                                    placeholder={`Enter your direct manager's name`}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </>
            ),
        },
        /** troisième section */
        {
            fields: [
                'emergencyContactName',
                'emergencyContactRelationship',
                'emergencyContactPhone',
                'emergencyContactEmail',
            ],
            component: (
                <>
                    <h2 className="col-span-full mt-4 mb-1 text-2xl font-bold tracking-tight">
                        Emergency Contact
                    </h2>
                    <p className="col-span-full mb-5 text-sm tracking-wide text-wrap text-muted-foreground">
                        Please provide emergency contact information
                    </p>

                    <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
                        <Controller
                            name="emergencyContactName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="col-span-full gap-1"
                                >
                                    <FieldLabel htmlFor="emergencyContactName">
                                        Emergency Contact Name *
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="emergencyContactName"
                                        type="text"
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={`Enter contact's full name`}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="emergencyContactRelationship"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const options = [
                                    { label: 'Spouse', value: 'spouse' },
                                    { label: 'Parent', value: 'parent' },
                                    { label: 'Sibling', value: 'sibling' },
                                    { label: 'Child', value: 'child' },
                                    { label: 'Friend', value: 'friend' },
                                    { label: 'Other', value: 'other' },
                                ];

                                return (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="col-span-full gap-1"
                                    >
                                        <FieldLabel htmlFor="emergencyContactRelationship">
                                            Relationship *
                                        </FieldLabel>

                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select relationship" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                    </div>

                    <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
                        <Controller
                            name="emergencyContactPhone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="col-span-full gap-1"
                                >
                                    <FieldLabel htmlFor="emergencyContactPhone">
                                        Emergency Contact Phone *
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="emergencyContactPhone"
                                        type="text"
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={`Enter contact's phone number`}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="emergencyContactEmail"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="col-span-full gap-1"
                                >
                                    <FieldLabel htmlFor="emergencyContactEmail">
                                        Emergency Contact Email{' '}
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="emergencyContactEmail"
                                        type="text"
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={`Enter contact's email address`}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </>
            ),
        },
        /** quatrième section */
        {
            fields: [
                'resume',
                'idDocument',
                null,
                'handbookAgreement',
                'confidentialityAgreement',
                'codeOfConductAgreement',
                'additionalNotes',
            ],
            component: (
                <>
                    <h2 className="col-span-full mt-4 mb-1 text-2xl font-bold tracking-tight">
                        Documents & Agreements
                    </h2>
                    <p className="col-span-full mb-5 text-sm tracking-wide text-wrap text-muted-foreground">
                        Please upload required documents and review agreements
                    </p>

                    <Controller
                        name="resume"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div>
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="col-span-full gap-1"
                                >
                                    <FieldLabel htmlFor="resume">
                                        Resume/CV *
                                    </FieldLabel>

                                    <FileUpload
                                        {...field}
                                        setValue={form.setValue}
                                        name="resume"
                                        placeholder="Upload your resume (PDF, DOC, DOCX)"
                                        accept={`application/pdf, application/doc, application/docx`}
                                        maxFiles={1}
                                        maxSize={1048576}
                                    />
                                </Field>
                                {Array.isArray(fieldState.error) ? (
                                    fieldState.error?.map((error, i) => (
                                        <p
                                            key={i}
                                            role="alert"
                                            data-slot="field-error"
                                            className="text-sm text-destructive"
                                        >
                                            {error.message}
                                        </p>
                                    ))
                                ) : (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        name="idDocument"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div>
                                <Field
                                    data-invalid={fieldState.invalid}
                                    className="col-span-full gap-1"
                                >
                                    <FieldLabel htmlFor="idDocument">
                                        Government ID *
                                    </FieldLabel>

                                    <FileUpload
                                        {...field}
                                        setValue={form.setValue}
                                        name="idDocument"
                                        placeholder="Upload a copy of your government ID (PDF, JPG, PNG)"
                                        accept={`application/pdf, image/jpeg, image/png`}
                                        maxFiles={1}
                                        maxSize={1048576}
                                    />
                                </Field>
                                {Array.isArray(fieldState.error) ? (
                                    fieldState.error?.map((error, i) => (
                                        <p
                                            key={i}
                                            role="alert"
                                            data-slot="field-error"
                                            className="text-sm text-destructive"
                                        >
                                            {error.message}
                                        </p>
                                    ))
                                ) : (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </div>
                        )}
                    />
                    <FieldSeparator className="col-span-full my-4">
                        Agreements
                    </FieldSeparator>
                    <Controller
                        name="handbookAgreement"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-full gap-1"
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <Checkbox
                                        id="handbookAgreement"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel htmlFor="handbookAgreement">
                                        I have read and agree to the Employee
                                        Handbook *
                                    </FieldLabel>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="confidentialityAgreement"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-full gap-1"
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <Checkbox
                                        id="confidentialityAgreement"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel htmlFor="confidentialityAgreement">
                                        I agree to the Confidentiality Agreement
                                        *
                                    </FieldLabel>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="codeOfConductAgreement"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-full gap-1"
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <Checkbox
                                        id="codeOfConductAgreement"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel htmlFor="codeOfConductAgreement">
                                        I agree to abide by the Company Code of
                                        Conduct *
                                    </FieldLabel>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="additionalNotes"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="col-span-full gap-1"
                            >
                                <FieldLabel htmlFor="additionalNotes">
                                    Additional Notes or Questions{' '}
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    id="additionalNotes"
                                    placeholder={`Any additional information or questions you'd like to share...`}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </>
            ),
        },
    ];

    if (isSubmitSuccessful) {
        return (
            <div className="w-full gap-2 rounded-md border p-2 sm:p-5 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
                    className="h-full px-3 py-6"
                >
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.3,
                            type: 'spring',
                            stiffness: 500,
                            damping: 15,
                        }}
                        className="mx-auto mb-4 flex w-fit justify-center rounded-full border p-2"
                    >
                        <Check className="size-8" />
                    </motion.div>
                    <h2 className="mb-2 text-center text-2xl font-bold text-pretty">
                        Thank you
                    </h2>
                    <p className="text-center text-lg text-pretty text-muted-foreground">
                        Form submitted successfully, we will get back to you
                        soon
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-md border p-2 md:p-5"
            >
                <MultiStepFormProvider
                    stepsFields={stepsFields}
                    onStepValidation={async (step) => {
                        const isValid = await form.trigger(step.fields);

                        return isValid;
                    }}
                >
                    <MultiStepFormContent>
                        <FormHeader />
                        <StepFields />
                        <FormFooter>
                            <PreviousButton>
                                <ChevronLeft />
                                Previous
                            </PreviousButton>
                            <NextButton>
                                Next <ChevronRight />
                            </NextButton>
                            <SubmitButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </SubmitButton>
                        </FormFooter>
                    </MultiStepFormContent>
                </MultiStepFormProvider>
            </form>
        </div>
    );
}
