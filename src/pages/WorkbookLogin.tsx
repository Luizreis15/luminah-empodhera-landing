import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useWorkbookAuth } from '@/hooks/useWorkbook';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

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

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/caderno');
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
      navigate('/caderno');
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
      navigate('/caderno');
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
      {/* Back to site link */}
      <div className="absolute top-4 left-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar ao site</span>
        </Link>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display text-gold tracking-wide mb-2">
            EMPODHERA
          </h1>
          <p className="text-muted-foreground font-body text-sm uppercase tracking-widest">
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
                          className="border-gold/20 focus:border-gold"
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
                            className="border-gold/20 focus:border-gold pr-10"
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
            /* Signup Form */
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Nome completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Seu nome" 
                          className="border-gold/20 focus:border-gold"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="seu@email.com" 
                          className="border-gold/20 focus:border-gold"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        WhatsApp <span className="text-muted-foreground">(opcional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="(11) 99999-9999" 
                          className="border-gold/20 focus:border-gold"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Mínimo 6 caracteres"
                            className="border-gold/20 focus:border-gold pr-10"
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

                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Confirmar senha</FormLabel>
                      <FormControl>
                        <Input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Repita a senha"
                          className="border-gold/20 focus:border-gold"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
            </Form>
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
