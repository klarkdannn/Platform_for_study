; ============================================================================
;  HELLO WORLD на x86-64 Assembly (NASM, Linux)
;  Запуск:
;    nasm -f elf64 hello_world.asm -o hello_world.o
;    ld hello_world.o -o hello_world
;    ./hello_world
; ============================================================================

; Макросы для удобства (наши "ключевые слова")
%macro sys_write 3          ; sys_write fd, buffer, length
    mov rax, 1
    mov rdi, %1
    mov rsi, %2
    mov rdx, %3
    syscall
%endmacro

%macro sys_exit 1           ; sys_exit code
    mov rax, 60
    mov rdi, %1
    syscall
%endmacro

%macro PRINT 2              ; PRINT строка, длина
    sys_write 1, %1, %2
%endmacro

%macro PRINTLN 2            ; PRINT + новая строка
    PRINT %1, %2
    sys_write 1, newline, 1
%endmacro

; ─── Секция данных ───────────────────────────────────────────────────────────
section .data
    hello       db  'Hello, World!', 10    ; строка + LF (10 = '\n')
    hello_len   equ $ - hello              ; $ = текущий адрес, длина = разность
    bank_msg    db  'Bank Payment System v1.0', 10
    bank_len    equ $ - bank_msg
    newline     db  10                     ; символ новой строки
    num_str     db  '0000000000', 10, 0    ; буфер для числа (10 цифр + \n)
    num_str_len equ 11

; ─── Секция BSS (неинициализированные данные) ────────────────────────────────
section .bss
    buffer      resb 64       ; резервируем 64 байта

; ─── Секция кода ─────────────────────────────────────────────────────────────
section .text
    global _start             ; точка входа видна линковщику

_start:
    ; --- Приветствие ---
    PRINTLN hello, hello_len
    PRINTLN bank_msg, bank_len

    ; --- Вызов наших функций ---
    mov rdi, 42
    call print_number
    sys_write 1, newline, 1

    ; --- Подсчёт суммы 1..10 ---
    mov rdi, 10
    call sum_1_to_n
    ; RAX теперь содержит 55 (сумма 1..10)
    mov rdi, rax
    call print_number
    sys_write 1, newline, 1

    ; --- Завершить программу ---
    sys_exit 0


; ============================================================================
;  ФУНКЦИЯ: print_number
;  Аргумент: RDI = число для вывода (беззнаковое 64-bit)
;  Изменяет: RAX, RCX, RDX, RSI, RDI
; ============================================================================
print_number:
    push rbp
    mov  rbp, rsp
    push rbx                    ; сохраняем callee-saved регистр

    ; Если число = 0 — особый случай
    test rdi, rdi
    jnz  .not_zero
    sys_write 1, zero_char, 1
    pop rbx
    pop rbp
    ret
.not_zero:

    ; Конвертация числа в строку (справа налево)
    mov rax, rdi                ; число в RAX
    mov rcx, 0                  ; счётчик цифр
    lea rsi, [num_str + 9]      ; указатель на конец буфера

.digit_loop:
    test rax, rax
    jz   .done_digits

    xor  rdx, rdx               ; обнулить RDX перед делением
    mov  rbx, 10
    div  rbx                    ; RAX = RAX / 10, RDX = RAX % 10
    add  dl, '0'                ; цифра → ASCII символ
    mov  [rsi], dl              ; записать символ в буфер
    dec  rsi                    ; сдвинуться назад
    inc  rcx                    ; счётчик++
    jmp  .digit_loop

.done_digits:
    inc  rsi                    ; начало числа в буфере
    ; Вывести цифры
    mov  rax, 1                 ; syscall write
    mov  rdi, 1                 ; stdout
    ; RSI уже указывает на начало числа
    mov  rdx, rcx               ; длина = количество цифр
    syscall

    pop rbx
    pop rbp
    ret


; ============================================================================
;  ФУНКЦИЯ: sum_1_to_n
;  Аргумент: RDI = N
;  Возврат:  RAX = сумма 1 + 2 + ... + N
; ============================================================================
sum_1_to_n:
    push rbp
    mov  rbp, rsp

    xor  rax, rax               ; RAX = 0 (результат)
    mov  rcx, rdi               ; RCX = N (счётчик)
    test rcx, rcx
    jle  .done                  ; если N <= 0 → вернуть 0

.loop:
    add  rax, rcx               ; result += counter
    dec  rcx                    ; counter--
    jnz  .loop                  ; если counter != 0 → продолжить

.done:
    pop  rbp
    ret
    ; Математическая формула: N*(N+1)/2 была бы быстрее, но цикл — для примера


; ─── Данные для функции print_number ─────────────────────────────────────────
section .data
    zero_char   db  '0'
