import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useWorkbookAuth } from '@/hooks/useWorkbook';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function WorkbookLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading, signIn, signUp } = useWorkbookAuth();

  // Debug log on mount
  useEffect(() => {
    console.log('[WorkbookLogin] Component mounted - JavaScript is working');
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/caderno/dashboard');
    }
  }, [user, authLoading, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast({
        title: "Erro ao entrar",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Bem-vinda de volta! ✨",
        description: "Vamos continuar sua jornada",
      });
      navigate('/caderno/dashboard');
    }
    setIsLoading(false);
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.name, data.phone);
    
    if (error) {
      let errorMessage = "Não foi possível criar sua conta";
      if (error.message.includes('already registered')) {
        errorMessage = "Este email já está cadastrado. Faça login.";
      }
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Conta criada com sucesso! 🎉",
        description: "Seja bem-vinda ao Caderno de Atividades EMPODHERA",
      });
      navigate('/caderno/dashboard');
    }
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pattern-dots">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display text-foreground tracking-wide mb-2">
            EMPODHERA
          </h1>
          <p className="text-foreground/70 font-body text-sm uppercase tracking-widest">
            Caderno de Atividades
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant border border-gold/20 p-8 animate-scale-in">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-gold/20">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm font-medium transition-all ${
                isLogin 
                  ? 'text-gold border-b-2 border-gold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm font-medium transition-all ${
                !isLogin 
                  ? 'text-gold border-b-2 border-gold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {isLogin ? (
            /* Login Form */
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="seu@email.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="••••••••"
                            className="pr-10"
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-gold hover:opacity-90 text-white font-medium py-5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            /* Signup Form - Using native inputs to avoid Slot issues */
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-sm font-medium text-foreground">
                  Nome completo
                </label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Seu nome"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={signupForm.watch('name')}
                  onChange={(e) => {
                    console.log('[Signup] Name changed:', e.target.value);
                    signupForm.setValue('name', e.target.value);
                  }}
                />
                {signupForm.formState.errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {signupForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="seu@email.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={signupForm.watch('email')}
                  onChange={(e) => {
                    console.log('[Signup] Email changed:', e.target.value);
                    signupForm.setValue('email', e.target.value);
                  }}
                />
                {signupForm.formState.errors.email && (
                  <p className="text-sm font-medium text-destructive">
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-phone" className="text-sm font-medium text-foreground">
                  WhatsApp <span className="text-muted-foreground">(opcional)</span>
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={signupForm.watch('phone')}
                  onChange={(e) => signupForm.setValue('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={signupForm.watch('password')}
                    onChange={(e) => signupForm.setValue('password', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {signupForm.formState.errors.password && (
                  <p className="text-sm font-medium text-destructive">
                    {signupForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-confirm" className="text-sm font-medium text-foreground">
                  Confirmar senha
                </label>
                <input
                  id="signup-confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={signupForm.watch('confirmPassword')}
                  onChange={(e) => signupForm.setValue('confirmPassword', e.target.value)}
                />
                {signupForm.formState.errors.confirmPassword && (
                  <p className="text-sm font-medium text-destructive">
                    {signupForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-gold hover:opacity-90 text-white font-medium py-5 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar minha conta'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Ao criar sua conta, você concorda em receber comunicações do EMPODHERA.
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-muted-foreground text-center">
          Caderno exclusivo para participantes do{' '}
          <span className="text-gold">EMPODHERA</span>
        </p>
      </div>
    </div>
  );
}
