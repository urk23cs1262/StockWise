import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
const InputField = ({name, label, placeholder, type="text", register, error, validation, disabled, value }) => {
    return (
        <div className="mb-5">
            <Label htmlFor={name} className="mb-1">
                {label}
            </Label>
            <Input
                type={type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                className={cn('form-input', {'opacity-50 cursor-not-allowed': disabled})}
                {...register(name, validation)}
            />
            {error && <p className="text-xs text-red-500 ">{error.message}</p>}
        </div>
    );
}

export default InputField;