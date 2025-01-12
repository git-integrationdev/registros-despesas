import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Wallet, Car, User } from "lucide-react";
import { format } from "date-fns";

const Index = () => {
  const { data: registros, isLoading } = useQuery({
    queryKey: ["registros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registros")
        .select("*")
        .order("data", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 py-6 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Olá 👋</h1>
            <p className="text-gray-500">Seus registros financeiros</p>
          </div>
          <Bell className="w-6 h-6 text-gray-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ADE80]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {registros?.map((registro) => (
              <Card key={registro.id} className="w-full animate-fade-in">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">
                      {registro.titulo || "Sem título"}
                    </CardTitle>
                    <span
                      className={`text-lg font-semibold ${
                        registro.tipo === "expense" ? "text-red-500" : "text-[#4ADE80]"
                      }`}
                    >
                      {registro.tipo === "expense" ? "-" : "+"}R$ {registro.valor?.toFixed(2)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{registro.categoria}</span>
                    <span>{registro.data ? format(new Date(registro.data), "dd/MM/yyyy") : "Sem data"}</span>
                  </div>
                  {registro.observacao && (
                    <p className="mt-2 text-sm text-gray-600">{registro.observacao}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button className="flex flex-col items-center text-[#4ADE80]">
            <Wallet className="w-6 h-6" />
            <span className="text-xs mt-1">Registros</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <Car className="w-6 h-6" />
            <span className="text-xs mt-1">Categorias</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;