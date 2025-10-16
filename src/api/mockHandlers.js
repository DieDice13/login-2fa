import { http, HttpResponse } from "msw"; // инструменты для описания HTTP-моков

// handlers — массив обработчиков запросов, имитирующих поведение API
export const handlers = [
  // Обработка POST-запроса на /api/login (авторизация)
  http.post("/api/login", async ({ request }) => {
    const { email, password } = await request.json(); // получаем данные из тела запроса

    // небольшая задержка для реалистичности
    await new Promise((res) => setTimeout(res, 800));

    // Проверка на пустые поля
    if (!email || !password) {
      return HttpResponse.json(
        { message: "Поля обязательны" },
        { status: 400 }
      );
    }

    // Проверка правильности логина и пароля
    if (email !== "test@mail.com" || password !== "123456") {
      return HttpResponse.json(
        { message: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Иногда имитируем случайную ошибку сервера
    if (Math.random() < 0.1) {
      return HttpResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }

    // Успешный ответ — вход прошёл, но требуется 2FA
    return HttpResponse.json({ message: "OK", twoFactorRequired: true });
  }),

  http.post("/api/verify-2fa", async ({ request }) => {
    const { code } = await request.json();
    await new Promise((res) => setTimeout(res, 800));

    if (code !== "131311") {
      return HttpResponse.json({ message: "Неверный код" }, { status: 401 });
    }

    return HttpResponse.json({
      message: "Успешный вход",
      token: "fake-jwt-token",
    });
  }),
];
