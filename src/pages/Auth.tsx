
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layers } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

const Auth = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isLogin) {
      await signIn(values.email, values.password);
    } else {
      await signUp(values.email, values.password);
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl tracking-tight">Knowledge Playlist</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? 'Enter your credentials to access your account' : 'Fill in the form to create your account'}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    {!isLogin && "Password must be at least 6 characters long"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
