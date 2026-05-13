# ══════════════════════════════════════════════════════════════════════
# Dockerfile для учебного проекта Java Bank
#
# Как использовать:
#   docker build -t java-bank .
#   docker run -it java-bank
#
# Разбор команд:
#   FROM   — базовый образ (берём готовую Java 21)
#   WORKDIR — рабочая директория внутри контейнера
#   COPY   — копируем файлы из хоста в контейнер
#   RUN    — выполняем команду при сборке образа
#   CMD    — команда при запуске контейнера
# ══════════════════════════════════════════════════════════════════════

# Этап 1: Сборка (Build Stage)
# Используем образ с Maven и JDK 21 для компиляции
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем pom.xml отдельно (кеш слоёв Docker — если pom.xml не изменился,
# зависимости не скачиваются заново)
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Копируем исходный код и собираем
COPY src ./src
RUN mvn package -DskipTests -q

# ══════════════════════════════════════════════════════════════════════
# Этап 2: Runtime (только JRE, без Maven — образ меньше)
# ══════════════════════════════════════════════════════════════════════
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Копируем только JAR из Build Stage (multi-stage build!)
COPY --from=build /app/target/java-bank-study-1.0.0.jar app.jar

# Метаданные образа
LABEL maintainer="your@email.com"
LABEL description="Учебный проект Java Bank"
LABEL version="1.0.0"

# Переменные окружения (можно переопределить при запуске)
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Порт (если добавишь Spring Boot — раскомментируй)
# EXPOSE 8080

# Команда запуска
# -it нужен для интерактивного ввода (Scanner)
CMD ["java", "-jar", "app.jar"]

# ══════════════════════════════════════════════════════════════════════
# КОМАНДЫ ДЛЯ ИЗУЧЕНИЯ DOCKER:
#
# Сборка образа:
#   docker build -t java-bank .
#   docker build -t java-bank:1.0 .          # с тегом версии
#
# Запуск контейнера (интерактивный режим нужен для Scanner!):
#   docker run -it java-bank
#   docker run -it --name my-bank java-bank  # с именем
#
# Управление:
#   docker ps                                # запущенные контейнеры
#   docker ps -a                             # все (включая остановленные)
#   docker stop my-bank                      # остановить
#   docker rm my-bank                        # удалить контейнер
#   docker rmi java-bank                     # удалить образ
#
# Просмотр:
#   docker images                            # список образов
#   docker logs my-bank                      # логи контейнера
#   docker exec -it my-bank bash             # войти в контейнер
#
# Размер образов:
#   docker image inspect java-bank           # детали образа
# ══════════════════════════════════════════════════════════════════════
