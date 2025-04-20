import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
import asyncio

logging.basicConfig(level=logging.INFO)

# t.me/eqd8_bot/psy_ai
bot = Bot(token="7597056502:AAELTCtak-ezPj_teZSZMRFb-UGouV3Jbcw")
dp = Dispatcher()

web_app_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Открыть приложеньку", web_app=WebAppInfo(url="https://localhost:3000"))]
    ],
    resize_keyboard=True
)

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "Добро пожаловать в наш сервис. Откройте Mini App!"
    )


@dp.message(types.WebAppData)
async def handle_web_app_data(message: types.Message):
    try:
        data = message.web_app_data.data
        await message.answer(f"Получены данные из мини-приложения: {data}")
    except Exception as e:
        logging.error(f"Ошибка обработки данных веб-приложения: {e}")
        await message.answer("Произошла ошибка при обработке данных")

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())