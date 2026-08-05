import { useState } from "react";

export const useCreateEventViewModel = () => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState<0 | 1>(1);

  const crearEvento = async () => {
    console.log("Crear evento...");
  };

  return {
    nombre,
    setNombre,

    categoria,
    setCategoria,

    descripcion,
    setDescripcion,

    fecha,
    setFecha,

    estado,
    setEstado,

    crearEvento,
  };
};