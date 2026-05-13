package com.bank.algorithms.graphs;

import java.util.*;

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              АЛГОРИТМЫ НА ГРАФАХ                        ║
 * ║   BFS, DFS, Dijkstra, Floyd-Warshall, MST, TopSort      ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * ГРАФ — это набор ВЕРШИН (nodes/vertices) и РЁБЕР (edges).
 *
 * КАК БАНК ИСПОЛЬЗУЕТ ГРАФЫ?
 * ─────────────────────────────────────────────────────────
 * 1. МОШЕННИЧЕСТВО (Fraud Detection):
 *    Строим граф транзакций. Если деньги идут по кольцу
 *    (A→B→C→A) — это может быть отмывание денег.
 *
 * 2. КРАТЧАЙШИЙ ПУТЬ:
 *    Маршрутизация платежей через корреспондентские счета.
 *    Найти самый дешёвый/быстрый путь конвертации валют.
 *
 * 3. РЕКОМЕНДАЦИИ:
 *    Граф связей клиентов (кто кому переводил).
 *    Рекомендации финансовых продуктов по соц. связям.
 *
 * 4. ТОПОЛОГИЧЕСКАЯ СОРТИРОВКА:
 *    Порядок выполнения банковских операций (операция B
 *    зависит от операции A — нельзя выполнить раньше).
 *
 * ВИДЫ ГРАФОВ:
 * ─────────────────────────────────────────────────────────
 * Ориентированный (directed): рёбра имеют направление A→B
 * Неориентированный (undirected): рёбра двусторонние A—B
 * Взвешенный (weighted): рёбра имеют вес/стоимость
 * Связный (connected): из любой вершины можно попасть в любую
 *
 * ПРЕДСТАВЛЕНИЕ ГРАФА:
 * ─────────────────────────────────────────────────────────
 * Матрица смежности (Adjacency Matrix): O(V²) память
 *   +Быстрая проверка наличия ребра O(1)
 *   -Много памяти для разреженных графов
 *
 * Список смежности (Adjacency List): O(V + E) память
 *   +Экономно для разреженных графов
 *   +Быстрый обход соседей
 *   -Медленная проверка наличия ребра O(degree)
 */
public class GraphAlgorithms {

    // ══════════════════════════════════════════════════════════
    // КЛАСС ГРАФ — список смежности (Adjacency List)
    // ══════════════════════════════════════════════════════════

    static class Graph {
        private final int vertices;
        private final boolean directed;
        private final Map<Integer, List<int[]>> adjList; // int[] = {neighbour, weight}

        Graph(int vertices, boolean directed) {
            this.vertices = vertices;
            this.directed = directed;
            this.adjList = new HashMap<>();
            for (int i = 0; i < vertices; i++) {
                adjList.put(i, new ArrayList<>());
            }
        }

        void addEdge(int from, int to, int weight) {
            adjList.get(from).add(new int[]{to, weight});
            if (!directed) {
                adjList.get(to).add(new int[]{from, weight});
            }
        }

        void addEdge(int from, int to) {
            addEdge(from, to, 1);
        }

        List<int[]> getNeighbors(int v) {
            return adjList.getOrDefault(v, Collections.emptyList());
        }

        int getVertices() { return vertices; }
    }

    // ══════════════════════════════════════════════════════════
    // 1. BFS — ОБХОД В ШИРИНУ (Breadth-First Search)
    //    Сложность: O(V + E)  — V вершин, E рёбер
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Исследуем уровень за уровнем. Начинаем из стартовой
    // вершины, посещаем всех соседей, затем соседей соседей.
    // Использует очередь (Queue — FIFO).
    //
    // ЗАЧЕМ: Нахождение КРАТЧАЙШЕГО ПУТИ по количеству рёбер.
    //
    // БАНК: Нашли подозрительный счёт. Ищем все счета
    // "на расстоянии" 1, 2, 3 транзакций от него.

