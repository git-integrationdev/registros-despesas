import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
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
    if (!registro.data) return acc;

    const date = format(parseISO(registro.data), "dd/MM");
    const existingDay = acc.find((item) => item.date === date);

    if (existingDay) {
      if (registro.celular === 5511984119222) {
        existingDay.tani = (existingDay.tani || 0) + (registro.valor || 0);
      } else if (registro.celular === 5511911407528) {
        existingDay.fla = (existingDay.fla || 0) + (registro.valor || 0);
      }
      existingDay.total = (existingDay.total || 0) + (registro.valor || 0);
    } else {
      acc.push({
        date,
        tani: registro.celular === 5511984119222 ? registro.valor || 0 : 0,
        fla: registro.celular === 5511911407528 ? registro.valor || 0 : 0,
        total: registro.valor || 0,
      });
    }

    return acc;
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Relatório de Gastos</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ADE80]"></div>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Bar dataKey="tani" name="Tani" fill="#4ADE80" stackId="a" />
                <Bar dataKey="fla" name="Flá" fill="#F472B6" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};