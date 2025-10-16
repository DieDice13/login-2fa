import { useMutation } from "@tanstack/react-query"; // хук для работы с мутациями (POST/PUT/DELETE)
import axios from "axios"; // библиотека для HTTP-запросов

// Кастомный хук useLogin — отвечает за авторизацию пользователя
export function useLogin() {
  // useMutation — для операций, изменяющих данные (в нашем случае — вход)
  return useMutation({
    // Функция, выполняющая сам запрос
    mutationFn: async (data) => {
      // Отправляем POST-запрос на наш моковый эндпоинт /api/login
      const res = await axios.post("/api/login", data);
      // Возвращаем данные ответа
      return res.data;
    },
  });
}
