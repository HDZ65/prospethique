import {
    FormControl,
    FormField as FormFieldWrapper,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FormFieldProps {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    options?: Array<{
        value: string;
        label: string;
    }>;
    className?: string;
}

export const FormField = ({ field, form }: {
    field: FormFieldProps;
    form: any;
}) => {
    const { id, label, type, required, placeholder, helpText, options } = field;

    return (
        <FormFieldWrapper
            control={form.control}
            name={id}
            render={({ field: formField }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {type === 'select' ? (
                            <Select
                                onValueChange={formField.onChange}
                                defaultValue={formField.value || undefined}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {options?.map(({ value, label }) => (
                                        value && ( // Vérifie que la valeur n'est pas vide
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        )
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : type === 'textarea' ? (
                            <Textarea
                                {...formField}
                                placeholder={placeholder}
                                required={required}
                            />
                        ) : (
                            <Input
                                {...formField}
                                type={type}
                                placeholder={placeholder}
                                required={required}
                            />
                        )}
                    </FormControl>
                    {helpText && <FormDescription>{helpText}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};