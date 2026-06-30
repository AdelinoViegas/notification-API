"use client";

import { useState, useActionState, useEffect } from "react";
import { createChamber, updateChamber, getChambersWithDetails } from "@/backend/api/clinical/morgue-api";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import { toast } from "react-toastify";

type Chamber = {
  _id: string;
  name: string;
  maxDrawers: number;
};

export default function Chambers() {
  const [createState, createAction] = useActionState(createChamber, { message: "", status: false });
  const [updateState, updateAction] = useActionState(updateChamber, { message: "", status: false });
  const [chambers, setChambers] = useState<Chamber[]>([]);
  const [editing, setEditing] = useState<Chamber | null>(null);

  const load = () => {
    getChambersWithDetails().then((data) =>
      setChambers(
        data.map((c) => ({
          _id: c._id.toString(),
          name: c.name ?? "",
          maxDrawers: c.maxDrawers ?? 10,
        }))
      )
    );
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (createState.message) {
      if (createState.status) {
        toast.success(createState.message);
        load();
      } else {
        toast.error(createState.message);
      }
    }
  }, [createState]);

  useEffect(() => {
    if (updateState.message) {
      if (updateState.status) {
        toast.success(updateState.message);
        setEditing(null);
        load();
      } else {
        toast.error(updateState.message);
      }
    }
  }, [updateState]);

  return (
    <main className="space-y-6">
      {/* Formulário de cadastro */}
      <Card className="p-6">
        <Tag className="inline-flex mb-4">Cadastrar Nova Câmara</Tag>
        <form action={createAction} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <InputField
            textLabel="Nome da Câmara"
            name="name"
            placeholder="Ex: Câmara A"
            required
          />
          <InputField
            textLabel="Nº de Gavetas"
            name="maxDrawers"
            type="number"
            min={1}
            placeholder="Ex: 10"
            required
          />
          <div className="pb-3">
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </Card>

      {/* Lista de câmaras */}
      <Card className="p-6">
        <Tag className="inline-flex mb-4">Câmaras Cadastradas</Tag>

        {chambers.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma câmara cadastrada.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Nº de Gavetas</th>
                <th className="py-2">Acções</th>
              </tr>
            </thead>
            <tbody>
              {chambers.map((c) => (
                <tr key={c._id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{c.name}</td>
                  <td className="py-2 pr-4">{c.maxDrawers}</td>
                  <td className="py-2">
                    <Button
                      type="button"
                      cancel
                      className="text-xs"
                      onClick={() => setEditing(c)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Modal de edição */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Card className="p-6 w-full max-w-md space-y-4">
            <Tag className="inline-flex">Editar Câmara</Tag>
            <form action={updateAction} className="space-y-4">
              <input type="hidden" name="id" value={editing._id} />
              <InputField
                textLabel="Nome da Câmara"
                name="name"
                defaultValue={editing.name}
                required
              />
              <InputField
                textLabel="Nº de Gavetas"
                name="maxDrawers"
                type="number"
                min={1}
                defaultValue={editing.maxDrawers}
                required
              />
              <div className="flex gap-3">
                <Button type="submit">Salvar</Button>
                <Button type="button" cancel onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </main>
  );
}
