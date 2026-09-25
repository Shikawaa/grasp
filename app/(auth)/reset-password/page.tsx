"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const queryToken = searchParams.get("token");
        if (queryToken) {
            setToken(queryToken);
        }
    }, [searchParams]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("Reset token is missing or invalid. Please check the link from your email.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword(newPassword, token);
            if (res?.error) {
                setError(res.error.message || "Failed to reset password.");
                setLoading(false);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/sign-in");
                }, 2000);
            }
        } catch (err: any) {
            setError(err?.message || "An unexpected error occurred.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#080914] px-4">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/grasp-logo.svg"
                        alt="Grasp"
                        width={96}
                        height={28}
                        priority
                    />
                </div>

                <Card className="shadow-none">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-[#F4F4F5]">Reset Password</CardTitle>
                        <CardDescription className="text-[#A1A1AA]">
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {success ? (
                            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded text-emerald-400 text-sm text-center">
                                Password successfully reset! Redirecting to sign in...
                            </div>
                        ) : (
                            <form onSubmit={handleReset} className="space-y-3">
                                {!searchParams.get("token") && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="token" className="text-[#F4F4F5]">Reset Token</Label>
                                        <Input
                                            id="token"
                                            type="text"
                                            placeholder="Token from email"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <Label htmlFor="newPassword" className="text-[#F4F4F5]">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword" className="text-[#F4F4F5]">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-destructive">{error}</p>
                                )}

                                <Button type="submit" className="w-full bg-[#4F46E5] hover:bg-[#4338CA]" disabled={loading}>
                                    {loading ? (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : null}
                                    Set new password
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-[#A1A1AA] text-center w-full">
                            Back to{" "}
                            <Link href="/sign-in" className="text-[#4F46E5] font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#080914]" />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
