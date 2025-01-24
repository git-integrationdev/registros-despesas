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
      if (registro.celular === 5511984119222) {
        existingDay.tani = (existingDay.tani || 0) + registro.valor;
      } else if (registro.celular === 5511911407528) {
        existingDay.fla = (existingDay.fla || 0) + registro.valor;
      }
      existingDay.total += registro.valor;
    } else {
      const newDay = { 
        date, 
        total: registro.valor,
        tani: registro.celular === 5511984119222 ? registro.valor : 0,
        fla: registro.celular === 5511911407528 ? registro.valor : 0
      };
      acc.push(newDay);
    }

    return acc;
  }, []) || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium mb-2">Data: {label}</p>
        {data.tani > 0 && (
          <p className="text-sm text-gray-600">
            Tani: R$ {data.tani.toFixed(2)}
          </p>
        )}
        {data.fla > 0 && (
          <p className="text-sm text-gray-600">
            Flá: R$ {data.fla.toFixed(2)}
          </p>
        )}
        <p className="text-sm font-medium text-gray-800 mt-2">
          Total: R$ {data.total.toFixed(2)}
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
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
              <BarChart 
                data={chartData}
                margin={{ 
                  top: 5, 
                  right: 5, 
                  left: 5, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="#4ADE80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};