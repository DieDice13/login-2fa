import { setupWorker } from "msw/browser"; //(Mock Service Worker).

// Обработчики запросов (handlers), где описаны сценарии: успешный логин, ошибки и т.д.
import { handlers } from "../api/mockHandlers";

// Создаём экземпляр мок-сервера (воркера) с нашими обработчиками.
// Воркеры работают только в браузере (в отличие от серверных моков).
export const worker = setupWorker(...handlers);
