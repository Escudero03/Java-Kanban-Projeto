package br.com.dio.board;

import java.util.ArrayList;
import java.util.List;

public class Coluna {
    private String nome;
    private int ordem;
    private TipoColuna tipo;
    private List<Card> cards;

    public Coluna(String nome, int ordem, TipoColuna tipo) {
        this.nome = nome;
        this.ordem = ordem;
        this.tipo = tipo;
        this.cards = new ArrayList<>();
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getOrdem() {
        return ordem;
    }

    public void setOrdem(int ordem) {
        this.ordem = ordem;
    }

    public TipoColuna getTipo() {
        return tipo;
    }

    public List<Card> getCards() {
        return cards;
    }

    public void adicionarCard(Card card) {
        cards.add(card);
    }

    public void removerCard(Card card) {
        cards.remove(card);
    }

    @Override
    public String toString() {
        return "Coluna{" +
                "nome='" + nome + '\'' +
                ", ordem=" + ordem +
                ", tipo=" + tipo +
                ", quantidade de cards=" + cards.size() +
                '}';
    }
}