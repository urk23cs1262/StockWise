import { Controller } from "react-hook-form";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
const SelectField = ({ name, label, placeholder, options, control, error, required = false }) => {
    return (
        <div className="mb-5">
            <Label htmlFor={name} className="mb-1">{label}</Label>
            <Controller
                name={name}
                control={control}
                rules={{
                    required: required ? `please select ${label.toLowerCase()}` : false,
                }}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full !h-12">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-800">
                            {options.map((option) => (
                                <SelectItem value={option.value} key={option.value} className="focus:bg-gray-600 focus:text-white">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                        {error && <p className="text-xs text-red-500">{error.message}</p>}
                    </Select>
                )}
            />
        </div>
    );
}

export default SelectField;