    public static List<Integer> bfs(Graph graph, int start) {
        List<Integer> visited = new ArrayList<>();
        boolean[] seen = new boolean[graph.getVertices()];
        Queue<Integer> queue = new LinkedList<>();

        queue.offer(start);
        seen[start] = true;

        while (!queue.isEmpty()) {
            int vertex = queue.poll();
            visited.add(vertex);

            for (int[] neighbor : graph.getNeighbors(vertex)) {
                int next = neighbor[0];
                if (!seen[next]) {
                    seen[next] = true;
                    queue.offer(next);
                }
            }
        }
        return visited;
    }

    // BFS с уровнями — полезно для понимания "глубины" связей
    public static Map<Integer, Integer> bfsLevels(Graph graph, int start) {
        Map<Integer, Integer> levels = new HashMap<>();
        Queue<Integer> queue = new LinkedList<>();

        queue.offer(start);
        levels.put(start, 0);

        while (!queue.isEmpty()) {
            int vertex = queue.poll();
            int currentLevel = levels.get(vertex);

            for (int[] neighbor : graph.getNeighbors(vertex)) {
                int next = neighbor[0];
                if (!levels.containsKey(next)) {
                    levels.put(next, currentLevel + 1);
                    queue.offer(next);
                }
            }
        }
        return levels;
    }

    // ══════════════════════════════════════════════════════════
    // 2. DFS — ОБХОД В ГЛУБИНУ (Depth-First Search)
    //    Сложность: O(V + E)
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Идём как можно глубже по одной ветке, затем
    // возвращаемся (backtrack) и идём по другой ветке.
    // Использует стек (или рекурсию).
    //
    // БАНК: Обнаружение циклов (кольцевые переводы),
    // топологическая сортировка зависимостей операций.

    public static List<Integer> dfsRecursive(Graph graph, int start) {
        List<Integer> visited = new ArrayList<>();
        boolean[] seen = new boolean[graph.getVertices()];
        dfsHelper(graph, start, seen, visited);
        return visited;
    }

    private static void dfsHelper(Graph graph, int v, boolean[] seen, List<Integer> visited) {
        seen[v] = true;
        visited.add(v);
        for (int[] neighbor : graph.getNeighbors(v)) {
            if (!seen[neighbor[0]]) {
                dfsHelper(graph, neighbor[0], seen, visited);
            }
        }
    }

    public static List<Integer> dfsIterative(Graph graph, int start) {
        List<Integer> visited = new ArrayList<>();
        boolean[] seen = new boolean[graph.getVertices()];
        Deque<Integer> stack = new ArrayDeque<>();

        stack.push(start);

        while (!stack.isEmpty()) {
            int vertex = stack.pop();
            if (!seen[vertex]) {
                seen[vertex] = true;
                visited.add(vertex);
                // добавляем соседей в стек
                for (int[] neighbor : graph.getNeighbors(vertex)) {
                    if (!seen[neighbor[0]]) {
                        stack.push(neighbor[0]);
                    }
                }
            }
        }
        return visited;
    }

    // ══════════════════════════════════════════════════════════
    // 3. DIJKSTRA — КРАТЧАЙШИЙ ПУТЬ в взвешенном графе
    //    Сложность: O((V + E) * log V) с приоритетной очередью
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: "Жадный" алгоритм. Всегда обрабатываем ближайшую
    // непосещённую вершину. Работает ТОЛЬКО с неотрицательными весами.
    //
    // БАНК: Найти дешевейший маршрут конвертации валют.
    // USD→EUR: можно через USD→GBP→EUR или USD→JPY→EUR.
    // Ищем минимальную комиссию.

