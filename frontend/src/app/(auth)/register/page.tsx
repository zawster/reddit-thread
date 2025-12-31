"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
    const { register: registerAuth } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setError('');
            await registerAuth({ email: data.email, username: data.username, password: data.password });
        } catch (err: any) {
            setError('Registration failed. Username or Email might be taken.');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create an account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                {...register("username", { required: true })}
                                type="text"
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <input
                                {...register("email", { required: true })}
                                type="email"
                                className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                {...register("password", { required: true })}
                                type="password"
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div>
                        <Button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Sign up
                        </Button>
                    </div>
                </form>
                <div className="text-center text-sm">
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
