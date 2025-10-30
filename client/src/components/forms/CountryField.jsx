import { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import countryList from 'react-select-country-list';

const CountrySelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const countries = countryList().getData();

const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '';
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
};

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='country-select-trigger'
        >
          {value ? (
            <span className='flex items-center gap-2'>
              <span>{getFlagEmoji(value)}</span>
              <span>{countries.find((c) => c.value === value)?.label}</span>
            </span>
          ) : (
            'Select your country...'
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-full p-0 bg-neutral-800 border-gray-600'
        align='start'
      >
        <Command className='bg-neutral-800 border-gray-600'>
          <CommandInput
            placeholder='Search countries...'
            className='country-select-input'
          />
          <CommandEmpty className='country-select-empty'>
            No country found.
          </CommandEmpty>
          <CommandList className='max-h-60 bg-neutral-800 scrollbar-hide-default'>
            <CommandGroup className='bg-neutral-800'>
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                  className='country-select-item'
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 text-yellow-500',
                      value === country.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className='flex items-center gap-2'>
                    <span>{getFlagEmoji(country.value)}</span>
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required = false,
}) => {
  return (
    <div className='mb-5'>
      <Label htmlFor={name} className='mb-1'>
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect value={field.value} onChange={field.onChange} />
        )}
      />

      {error && <p className='text-sm text-red-500'>{error.message}</p>}

      <p className='text-xs text-gray-500'>
        Helps us show market data and news relevant to you.
      </p>
    </div>
  );
};
