import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportModal = ({ open, onOpenChange }: ReportModalProps) => {
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

  // Process data for the chart
  const chartData = registros?.reduce((acc: any[], registro) => {
    if (!registro.data || !registro.valor) return acc;

    const date = format(parseISO(registro.data), "dd/MM", { locale: ptBR });
    const existingDay = acc.find(item => item.date === date);

    if (existingDay) {
      existingDay.total += registro.valor;
    } else {
      acc.push({ date, total: registro.valor });
    }

    return acc;
  }, []) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Relatório de Gastos Diários</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ADE80]"></div>
          </div>
        ) : (
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Total"]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Bar dataKey="total" fill="#4ADE80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};