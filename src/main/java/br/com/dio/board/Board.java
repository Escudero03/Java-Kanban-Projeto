package br.com.dio.board;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Board {
    private String nome;
    private List<Coluna> colunas;

    public Board(String nome) {
        this.nome = nome;
        this.colunas = new ArrayList<>();
        inicializarColunasPadrao();
    }

    private void inicializarColunasPadrao() {
        adicionarColuna(new Coluna("Inicial", 1, TipoColuna.INICIAL));
        adicionarColuna(new Coluna("Cancelamento", 2, TipoColuna.CANCELAMENTO));
        adicionarColuna(new Coluna("Final", 3, TipoColuna.FINAL));
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Coluna> getColunas() {
        return new ArrayList<>(colunas);
    }

    public void adicionarColuna(Coluna coluna) {
        if (coluna.getTipo() != TipoColuna.PENDENTE && colunas.stream().anyMatch(c -> c.getTipo() == coluna.getTipo())) {
            throw new IllegalArgumentException("Já existe uma coluna do tipo " + coluna.getTipo());
        }
        colunas.add(coluna);
    }

    public void removerColuna(Coluna coluna) {
        if (coluna.getTipo() != TipoColuna.PENDENTE) {
            throw new IllegalArgumentException("Não é possível remover colunas do tipo " + coluna.getTipo());
        }
        colunas.remove(coluna);
    }

    public Optional<Coluna> encontrarColunaPorTipo(TipoColuna tipo) {
        return colunas.stream()
                .filter(c -> c.getTipo() == tipo)
                .findFirst();
    }

    public void moverCard(Card card, Coluna origem, Coluna destino) {
        if (card.isBloqueado()) {
            throw new IllegalStateException("Não é possível mover um card bloqueado");
        }
        origem.removerCard(card);
        destino.adicionarCard(card);
    }

    @Override
    public String toString() {
        return "Board{" +
                "nome='" + nome + '\'' +
                ", colunas=" + colunas +
                '}';
    }
}