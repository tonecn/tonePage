import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { CreateUserValues } from "./user-schema";
import { handleAPIError } from "@/lib/api";
import { generalErrorHandler } from "@/lib/api/common";

interface UserFormProps {
    defaultValues?: Partial<CreateUserValues>;
    onSubmit: (values: CreateUserValues) => Promise<void>;
    isEdit?: boolean;
    children?: React.ReactNode; // For extra actions like "Reset Password" button in edit mode
}

export function UserForm({ defaultValues, onSubmit, isEdit = false, children }: UserFormProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [formData, setFormData] = React.useState<CreateUserValues>({
        username: defaultValues?.username || "",
        nickname: defaultValues?.nickname || "",
        email: defaultValues?.email || "",
        phone: defaultValues?.phone || "",
        password: defaultValues?.password || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            await onSubmit(formData);
        } catch (error) {
            handleAPIError(error, generalErrorHandler)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="username" className={errors.username ? "text-destructive" : ""}>
                        账户名
                    </Label>
                    <Input
                        id="username"
                        name="username"
                        placeholder="4-32位，仅支持字母、数字、下划线"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="nickname" className={errors.nickname ? "text-destructive" : ""}>
                        昵称
                    </Label>
                    <Input
                        id="nickname"
                        name="nickname"
                        placeholder="1-30位字符"
                        value={formData.nickname}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={errors.nickname ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.nickname && <p className="text-xs text-destructive">{errors.nickname}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                        电子邮箱
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="请输入有效的电子邮箱地址"
                        value={formData.email || ''}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
                        手机号
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="11位中国大陆手机号"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                {!isEdit && (
                    <div className="grid gap-2">
                        <Label htmlFor="password" className={errors.password ? "text-destructive" : ""}>
                            密码
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="6-32位，支持字母、数字、常见特殊字符"
                            value={formData.password || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {!isLoading && <Save className="h-4 w-4" />}
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEdit ? "保存修改" : "立即创建"}
                </Button>
                {children}
            </div>
        </form>
    );
}
