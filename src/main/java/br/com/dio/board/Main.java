package br.com.dio.board;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    private static List<Board> boards = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("Bem-vindo ao Sistema de Gerenciamento de Boards!");

        while (true) {
            exibirMenuPrincipal();
            int opcao = obterOpcao();

            switch (opcao) {
                case 1:
                    criarBoard();
                    break;
                case 2:
                    selecionarBoard();
                    break;
                case 0:
                    System.out.println("Saindo do sistema...");
                    scanner.close();
                    return;
                default:
                    System.out.println("Opção inválida.");
            }
        }
    }

    private static void exibirMenuPrincipal() {
        System.out.println("\n--- Menu Principal ---");
        System.out.println("1. Criar novo board");
        System.out.println("2. Selecionar board existente");
        System.out.println("0. Sair");
        System.out.print("Escolha uma opção: ");
    }

    private static int obterOpcao() {
        while (!scanner.hasNextInt()) {
            System.out.println("Por favor, digite um número válido.");
            scanner.next();
        }
        return scanner.nextInt();
    }

    private static void criarBoard() {
        scanner.nextLine();
        System.out.print("Digite o nome do novo board: ");
        String nome = scanner.nextLine();
        Board novoBoard = new Board(nome);
        boards.add(novoBoard);
        System.out.println("Board '" + nome + "' criado com sucesso!");
    }

    private static void selecionarBoard() {
        if (boards.isEmpty()) {
            System.out.println("Nenhum board existente.");
            return;
        }

        System.out.println("\n--- Boards Existentes ---");
        for (int i = 0; i < boards.size(); i++) {
            System.out.println((i + 1) + ". " + boards.get(i).getNome());
        }

        System.out.print("Selecione o número do board: ");
        int escolha = obterOpcao();

        if (escolha >= 1 && escolha <= boards.size()) {
            Board boardSelecionado = boards.get(escolha - 1);
            manipularBoard(boardSelecionado);
        } else {
            System.out.println("Seleção inválida.");
        }
    }

    private static void manipularBoard(Board board) {
        while (true) {
            exibirMenuBoard(board);
            int opcao = obterOpcao();

            switch (opcao) {
                case 1:
                    adicionarColuna(board);
                    break;
                case 2:
                    criarCard(board);
                    break;
                case 3:
                    moverCard(board);
                    break;
                case 4:
                    bloquearDesbloquearCard(board);
                    break;
                case 5:
                    exibirBoard(board);
                    break;
                case 0:
                    return;
                default:
                    System.out.println("Opção inválida.");
            }
        }
    }

    private static void exibirMenuBoard(Board board) {
        System.out.println("\n--- Board: " + board.getNome() + " ---");
        System.out.println("1. Adicionar coluna");
        System.out.println("2. Criar card");
        System.out.println("3. Mover card");
        System.out.println("4. Bloquear/Desbloquear card");
        System.out.println("5. Exibir board");
        System.out.println("0. Voltar ao menu principal");
        System.out.print("Escolha uma opção: ");
    }

    private static void adicionarColuna(Board board) {
        scanner.nextLine();
        System.out.print("Digite o nome da coluna: ");
        String nome = scanner.nextLine();
        System.out.print("Digite a ordem da coluna: ");
        int ordem = obterOpcao();
        System.out.print("Digite o tipo da coluna (INICIAL, PENDENTE, CANCELAMENTO, FINAL): ");
        TipoColuna tipo = TipoColuna.valueOf(scanner.next().toUpperCase());

        try {
            Coluna novaColuna = new Coluna(nome, ordem, tipo);
            board.adicionarColuna(novaColuna);
            System.out.println("Coluna '" + nome + "' adicionada com sucesso!");
        } catch (IllegalArgumentException e) {
            System.out.println("Erro ao adicionar coluna: " + e.getMessage());
        }
    }

    private static void criarCard(Board board) {
        scanner.nextLine();
        System.out.print("Digite o título do card: ");
        String titulo = scanner.nextLine();
        System.out.print("Digite a descrição do card: ");
        String descricao = scanner.nextLine();

        Card novoCard = new Card(titulo, descricao);

        System.out.println("Selecione a coluna para adicionar o card:");
        List<Coluna> colunas = board.getColunas();
        for (int i = 0; i < colunas.size(); i++) {
            System.out.println((i + 1) + ". " + colunas.get(i).getNome());
        }

        int escolhaColuna = obterOpcao() - 1;
        if (escolhaColuna >= 0 && escolhaColuna < colunas.size()) {
            colunas.get(escolhaColuna).adicionarCard(novoCard);
            System.out.println("Card criado e adicionado à coluna '" + colunas.get(escolhaColuna).getNome() + "'");
        } else {
            System.out.println("Seleção de coluna inválida.");
        }
    }

    private static void moverCard(Board board) {
        System.out.println("Selecione a coluna de origem:");
        Coluna colunaOrigem = selecionarColuna(board);
        if (colunaOrigem == null)
            return;

        System.out.println("Selecione o card para mover:");
        Card cardSelecionado = selecionarCard(colunaOrigem);
        if (cardSelecionado == null)
            return;

        System.out.println("Selecione a coluna de destino:");
        Coluna colunaDestino = selecionarColuna(board);
        if (colunaDestino == null)
            return;

        try {
            board.moverCard(cardSelecionado, colunaOrigem, colunaDestino);
            System.out.println("Card movido com sucesso!");
        } catch (IllegalStateException e) {
            System.out.println("Erro ao mover card: " + e.getMessage());
        }
    }

    private static void bloquearDesbloquearCard(Board board) {
        System.out.println("Selecione a coluna do card:");
        Coluna colunaSelecionada = selecionarColuna(board);
        if (colunaSelecionada == null)
            return;

        System.out.println("Selecione o card para bloquear/desbloquear:");
        Card cardSelecionado = selecionarCard(colunaSelecionada);
        if (cardSelecionado == null)
            return;

        if (cardSelecionado.isBloqueado()) {
            cardSelecionado.desbloquear();
            System.out.println("Card desbloqueado com sucesso!");
        } else {
            scanner.nextLine(); // Limpar o buffer
            System.out.print("Digite o motivo do bloqueio: ");
            String motivo = scanner.nextLine();
            cardSelecionado.bloquear(motivo);
            System.out.println("Card bloqueado com sucesso!");
        }
    }

    private static void exibirBoard(Board board) {
        System.out.println("\n--- Board: " + board.getNome() + " ---");
        for (Coluna coluna : board.getColunas()) {
            System.out.println(coluna.getNome() + " (" + coluna.getTipo() + "):");
            for (Card card : coluna.getCards()) {
                System.out.println("  - " + card.getTitulo() + (card.isBloqueado() ? " [BLOQUEADO]" : ""));
            }
            System.out.println();
        }
    }

    private static Coluna selecionarColuna(Board board) {
        List<Coluna> colunas = board.getColunas();
        for (int i = 0; i < colunas.size(); i++) {
            System.out.println((i + 1) + ". " + colunas.get(i).getNome());
        }

        System.out.print("Escolha o número da coluna: ");
        int escolha = obterOpcao();

        if (escolha >= 1 && escolha <= colunas.size()) {
            return colunas.get(escolha - 1);
        } else {
            System.out.println("Seleção inválida.");
            return null;
        }
    }

    private static Card selecionarCard(Coluna coluna) {
        List<Card> cards = coluna.getCards();
        if (cards.isEmpty()) {
            System.out.println("Não há cards nesta coluna.");
            return null;
        }

        for (int i = 0; i < cards.size(); i++) {
            System.out.println((i + 1) + ". " + cards.get(i).getTitulo() +
                    (cards.get(i).isBloqueado() ? " [BLOQUEADO]" : ""));
        }

        System.out.print("Escolha o número do card: ");
        int escolha = obterOpcao();

        if (escolha >= 1 && escolha <= cards.size()) {
            return cards.get(escolha - 1);
        } else {
            System.out.println("Seleção inválida.");
            return null;
        }
    }
}