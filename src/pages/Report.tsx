import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();
  const [selectedPerson, setSelectedPerson] = React.useState<string | null>(null);

  const { data: registros, isLoading } = useQuery({
    queryKey: ["registros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registros")
        .select("*")
        .order("data", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Filter records by selected person
  const filteredRegistros = registros?.filter(registro => 
    !selectedPerson || registro.celular?.toString() === selectedPerson
  );

  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!filteredRegistros) return [];

    const dataByDate = filteredRegistros.reduce((acc: any, registro) => {
      if (!registro.data) return acc;

      const date = format(parseISO(registro.data), "dd/MM");
      if (!acc[date]) {
        acc[date] = {};
      }
      
      const categoria = registro.categoria || "Sem categoria";
      acc[date][categoria] = (acc[date][categoria] || 0) + (registro.valor || 0);
      
      return acc;
    }, {});

    return Object.entries(dataByDate).map(([date, categories]) => ({
      date,
      ...categories as object,
    }));
  }, [filteredRegistros]);

  // Get unique categories for the stacked bars
  const categories = React.useMemo(() => {
    if (!registros) return [];
    return [...new Set(registros.map(r => r.categoria).filter(Boolean))];
  }, [registros]);

  // Function to get phone label
  const getPhoneLabel = (phone: number | null) => {
    if (!phone) return null;
    switch (phone) {
      case 5511984119222:
        return "Tani";
      case 5511911407528:
        return "Flá";
      default:
        return phone.toString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 py-6 bg-white flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Relatório</h1>
          <p className="text-gray-500">Análise de gastos</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Person Filter */}
        <div className="mb-6">
          <Select
            value={selectedPerson || ""}
            onValueChange={(value) => setSelectedPerson(value === "" ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por pessoa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as pessoas</SelectItem>
              <SelectItem value="5511984119222">Tani</SelectItem>
              <SelectItem value="5511911407528">Flá</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ADE80]"></div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {categories.map((category, index) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="a"
                    fill={`hsl(${index * 60}, 70%, 60%)`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
};

export default Report;