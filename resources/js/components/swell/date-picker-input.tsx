import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { format, isValid, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerInputProps {
    value?: string;
    onChange?: (date: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePickerInput({
    value = '',
    onChange,
    placeholder = 'Sélectionner une date',
    disabled = false,
    className,
}: DatePickerInputProps) {
    const [open, setOpen] = React.useState(false);

    const dateValue = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
    const validDate = dateValue && isValid(dateValue) ? dateValue : undefined;

    const [month, setMonth] = React.useState<Date | undefined>(validDate || new Date());
    const [inputValue, setInputValue] = React.useState(
        validDate ? format(validDate, 'dd MMMM yyyy', { locale: fr }) : ''
    );

    React.useEffect(() => {
        if (validDate) {
            setInputValue(format(validDate, 'dd MMMM yyyy', { locale: fr }));
        } else {
            setInputValue('');
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
    };

    const handleInputBlur = () => {
        // Valider la date seulement quand l'utilisateur quitte l'input
        const parsedDate = parse(inputValue, 'dd MMMM yyyy', new Date(), { locale: fr });
        if (isValid(parsedDate)) {
            onChange?.(format(parsedDate, 'yyyy-MM-dd'));
            setMonth(parsedDate);
        } else if (inputValue.trim() !== '') {
            // Si la date est invalide, réinitialiser à la valeur précédente
            if (validDate) {
                setInputValue(format(validDate, 'dd MMMM yyyy', { locale: fr }));
            } else {
                setInputValue('');
                onChange?.('');
            }
        } else {
            // Input vide
            onChange?.('');
        }
    };

    const handleSelectDate = (date: Date | undefined) => {
        if (date && isValid(date)) {
            onChange?.(format(date, 'yyyy-MM-dd'));
            setInputValue(format(date, 'dd MMMM yyyy', { locale: fr }));
            setMonth(date);
        }
        setOpen(false);
    };

    return (
        <div className={`relative flex ${className || ''}`}>
            <Input
                value={inputValue}
                placeholder={placeholder}
                className="bg-background pr-10"
                disabled={disabled}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setOpen(true);
                    }
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleInputBlur();
                    }
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        disabled={disabled}
                    >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Sélectionner une date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                    <Calendar
                        mode="single"
                        selected={validDate}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={handleSelectDate}
                        locale={fr}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
