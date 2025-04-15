
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";

interface EditRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: {
    id: number;
    titulo: string;
    categoria: string;
    valor: number;
    tipo: string;
    data: string;
    celular: number;
    observacao: string;
  };
  onSave: (editedRecord: any) => void;
}

export function EditRecordDialog({ open, onOpenChange, record, onSave }: EditRecordDialogProps) {
  const { toast } = useToast();
  const [editedRecord, setEditedRecord] = React.useState(record);

  const handleInputChange = (field: string, value: string | number) => {
    setEditedRecord((prev) => ({
      ...prev,
      [field]: field === "valor" || field === "celular" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    if (!editedRecord.titulo || !editedRecord.valor || !editedRecord.data) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    onSave(editedRecord);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Registro</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              type="text"
              id="titulo"
              value={editedRecord.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={editedRecord.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alimentação">Alimentação</SelectItem>
                <SelectItem value="Transporte">Transporte</SelectItem>
                <SelectItem value="Lazer">Lazer</SelectItem>
                <SelectItem value="Moradia">Moradia</SelectItem>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Educação">Educação</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="valor">Valor</Label>
            <Input
              type="number"
              id="valor"
              value={editedRecord.valor}
              onChange={(e) => handleInputChange("valor", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={editedRecord.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="data">Data</Label>
            <Input
              type="date"
              id="data"
              value={editedRecord.data}
              onChange={(e) => handleInputChange("data", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="celular">Celular</Label>
            <Input
              type="number"
              id="celular"
              value={editedRecord.celular}
              onChange={(e) => handleInputChange("celular", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="observacao">Observação</Label>
            <Input
              type="text"
              id="observacao"
              value={editedRecord.observacao}
              onChange={(e) => handleInputChange("observacao", e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
