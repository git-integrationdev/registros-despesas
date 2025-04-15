
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthMode = "login" | "signup" | "reset";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate("/");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        toast({
          title: "Conta criada com sucesso!",
          description: "Por favor, verifique seu email para confirmar sua conta.",
        });
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        toast({
          title: "Email enviado!",
          description: "Verifique seu email para redefinir sua senha.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === "login" ? "Login" : mode === "signup" ? "Criar Conta" : "Redefinir Senha"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Entre com sua conta"
              : mode === "signup"
              ? "Crie uma nova conta"
              : "Digite seu email para redefinir sua senha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {mode !== "reset" && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Carregando..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar Conta" : "Enviar Email"}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            {mode === "login" && (
              <>
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => setMode("reset")}
                >
                  Esqueceu sua senha?
                </Button>
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setMode("signup")}
                  >
                    Não tem uma conta? Crie agora
                  </Button>
                </div>
              </>
            )}
            {(mode === "signup" || mode === "reset") && (
              <Button
                variant="link"
                className="px-0"
                onClick={() => setMode("login")}
              >
                Voltar para o login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
