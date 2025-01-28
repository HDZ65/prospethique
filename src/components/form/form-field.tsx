import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils/core/cn";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface FormFieldProps {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'email' | 'url' | 'select' | 'textarea' | 'date';
    placeholder: string;
    value?: string;
    options?: string[];
    error?: string[];
    disabled?: boolean;
    className?: string;
    onChange?: (value: string) => void;
}

const styles = {
    input: "bg-muted/60 border-white/10 shadow-input placeholder:text-text-tertiary focus:border-primary/30 hover:border-white/20",
    label: "text-sm font-medium text-text-secondary mb-2 block",
    error: "text-red-500 text-sm mt-1"
};

export const FormField: FC<FormFieldProps> = ({
    id,
    name,
    label,
    type,
    placeholder,
    value,
    options = [],
    disabled,
    className,
    error,
    onChange,
}) => {
    const commonProps = {
        id,
        name,
        placeholder,
        disabled,
        value: value,
        className: cn(styles.input, error && "border-red-500", className),
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange?.(e.target.value);
    };

    const renderField = () => {
        switch (type) {
            case 'select':
                return (
                    <Select
                        name={name}
                        defaultValue={value}
                        onValueChange={onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className={cn(styles.input, error && "border-red-500")}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'textarea':
                return <Textarea 
                    {...commonProps} 
                    rows={4} 
                    className={cn(commonProps.className, "resize-none")}
                    onChange={handleInputChange}
                    value={value}
                />;

            case 'date':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    styles.input,
                                    error && "border-red-500",
                                    !value && "text-muted-foreground"
                                )}
                                disabled={disabled}
                            >
                                <CalendarIcon className=" h-4 w-4" />
                                {value ? (
                                    format(new Date(value), "PPP", { locale: fr })
                                ) : (
                                    <span>Sélectionner une date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={value ? new Date(value) : undefined}
                                onSelect={(date) => {
                                    if (date) {
                                        const formattedDate = format(date, 'yyyy-MM-dd');
                                        onChange?.(formattedDate);
                                    }
                                }}
                                initialFocus
                                locale={fr}
                            />
                        </PopoverContent>
                    </Popover>
                );

            default:
                return <Input 
                    {...commonProps} 
                    type={type}
                    onChange={handleInputChange}
                    value={value}
                />;
        }
    };

    return (
        <div className="space-y-2">
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            {renderField()}
        </div>
    );
};