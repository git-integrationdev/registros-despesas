import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfDay, startOfWeek, startOfMonth, isWithinInterval, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { Tag } from "@/components/ui/tag";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

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

  // Get unique categories
  const categories = [...new Set(registros?.map(registro => registro.categoria).filter(Boolean))];

  // Filter records by date
  const filterByDate = (registro: any) => {
    if (!selectedDateFilter || !registro.data) return true;

    const recordDate = parseISO(registro.data);
    const today = startOfDay(new Date());
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
    const monthStart = startOfMonth(today);

    switch (selectedDateFilter) {
      case "today":
        return format(recordDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      case "week":
        return isWithinInterval(recordDate, {
          start: weekStart,
          end: new Date()
        });
      case "month":
        return isWithinInterval(recordDate, {
          start: monthStart,
          end: new Date()
        });
      default:
        return true;
    }
  };

  // Filter records by category and date
  const filteredRegistros = registros?.filter(registro => 
    (!selectedCategory || registro.categoria === selectedCategory) && filterByDate(registro)
  );

  // Calculate total value
  const total = filteredRegistros?.reduce((acc, registro) => {
    if (registro.valor) {
      return acc + (registro.tipo === "expense" ? -registro.valor : registro.valor);
    }
    return acc;
  }, 0) || 0;

  // Function to get a consistent color variant for each category
  const getCategoryVariant = (category: string) => {
    const variants = ["blue", "pink", "green", "purple", "cyan"] as const;
    const index = Math.abs(category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return variants[index % variants.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 py-6 bg-white">
        <div>
          <h1 className="text-2xl font-semibold">Olá 👋</h1>
          <p className="text-gray-500">Seus registros financeiros</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 mb-24">
        {/* Filters */}
        <div className="space-y-4">
          {/* Category Filter */}
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <ToggleGroup
            type="single"
            value={selectedDateFilter || ""}
            onValueChange={(value) => setSelectedDateFilter(value)}
            className="justify-start w-full"
          >
            <ToggleGroupItem value="" className="flex-1">
              Todos
            </ToggleGroupItem>
            <ToggleGroupItem value="today" className="flex-1">
              Hoje
            </ToggleGroupItem>
            <ToggleGroupItem value="week" className="flex-1">
              Semana
            </ToggleGroupItem>
            <ToggleGroupItem value="month" className="flex-1">
              Mês
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ADE80]"></div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {filteredRegistros?.map((registro) => (
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
                    {registro.categoria && (
                      <Tag variant={getCategoryVariant(registro.categoria)}>
                        {registro.categoria}
                      </Tag>
                    )}
                    <span>
                      {registro.data ? format(parseISO(registro.data), "dd/MM/yyyy") : "Sem data"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Fixed Footer with Total */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <span className="text-gray-600 font-medium">Total:</span>
          <span className={`text-xl font-bold ${total >= 0 ? 'text-[#4ADE80]' : 'text-red-500'}`}>
            R$ {Math.abs(total).toFixed(2)}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;