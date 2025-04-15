import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfDay, startOfWeek, startOfMonth, isWithinInterval, parseISO } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, BarChart2, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { EditRecordDialog } from "@/components/EditRecordDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportModal } from "@/components/ReportModal";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [selectedPhoneFilter, setSelectedPhoneFilter] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const queryClient = useQueryClient();

  const { data: registros, isLoading } = useQuery({
    queryKey: ["registros", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registros")
        .select("*")
        .order("data", { ascending: sortOrder === 'asc' });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("registros")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["registros"] });
      toast.success("Registro deletado com sucesso");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Erro ao deletar registro");
    }
  };

  const categories = [...new Set(registros?.map(registro => registro.categoria).filter(Boolean))];

  const filterByDate = (registro: any) => {
    if (!selectedDateFilter || !registro.data) return true;

    const recordDate = parseISO(registro.data);
    const today = startOfDay(new Date());
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
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

  const filteredRegistros = registros?.filter(registro => 
    (!selectedCategory || registro.categoria === selectedCategory) && 
    filterByDate(registro) &&
    (!selectedPhoneFilter || registro.celular?.toString() === selectedPhoneFilter)
  );

  const total = filteredRegistros?.reduce((acc, registro) => {
    if (registro.valor) {
      return acc + (registro.tipo === "expense" ? -registro.valor : registro.valor);
    }
    return acc;
  }, 0) || 0;

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

  const getCategoryVariant = (category: string) => {
    const variants = ["blue", "pink", "green", "purple", "cyan"] as const;
    const index = Math.abs(category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return variants[index % variants.length];
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-4 py-6 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Olá 👋</h1>
            <p className="text-gray-500">Seus registros financeiros</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSortOrder}
              className="relative group"
            >
              {sortOrder === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsReportOpen(true)}
            >
              <BarChart2 className="h-4 w-4" />
              Relatório
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 mb-24">
        <div className="space-y-4">
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

          <ToggleGroup
            type="single"
            value={selectedPhoneFilter || ""}
            onValueChange={(value) => setSelectedPhoneFilter(value)}
            className="justify-start w-full"
          >
            <ToggleGroupItem value="" className="flex-1">
              Todas
            </ToggleGroupItem>
            <ToggleGroupItem value="5511984119222" className="flex-1">
              Tani
            </ToggleGroupItem>
            <ToggleGroupItem value="5511911407528" className="flex-1">
              Flá
            </ToggleGroupItem>
          </ToggleGroup>

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
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium">
                        {registro.titulo || "Sem título"}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-red-500">
                        -R$ {registro.valor?.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-blue-500"
                          onClick={() => setEditingRecord(registro)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => handleDelete(registro.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex gap-2 flex-wrap">
                      {registro.categoria && (
                        <Tag variant={getCategoryVariant(registro.categoria)}>
                          {registro.categoria}
                        </Tag>
                      )}
                      {registro.celular && (
                        <Tag variant="cyan">
                          {getPhoneLabel(registro.celular)}
                        </Tag>
                      )}
                    </div>
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

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <span className="text-gray-600 font-medium">Total:</span>
          <span className="text-xl font-bold text-red-500">
            -R$ {Math.abs(total).toFixed(2)}
          </span>
        </div>
      </footer>

      {editingRecord && (
        <EditRecordDialog
          open={!!editingRecord}
          onOpenChange={(open) => !open && setEditingRecord(null)}
          record={editingRecord}
          onSave={async (editedRecord) => {
            try {
              const { error } = await supabase
                .from("registros")
                .update(editedRecord)
                .eq("id", editedRecord.id);

              if (error) throw error;

              await queryClient.invalidateQueries({ queryKey: ["registros"] });
              toast.success("Registro atualizado com sucesso");
            } catch (error) {
              console.error("Error updating record:", error);
              toast.error("Erro ao atualizar registro");
            }
          }}
        />
      )}

      <ReportModal open={isReportOpen} onOpenChange={setIsReportOpen} />
    </div>
  );
};

export default Index;
