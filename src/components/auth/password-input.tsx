import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Check, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils/cn"

interface PasswordInputProps {
    id: string
    name: string
    label: string
    required?: boolean
    confirmPassword?: string
    onChange?: (isValid: boolean) => void
    showValidation?: boolean
    disabled?: boolean
}

export function PasswordInput({ 
    id, 
    name, 
    label, 
    required = false,
    confirmPassword,
    onChange,
    showValidation = false,
    disabled = false
}: PasswordInputProps) {
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rules, setRules] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        match: true
    })

    useEffect(() => {
        const validatePassword = () => {
            const newRules = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                match: !confirmPassword || password === confirmPassword
            }
            setRules(newRules)
            onChange?.(Object.values(newRules).every(Boolean))
        }

        validatePassword()
    }, [password, confirmPassword, onChange])

    const strength = Object.values(rules).filter(Boolean).length
    const strengthPercentage = password.length > 0 
        ? Math.min(
            (password.length / 8) * 25 + // 25% pour la longueur
            (rules.uppercase ? 25 : 0) + // 25% pour la majuscule
            (rules.lowercase ? 25 : 0) + // 25% pour la minuscule
            (rules.number ? 25 : 0), // 25% pour le chiffre
            100
        ) 
        : 0
    const strengthColor = strengthPercentage < 33 ? "bg-red-500" : 
                         strengthPercentage < 66 ? "bg-yellow-500" : 
                         "bg-green-500"

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    required={required}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>
            {showValidation && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Force du mot de passe</span>
                        <span className={cn(
                            "font-medium",
                            strengthPercentage < 33 ? "text-red-500" : 
                            strengthPercentage < 66 ? "text-yellow-500" : 
                            "text-green-500"
                        )}>
                            {strengthPercentage < 33 ? "Faible" : 
                             strengthPercentage < 66 ? "Moyen" : 
                             "Fort"}
                        </span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={cn(
                                "h-full transition-all duration-300",
                                strengthColor
                            )}
                            style={{ width: `${strengthPercentage}%` }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={cn(
                            "flex items-center gap-1 transition-colors",
                            rules.length ? "text-green-500" : "text-muted-foreground/30"
                        )}>
                            <Check className="h-3 w-3" />
                            <span>8+ caractères</span>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1 transition-colors",
                            rules.uppercase ? "text-green-500" : "text-muted-foreground/30"
                        )}>
                            <Check className="h-3 w-3" />
                            <span>Majuscule</span>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1 transition-colors",
                            rules.lowercase ? "text-green-500" : "text-muted-foreground/30"
                        )}>
                            <Check className="h-3 w-3" />
                            <span>Minuscule</span>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1 transition-colors",
                            rules.number ? "text-green-500" : "text-muted-foreground/30"
                        )}>
                            <Check className="h-3 w-3" />
                            <span>Chiffre</span>
                        </div>
                        {confirmPassword && (
                            <div className={cn(
                                "flex items-center gap-1 transition-colors",
                                rules.match ? "text-green-500" : "text-muted-foreground/30"
                            )}>
                                <Check className="h-3 w-3" />
                                <span>Correspond</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
} 