    public static int[] dijkstra(Graph graph, int source) {
        int V = graph.getVertices();
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;

        // PriorityQueue: {расстояние, вершина} — сортируем по расстоянию
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, source});

        boolean[] visited = new boolean[V];

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0], u = curr[1];

            if (visited[u]) continue; // уже обработали
            visited[u] = true;

            for (int[] edge : graph.getNeighbors(u)) {
                int v = edge[0], weight = edge[1];
                if (!visited[v] && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }

    // Dijkstra с восстановлением пути
    public static int[] dijkstraWithPath(Graph graph, int source, int target) {
        int V = graph.getVertices();
        int[] dist = new int[V];
        int[] prev = new int[V]; // для восстановления пути
        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(prev, -1);
        dist[source] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, source});
        boolean[] visited = new boolean[V];

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[1];
            if (visited[u]) continue;
            visited[u] = true;
            if (u == target) break;

            for (int[] edge : graph.getNeighbors(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    prev[v] = u;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }

        // Восстанавливаем путь
        List<Integer> path = new ArrayList<>();
        for (int at = target; at != -1; at = prev[at]) {
            path.add(at);
        }
        Collections.reverse(path);
        System.out.print("Путь " + source + "→" + target + " (стоимость=" + dist[target] + "): ");
        path.forEach(v -> System.out.print(v + " "));
        System.out.println();
        return dist;
    }

    // ══════════════════════════════════════════════════════════
    // 4. FLOYD-WARSHALL — ВСЕ КРАТЧАЙШИЕ ПУТИ
    //    Сложность: O(V³) время, O(V²) память
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Динамическое программирование. dist[i][j] = min(
    //   dist[i][j],        // текущий известный путь
    //   dist[i][k] + dist[k][j]  // через промежуточную вершину k
    // )
    // Работает с отрицательными весами (но не с отриц. циклами).
    //
    // БАНК: Таблица курсов обмена всех валют через все маршруты.

    public static int[][] floydWarshall(int[][] matrix) {
        int V = matrix.length;
        int[][] dist = new int[V][V];
        int INF = Integer.MAX_VALUE / 2;

        // копируем матрицу
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                dist[i][j] = matrix[i][j];
            }
        }

        // пробуем каждую вершину как промежуточную
        for (int k = 0; k < V; k++) {
            for (int i = 0; i < V; i++) {
                for (int j = 0; j < V; j++) {
                    if (dist[i][k] < INF && dist[k][j] < INF) {
                        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                    }
                }
            }
        }
        return dist;
    }

    // ══════════════════════════════════════════════════════════
    // 5. ТОПОЛОГИЧЕСКАЯ СОРТИРОВКА (Кан — Kahn's Algorithm)
    //    Сложность: O(V + E)
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Линейное упорядочивание вершин ориентированного
    // ациклического графа (DAG). Вершина u стоит перед v,
    // если есть ребро u→v.
    //
    // БАНК: Порядок выполнения финансовых операций.
    // "Начисли проценты" должно идти ПОСЛЕ "открытия счёта".

    public static List<Integer> topologicalSort(Graph graph) {
        int V = graph.getVertices();
        int[] inDegree = new int[V]; // кол-во входящих рёбер

        // считаем входящие степени
        for (int u = 0; u < V; u++) {
            for (int[] edge : graph.getNeighbors(u)) {
                inDegree[edge[0]]++;
            }
        }

        // начинаем с вершин без входящих рёбер
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < V; i++) {
            if (inDegree[i] == 0) queue.offer(i);
        }

        List<Integer> order = new ArrayList<>();
        while (!queue.isEmpty()) {
            int u = queue.poll();
            order.add(u);
            for (int[] edge : graph.getNeighbors(u)) {
                int v = edge[0];
                if (--inDegree[v] == 0) queue.offer(v);
            }
        }

        if (order.size() != V) {
            System.out.println("ЦИКЛ ОБНАРУЖЕН — топологическая сортировка невозможна!");
            return Collections.emptyList();
        }
        return order;
    }

    // ══════════════════════════════════════════════════════════
    // 6. ОБНАРУЖЕНИЕ ЦИКЛА (DFS-based)
    //    Сложность: O(V + E)
    // ══════════════════════════════════════════════════════════
    // БАНК: Обнаружение схем отмывания денег (кольцевые переводы)

    public static boolean hasCycle(Graph graph) {
        boolean[] visited = new boolean[graph.getVertices()];
        boolean[] inStack = new boolean[graph.getVertices()];

        for (int i = 0; i < graph.getVertices(); i++) {
            if (!visited[i] && hasCycleHelper(graph, i, visited, inStack)) {
                return true;
            }
        }
        return false;
    }

    private static boolean hasCycleHelper(Graph graph, int v, boolean[] visited, boolean[] inStack) {
        visited[v] = true;
        inStack[v] = true;

        for (int[] edge : graph.getNeighbors(v)) {
            int next = edge[0];
            if (!visited[next] && hasCycleHelper(graph, next, visited, inStack)) {
                return true;
            } else if (inStack[next]) {
                return true; // нашли вершину из текущего стека вызовов — это цикл!
            }
        }
        inStack[v] = false;
        return false;
    }

    // ══════════════════════════════════════════════════════════
    // 7. MST — МИНИМАЛЬНОЕ ОСТОВНОЕ ДЕРЕВО (Kruskal)
    //    Сложность: O(E log E)
    // ══════════════════════════════════════════════════════════
    // ИДЕЯ: Выбираем рёбра с минимальным весом, не создавая циклов.
    // Использует Union-Find (Disjoint Set Union) структуру данных.
    //
    // БАНК: Построить минимальную сеть корреспондентских отношений
    // между банками с минимальными затратами на обслуживание.

    static class UnionFind {
        int[] parent, rank;

        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }

        int find(int x) {
            if (parent[x] != x) parent[x] = find(parent[x]); // path compression
            return parent[x];
        }

        boolean union(int x, int y) {
            int px = find(x), py = find(y);
            if (px == py) return false; // уже в одном компоненте — цикл!
            // union by rank
            if (rank[px] < rank[py]) { int t = px; px = py; py = t; }
            parent[py] = px;
            if (rank[px] == rank[py]) rank[px]++;
            return true;
        }
    }

    public static List<int[]> kruskalMST(int V, List<int[]> edges) {
        // edges: {from, to, weight}
        edges.sort(Comparator.comparingInt(e -> e[2])); // сортируем по весу

        UnionFind uf = new UnionFind(V);
        List<int[]> mst = new ArrayList<>();

        for (int[] edge : edges) {
            if (uf.union(edge[0], edge[1])) {
                mst.add(edge);
                if (mst.size() == V - 1) break;
            }
        }
        return mst;
    }

    // ══════════════════════════════════════════════════════════
    // БАНКОВСКИЙ ПРИМЕР: МАРШРУТИЗАЦИЯ ПЛАТЕЖЕЙ
    // ══════════════════════════════════════════════════════════

    public static void bankPaymentRouting() {
        System.out.println("\n═══ МАРШРУТИЗАЦИЯ БАНКОВСКИХ ПЛАТЕЖЕЙ ═══");
        System.out.println("Банки: 0=Сбер, 1=ВТБ, 2=Тинькофф, 3=Альфа, 4=Открытие");
        System.out.println("Рёбра = комиссия за перевод между банками\n");

        // 5 банков, ориентированный взвешенный граф
        Graph banks = new Graph(5, true);
        banks.addEdge(0, 1, 3);  // Сбер→ВТБ: комиссия 3
        banks.addEdge(0, 2, 7);  // Сбер→Тинькофф: 7
        banks.addEdge(1, 2, 2);  // ВТБ→Тинькофф: 2
        banks.addEdge(1, 3, 5);  // ВТБ→Альфа: 5
        banks.addEdge(2, 3, 1);  // Тинькофф→Альфа: 1
        banks.addEdge(3, 4, 4);  // Альфа→Открытие: 4
        banks.addEdge(2, 4, 6);  // Тинькофф→Открытие: 6

        System.out.println("BFS из Сбера: " + bfs(banks, 0));
        System.out.println("DFS из Сбера: " + dfsRecursive(banks, 0));

        int[] distances = dijkstra(banks, 0);
        System.out.println("\nМинимальные комиссии из Сбера:");
        String[] names = {"Сбер", "ВТБ", "Тинькофф", "Альфа", "Открытие"};
        for (int i = 0; i < 5; i++) {
            System.out.printf("  %s → %s: %d%n", names[0], names[i], distances[i]);
        }

        System.out.print("\nОптимальный путь Сбер→Открытие: ");
        dijkstraWithPath(banks, 0, 4);
    }

    // ══════════════════════════════════════════════════════════
    // БАНКОВСКИЙ ПРИМЕР: ОБНАРУЖЕНИЕ МОШЕННИЧЕСТВА
    // ══════════════════════════════════════════════════════════

    public static void fraudDetection() {
        System.out.println("\n═══ ОБНАРУЖЕНИЕ МОШЕННИЧЕСТВА (ЦИКЛИЧЕСКИЕ ПЕРЕВОДЫ) ═══");

        // Подозрительная схема: A→B→C→A (кольцевые переводы)
        Graph transactions = new Graph(5, true);
        transactions.addEdge(0, 1); // А→Б
        transactions.addEdge(1, 2); // Б→В
        transactions.addEdge(2, 0); // В→А (цикл!)
        transactions.addEdge(3, 4); // Д→Е (нормальный перевод)

        boolean cycle = hasCycle(transactions);
        System.out.println("Обнаружен цикл (кольцевые переводы)? " + cycle);
        if (cycle) System.out.println("⚠️  ПОДОЗРЕНИЕ НА ОТМЫВАНИЕ ДЕНЕГ! Заморозить счета.");
    }

    // ══════════════════════════════════════════════════════════
    // ★ ЗАДАНИЕ ДЛЯ ТЕБЯ:
    //
    // 1. РЕАЛИЗУЙ алгоритм Беллмана-Форда (Bellman-Ford):
    //    Работает с отрицательными весами (в отличие от Dijkstra).
    //    Сложность: O(V * E).
    //    Банк: Конвертация валют где некоторые курсы "отрицательные"
    //    (после логарифмирования — арбитраж).
    //
    // 2. РЕАЛИЗУЙ поиск всех связных компонент графа:
    //    Метод: findComponents(Graph) → List<List<Integer>>
    //    Банк: Найти изолированные группы счетов (возможно,
    //    несколько независимых мошеннических сетей).
    //
    // 3. РЕАЛИЗУЙ алгоритм Прима (Prim's MST):
    //    Альтернатива Краскалу. Начинаем с одной вершины,
    //    жадно добавляем минимальное ребро к MST.
    //    Сложность: O(E log V) с приоритетной очередью.
    //
    // 4. НАПИШИ FraudDetector:
    //    - Принимает список транзакций (от-кому, сумма)
    //    - Строит граф транзакций
    //    - Находит все циклы длиной 2 и 3 (кольцевые переводы)
    //    - Возвращает список подозрительных счетов
    // ══════════════════════════════════════════════════════════

    public static void run() {
        bankPaymentRouting();
        fraudDetection();

        // Топологическая сортировка (DAG)
        System.out.println("\n═══ ТОПОЛОГИЧЕСКАЯ СОРТИРОВКА (ПОРЯДОК ОПЕРАЦИЙ) ═══");
        Graph operations = new Graph(6, true);
        // 0=Открытие счёта, 1=Верификация, 2=Выдача карты, 3=Пополнение, 4=Перевод, 5=Закрытие
        operations.addEdge(0, 1);
        operations.addEdge(1, 2);
        operations.addEdge(1, 3);
        operations.addEdge(3, 4);
        operations.addEdge(2, 4);
        operations.addEdge(4, 5);
        System.out.println("Порядок операций: " + topologicalSort(operations));
        System.out.println("(0=Откр, 1=Верификация, 2=Карта, 3=Пополн, 4=Перевод, 5=Закр)");
    }
}
