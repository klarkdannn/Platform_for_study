package com.bank.oop.model;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

/**
 * КЛИЕНТ БАНКА — демонстрирует паттерн Builder и инкапсуляцию.
 *
 * Паттерн Builder: когда у объекта много необязательных полей,
 * вместо 10 конструкторов создаём вспомогательный класс Builder.
 *
 * Создание объекта:
 *   Client client = new Client.Builder("Иван Петров")
 *       .email("ivan@mail.ru")
 *       .phone("+79001234567")
 *       .passport("4506 123456")
 *       .dateOfBirth(LocalDate.of(1990, 5, 15))
 *       .build();
 */
public class Client {

    // private final — неизменяемые поля (immutable after creation)
    private final String id;
    private final String fullName;
    private final LocalDate registrationDate;

    // private — изменяемые поля (можно обновлять)
    private String email;
    private String phone;
    private String passportNumber;      // ЗАДАНИЕ: реализуй equals() по паспорту
    private LocalDate dateOfBirth;      // ЗАДАНИЕ: реализуй getAge()
    private boolean active;

    // Конструктор ПРИВАТНЫЙ — объект создаётся только через Builder
    private Client(Builder builder) {
        this.id               = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.fullName         = builder.fullName;
        this.email            = builder.email;
        this.phone            = builder.phone;
        this.passportNumber   = builder.passportNumber;
        this.dateOfBirth      = builder.dateOfBirth;
        this.registrationDate = LocalDate.now();
        this.active           = true;
    }

    // ═══════════════════════════════════════════════════════════
    // ПАТТЕРН BUILDER (статический вложенный класс)
    // ═══════════════════════════════════════════════════════════

    public static class Builder {
        // Обязательное поле — задаётся в конструкторе Builder
        private final String fullName;

        // Необязательные поля — задаются через методы-цепочки
        private String email;
        private String phone;
        private String passportNumber;
        private LocalDate dateOfBirth;

        public Builder(String fullName) {
            if (fullName == null || fullName.isBlank()) {
                throw new IllegalArgumentException("Имя клиента не может быть пустым");
            }
            this.fullName = fullName;
        }

        // Каждый метод возвращает this — позволяет цепочку вызовов (method chaining)
        public Builder email(String email)            { this.email = email;             return this; }
        public Builder phone(String phone)            { this.phone = phone;             return this; }
        public Builder passport(String passport)      { this.passportNumber = passport; return this; }
        public Builder dateOfBirth(LocalDate dob)     { this.dateOfBirth = dob;         return this; }

        /** Финальный метод — создаёт объект Client */
        public Client build() { return new Client(this); }
    }

    // ═══════════════════════════════════════════════════════════
    // ГЕТТЕРЫ — единственный способ получить данные снаружи
    // ═══════════════════════════════════════════════════════════

    public String getId()               { return id; }
    public String getFullName()         { return fullName; }
    public String getEmail()            { return email; }
    public String getPhone()            { return phone; }
    public String getPassportNumber()   { return passportNumber; }
    public LocalDate getDateOfBirth()   { return dateOfBirth; }
    public LocalDate getRegistrationDate() { return registrationDate; }
    public boolean isActive()           { return active; }

    // ЗАДАНИЕ (Урок 9): Добавь getAge() — считает возраст по дате рождения
    public int getAge() {
        if (dateOfBirth == null) return -1;
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    // Сеттеры только для изменяемых полей
    public void setEmail(String email)   { this.email = email; }
    public void setPhone(String phone)   { this.phone = phone; }
    public void deactivate()             { this.active = false; }

    // ═══════════════════════════════════════════════════════════
    // toString, equals, hashCode
    // ═══════════════════════════════════════════════════════════

    @Override
    public String toString() {
        return String.format("Клиент[%s] %-20s | Email: %-20s | Статус: %s",
                id, fullName,
                email != null ? email : "не указан",
                active ? "Активен" : "Деактивирован");
    }

    // ЗАДАНИЕ (Урок 9): equals по паспорту (если указан), иначе по ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Client)) return false;
        Client other = (Client) o;
        if (this.passportNumber != null && other.passportNumber != null) {
            return this.passportNumber.equals(other.passportNumber);
        }
        return this.id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return passportNumber != null ? passportNumber.hashCode() : id.hashCode();
    }
}
